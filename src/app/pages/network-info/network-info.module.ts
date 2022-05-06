import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NetworkInfoPageRoutingModule } from './network-info-routing.module';

import { NetworkInfoPage } from './network-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetworkInfoPageRoutingModule,
  ],
  declarations: [NetworkInfoPage],
})
export class NetworkInfoPageModule {}
