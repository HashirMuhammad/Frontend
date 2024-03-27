import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
  dailySale = [540, 325, 702, 620, 400, 321, 951];
  monthlySale = [540, 325, 702, 620, 654, 753, 987, 456, 321, 620, 450, 785];

  constructor(private http: HttpClient) {}

  getDailySales(): Observable<number[]> {
    // Replace 'your_backend_api_url' with the actual URL of your backend API endpoint
    const apiUrl = 'your_backend_api_url/dailySales';
    return this.http.get<number[]>(apiUrl);
  }

  getMonthlySales(): Observable<number[]> {
    // Replace 'your_backend_api_url' with the actual URL of your backend API endpoint
    const apiUrl = 'your_backend_api_url/monthlySales';
    return this.http.get<number[]>(apiUrl);
  }
}
