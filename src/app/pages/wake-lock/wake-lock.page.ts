import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavigatorWithWakeLock, WakeLockSentinel } from '../../core/models';
import { getErrorMessage } from '../../core/utils';

@Component({
  standalone: true,
  imports: [IonicModule],
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
      this.errorMessage = getErrorMessage(error);
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
