import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DeviceOrientationPageRoutingModule } from './device-orientation-routing.module';
import { DeviceOrientationPage } from './device-orientation.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DeviceOrientationPageRoutingModule,
  ],
  declarations: [DeviceOrientationPage],
})
export class DeviceOrientationPageModule {}
