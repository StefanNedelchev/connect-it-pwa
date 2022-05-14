import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MediaSessionPageRoutingModule } from './media-session-routing.module';

import { MediaSessionPage } from './media-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MediaSessionPageRoutingModule,
  ],
  declarations: [MediaSessionPage],
})
export class MediaSessionPageModule {}
