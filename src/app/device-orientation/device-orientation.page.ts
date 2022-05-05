import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener,
} from '@angular/core';

@Component({
  selector: 'app-device-orientation',
  templateUrl: './device-orientation.page.html',
  styleUrls: ['./device-orientation.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceOrientationPage {
  public orientation: Pick<DeviceOrientationEvent, 'absolute' | 'alpha' | 'beta' | 'gamma'> = {
    absolute: false,
    alpha: 0,
    beta: 0,
    gamma: 0,
  };

  constructor(private cdr: ChangeDetectorRef) { }

  @HostListener('window:deviceorientation', ['$event'])
  protected onDeviceOrientation(event: DeviceOrientationEvent): void {
    this.orientation = {
      absolute: event.absolute,
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0,
    };
    this.cdr.markForCheck();
  }
}
