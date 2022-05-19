import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.page.html',
  styleUrls: ['./more-info.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreInfoPage {
}
