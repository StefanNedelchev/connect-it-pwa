import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import addSeconds from 'date-fns/addSeconds';
import { BatteryManager, NavigatorWithBattery } from '../../core/models';

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
        this.batteryManager = batteryManager;
        this.batteryInfo = {
          charging: batteryManager.charging,
          chargingTime: this.formatChargingTime(batteryManager.chargingTime),
          dischargingTime: this.formatDischargingTime(batteryManager.dischargingTime),
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
            this.batteryInfo.chargingTime = this.formatChargingTime(batteryManager.chargingTime);
            this.cdr.detectChanges();
          }
        };
        batteryManager.ondischargingtimechange = () => {
          if (this.batteryInfo) {
            this.batteryInfo.dischargingTime = this.formatDischargingTime(batteryManager.dischargingTime);
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
      .catch((error) => console.error(error));
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

  private formatChargingTime(chargingTime: number): string {
    const now = new Date();
    return this.isInfinity(chargingTime)
      ? '---'
      : formatDuration(
        intervalToDuration({
          start: now,
          end: addSeconds(now, chargingTime),
        }),
        { format: ['hours', 'minutes', 'seconds'] },
      );
  }

  private formatDischargingTime(dischargingTime: number): string {
    const now = new Date();
    return this.isInfinity(dischargingTime)
      ? '---'
      : formatDuration(
        intervalToDuration({
          start: now,
          end: addSeconds(now, dischargingTime),
        }),
        { format: ['hours', 'minutes', 'seconds'] },
      );
  }
}
