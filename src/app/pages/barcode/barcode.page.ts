import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
} from '@angular/core';

interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number };
  format: string;
  rawValue: string;
}

interface IBarcodeDetector {
  new (): typeof BarcodeDetector;
  getSupportedFormats: () => Promise<string[]>;
  detect: (image: ImageBitmapSource) => Promise<DetectedBarcode[]>;
}

declare const BarcodeDetector: IBarcodeDetector;

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.page.html',
  styleUrls: ['./barcode.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodePage {
  public isSupported = ('BarcodeDetector' in window);
  public errorMessage = '';
  public detectedBarcodes: DetectedBarcode[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    if (this.isSupported) {
      BarcodeDetector.getSupportedFormats()
        .then((formats) => {
          if (formats.length === 0) {
            this.errorMessage = 'Your browser doesn not support any barcode formats.';
            this.cdr.markForCheck();
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            this.errorMessage = error.message;
          } else if (typeof error === 'string') {
            this.errorMessage = error;
          }
          this.cdr.markForCheck();
        });
    }
  }

  public async onImageChange(event: Event): Promise<void> {
    this.detectedBarcodes = [];
    this.errorMessage = '';
    this.cdr.markForCheck();

    const ionInput = event.target as HTMLElement;
    const { files } = ionInput.childNodes.item(0) as HTMLInputElement;
    if (files && files.length > 0) {
      const detector = new BarcodeDetector();

      const image = await window.createImageBitmap(files[0]);
      this.detectedBarcodes = await detector.detect(image);

      if (this.detectedBarcodes.length === 0) {
        this.errorMessage = 'No barcodes detected.';
      }

      this.cdr.markForCheck();
    }
  }
}
