import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VibratePage } from './vibrate.page';

const routes: Routes = [
  {
    path: '',
    component: VibratePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VibratePageRoutingModule {}
