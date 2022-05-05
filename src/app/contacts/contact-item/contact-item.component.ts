import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input,
} from '@angular/core';
import { ContactResult } from '../model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactItemComponent {
  @Input() contact!: ContactResult;
  public iconUrl?: string;

  constructor(private cdr: ChangeDetectorRef) {
    if (this.contact.icon.length > 0) {
      this.iconUrl = URL.createObjectURL(this.contact.icon[0]);
      this.cdr.markForCheck();
    }
  }
}