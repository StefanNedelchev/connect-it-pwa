import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactResult, NavigatorWithContacts } from '../../core/models';
import { ContactItemComponent } from './contact-item/contact-item.component';
import { getErrorMessage } from '../../core/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactItemComponent,
  ],
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsPage implements OnInit {
  public readonly isSupported: boolean = ('contacts' in window.navigator && 'ContactsManager' in window);
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
        .catch((error) => {
          this.errorMessage = getErrorMessage(error);
          this.cdr.markForCheck();
        });
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
      this.errorMessage = getErrorMessage(error);
      this.cdr.markForCheck();
    }
  }
}
