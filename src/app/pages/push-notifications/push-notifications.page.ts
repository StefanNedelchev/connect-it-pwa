import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';
import { lastValueFrom, Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.page.html',
  styleUrls: ['./push-notifications.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushNotificationsPage implements OnInit, OnDestroy {
  public isSupported = this.swPush.isEnabled;
  public errorMessage = '';
  public notificationMessages: unknown[] = [];
  public pushSubscription: PushSubscription | null = null;

  private subscriptons = new Subscription();

  constructor(
    private swPush: SwPush,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private toastController: ToastController,
  ) { }

  ngOnInit(): void {
    this.subscriptons.add(
      this.swPush.subscription.subscribe((sub) => {
        this.pushSubscription = sub;
        this.cdr.markForCheck();
      }),
    );
    this.subscriptons.add(
      this.swPush.messages.subscribe((m) => {
        this.notificationMessages.push(m);
        this.cdr.markForCheck();
      }),
    );
    this.subscriptons.add(
      this.swPush.notificationClicks.subscribe((clickEvent) => {
        this.toastController.create({
          animated: true,
          duration: 3000,
          color: 'success',
          message: `Notification clicked: ${clickEvent.notification.title}`,
        }).then((toast) => toast.present());
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptons.unsubscribe();
  }

  public async requestSubscription(): Promise<void> {
    this.errorMessage = '';
    this.cdr.markForCheck();

    if (!this.isSupported) {
      this.errorMessage = 'Push API is not enabled.';
      this.cdr.markForCheck();
      return;
    }

    try {
      const sub = await this.swPush.requestSubscription({ serverPublicKey: environment.serverPublicKey });
      await lastValueFrom(
        this.http.post(`${environment.pushServerUrl}/api/subscribe`, sub, {
          headers: {
            'content-type': 'application/json',
          },
        }),
      );
      this.pushSubscription = sub;

      await this.toastController.create({
        animated: true,
        duration: 4000,
        color: 'success',
        message: 'You have been successfully subscribed for push notifications!',
      }).then((toast) => toast.present());
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
        this.cdr.markForCheck();
      } else if (typeof error === 'string') {
        this.errorMessage = error;
      }
    }
  }

  public async unsubscribe(): Promise<void> {
    if (!this.isSupported) {
      this.errorMessage = 'Push API is not enabled.';
      this.cdr.markForCheck();
      return;
    }

    if (this.pushSubscription) {
      try {
        await lastValueFrom(
          this.http.post(`${environment.pushServerUrl}/api/unsubscribe`, this.pushSubscription, {
            headers: {
              'content-type': 'application/json',
            },
          }),
        );
        await this.swPush.unsubscribe();
        await this.toastController.create({
          animated: true,
          duration: 4000,
          color: 'success',
          message: 'You have been successfully UNsubscribed from push notifications!',
        }).then((toast) => toast.present());
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        }

        this.cdr.markForCheck();
      }
    }
  }

  public async schedule(): Promise<void> {
    if (!this.isSupported) {
      this.errorMessage = 'Push API is not enabled.';
      this.cdr.markForCheck();
      return;
    }

    if (this.pushSubscription) {
      try {
        await lastValueFrom(
          this.http.post(
            `${environment.pushServerUrl}/api/single-newsletter`,
            { endpoint: this.pushSubscription.endpoint },
            {
              headers: {
                'content-type': 'application/json',
              },
            },
          ),
        );
        await this.toastController.create({
          animated: true,
          duration: 4000,
          color: 'success',
          message: 'Notification was scheduled and will be pushed after 10 seconds!',
        }).then((toast) => toast.present());
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        }

        this.cdr.markForCheck();
      }
    }
  }
}
