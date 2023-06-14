import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetectedBarcode, IBarcodeDetector } from '../../core/models';
import { BarcodePage } from './barcode.page';

describe('BarcodePage', () => {
  let component: BarcodePage;
  let fixture: ComponentFixture<BarcodePage>;
  const detectorMocks = {
    getSupportedFormats: (): Promise<string[]> => Promise.resolve([]),
    detect: (image: ImageBitmapSource): Promise<DetectedBarcode[]> => Promise.resolve([]),
  };

  class BarcodeDetectorMock implements IBarcodeDetector {
    public static getSupportedFormats(): Promise<string[]> {
      return detectorMocks.getSupportedFormats();
    }

    public detect(image: ImageBitmapSource): Promise<DetectedBarcode[]> {
      return detectorMocks.detect(image);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodePage, IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    detectorMocks.getSupportedFormats = () => Promise.resolve([]);
    detectorMocks.detect = () => Promise.resolve([]);

    Object.defineProperty(window, 'BarcodeDetector', {
      value: BarcodeDetectorMock,
      writable: true,
      configurable: true,
    });
  });

  it('should create', () => {
    fixture = TestBed.createComponent(BarcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT initialize supported formats when barcode detector is not supported', async () => {
    // Arrange
    const supportedFormats = ['test1', 'test2'];
    detectorMocks.getSupportedFormats = () => Promise.resolve(supportedFormats);
    delete (window as (Window & typeof globalThis & { BarcodeDetector?: unknown })).BarcodeDetector;
    fixture = TestBed.createComponent(BarcodePage);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(component.supportedFormats).toEqual([]);
  });

  it('should initialize without supported formats', async () => {
    // Arrange
    fixture = TestBed.createComponent(BarcodePage);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // assert
    expect(component.supportedFormats).toEqual([]);
    expect(component.errorMessage).toMatch('Your browser doesn not support any barcode formats.');
  });

  it('should initialize supported formats', async () => {
    // Arrange
    const supportedFormats = ['test1', 'test2'];
    detectorMocks.getSupportedFormats = () => Promise.resolve(supportedFormats);
    fixture = TestBed.createComponent(BarcodePage);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(component.supportedFormats).toEqual(supportedFormats);
    expect(component.errorMessage).toMatch('');
  });

  describe('#onImageChange', () => {
    it('should detect a barcode from image', async () => {
      // Arrange
      detectorMocks.detect = () => Promise.resolve([{
        rawValue: '12345',
      }] as DetectedBarcode[]);
      Object.defineProperty(window, 'createImageBitmap', {
        value: () => new Blob([]),
        writable: true,
      });
      const imageEvent = {
        target: {
          querySelector: () => ({ files: [new File([], 'test.jpg')] }) as unknown as HTMLInputElement,
        },
      } as unknown as Event;

      fixture = TestBed.createComponent(BarcodePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      await component.onImageChange(imageEvent);

      // Assert
      expect(component.detectedBarcodes.length).toBeGreaterThan(0);
      expect(component.pictureSafeUrl).toBeTruthy();
      expect(component.errorMessage).toBeFalsy();
    });

    it('should NOT detect barcodes from image', async () => {
      // Arrange
      Object.defineProperty(window, 'createImageBitmap', {
        value: () => new Blob([]),
        writable: true,
      });
      const imageEvent = {
        target: {
          querySelector: () => ({ files: [new File([], 'test.jpg')] }) as unknown as HTMLInputElement,
        },
      } as unknown as Event;

      fixture = TestBed.createComponent(BarcodePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      await component.onImageChange(imageEvent);

      // Assert
      expect(component.detectedBarcodes.length).toBe(0);
      expect(component.pictureSafeUrl).toBeTruthy();
      expect(component.errorMessage).toMatch('No barcodes detected.');
    });

    it('should NOT detect barcodes when no selected files', async () => {
      // Arrange
      const imageEvent = {
        target: {
          querySelector: () => ({ files: [] }) as unknown as HTMLInputElement,
        },
      } as unknown as Event;

      fixture = TestBed.createComponent(BarcodePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      await component.onImageChange(imageEvent);

      // Assert
      expect(component.detectedBarcodes.length).toBe(0);
      expect(component.pictureSafeUrl).toBeNull();
      expect(component.errorMessage).toBeFalsy();
    });

    it('should reset component state', async () => {
      // Arrange
      const imageEvent = {
        target: {
          querySelector: () => ({ files: [] }) as unknown as HTMLInputElement,
        },
      } as unknown as Event;
      fixture = TestBed.createComponent(BarcodePage);
      component = fixture.componentInstance;

      const pictureUrl = 'https://test';
      Object.defineProperty(component, 'pictureUrl', {
        value: pictureUrl,
        writable: true,
      });
      component.pictureSafeUrl = pictureUrl;
      component.detectedBarcodes = [{
        rawValue: '123',
        format: 'test',
        cornerPoints: { x: 0, y: 0 },
        boundingBox: new DOMRect(),
      }];
      component.errorMessage = 'test';

      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      await component.onImageChange(imageEvent);

      // Assert
      expect(component.detectedBarcodes.length).toBe(0);
      expect(component.pictureSafeUrl).toBeNull();
      expect(component.errorMessage).toBeFalsy();
    });
  });
});
