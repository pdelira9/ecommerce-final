/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, orderArraySchema, orderSchema } from '../../types/Order';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment.development';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.BACK_URL}/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public $order = this.ordersSubject.asObservable();

  private lastOrderSubject = new BehaviorSubject<Order | null>(null);
  public lastOrder$ = this.lastOrderSubject.asObservable();
  constructor(private http: HttpClient, private store: Store) {}

  private getUserId(): string {
    let id = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe({ next: (userId) => (id = userId ?? '') });
    return id;
  }

  loadOrders(): void {
    const userId = this.getUserId();
    if (!userId) return;
  }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get(`${this.baseUrl}/${userId}`).pipe(
      map((data) => {
        console.log(data);
        const response = orderArraySchema.safeParse(data);
        if (!response.success) {
          throw new Error(`Order validation failed: ${response.error}`);
        }
        return response.data;
      }),
      catchError((error) => {
        if (error.status === 404) {
          return of([]);
        }
        console.log('Error fetching order', error);
        return of([]);
      })
    );
  }

  createOrder(order: Order): Observable<Order[]> {
    return this.http.post(`${this.baseUrl}`, order).pipe(
      map((newOrder) => {
        const reponse = orderSchema.safeParse(newOrder);
        if (!reponse.success) {
          console.log(reponse.error);
          return [];
        }
        this.lastOrderSubject.next(reponse.data);
        return [...(this.ordersSubject.value ?? []), reponse.data];
      }),
      tap((updatedOrders) => {
        this.ordersSubject.next(updatedOrders);
      })
    );
  }
}
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.BACK_URL}/orders`;

  constructor(private http: HttpClient) {}

  // Admin
  getOrders() {
    return this.http.get<any>(this.baseUrl).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudieron obtener las órdenes';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Usuario
  getOrdersByUser(userId: string) {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudieron obtener tus órdenes';
        return throwError(() => new Error(msg));
      })
    );
  }

  getOrderById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo obtener la orden';
        return throwError(() => new Error(msg));
      })
    );
  }

  createOrder(payload: any) {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo crear la orden';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  cancelOrder(id: string) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/cancel`, {}).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo cancelar la orden';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  updateOrderStatus(id: string, status: string) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, { status }).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo actualizar el estado';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  updatePaymentStatus(id: string, paymentStatus: string) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/payment-status`, { paymentStatus }).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo actualizar el pago';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  updateOrder(id: string, payload: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo actualizar la orden';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Admin
  deleteOrder(id: string) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo eliminar la orden';
        return throwError(() => new Error(msg));
      })
    );
  }
}


