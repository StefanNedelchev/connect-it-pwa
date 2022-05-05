import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ContactResult, NavigatorWithContacts } from './model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsPage {
  public isSupported: boolean = ('contacts' in navigator && 'ContactsManager' in window);
  public availableProps: string[] = [];
  public contacts: ContactResult[] = [];

  public multiple = false;

  constructor(private cdr: ChangeDetectorRef) {
    if (this.isSupported) {
      (navigator as NavigatorWithContacts).contacts.getProperties().then((props) => {
        this.availableProps = props;
        this.cdr.markForCheck();
      });
    }
  }

  public async selectContacts(): Promise<void> {
    if (this.isSupported) {
      await (navigator as NavigatorWithContacts).contacts.select(this.availableProps, { multiple: this.multiple })
        .then((contacts) => {
          this.contacts = contacts;
          this.cdr.markForCheck();
        });
    }
  }
}
