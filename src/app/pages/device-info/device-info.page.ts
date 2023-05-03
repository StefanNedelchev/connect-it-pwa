import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavigatorWithDeviceInfo } from '../../core/models';

const navigatorWithInfo = window.navigator as NavigatorWithDeviceInfo;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
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
