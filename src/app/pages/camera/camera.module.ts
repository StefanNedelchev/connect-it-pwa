import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CameraPageRoutingModule } from './camera-routing.module';
import { CameraPage } from './camera.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CameraPageRoutingModule,
  ],
  declarations: [CameraPage],
})
export class CameraPageModule {}
