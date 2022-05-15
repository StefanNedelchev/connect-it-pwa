import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';
import { PaymentPage } from './payment.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PaymentPageRoutingModule,
  ],
  declarations: [PaymentPage],
})
export class PaymentPageModule {}
