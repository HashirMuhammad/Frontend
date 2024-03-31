import { Component } from '@angular/core';
import { PaymentServiceService } from '../payment-service.service';

@Component({
  selector: 'app-bill-payments',
  templateUrl: './bill-payments.component.html',
  styleUrls: ['./bill-payments.component.scss']
})
export class BillPaymentsComponent {
  billPaymentData = [
    {
      id: 2,
      clientID: 0,
      clientName: "laks",
      remainingPayment: 0,
      totalQuantity: 3,
      paymentReceived: 36
    }
  ];

  constructor(
    private paymentService: PaymentServiceService,
    ) {
    // this.searchClients = this.ClientService.searchClients
    this.getData();
  }

  ngOnInit() {
    
  }

  getData() {
    this.paymentService.getRemainingBillPayments().subscribe(
      (data) => {
        this.billPaymentData = data;
        console.log(data)
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
  }

  
}
