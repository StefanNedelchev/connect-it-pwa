import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { getErrorMessage } from '../../core/utils';

@Component({
  standalone: true,
  imports: [FormsModule, IonicModule],
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePage {
  public readonly isSupported = ('share' in window.navigator);
  public errorMessage = '';
  public shareData: ShareData = {
    title: 'Check out this awesome PWA!',
    text: undefined,
    url: window.location.origin,
    files: undefined,
  };

  constructor(private cdr: ChangeDetectorRef) { }

  public onFileChange(event: Event): void {
    const ionInput = event.target as HTMLElement;
    const { files } = ionInput.querySelector('input') as HTMLInputElement;
    if (files && files.length > 0) {
      this.shareData.files = [];

      for (let i = 0; i < files.length; i++) {
        this.shareData.files.push(files[i]);
      }
    }
  }

  public async share(): Promise<void> {
    this.errorMessage = '';

    if (
      !this.shareData.title
      && !this.shareData.text
      && !this.shareData.url
      && (!this.shareData.files || this.shareData.files.length === 0)
    ) {
      this.errorMessage = 'You need to fill at least one field';
      this.cdr.markForCheck();
      return;
    }

    if (window.navigator.canShare(this.shareData)) {
      try {
        await window.navigator.share(this.shareData);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
        this.cdr.markForCheck();
      }
    } else {
      this.errorMessage = 'The selected data can not be shared (maybe file sharing is not supported)';
      this.cdr.markForCheck();
    }
  }
}
