import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/users';
  private tokenKey = 'auth_token';
  private isLoggedIn$ = new BehaviorSubject<Boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        this.isLoggedIn$.next(true);
      })
    );
  }

  register(credentials: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) {
    return this.http.post<any>(`${this.apiUrl}/signup`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        this.isLoggedIn$.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn$.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken() {
    return !!localStorage.getItem(this.tokenKey);
  }
}
