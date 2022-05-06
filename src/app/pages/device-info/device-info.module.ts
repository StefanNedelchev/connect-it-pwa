import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DeviceInfoPageRoutingModule } from './device-info-routing.module';
import { DeviceInfoPage } from './device-info.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DeviceInfoPageRoutingModule,
  ],
  declarations: [DeviceInfoPage],
})
export class DeviceInfoPageModule {}
