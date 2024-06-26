import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient
    ) { }

    getRemainingBillPayments(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/get-all-clients`);
    }

    totalPaymentReceived(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/get-remaining-payment-clients`);
    }
}
