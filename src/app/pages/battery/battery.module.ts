import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { BatteryPageRoutingModule } from './battery-routing.module';

import { BatteryPage } from './battery.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BatteryPageRoutingModule,
  ],
  declarations: [BatteryPage],
})
export class BatteryPageModule {}
