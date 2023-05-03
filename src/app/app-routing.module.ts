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
    loadComponent: () => import('./pages/battery/battery.page').then((m) => m.BatteryPage),
  },
  {
    path: 'device-info',
    loadComponent: () => import('./pages/device-info/device-info.page').then((m) => m.DeviceInfoPage),
  },
  {
    path: 'network-info',
    loadComponent: () => import('./pages/network-info/network-info.page').then((m) => m.NetworkInfoPage),
  },
  {
    path: 'geolocation',
    loadComponent: () => import('./pages/geolocation/geolocation.page').then((m) => m.GeolocationPage),
  },
  {
    path: 'badge',
    loadComponent: () => import('./pages/badge/badge.page').then((m) => m.BadgePage),
  },
  {
    path: 'contacts',
    loadComponent: () => import('./pages/contacts/contacts.page').then((m) => m.ContactsPage),
  },
  {
    path: 'vibrate',
    loadComponent: () => import('./pages/vibrate/vibrate.page').then((m) => m.VibratePage),
  },
  {
    path: 'camera',
    loadComponent: () => import('./pages/camera/camera.page').then((m) => m.CameraPage),
  },
  {
    path: 'wake-lock',
    loadComponent: () => import('./pages/wake-lock/wake-lock.page').then((m) => m.WakeLockPage),
  },
  {
    path: 'share',
    loadComponent: () => import('./pages/share/share.page').then((m) => m.SharePage),
  },
  {
    path: 'device-orientation',
    loadComponent: () => import('./pages/device-orientation/device-orientation.page').then((m) => m.DeviceOrientationPage),
  },
  {
    path: 'local-notifications',
    loadComponent: () => import('./pages/local-notifications/local-notifications.page').then((m) => m.LocalNotificationsPage),
  },
  {
    path: 'push-notifications',
    loadComponent: () => import('./pages/push-notifications/push-notifications.page').then((m) => m.PushNotificationsPage),
  },
  {
    path: 'barcode',
    loadComponent: () => import('./pages/barcode/barcode.page').then((m) => m.BarcodePage),
  },
  {
    path: 'media-session',
    loadComponent: () => import('./pages/media-session/media-session.page').then((m) => m.MediaSessionPage),
  },
  {
    path: 'speech-synthesis',
    loadComponent: () => import('./pages/speech-synthesis/speech-synthesis.page').then((m) => m.SpeechSynthesisPage),
  },
  {
    path: 'speech-recognition',
    loadComponent: () => import('./pages/speech-recognition/speech-recognition.page').then((m) => m.SpeechRecognitionPage),
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment/payment.page').then((m) => m.PaymentPage),
  },
  {
    path: 'more-info',
    loadComponent: () => import('./pages/more-info/more-info.page').then((m) => m.MoreInfoPage),
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
