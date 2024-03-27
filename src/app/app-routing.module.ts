import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/guards";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./feature/user/user.module").then((module) => module.UserModule)
  },
  {
    path: "items",
    // canActivate: [AuthGuard],
    loadChildren: () => import("./feature/items/items.module").then((module) => module.ItemsModule)
  },
  {
    path: "manage_clients",
    // canActivate: [AuthGuard],
    loadChildren: () => import("./feature/clients/clients.module").then((module) => module.ClientsModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
