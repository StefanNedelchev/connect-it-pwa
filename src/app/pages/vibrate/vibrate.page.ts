import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [FormsModule, IonicModule],
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
