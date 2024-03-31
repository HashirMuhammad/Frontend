import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { BillPaymentsComponent } from './bill-payments/bill-payments.component';
import { ClientPaymentsComponent } from './client-payments/client-payments.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BillPaymentsComponent,
    ClientPaymentsComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    SharedModule
  ]
})
export class PaymentsModule { }
