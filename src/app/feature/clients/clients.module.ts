import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients/clients.component';
import { AddClientsComponent } from './add-clients/add-clients.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ClientsComponent,
    AddClientsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientsRoutingModule
  ],
})
export class ClientsModule { }
