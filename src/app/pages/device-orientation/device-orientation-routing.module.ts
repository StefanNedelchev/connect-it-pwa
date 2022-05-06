import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceOrientationPage } from './device-orientation.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceOrientationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceOrientationPageRoutingModule {}
