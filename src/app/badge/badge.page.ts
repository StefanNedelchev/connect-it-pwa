import { ChangeDetectionStrategy, Component } from '@angular/core';

type NavigatorWithBadging = Navigator & {
  setAppBadge(content: number): () => Promise<void>;
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

  setBadge(): void {
    (navigator as NavigatorWithBadging).setAppBadge(Number(this.badgeContent));
  }

  public clearBadge(): void {
    (navigator as NavigatorWithBadging).clearAppBadge();
  }
}
