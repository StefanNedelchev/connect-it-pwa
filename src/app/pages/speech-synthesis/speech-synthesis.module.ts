import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SpeechSynthesisPageRoutingModule } from './speech-synthesis-routing.module';
import { SpeechSynthesisPage } from './speech-synthesis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpeechSynthesisPageRoutingModule,
  ],
  declarations: [SpeechSynthesisPage],
})
export class SpeechSynthesisPageModule {}
