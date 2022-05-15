import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SpeechRecognitionPageRoutingModule } from './speech-recognition-routing.module';
import { SpeechRecognitionPage } from './speech-recognition.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SpeechRecognitionPageRoutingModule,
  ],
  declarations: [SpeechRecognitionPage],
})
export class SpeechRecognitionPageModule {}
