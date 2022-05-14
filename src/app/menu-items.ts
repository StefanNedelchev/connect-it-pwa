export interface MenuItem {
  title: string;
  pageName: string;
  routerLink: string;
  iconName: string;
}

export const menuItems: MenuItem[] = [
  {
    title: 'Device Info',
    pageName: 'Device Info APIs',
    routerLink: '/device-info',
    iconName: 'information-circle',
  },
  {
    title: 'Battery',
    pageName: 'Battery API',
    routerLink: '/battery',
    iconName: 'battery-charging',
  },
  {
    title: 'Network Information',
    pageName: 'Network Information API ',
    routerLink: '/network-info',
    iconName: 'cellular',
  },
  {
    title: 'Geolocation',
    pageName: 'Geolocation API',
    routerLink: '/geolocation',
    iconName: 'location',
  },
  {
    title: 'Local Notifications',
    pageName: 'Notification API',
    routerLink: '/local-notifications',
    iconName: 'chatbox-ellipses',
  },
  {
    title: 'Push Notifications',
    pageName: 'Push API',
    routerLink: '/push-notifications',
    iconName: 'notifications-circle',
  },
  {
    title: 'Contacts',
    pageName: 'Contact Picker API',
    routerLink: '/contacts',
    iconName: 'person-circle',
  },
  {
    title: 'Share',
    pageName: 'Web Share API',
    routerLink: '/share',
    iconName: 'share',
  },
  {
    title: 'Camera',
    pageName: 'Media Capture',
    routerLink: '/camera',
    iconName: 'camera',
  },
  {
    title: 'Barcode Detector',
    pageName: 'Barcode Detection API',
    routerLink: '/barcode',
    iconName: 'barcode',
  },
  {
    title: 'Device Orientation',
    pageName: 'Device Orientation API',
    routerLink: '/device-orientation',
    iconName: 'navigate-circle',
  },
  {
    title: 'Media Session',
    pageName: 'Media Session API',
    routerLink: '/media-session',
    iconName: 'play',
  },
  {
    title: 'Speech Synthesis',
    pageName: 'Web Speech API',
    routerLink: '/speech-synthesis',
    iconName: 'megaphone',
  },
  {
    title: 'Speech Recognition',
    pageName: 'Web Speech API',
    routerLink: '/speech-recognition',
    iconName: 'mic',
  },
  {
    title: 'Wake Lock',
    pageName: 'Wake Lock API',
    routerLink: '/wake-lock',
    iconName: 'eye',
  },
  {
    title: 'Vibrate',
    pageName: 'Vibrate API',
    routerLink: '/vibrate',
    iconName: 'radio',
  },
  {
    title: 'App Badge',
    pageName: 'Badging API',
    routerLink: '/badge',
    iconName: 'pricetag',
  },
];
