import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NetworkInfoPage } from './network-info.page';

const routes: Routes = [
  {
    path: '',
    component: NetworkInfoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkInfoPageRoutingModule {}
