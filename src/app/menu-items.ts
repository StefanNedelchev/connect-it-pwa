export interface MenuItem {
  label: string;
  pageTitle: string;
  routerLink: string;
  iconName: string;
}

export const menuItems: MenuItem[] = [
  {
    label: 'Device Info',
    pageTitle: 'Device Info APIs',
    routerLink: '/device-info',
    iconName: 'information-circle',
  },
  {
    label: 'Battery',
    pageTitle: 'Battery API',
    routerLink: '/battery',
    iconName: 'battery-charging',
  },
  {
    label: 'Network Information',
    pageTitle: 'Network Information API ',
    routerLink: '/network-info',
    iconName: 'cellular',
  },
  {
    label: 'Geolocation',
    pageTitle: 'Geolocation API',
    routerLink: '/geolocation',
    iconName: 'location',
  },
  {
    label: 'Local Notifications',
    pageTitle: 'Notification API',
    routerLink: '/local-notifications',
    iconName: 'chatbox-ellipses',
  },
  {
    label: 'Push Notifications',
    pageTitle: 'Push API',
    routerLink: '/push-notifications',
    iconName: 'notifications-circle',
  },
  {
    label: 'Contacts',
    pageTitle: 'Contact Picker API',
    routerLink: '/contacts',
    iconName: 'person-circle',
  },
  {
    label: 'Share',
    pageTitle: 'Web Share API',
    routerLink: '/share',
    iconName: 'share',
  },
  {
    label: 'Camera',
    pageTitle: 'Media Capture',
    routerLink: '/camera',
    iconName: 'camera',
  },
  {
    label: 'Barcode Detector',
    pageTitle: 'Barcode Detection API',
    routerLink: '/barcode',
    iconName: 'barcode',
  },
  {
    label: 'Device Orientation',
    pageTitle: 'Device Orientation API',
    routerLink: '/device-orientation',
    iconName: 'navigate-circle',
  },
  {
    label: 'Media Session',
    pageTitle: 'Media Session API',
    routerLink: '/media-session',
    iconName: 'play',
  },
  {
    label: 'Speech Synthesis',
    pageTitle: 'Speech Synthesis API',
    routerLink: '/speech-synthesis',
    iconName: 'megaphone',
  },
  {
    label: 'Speech Recognition',
    pageTitle: 'Speech Recognition API',
    routerLink: '/speech-recognition',
    iconName: 'mic',
  },
  {
    label: 'Wake Lock',
    pageTitle: 'Wake Lock API',
    routerLink: '/wake-lock',
    iconName: 'eye',
  },
  {
    label: 'Vibrate',
    pageTitle: 'Vibrate API',
    routerLink: '/vibrate',
    iconName: 'radio',
  },
  {
    label: 'App Badge',
    pageTitle: 'Badging API',
    routerLink: '/badge',
    iconName: 'pricetag',
  },
];
