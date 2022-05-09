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
  public isDeviceOrientationSupported = ('DeviceOrientationEvent' in window);

  public orientation: Pick<DeviceOrientationEvent, 'absolute' | 'alpha' | 'beta' | 'gamma'> = {
    absolute: false,
    alpha: 0,
    beta: 0,
    gamma: 0,
  };

  public motion: Pick<DeviceMotionEvent, 'acceleration' | 'accelerationIncludingGravity' | 'interval' | 'rotationRate'> = {
    acceleration: null,
    accelerationIncludingGravity: null,
    interval: 0,
    rotationRate: null,
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

  @HostListener('window:devicemotion', ['$event'])
  protected onDeviceMotion(event: DeviceMotionEvent): void {
    this.motion = {
      acceleration: event.acceleration,
      accelerationIncludingGravity: event.accelerationIncludingGravity,
      interval: event.interval,
      rotationRate: event.rotationRate,
    };
    this.cdr.markForCheck();
  }
}
