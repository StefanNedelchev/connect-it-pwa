import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BarcodePageRoutingModule } from './barcode-routing.module';
import { BarcodePage } from './barcode.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BarcodePageRoutingModule,
  ],
  declarations: [BarcodePage],
})
export class BarcodePageModule {}
