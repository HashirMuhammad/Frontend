import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { InventoryComponent } from './inventory/inventory.component';
import { BillsComponent } from './bills/bills.component';

import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CheckoutComponent,
    InventoryComponent,
    BillsComponent,
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    SharedModule,
  ]
})
export class ItemsModule { }
