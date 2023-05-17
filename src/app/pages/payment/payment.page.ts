import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { getErrorMessage } from '../../core/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPage {
  public readonly isSupported = ('PaymentRequest' in window);
  public errorMessage = '';
  public isSuccessful = false;

  constructor(private cdr: ChangeDetectorRef) { }

  public async testPayment(): Promise<void> {
    const paymentMethodData: PaymentMethodData = {
      supportedMethods: 'https://google.com/pay',
    };

    const paymentDetails: PaymentDetailsInit = {
      id: 'order-123',
      displayItems: [
        {
          label: 'Example item 1',
          amount: { currency: 'USD', value: '1.00' },
        },
        {
          label: 'Example item 2',
          amount: { currency: 'USD', value: '2.50' },
        },
      ],
      total: {
        label: 'Total',
        amount: { currency: 'USD', value: '3.50' },
      },
    };

    const request = new PaymentRequest([paymentMethodData], paymentDetails);
    const canMake = await request.canMakePayment();

    if (!canMake) {
      this.errorMessage = 'Can not make this payment';
      this.cdr.markForCheck();
      return;
    }

    try {
      const response = await request.show();
      await response.complete('success');
      this.isSuccessful = true;
      this.cdr.markForCheck();
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
      this.cdr.markForCheck();
    }
  }
}
