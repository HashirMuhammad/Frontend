import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // extract error message from http body if an error occurs
    return next.handle(request).pipe(
      catchError((errorResponse) => {
        if (errorResponse instanceof HttpErrorResponse) {
          switch (errorResponse.status) {
            case 401: // login
              // redirect to login page
              break;
            case 400: // forbidden
              // show server bad request message
              // this.messageService.add({ severity: "error", summary: "Error", detail: errorResponse.error?.Message, life: 20000 });

              // this.messageService.error(errorResponse.error?.Message);
              break;
            case 500:
              // this.messageService.add({ severity: "error", summary: "Error", detail: "Please contact to Support Team.", life: 20000 });
              // error("Please contact to Support Team.", null, { timeOut: 10000 });
              break;
          }
        } else {
        }

        return throwError(errorResponse.error);
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
