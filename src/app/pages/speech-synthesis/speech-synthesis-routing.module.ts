import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpeechSynthesisPage } from './speech-synthesis.page';

const routes: Routes = [
  {
    path: '',
    component: SpeechSynthesisPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeechSynthesisPageRoutingModule {}
