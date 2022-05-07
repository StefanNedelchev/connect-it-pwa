export interface MenuItem {
  title: string;
  routerLink: string;
  iconName: string;
}

export const menuItems: MenuItem[] = [
  {
    title: 'Device Info',
    routerLink: '/device-info',
    iconName: 'information-circle',
  },
  {
    title: 'Battery',
    routerLink: '/battery',
    iconName: 'battery-charging',
  },
  {
    title: 'Network Information',
    routerLink: '/network-info',
    iconName: 'cellular',
  },
  {
    title: 'Geolocation',
    routerLink: '/geolocation',
    iconName: 'location',
  },
  {
    title: 'Local Notifications',
    routerLink: '/local-notifications',
    iconName: 'chatbox-ellipses',
  },
  {
    title: 'Push Notifications',
    routerLink: '/push-notifications',
    iconName: 'notifications-circle',
  },
  {
    title: 'Contacts',
    routerLink: '/contacts',
    iconName: 'person-circle',
  },
  {
    title: 'Share',
    routerLink: '/share',
    iconName: 'share',
  },
  {
    title: 'Camera',
    routerLink: '/camera',
    iconName: 'camera',
  },
  {
    title: 'Barcode Detector',
    routerLink: '/barcode',
    iconName: 'barcode-outline',
  },
  {
    title: 'Device Orientation',
    routerLink: '/device-orientation',
    iconName: 'navigate-circle',
  },
  {
    title: 'Wake Lock',
    routerLink: '/wake-lock',
    iconName: 'eye',
  },
  {
    title: 'Vibrate',
    routerLink: '/vibrate',
    iconName: 'radio',
  },
  {
    title: 'App Badge',
    routerLink: '/badge',
    iconName: 'pricetag',
  },
];
