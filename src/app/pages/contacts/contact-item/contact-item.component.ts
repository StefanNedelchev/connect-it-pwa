import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ContactResult } from '../../../core/models';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactItemComponent implements OnInit {
  @Input() contact!: ContactResult;
  public iconUrl?: SafeUrl;

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.contact.icon && this.contact.icon.length > 0) {
      this.iconUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.contact.icon[0]));
      this.cdr.markForCheck();
    }
  }
}
