import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraPage {
  public imageUrl: SafeUrl | null = null;
  private objectUrl: string | null = null;

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) { }

  public async takePicture(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      correctOrientation: true,
      saveToGallery: true,
    });

    if (image.webPath) {
      this.objectUrl = image.webPath;
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
      this.cdr.markForCheck();
    }
  }

  public clearPicture(): void {
    if (this.objectUrl && this.imageUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
      this.imageUrl = null;
    }
  }
}
