export interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((event: Event) => void) | null;
  onchargingtimechange: ((event: Event) => void) | null;
  ondischargingtimechange: ((event: Event) => void) | null;
  onlevelchange: ((event: Event) => void) | null;
}
