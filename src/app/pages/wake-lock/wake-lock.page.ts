import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,
} from '@angular/core';
import { NavigatorWithWakeLock, WakeLockSentinel } from '../../core/models';

@Component({
  selector: 'app-wake-lock',
  templateUrl: './wake-lock.page.html',
  styleUrls: ['./wake-lock.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WakeLockPage implements OnDestroy {
  public readonly isSupported = ('wakeLock' in window.navigator);
  public wakeLock: WakeLockSentinel | null = null;
  public errorMessage = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.releaseLock();
  }

  public async requestLock(): Promise<void> {
    this.errorMessage = '';

    try {
      this.wakeLock = await (window.navigator as NavigatorWithWakeLock).wakeLock.request('screen');
      this.cdr.markForCheck();
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else if (typeof error === 'string') {
        this.errorMessage = error;
      }
      this.cdr.markForCheck();
    }
  }

  public async releaseLock(): Promise<void> {
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = null;
      this.errorMessage = '';
      this.cdr.markForCheck();
    }
  }
}
