import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.page.html',
  styleUrls: ['./push-notifications.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushNotificationsPage {
  constructor(private swPush: SwPush, private http: HttpClient) { }

  public async sub(): Promise<void> {
    if (this.swPush.isEnabled) {
      try {
        const sub = await this.swPush.requestSubscription({ serverPublicKey: environment.serverPublicKey });
        await lastValueFrom(this.http.post('http://127.0.0.1:6666/api/subscribe', sub, {
          headers: {
            'content-type': 'application/json',
          },
        }));
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
        }
      }
    }
  }
}
