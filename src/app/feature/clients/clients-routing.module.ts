import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { AddClientsComponent } from './add-clients/add-clients.component';
import { LayoutComponent } from '../../core/layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "clients",
        component: ClientsComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: "add_client",
        component: AddClientsComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: "add_client/:id",
        component: AddClientsComponent,
        // canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
