import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginDto } from '../dtos/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44321/api/Users';
  private tokenKey = 'jwtToken';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(this.getRoleFromToken());
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  login(dto: LoginDto): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, dto, { responseType: 'text' })
      .pipe(
        tap({
          next: token => {
            localStorage.setItem(this.tokenKey, token);
            this.loggedInSubject.next(true);
            console.log(this.getRoleFromToken(token))
            this.roleSubject.next(this.getRoleFromToken(token));
          },
          error: err => {
            console.error('Login failed', err);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
    this.roleSubject.next(null);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getRoleFromToken(token?: string): string | null {
  const jwt = token ?? this.getToken();
  if (!jwt) return null;

  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    console.log('Decoded JWT payload:', payload);
    return payload['role'] ?? null;
  } catch (e) {
    console.error('JWT decode error', e);
    const errorMessage = (e instanceof Error) ? e.message : 'JWT decode error';
    this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
    return null;
  }
}

}
