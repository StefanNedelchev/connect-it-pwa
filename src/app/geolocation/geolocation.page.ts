import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Geolocation, Position } from '@capacitor/geolocation';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeolocationPage implements OnDestroy {
  public position?: Position;
  public watchId: string | null = null;
  public errorMessage = '';
  public iFrameSrc: SafeResourceUrl | null = null;

  private isIOS = isPlatform('ios');

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) { }

  ngOnDestroy(): void {
    this.clearWatch();
  }

  ionViewDidLeave(): void {
    this.clearWatch();
  }

  public async requestLocation(): Promise<void> {
    try {
      this.position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
      });
      this.iFrameSrc = this.getMapsIframeUrl(this.position.coords.latitude, this.position.coords.longitude);
      this.cdr.markForCheck();
    } catch (error) {
      const geolocationError = (error as GeolocationPositionError);
      if (geolocationError.code === GeolocationPositionError.TIMEOUT) {
        // Try again without high accuracy
        this.position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
        });
        this.iFrameSrc = this.getMapsIframeUrl(this.position.coords.latitude, this.position.coords.longitude);
        this.cdr.markForCheck();
        return;
      }

      this.errorMessage = geolocationError.message;
      this.iFrameSrc = null;
      this.cdr.markForCheck();
    }
  }

  public async watchLocation(): Promise<void> {
    this.watchId = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 5000,
    }, (position, error) => {
      if (position && !error) {
        this.position = position;
        this.iFrameSrc = this.getMapsIframeUrl(this.position.coords.latitude, this.position.coords.longitude);
        this.cdr.markForCheck();
        return;
      }

      const geolocationError = (error as GeolocationPositionError);

      if (geolocationError.code === GeolocationPositionError.TIMEOUT) {
        Geolocation.clearWatch({ id: this.watchId || '' }).then(async () => {
          // Try again without high accuracy
          this.watchId = await Geolocation.watchPosition({
            enableHighAccuracy: false,
          }, (position2, error2) => {
            if (error2) {
              this.errorMessage = (error2 as GeolocationPositionError).message;
              this.iFrameSrc = null;
            } else if (position2) {
              this.position = position2;
              this.iFrameSrc = this.getMapsIframeUrl(this.position.coords.latitude, this.position.coords.longitude);
            }

            this.cdr.markForCheck();
          });
        }).catch((error3) => {
          this.errorMessage = (error3 as GeolocationPositionError).message;
          this.iFrameSrc = null;
          this.cdr.markForCheck();
        });

        return;
      }

      this.errorMessage = geolocationError.message;
      this.iFrameSrc = null;
      this.cdr.markForCheck();
    });
  }

  public async clearWatch(): Promise<void> {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
      this.errorMessage = '';
      this.cdr.markForCheck();
    }
  }

  private getMapsOpenUrl(lat: number, lng: number): SafeResourceUrl {
    const url = this.isIOS
      ? `https://maps.google.com/maps?daddr=${lat},${lng}`
      : `http://www.google.com/maps/place/${lat},${lng}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private getMapsIframeUrl(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
