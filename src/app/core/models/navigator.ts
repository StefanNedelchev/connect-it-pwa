import { BatteryManager } from './battery-manager.interface';
import { ContactsManager } from './contacts-manager.interface';
import { NetworkInformationExtended } from './network-information-extended.interface';
import { WakeLockSentinel } from './wake-lock-sentinel.interface';

export type NavigatorWithBadging = Navigator & {
  setAppBadge: (content: number) => Promise<void>;
  clearAppBadge: () => Promise<void>;
};

export type NavigatorWithBattery = Navigator & { getBattery(): Promise<BatteryManager> };

export type NavigatorWithContacts = Navigator & { contacts: ContactsManager };

export type NavigatorWithDeviceInfo = Navigator & {
  deviceMemory: number | undefined;
  hardwareConcurrency: number | undefined;
};

export type NavigatorWithWakeLock = Navigator & {
  wakeLock: {
    request: (type: string) => Promise<WakeLockSentinel>;
  };
};

export type NavigatorWithConnection = Navigator & {
  connection: NetworkInformationExtended & {
    addEventListener: (name: string, listener: () => void) => void;
    removeEventListener: (name: string, listener: () => void) => void;
  };
};
