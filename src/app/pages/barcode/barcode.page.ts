import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { DetectedBarcode, IBarcodeDetector } from '../../core/models';
import { getErrorMessage } from '../../core/utils';

declare const BarcodeDetector: {
  prototype: IBarcodeDetector;
  new(): IBarcodeDetector;
  getSupportedFormats(): Promise<string[]>;
};

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-barcode',
  templateUrl: './barcode.page.html',
  styleUrls: ['./barcode.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodePage {
  public isSupported = ('BarcodeDetector' in window);
  public errorMessage = '';
  public pictureSafeUrl: SafeUrl | null = null;
  public supportedFormats: string[] = [];
  public detectedBarcodes: DetectedBarcode[] = [];

  private pictureUrl: string | null = null;

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    if (this.isSupported) {
      BarcodeDetector.getSupportedFormats()
        .then((formats) => {
          this.supportedFormats = formats;
          if (formats.length === 0) {
            this.errorMessage = 'Your browser doesn not support any barcode formats.';
          }
          this.cdr.markForCheck();
        })
        .catch((error) => {
          this.errorMessage = getErrorMessage(error);
          this.cdr.markForCheck();
        });
    }
  }

  public async onImageChange(event: Event): Promise<void> {
    this.detectedBarcodes = [];
    this.errorMessage = '';

    if (this.pictureUrl && this.pictureSafeUrl) {
      this.pictureSafeUrl = null;
      URL.revokeObjectURL(this.pictureUrl);
      this.pictureUrl = null;
    }

    this.cdr.markForCheck();

    const ionInput = event.target as HTMLElement;
    const { files } = ionInput.querySelector('input') as HTMLInputElement;
    if (files && files.length > 0) {
      const detector = new BarcodeDetector();
      const imageFile = files[0];
      const image = await window.createImageBitmap(imageFile);

      this.pictureUrl = URL.createObjectURL(imageFile);
      this.pictureSafeUrl = this.sanitizer.bypassSecurityTrustUrl(this.pictureUrl);
      this.detectedBarcodes = await detector.detect(image);

      if (this.detectedBarcodes.length === 0) {
        this.errorMessage = 'No barcodes detected.';
      }

      this.cdr.markForCheck();
    }
  }
}
