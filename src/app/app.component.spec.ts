import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Storage } from '@capacitor/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { AppComponent } from './app.component';
import { BeforeInstallPromptEvent } from './core/models';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let swUpdateSpy: jasmine.SpyObj<SwUpdate>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  const versionUpdates$$ = new BehaviorSubject<VersionEvent>({
    type: 'VERSION_DETECTED',
    version: { hash: 'asdasd' },
  });

  beforeEach(async () => {
    Storage.clear();

    swUpdateSpy = {
      ...jasmine.createSpyObj<SwUpdate>('SwUpdate', ['isEnabled', 'versionUpdates']),
      versionUpdates: versionUpdates$$.asObservable(),
    } as jasmine.SpyObj<SwUpdate>;

    toastControllerSpy = jasmine.createSpyObj<ToastController>('ToastController', ['create']);
    toastControllerSpy.create.and.resolveTo(document.createElement('ion-toast'));

    alertControllerSpy = jasmine.createSpyObj<AlertController>('AlertController', ['create']);
    alertControllerSpy.create.and.resolveTo(document.createElement('ion-alert'));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: SwUpdate, useValue: swUpdateSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: AlertController, userValue: alertControllerSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('#window:beforeinstallprompt', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });

    it('should block install prompt and defer it', async () => {
      // Arrange
      const beforeInstallPromptEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
      const preventSpy = spyOn(beforeInstallPromptEvent, 'preventDefault');
      const setSpy = spyOn(Storage, 'set').and.returnValue(Promise.resolve());

      // Act
      window.dispatchEvent(beforeInstallPromptEvent);
      const canInstall = await component.canInstall;
      fixture.detectChanges();

      // Assert
      expect(canInstall).toBeTrue();
      expect(component.deferredInstallPrompt).toBeTruthy();
      expect(preventSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledOnceWith({ key: 'isAppInstalled', value: 'no' });
    });
  });

  describe('#window:appinstalled', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });

    it('should block install prompt and defer it', async () => {
      // Arrange
      const appInstalledEvent = new Event('appinstalled');
      const preventSpy = spyOn(appInstalledEvent, 'preventDefault');
      const setSpy = spyOn(Storage, 'set').and.returnValue(Promise.resolve());

      // Act
      window.dispatchEvent(appInstalledEvent);
      const canInstall = await component.canInstall;
      fixture.detectChanges();

      // Assert
      expect(canInstall).toBeFalse();
      expect(component.deferredInstallPrompt).toBeNull();
      expect(preventSpy).not.toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledOnceWith({ key: 'isAppInstalled', value: 'yes' });
    });
  });

  describe('#window:online/offlnie', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });

    it('should detect offline status', () => {
      // Act
      window.dispatchEvent(new Event('offline'));
      fixture.detectChanges();

      // Assert
      expect(component.isOnline).toBeFalse();
      expect(toastControllerSpy.create).toHaveBeenCalledOnceWith({
        animated: true,
        duration: 3000,
        color: 'warning',
        message: 'You are offline but you can keep using the app.',
        icon: 'cloud-offline-outline',
      });
    });

    it('should detect online status', () => {
      // Act
      component.isOnline = false;
      window.dispatchEvent(new Event('online'));
      fixture.detectChanges();

      // Assert
      expect(component.isOnline).toBeTrue();
      expect(toastControllerSpy.create).toHaveBeenCalledOnceWith({
        animated: true,
        duration: 2000,
        color: 'success',
        message: 'You are back online!',
        icon: 'cloud-done-outline',
      });
    });
  });

  // describe('#ngOnInit', () => {
  //   const oldAgent = window.navigator.userAgent;

  //   beforeEach(() => {
  //     Object.defineProperty(window.navigator, 'userAgent', { value: 'iPhone Macintosh', writable: false });
  //   });

  //   afterEach(() => {
  //     Object.defineProperty(window.navigator, 'userAgent', { value: oldAgent, writable: false });
  //   });

  //   it('should detect iOS installation', () => {
  //     // Arrange
  //     Storage.set({ key: 'isAppInstalled', value: 'no' });
  //     Storage.set({ key: 'iosInstallDismissed', value: 'no' });
  //     fixture = TestBed.createComponent(AppComponent);
  //     component = fixture.componentInstance;

  //     // Act
  //     fixture.detectChanges();

  //     // Assert
  //     expect(component.canDisplayIosInstall).toBeTrue();
  //   });
  // });
});
