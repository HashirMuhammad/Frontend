import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillPaymentsComponent } from './bill-payments/bill-payments.component';
import { ClientPaymentsComponent } from './client-payments/client-payments.component';
import { LayoutComponent } from '../../core/layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "bill_payments",
        component: BillPaymentsComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: "client_payments",
        component: ClientPaymentsComponent,
        // canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
