import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GeolocationPageRoutingModule } from './geolocation-routing.module';
import { GeolocationPage } from './geolocation.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GeolocationPageRoutingModule,
  ],
  declarations: [GeolocationPage],
})
export class GeolocationPageModule {}
