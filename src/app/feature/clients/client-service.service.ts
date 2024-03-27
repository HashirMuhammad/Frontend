import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  getClientDataById = [
    {
      id:1,
      name: 'test',
      email: 'abc@gmail.com',
      phoneNo: '03123456789',
      country: 'pakistan',
      city: 'lahore',
      address: 'lahore',
      bussniessName: 'abc',
      description: ''
    },
  ]
  
  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient
    ) { }

    sendData(data: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/save-client`, data);
    }

    updateData(data: any,id: number): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/clients/${id}`, data);
    }
    getClients(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/clients`);
    }

    getClientById(id: number): Observable<any> {
      const url = `${this.apiUrl}/clients/${id}`;
      return this.http.get<any>(url);
    }

    removeUser(id: any): Observable<any> {
      const url = `${this.apiUrl}/clients/${id}`;
      return this.http.delete<any>(url);
    }
}
