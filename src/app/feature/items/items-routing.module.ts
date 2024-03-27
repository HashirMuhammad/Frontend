import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../core/layout/layout.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InventoryComponent } from './inventory/inventory.component';
import { BillsComponent } from './bills/bills.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "checkout",
        component: CheckoutComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: "checkout/:id",
        component: CheckoutComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: "inventory",
        component: InventoryComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: "bills",
        component: BillsComponent,
        // canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
