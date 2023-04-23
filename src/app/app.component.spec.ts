import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NavigationEnd, NavigationStart, Router, RouterEvent,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Preferences } from '@capacitor/preferences';
import { AlertController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { AppComponent } from './app.component';
import { BeforeInstallPromptEvent } from './core/models';
import { menuItems } from './menu-items';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let swUpdateSpy: jasmine.SpyObj<SwUpdate>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let router: Router;

  const versionUpdates$$ = new BehaviorSubject<VersionEvent>({
    type: 'VERSION_DETECTED',
    version: { hash: 'asdasd' },
  });

  beforeEach(async () => {
    Preferences.clear();

    versionUpdates$$.next({
      type: 'VERSION_DETECTED',
      version: { hash: 'asdasd' },
    });

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
        { provide: AlertController, useValue: alertControllerSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
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
      const setSpy = spyOn(Preferences, 'set').and.returnValue(Promise.resolve());

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
      const setSpy = spyOn(Preferences, 'set').and.returnValue(Promise.resolve());

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

  describe('#ngOnInit', () => {
    it('should NOT subscribe for version updates when SW is not enabled', () => {
      // Arrange
      (swUpdateSpy.isEnabled as unknown as boolean) = false;
      const versionUpdateSpy = spyOn(swUpdateSpy.versionUpdates, 'subscribe');
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;

      // Act
      fixture.detectChanges();

      // Assert
      expect(versionUpdateSpy).not.toHaveBeenCalled();
      expect(alertControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should NOT display update alert on version detect event', () => {
      // Arrange
      versionUpdates$$.next({
        type: 'VERSION_DETECTED',
        version: { hash: 'asdasd' },
      });
      (swUpdateSpy.isEnabled as unknown as boolean) = true;
      const versionUpdateSpy = spyOn(swUpdateSpy.versionUpdates, 'subscribe');
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;

      // Act
      fixture.detectChanges();

      // Arrange
      expect(versionUpdateSpy).toHaveBeenCalled();
      expect(alertControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should display update alert on version ready event', () => {
      // Arrange
      versionUpdates$$.next({
        type: 'VERSION_READY',
        currentVersion: { hash: 'current' },
        latestVersion: { hash: 'latest' },
      });
      (swUpdateSpy.isEnabled as unknown as boolean) = true;
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;

      // Act
      fixture.detectChanges();

      // Arrange
      expect(alertControllerSpy.create).toHaveBeenCalled();
      const alertHeader = alertControllerSpy.create.calls.mostRecent().args[0]?.header;
      expect(alertHeader).toMatch('A new version is available');
    });

    it('should not change pageTitle on NavigationStart event', () => {
      // Arrange
      const routerEvents$$ = new BehaviorSubject<RouterEvent>(new NavigationEnd(1, '', ''));
      spyOnProperty(router, 'events').and.returnValue(routerEvents$$.asObservable());
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      const oldPageTitle = component.pageTitle;

      // Act
      routerEvents$$.next(new NavigationStart(1, menuItems[1].routerLink));
      fixture.detectChanges();

      // Assert
      expect(component.pageTitle).not.toMatch(menuItems[1].pageTitle);
      expect(component.pageTitle).toMatch(oldPageTitle);
    });

    it('should set Page Not Found title if the path is not found', () => {
      // Arrange
      const routerEvents$$ = new BehaviorSubject<RouterEvent>(new NavigationEnd(1, '/n/a', '/n/a'));
      spyOnProperty(router, 'events').and.returnValue(routerEvents$$.asObservable());
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.pageTitle).toMatch('Page Not Found');
    });

    it('should set page title based on the url', () => {
      // Arrange
      const routerEvents$$ = new BehaviorSubject<RouterEvent>(
        new NavigationEnd(1, menuItems[2].routerLink, menuItems[2].routerLink),
      );
      spyOnProperty(router, 'events').and.returnValue(routerEvents$$.asObservable());
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.pageTitle).toMatch(menuItems[2].pageTitle);

      // Act
      routerEvents$$.next(new NavigationEnd(1, '/home', '/home'));
      fixture.detectChanges();

      // Assert
      expect(component.pageTitle).toMatch('Home');
    });

    it('should allow iOS install tooltip', async () => {
      // Arrange
      Preferences.set({ key: 'isAppInstalled', value: 'no' });
      Preferences.set({ key: 'iosInstallDismissed', value: 'no' });
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      Object.defineProperty(component, 'isIOS', { value: true, writable: true });

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.canDisplayIosInstall).toBeTrue();
    });

    it('should NOT allow iOS install tooltip when already dismissed or installed', async () => {
      // Arrange
      Preferences.set({ key: 'isAppInstalled', value: 'no' });
      Preferences.set({ key: 'iosInstallDismissed', value: 'yes' });
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      Object.defineProperty(component, 'isIOS', { value: true, writable: true });

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.canDisplayIosInstall).toBeFalse();

      // Act
      Preferences.set({ key: 'isAppInstalled', value: 'yes' });
      Preferences.set({ key: 'iosInstallDismissed', value: 'no' });
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.canDisplayIosInstall).toBeFalse();
    });

    it('should NOT allow iOS install tooltip in standalone mode', async () => {
      // Arrange
      Preferences.set({ key: 'isAppInstalled', value: 'no' });
      Preferences.set({ key: 'iosInstallDismissed', value: 'no' });
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      Object.defineProperty(component, 'isIOS', { value: true, writable: true });
      Object.defineProperty(component, 'getPWADisplayMode', { value: 'standalone', writable: true });

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.canDisplayIosInstall).toBeFalse();
    });
  });

  describe('#installApp', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should NOT do anything when there is no deferred install prompt', async () => {
      // Arrange
      let promptCalled = false;
      const beforeInstallPromptEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
      Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
        value: () => { promptCalled = true },
        writable: true,
      });

      // Act
      fixture.detectChanges();
      await component.installApp();

      // Assert
      expect(promptCalled).toBeFalse();
      expect(component.deferredInstallPrompt).toBeNull();
    });

    it('should display iOS install tooltip', async () => {
      // Arrange
      let promptCalled = false;
      const beforeInstallPromptEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
      Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
        value: () => { promptCalled = true },
        writable: true,
      });
      component.displayIosInstall = false;
      component.canDisplayIosInstall = true;

      // Act
      fixture.detectChanges();
      await component.installApp();

      // Assert
      expect(promptCalled).toBeFalse();
      expect(component.displayIosInstall).toBeTrue();
    });

    it('should display the prompt and reset the deferred one on user accept', async () => {
      // Arrange
      let promptCalled = false;
      const beforeInstallPromptEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
      Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
        value: () => { promptCalled = true },
        writable: true,
      });
      Object.defineProperty(beforeInstallPromptEvent, 'userChoice', {
        value: Promise.resolve({ outcome: 'accepted' }),
        writable: true,
      });
      window.dispatchEvent(beforeInstallPromptEvent);
      fixture.detectChanges();

      // Act
      await component.installApp();

      // Assert
      expect(promptCalled).toBeTrue();
      expect(component.deferredInstallPrompt).toBeNull();
    });

    it('should display the prompt and NOT reset the deferred one on user dismiss', async () => {
      // Arrange
      let promptCalled = false;
      const beforeInstallPromptEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
      Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
        value: () => { promptCalled = true },
        writable: true,
      });
      Object.defineProperty(beforeInstallPromptEvent, 'userChoice', {
        value: Promise.resolve({ outcome: 'dismissed' }),
        writable: true,
      });
      window.dispatchEvent(beforeInstallPromptEvent);
      fixture.detectChanges();

      // Act
      await component.installApp();

      // Assert
      expect(promptCalled).toBeTrue();
      expect(component.deferredInstallPrompt).toBeTruthy();
    });
  });

  describe('#dismissIosInstall', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set iOS install tooltip as dismissed', async () => {
      // Arrange
      component.displayIosInstall = true;
      const setSpy = spyOn(Preferences, 'set').and.returnValue(Promise.resolve());

      // Act
      await component.dismissIosInstall();

      // Assert
      expect(component.displayIosInstall).toBeFalse();
      expect(setSpy).toHaveBeenCalledOnceWith({ key: 'iosInstallDismissed', value: 'yes' });
    });
  });
});
