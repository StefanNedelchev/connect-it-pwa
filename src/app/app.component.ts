import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Preferences } from '@capacitor/preferences';
import { AlertController, isPlatform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BeforeInstallPromptEvent } from './core/models';
import { menuItems } from './menu-items';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public canDisplayIosInstall = false;
  public displayIosInstall = false;
  public deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
  public menuItems = menuItems;
  public pageTitle = 'Home';
  public isOnline = true;

  private appUpdateSubscription?: Subscription;
  private readonly isIOS = isPlatform('ios');

  constructor(
    private swUpdate: SwUpdate,
    private alertController: AlertController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  protected onBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
    event.preventDefault();
    Preferences.set({ key: 'isAppInstalled', value: 'no' });
    this.deferredInstallPrompt = event;
    this.cdr.markForCheck();
  }

  @HostListener('window:appinstalled')
  protected onAppInstalled(): void {
    this.deferredInstallPrompt = null;
    this.cdr.markForCheck();
    Preferences.set({ key: 'isAppInstalled', value: 'yes' });
  }

  @HostListener('window:online')
  protected onOnline(): void {
    this.isOnline = true;
    this.cdr.markForCheck();
    this.toastController.create({
      animated: true,
      duration: 2000,
      color: 'success',
      message: 'You are back online!',
      icon: 'cloud-done-outline',
    }).then((toast) => toast.present());
  }

  @HostListener('window:offline')
  protected onOffline(): void {
    this.isOnline = false;
    this.cdr.markForCheck();
    this.toastController.create({
      animated: true,
      duration: 3000,
      color: 'warning',
      message: 'You are offline but you can keep using the app.',
      icon: 'cloud-offline-outline',
    }).then((toast) => toast.present());
  }

  ngOnInit(): void {
    this.detectIosInstallation();
    this.listenForAppUpdates();
    this.listenForRouteChanges();
  }

  ngOnDestroy(): void {
    this.appUpdateSubscription?.unsubscribe();
  }

  get canInstall(): Promise<boolean> {
    return Preferences.get({ key: 'isAppInstalled' })
      .then(({ value }) => value !== 'yes' && this.deferredInstallPrompt !== null);
  }

  public async installApp(): Promise<void> {
    if (this.canDisplayIosInstall) {
      this.displayIosInstall = true;
      this.cdr.markForCheck();
      return;
    }

    if (!this.deferredInstallPrompt) {
      return;
    }

    this.deferredInstallPrompt.prompt();
    const { outcome } = await this.deferredInstallPrompt.userChoice;

    if (outcome === 'accepted') {
      this.deferredInstallPrompt = null;
      this.cdr.markForCheck();
      // TODO: maybe we should track installations from prompt
    }
  }

  public async dismissIosInstall(): Promise<void> {
    this.displayIosInstall = false;
    await Preferences.set({ key: 'iosInstallDismissed', value: 'yes' });
    this.cdr.markForCheck();
  }

  private async detectIosInstallation(): Promise<void> {
    const isAppInstalled = await Preferences.get({ key: 'isAppInstalled' });
    const iosInstallDismissed = Preferences.get({ key: 'iosInstallDismissed' });

    this.canDisplayIosInstall = isAppInstalled.value !== 'yes'
      && (await iosInstallDismissed).value !== 'yes'
      && (this.isIOS && this.getPWADisplayMode() === 'browser');
    this.cdr.markForCheck();
  }

  private getPWADisplayMode(): 'twa' | 'standalone' | 'browser' {
    if (document.referrer.startsWith('android-app://')) {
      return 'twa';
    } if (isPlatform('pwa')) {
      return 'standalone';
    }

    return 'browser';
  }

  private listenForAppUpdates(): void {
    if (this.swUpdate.isEnabled) {
      this.appUpdateSubscription = this.swUpdate.versionUpdates.subscribe((e) => {
        if (e.type === 'VERSION_READY') {
          this.displayUpdateAlert();
        }
      });
    }
  }

  private async displayUpdateAlert(): Promise<void> {
    const confirmDalog = await this.alertController.create({
      header: 'A new version is available',
      message: 'Would you like to refresh in order to apply the new updates?',
      buttons: [
        {
          text: 'Not now',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes',
          cssClass: 'success',
          handler: () => window.location.reload(),
        },
      ],
    });

    await confirmDalog.present();
  }

  private listenForRouteChanges(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const menuItem = this.menuItems.find((i) => event.url.includes(i.routerLink));
        if (menuItem) {
          this.pageTitle = menuItem.pageTitle;
        } else if (event.urlAfterRedirects.includes('/home')) {
          this.pageTitle = 'Home';
        } else {
          this.pageTitle = 'Page Not Found';
        }
      }
    });
  }
}
