import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getDashboarddata(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard-data`);
  }

  getDashboarddata2(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/combined-totals`);
  }

  getDailySales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/daily-sales`);
  }

  getMonthlySales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly-sales`);
  }
}
