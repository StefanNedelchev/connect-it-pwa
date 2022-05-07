import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { PushNotificationsPageRoutingModule } from './push-notifications-routing.module';
import { PushNotificationsPage } from './push-notifications.page';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    PushNotificationsPageRoutingModule,
  ],
  declarations: [PushNotificationsPage],
})
export class PushNotificationsPageModule {}
