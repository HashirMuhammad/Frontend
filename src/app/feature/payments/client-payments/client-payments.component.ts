import { Component } from '@angular/core';
import { PaymentServiceService } from '../payment-service.service';

@Component({
  selector: 'app-client-payments',
  templateUrl: './client-payments.component.html',
  styleUrls: ['./client-payments.component.scss']
})
export class ClientPaymentsComponent {
  billPaymentData = [
    {
      clientID: 1,
      clientName: "",
      totalPaymentReceived: 0,
      totalRemainingPayment: 0
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
    this.paymentService.totalPaymentReceived().subscribe(
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
