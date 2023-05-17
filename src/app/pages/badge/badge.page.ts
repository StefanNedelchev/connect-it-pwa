import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigatorWithBadging } from '../../core/models';
import { getErrorMessage } from '../../core/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  selector: 'app-badge',
  templateUrl: './badge.page.html',
  styleUrls: ['./badge.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {
  public readonly isSupported = ('setAppBadge' in window.navigator);
  public badgeContent: number | string = 0;
  public errorMessage = '';

  constructor(private cdr: ChangeDetectorRef) {}

  public setBadge(): void {
    (window.navigator as NavigatorWithBadging).setAppBadge(+this.badgeContent)
      .catch((error) => {
        this.errorMessage = getErrorMessage(error);
        this.cdr.markForCheck();
      });
  }

  public clearBadge(): void {
    (window.navigator as NavigatorWithBadging).clearAppBadge()
      .catch((error) => {
        this.errorMessage = getErrorMessage(error);
        this.cdr.markForCheck();
      });
  }
}
