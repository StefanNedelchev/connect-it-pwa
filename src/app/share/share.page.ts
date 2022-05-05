import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
} from '@angular/core';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePage {
  public isSupported = ('share' in navigator);
  public errorMessage = '';
  public shareData: ShareData = {
    title: 'Check out this awesome PWA!',
    text: undefined,
    url: window.location.origin,
    files: undefined,
  };

  constructor(private cdr: ChangeDetectorRef) { }

  public async share(): Promise<void> {
    this.errorMessage = '';

    if (!this.shareData.title && !this.shareData.text && !this.shareData.url && !this.shareData.url) {
      this.errorMessage = 'You need to fill at least one field';
      this.cdr.markForCheck();
      return;
    }

    if (navigator.canShare(this.shareData)) {
      await navigator.share(this.shareData);
    } else {
      this.errorMessage = 'The selected data can not be shared (maybe file sharing is not supported)';
      this.cdr.markForCheck();
    }
  }
}
