import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
} from '@angular/core';
import { ContactResult, NavigatorWithContacts } from './model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsPage implements OnInit {
  public isSupported: boolean = ('contacts' in window.navigator && 'ContactsManager' in window);
  public availableProps: string[] = [];
  public selectedProps: string[] = [];
  public contacts: ContactResult[] = [];
  public multiple = false;
  public errorMessage = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.isSupported) {
      (window.navigator as NavigatorWithContacts).contacts.getProperties()
        .then((props) => {
          this.availableProps = props;
          this.selectedProps = props;
          this.cdr.markForCheck();
        })
        .catch((error: Error) => { this.errorMessage = error.message });
    }
  }

  public async selectContacts(): Promise<void> {
    this.errorMessage = '';

    if (!this.isSupported) {
      return;
    }

    try {
      const contacts = await (window.navigator as NavigatorWithContacts).contacts.select(
        this.selectedProps,
        { multiple: this.multiple },
      );

      this.contacts = contacts;
      this.cdr.markForCheck();
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      }
    }
  }
}
