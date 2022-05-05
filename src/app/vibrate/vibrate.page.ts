import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vibrate',
  templateUrl: './vibrate.page.html',
  styleUrls: ['./vibrate.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VibratePage {
  public isSupported = ('vibrate' in navigator);
  public vibrateDuration = 300;

  public vibrate(): void {
    navigator.vibrate(this.vibrateDuration);
  }

  public stop(): void {
    navigator.vibrate(0);
  }
}
