import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,
} from '@angular/core';
import { ContactResult } from '../model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactItemComponent implements OnInit {
  @Input() contact!: ContactResult;
  public iconUrl?: string;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.contact.icon && this.contact.icon.length > 0) {
      this.iconUrl = URL.createObjectURL(this.contact.icon[0]);
      this.cdr.markForCheck();
    }
  }
}
