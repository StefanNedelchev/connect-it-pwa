import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VibratePageRoutingModule } from './vibrate-routing.module';

import { VibratePage } from './vibrate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VibratePageRoutingModule,
  ],
  declarations: [VibratePage],
})
export class VibratePageModule {}
