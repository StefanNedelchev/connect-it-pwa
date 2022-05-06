import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vibrate',
  templateUrl: './vibrate.page.html',
  styleUrls: ['./vibrate.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VibratePage {
  public readonly isSupported = ('vibrate' in window.navigator);
  public vibrateDuration = 300;

  public vibrate(): void {
    window.navigator.vibrate(this.vibrateDuration);
  }

  public stop(): void {
    window.navigator.vibrate(0);
  }
}
