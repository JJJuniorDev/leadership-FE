import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

 login(credentials: {email: string, password: string}) {
  return this.http.post<{jwt: string}>(`${this.apiUrl}/login`, credentials);
}

register(data: {email: string, password: string}) {
  return this.http.post(`${this.apiUrl}/register`, data);
}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  canDoFreeAnalysis(): boolean {
  const used = Number(localStorage.getItem('freeAnalysisUsed') || '0');
  if (used >= 1 && !this.isLoggedIn()) return false;
  return true;
}

incrementFreeAnalysis() {
  const used = Number(localStorage.getItem('freeAnalysisUsed') || '0') + 1;
  localStorage.setItem('freeAnalysisUsed', used.toString());
}
}
