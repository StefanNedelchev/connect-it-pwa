import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaSessionPage } from './media-session.page';

const routes: Routes = [
  {
    path: '',
    component: MediaSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaSessionPageRoutingModule {}
