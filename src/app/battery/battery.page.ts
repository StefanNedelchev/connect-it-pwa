import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import addSeconds from 'date-fns/addSeconds';

interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((event: Event) => void) | null;
  onchargingtimechange: ((event: Event) => void) | null;
  ondischargingtimechange: ((event: Event) => void) | null;
  onlevelchange: ((event: Event) => void) | null;
}
type NavigatorWithBattery = Navigator & { getBattery(): Promise<BatteryManager> };

@Component({
  selector: 'app-battery',
  templateUrl: './battery.page.html',
  styleUrls: ['./battery.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatteryPage implements OnInit, OnDestroy {
  public batteryInfo?: {
    charging: boolean;
    level: number;
    chargingTime: string;
    dischargingTime: string;
  } | null;

  private batteryManager?: BatteryManager;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!('getBattery' in window.navigator)) {
      this.batteryInfo = null;
      return;
    }

    (window.navigator as NavigatorWithBattery).getBattery()
      .then((batteryManager) => {
        const now = new Date();
        this.batteryManager = batteryManager;
        this.batteryInfo = {
          charging: batteryManager.charging,
          chargingTime: this.isInfinity(batteryManager.chargingTime)
            ? 'Calculating...'
            : formatDuration(
              intervalToDuration({
                start: now,
                end: addSeconds(now, batteryManager.chargingTime),
              }),
              { format: ['hours', 'minutes', 'seconds'] },
            ),
          dischargingTime: this.isInfinity(batteryManager.dischargingTime)
            ? 'Calculating...'
            : formatDuration(
              intervalToDuration({
                start: now,
                end: addSeconds(now, batteryManager.dischargingTime),
              }),
              { format: ['hours', 'minutes', 'seconds'] },
            ),
          level: batteryManager.level,
        };
        this.cdr.detectChanges();

        batteryManager.onchargingchange = () => {
          if (this.batteryInfo) {
            this.batteryInfo.charging = batteryManager.charging;
            this.cdr.detectChanges();
          }
        };
        batteryManager.onchargingtimechange = () => {
          if (this.batteryInfo) {
            const newDate = new Date();
            this.batteryInfo.chargingTime = this.isInfinity(batteryManager.chargingTime)
              ? 'Calculating...'
              : formatDuration(
                intervalToDuration({
                  start: newDate,
                  end: addSeconds(newDate, batteryManager.chargingTime),
                }),
                { format: ['hours', 'minutes', 'seconds'] },
              );
            this.cdr.detectChanges();
          }
        };
        batteryManager.ondischargingtimechange = () => {
          if (this.batteryInfo) {
            const newDate = new Date();
            this.batteryInfo.dischargingTime = this.isInfinity(batteryManager.dischargingTime)
              ? 'Calculating...'
              : formatDuration(
                intervalToDuration({
                  start: newDate,
                  end: addSeconds(newDate, batteryManager.dischargingTime),
                }),
                { format: ['hours', 'minutes', 'seconds'] },
              );
            this.cdr.detectChanges();
          }
        };
        batteryManager.onlevelchange = () => {
          if (this.batteryInfo) {
            this.batteryInfo.level = batteryManager.level;
            this.cdr.detectChanges();
          }
        };
      })
      .catch((error) => console.log(error));
  }

  ngOnDestroy(): void {
    if (this.batteryManager) {
      this.batteryManager.onchargingchange = null;
      this.batteryManager.onchargingtimechange = null;
      this.batteryManager.ondischargingtimechange = null;
      this.batteryManager.onlevelchange = null;
    }
  }

  private isInfinity(value: number): boolean {
    return value === window.Infinity;
  }
}
