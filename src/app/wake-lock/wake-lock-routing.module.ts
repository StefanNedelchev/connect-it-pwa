import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WakeLockPage } from './wake-lock.page';

const routes: Routes = [
  {
    path: '',
    component: WakeLockPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WakeLockPageRoutingModule {}
