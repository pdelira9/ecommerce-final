/* import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Observable, } from 'rxjs';
import { tokenSchema } from '../../types/Token';
import { Router } from '@angular/router';

export type decodedToken = {
  userId: string;
  displayName: string;
  role: 'admin' | 'customer' | 'guest';
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';

  private readonly httpClient = inject(HttpClient);

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>(`${this.baseUrl}/auth/check-email`, {
        params: { email },
      })
      .pipe(map((res) => res.exists));
  }
}

 */

/* import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiBase}`;

  private readonly httpClient = inject(HttpClient);

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>(`${this.baseUrl}/auth/check-email`, { params: { email } })
      .pipe(map((res) => res.exists));
  }
} */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.BACK_URL}/auth`;

  constructor(private http: HttpClient) {}

  register(payload: {
    displayName: string;
    email: string;
    password: string;
    phone: string;
    role?: 'admin' | 'customer' | 'guest';
  }) {
    return this.http.post<any>(`${this.baseUrl}/register`, payload).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo registrar el usuario';
        return throwError(() => new Error(msg));
      })
    );
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        // Ajusta según tu respuesta real del backend:
        const token = res?.token || res?.accessToken;
        if (token) localStorage.setItem('token', token);

        const refresh = res?.refreshToken;
        if (refresh) localStorage.setItem('refreshToken', refresh);
      }),
      catchError((err) => {
        const msg = err?.error?.message || 'Credenciales inválidas';
        return throwError(() => new Error(msg));
      })
    );
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.baseUrl}/check-email`, { params: { email } })
      .pipe(
        map((res) => !!res?.exists),
        catchError((err) => {
          const msg = err?.error?.message || 'No se pudo validar el correo';
          return throwError(() => new Error(msg));
        })
      );
  }

  refreshToken(refreshToken: string) {
    return this.http.post<any>(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo refrescar token';
        return throwError(() => new Error(msg));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}


