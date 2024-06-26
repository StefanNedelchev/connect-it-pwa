import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { getErrorMessage } from '../../core/utils';

@Component({
  standalone: true,
  imports: [FormsModule, IonicModule],
  selector: 'app-local-notifications',
  templateUrl: './local-notifications.page.html',
  styleUrls: ['./local-notifications.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalNotificationsPage implements OnInit, OnDestroy {
  public readonly isSupported = ('Notification' in window);
  public errorMessage = '';
  public notificationTitle = '';
  public notificationOptions: NotificationOptions & { renotify: boolean } = {
    icon: '/assets/icons/icon-192x192.png',
    silent: false,
    requireInteraction: false,
    renotify: false,
    tag: 'connect.it',
  };

  private notification: Notification | null = null;

  constructor(private cdr: ChangeDetectorRef, private toastController: ToastController) { }

  ngOnInit(): void {
    if (this.isSupported && Notification.permission === 'denied') {
      this.setPermissionDeniedMessage();
    }
  }

  ngOnDestroy(): void {
    this.destroyNotification();
  }

  public onIconChange(event: Event): void {
    const ionInput = event.target as HTMLElement;
    const { files } = ionInput.querySelector('input') as HTMLInputElement;
    if (files && files.length > 0) {
      this.notificationOptions.icon = URL.createObjectURL(files[0]);
    }
  }

  public async openNotification(): Promise<void> {
    this.destroyNotification();
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      await this.ensurePermission();

      if (!('serviceWorker' in navigator)) {
        this.createWithNotificationApi();
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      if ('showNotification' in registration) {
        await registration.showNotification(this.notificationTitle, this.notificationOptions);
      } else {
        this.createWithNotificationApi();
      }
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
      this.cdr.markForCheck();
    }
  }

  private destroyNotification(): void {
    if (this.notification) {
      this.notification.close();
      this.notification = null;
    }
  }

  private setPermissionDeniedMessage(): void {
    this.errorMessage = 'Notification permission is denied! Please, enable it from app settings in order to use this feature.';
    this.cdr.markForCheck();
  }

  private async ensurePermission(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    const permission = await window.Notification.requestPermission();
    if (permission === 'denied') {
      this.setPermissionDeniedMessage();
      throw new Error('DENIED');
    }
  }

  private createWithNotificationApi(): void {
    this.notification = new window.Notification(this.notificationTitle, this.notificationOptions);
    this.notification.onclick = () => {
      this.toastController.create({
        animated: true,
        duration: 2000,
        color: 'success',
        message: 'Notification was clicked!',
      }).then((toast) => toast.present());
    };
  }
}
