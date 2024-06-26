import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
// import { ToastrModule, ToastrService } from "ngx-toastr";

import { AlertComponent, AlertService } from "./components/index";
import { AuthGuard } from "./guards/index";
import { JwtInterceptorProvider, ErrorInterceptorProvider } from "./helpers/index";
import { LayoutModule } from "./layout/layout.module";
import { UserService } from "./services";
import { ValidaionErrorsModule } from "./components/validation-errors/validation-errors.module";
import { NumberOnlyDirective } from "./directives/number-only.directive";
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ToastModule,
    MessagesModule,
    // ToastrModule.forRoot(),
    LayoutModule,
    ValidaionErrorsModule.forRoot({
      errors: {
        useFactory() {
          return {
            required: 'This field is required',
            minlength: ({ requiredLength, actualLength }) => `Expect ${requiredLength} but got ${actualLength}`,
            invalidEmailAddress: error => `Email Address is not valid`,
            invalidMobile: error => `Invalid Mobile number`,
            invalidPassword: error => `Password is weak`,
            passwordMustMatch: error => `Password is not matching`,
          };
        },
        deps: []
      }
    })
  ],
  declarations: [AlertComponent, NumberOnlyDirective],
  exports: [AlertComponent, LayoutModule, NumberOnlyDirective, ValidaionErrorsModule]
})

export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [AuthGuard, UserService, AlertService, JwtInterceptorProvider, ErrorInterceptorProvider]
    };
  }
}
