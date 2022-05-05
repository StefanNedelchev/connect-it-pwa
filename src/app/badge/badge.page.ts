import { ChangeDetectionStrategy, Component } from '@angular/core';

type NavigatorWithBadging = Navigator & {
  setAppBadge: (content: number) => Promise<void>;
  clearAppBadge: () => Promise<void>;
};

@Component({
  selector: 'app-badge',
  templateUrl: './badge.page.html',
  styleUrls: ['./badge.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {
  public isSupported = ('setAppBadge' in navigator);
  public badgeContent: number | string = 0;
  public errorMessage = '';

  public setBadge(): void {
    (navigator as NavigatorWithBadging).setAppBadge(+this.badgeContent)
      .catch((error) => {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        }
        console.error('Cannot set badge', error);
      });
  }

  public clearBadge(): void {
    (navigator as NavigatorWithBadging).clearAppBadge()
      .catch((error) => {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        }
        console.error('Cannot clear badge', error);
      });
  }
}
