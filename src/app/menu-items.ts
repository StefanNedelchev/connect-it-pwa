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
    title: 'Contacts',
    routerLink: '/contacts',
    iconName: 'person-circle',
  },
  {
    title: 'Camera',
    routerLink: '/camera',
    iconName: 'camera',
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
