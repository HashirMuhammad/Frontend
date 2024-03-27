import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "../../core/guards";
import { ProfileComponent } from "./profile/profile.component";
import { LayoutComponent } from "src/app/core/layout/layout.component";
import { Recoverpwd2Component } from "./recoverpwd2/recoverpwd2.component";
import { Verification2Component } from "./verification2/verification2.component";
import { Steptwoverification2Component } from "./steptwoverification2/steptwoverification2.component";
import { Confirmmail2Component } from "./confirmmail2/confirmmail2.component";
import { SignupComponent } from "./signup/signup.component";

const userRoutes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "home",
        component: HomeComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: "profile",
        component: ProfileComponent,
        // canActivate: [AuthGuard],
      },
    ],
    // canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "forgot",
    component: Recoverpwd2Component,
  },
  {
    path: "verify",
    component: Verification2Component,
  },
  {
    path: "step_two_verify",
    component: Steptwoverification2Component,
  },
  {
    path: "confirm_mail",
    component: Confirmmail2Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
