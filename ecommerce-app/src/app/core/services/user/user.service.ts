/* import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, userSchema } from '../../types/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private httpClient: HttpClient) { }

  getUserById(userId: string):Observable<User>{
    return this.httpClient.get(`${this.baseUrl}/${userId}`).pipe(
      map((data:any)=>{
        const response = userSchema.safeParse(data.user);
        if (!response.success) {
          console.log(response.error)
          throw new Error(`${response.error}`);
        }
        return response.data;
      })
    )
  }
} */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.BACK_URL}/users`;

  constructor(private http: HttpClient) {}

  // Usuario autenticado
  getProfile() {
    return this.http.get<any>(`${this.baseUrl}/profile`).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo obtener el perfil';
        return throwError(() => new Error(msg));
      })
    );
  }

  updateProfile(payload: any) {
    return this.http.put<any>(`${this.baseUrl}/profile`, payload).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo actualizar el perfil';
        return throwError(() => new Error(msg));
      })
    );
  }

  changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    return this.http.put<any>(`${this.baseUrl}/change-password`, payload).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo cambiar la contraseña';
        return throwError(() => new Error(msg));
      })
    );
  }

  deactivateMe() {
    return this.http.patch<any>(`${this.baseUrl}/deactivate`, {}).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo desactivar la cuenta';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Search (según tu backend NO exige authMiddleware aquí)
  searchUsers(page = 1, limit = 10) {
    const params = new HttpParams({ fromObject: { page, limit } as any });
    return this.http.get<any>(`${this.baseUrl}/search`, { params }).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo buscar usuarios';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  getAllUsers(paramsObj?: { page?: number; limit?: number; role?: string; isActive?: boolean }) {
    const params = new HttpParams({ fromObject: (paramsObj ?? {}) as any });
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudieron obtener usuarios';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  getUserById(userId: string) {
    return this.http.get<any>(`${this.baseUrl}/${userId}`).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo obtener el usuario';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  updateUser(userId: string, payload: any) {
    return this.http.put<any>(`${this.baseUrl}/${userId}`, payload).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo actualizar el usuario';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  toggleUserStatus(userId: string) {
    return this.http.patch<any>(`${this.baseUrl}/${userId}/toggle-status`, {}).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo cambiar el estatus';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  deleteUser(userId: string) {
    return this.http.delete<any>(`${this.baseUrl}/${userId}`).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo eliminar el usuario';
        return throwError(() => new Error(msg));
      })
    );
  }
}



