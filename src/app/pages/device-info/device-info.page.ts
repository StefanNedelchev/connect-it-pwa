import { ChangeDetectionStrategy, Component } from '@angular/core';

type NavigatorWithDeviceInfo = Navigator & {
  deviceMemory: number | undefined;
  hardwareConcurrency: number | undefined;
};

const navigatorWithInfo = window.navigator as NavigatorWithDeviceInfo;

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.page.html',
  styleUrls: ['./device-info.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceInfoPage {
  public deviceMemory = navigatorWithInfo.deviceMemory;
  public logicalCores = navigatorWithInfo.hardwareConcurrency;
  public maxTouchPoints = navigatorWithInfo.maxTouchPoints;
  public languages = navigatorWithInfo.languages;
}
