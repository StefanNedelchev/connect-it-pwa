import {
  ChangeDetectionStrategy, Component, EventEmitter, Output,
} from '@angular/core';

@Component({
  selector: 'app-ios-install-popup',
  templateUrl: './ios-install-popup.component.html',
  styleUrls: ['./ios-install-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IosInstallPopupComponent {
  @Output() readonly dismiss = new EventEmitter();
}
