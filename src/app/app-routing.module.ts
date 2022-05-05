import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'battery',
    loadChildren: () => import('./battery/battery.module').then((m) => m.BatteryPageModule),
  },
  {
    path: 'device-info',
    loadChildren: () => import('./device-info/device-info.module').then((m) => m.DeviceInfoPageModule),
  },
  {
    path: 'network-info',
    loadChildren: () => import('./network-info/network-info.module').then((m) => m.NetworkInfoPageModule),
  },
  {
    path: 'geolocation',
    loadChildren: () => import('./geolocation/geolocation.module').then((m) => m.GeolocationPageModule),
  },
  {
    path: 'badge',
    loadChildren: () => import('./badge/badge.module').then((m) => m.BadgePageModule),
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsPageModule),
  },
  {
    path: 'vibrate',
    loadChildren: () => import('./vibrate/vibrate.module').then((m) => m.VibratePageModule),
  },
  {
    path: 'camera',
    loadChildren: () => import('./camera/camera.module').then( m => m.CameraPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
