import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { NotFoundPage } from './pages/not-found/not-found.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'battery',
    loadChildren: () => import('./pages/battery/battery.module').then((m) => m.BatteryPageModule),
  },
  {
    path: 'device-info',
    loadChildren: () => import('./pages/device-info/device-info.module').then((m) => m.DeviceInfoPageModule),
  },
  {
    path: 'network-info',
    loadChildren: () => import('./pages/network-info/network-info.module').then((m) => m.NetworkInfoPageModule),
  },
  {
    path: 'geolocation',
    loadChildren: () => import('./pages/geolocation/geolocation.module').then((m) => m.GeolocationPageModule),
  },
  {
    path: 'badge',
    loadChildren: () => import('./pages/badge/badge.module').then((m) => m.BadgePageModule),
  },
  {
    path: 'contacts',
    loadChildren: () => import('./pages/contacts/contacts.module').then((m) => m.ContactsPageModule),
  },
  {
    path: 'vibrate',
    loadChildren: () => import('./pages/vibrate/vibrate.module').then((m) => m.VibratePageModule),
  },
  {
    path: 'camera',
    loadChildren: () => import('./pages/camera/camera.module').then((m) => m.CameraPageModule),
  },
  {
    path: 'wake-lock',
    loadChildren: () => import('./pages/wake-lock/wake-lock.module').then((m) => m.WakeLockPageModule),
  },
  {
    path: 'share',
    loadChildren: () => import('./pages/share/share.module').then((m) => m.SharePageModule),
  },
  {
    path: 'device-orientation',
    loadChildren: () => import('./pages/device-orientation/device-orientation.module').then((m) => m.DeviceOrientationPageModule),
  },
  {
    path: 'local-notifications',
    loadChildren: () => import('./pages/local-notifications/local-notifications.module').then((m) => m.LocalNotificationsPageModule),
  },
  {
    path: 'push-notifications',
    loadChildren: () => import('./pages/push-notifications/push-notifications.module').then((m) => m.PushNotificationsPageModule),
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
