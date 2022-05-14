import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpeechRecognitionPage } from './speech-recognition.page';

const routes: Routes = [
  {
    path: '',
    component: SpeechRecognitionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeechRecognitionPageRoutingModule {}
