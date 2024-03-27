import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { UserRoutingModule } from "./user-routing.module";
import { LoginService } from "./login.service";
import { CoreModule } from "../../core/core.module";
import { SharedModule } from "../../shared/shared.module";
import { ProfileComponent } from "./profile/profile.component";
import { HttpClientModule } from "@angular/common/http";
import { Recoverpwd2Component } from "./recoverpwd2/recoverpwd2.component";
import { Verification2Component } from "./verification2/verification2.component";
import { Steptwoverification2Component } from "./steptwoverification2/steptwoverification2.component";
import { Confirmmail2Component } from "./confirmmail2/confirmmail2.component";

import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations: [
    LoginComponent, 
    HomeComponent, 
    ProfileComponent,
    Recoverpwd2Component,
    Verification2Component,
    Steptwoverification2Component,
    Confirmmail2Component,
    SignupComponent,
  ],
  imports: [
    UserRoutingModule, 
    HttpClientModule, 
    CoreModule.forRoot(), 
    SharedModule.forRoot()
  ],
  providers: [LoginService],
  bootstrap: []
})
export class UserModule {}
