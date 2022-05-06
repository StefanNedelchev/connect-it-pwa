import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,
} from '@angular/core';

interface WakeLockSentinel {
  released: boolean;
  type: string;
  release: () => Promise<void>;
  addEventListener: (eventName: 'release', cb: () => void) => void;
}
type NavigatorWithWakeLock = Navigator & {
  wakeLock: {
    request: (type: string) => Promise<WakeLockSentinel>;
  };
};

@Component({
  selector: 'app-wake-lock',
  templateUrl: './wake-lock.page.html',
  styleUrls: ['./wake-lock.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WakeLockPage implements OnDestroy {
  public isSupported = ('wakeLock' in window.navigator);
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
      }
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
