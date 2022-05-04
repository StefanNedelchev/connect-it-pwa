import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit,
} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Storage } from '@capacitor/storage';
import { AlertController, isPlatform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

type InstallPromptOutcome = 'accepted' | 'dismissed';
type BeforeInstallPromptEvent = Event & {
  prompt: () => void;
  userChoice: Promise<{ outcome: InstallPromptOutcome }>;
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public canDisplayIosInstall = false;
  public deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

  private appUpdateSubscription?: Subscription;
  private readonly isIOS = isPlatform('ios');

  constructor(
    private swUpdate: SwUpdate,
    private alertController: AlertController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef,
  ) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  protected onBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
    event.preventDefault();
    Storage.set({ key: 'isAppInstalled', value: 'no' });
    this.deferredInstallPrompt = event;
    this.cdr.markForCheck();
  }

  @HostListener('window:appinstalled')
  protected onAppInstalled(): void {
    this.deferredInstallPrompt = null;
    this.cdr.markForCheck();
    Storage.set({ key: 'isAppInstalled', value: 'yes' });
  }

  @HostListener('window:online')
  protected onOnline(): void {
    this.toastController.create({
      animated: true,
      duration: 2000,
      color: 'success',
      message: 'You are back online!',
    }).then((toast) => toast.present());
  }

  @HostListener('window:offline')
  protected onOffline(): void {
    this.toastController.create({
      animated: true,
      duration: 3000,
      color: 'warning',
      message: 'You are offline but you can keep using the app.',
    }).then((toast) => toast.present());
  }

  ngOnInit(): void {
    this.detectIosInstallation();
    this.listenForAppUpdates();
  }

  ngOnDestroy(): void {
    this.appUpdateSubscription?.unsubscribe();
  }

  get canInstall(): Promise<boolean> {
    return Storage.get({ key: 'isAppInstalled' })
      .then(({ value }) => value !== 'yes' && this.deferredInstallPrompt !== null);
  }

  public async installApp(): Promise<void> {
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
    this.canDisplayIosInstall = false;
    await Storage.set({ key: 'iosInstallDismissed', value: 'yes' });
  }

  private async detectIosInstallation(): Promise<void> {
    const isAppInstalled = await Storage.get({ key: 'isAppInstalled' });
    const iosInstallDismissed = Storage.get({ key: 'iosInstallDismissed' });

    this.canDisplayIosInstall = isAppInstalled.value !== 'yes'
      && (await iosInstallDismissed).value !== 'yes'
      && (this.isIOS && this.getPWADisplayMode() === 'browser');
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
}
