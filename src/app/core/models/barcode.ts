export interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number };
  format: string;
  rawValue: string;
}

export interface IBarcodeDetector {
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}
