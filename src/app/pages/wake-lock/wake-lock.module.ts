import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WakeLockPageRoutingModule } from './wake-lock-routing.module';

import { WakeLockPage } from './wake-lock.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WakeLockPageRoutingModule,
  ],
  declarations: [WakeLockPage],
})
export class WakeLockPageModule {}
