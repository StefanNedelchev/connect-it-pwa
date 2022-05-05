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

  public async setBadge(): Promise<void> {
    await (navigator as NavigatorWithBadging).setAppBadge(+this.badgeContent);
  }

  public async clearBadge(): Promise<void> {
    await (navigator as NavigatorWithBadging).clearAppBadge();
  }
}
