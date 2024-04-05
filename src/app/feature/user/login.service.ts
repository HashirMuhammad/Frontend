import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class LoginService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  login(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, formData);
  }

  signup(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, formData);
  }

  updatePassword(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-password`, formData);
  }

  logout(): void {
    // remove user from local storage to log user out
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      this.router.navigate(["login"]);
    }
  }
}
