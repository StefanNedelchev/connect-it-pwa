import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-more-info',
  templateUrl: './more-info.page.html',
  styleUrls: ['./more-info.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreInfoPage {
}
