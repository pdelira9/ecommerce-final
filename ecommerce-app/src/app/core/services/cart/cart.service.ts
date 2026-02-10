import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { Cart, cartSchema } from '../../types/Cart';
import { ToastService } from '../toast/toast.service';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = { userId: string };

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart';

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private store: Store
  ) {
    this.store.select(selectUserId).pipe(
      switchMap((userId) => {
        const resolvedUserId = userId || this.getUserIdFromToken();
        if (!resolvedUserId) return of(null);
        return this.getCartByUserId(resolvedUserId).pipe(catchError(() => of(null)));
      })
    ).subscribe((cart) => this.cartSubject.next(cart));
  }

  private getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.userId ?? '';
    } catch {
      return '';
    }
  }

  private getResolvedUserIdOnce(): Observable<string> {
    return this.store.select(selectUserId).pipe(
      take(1),
      map((id) => id || this.getUserIdFromToken() || '')
    );
  }

  private getCartByUserId(userId: string): Observable<Cart> {
    return this.http.get(`${this.baseUrl}/user/${userId}`).pipe(
      map((data) => {
        const parsed = cartSchema.safeParse(data);
        if (!parsed.success) throw new Error(String(parsed.error));
        return parsed.data;
      })
    );
  }

  addToCart(productId: string, quantity = 1): Observable<Cart | null> {
    return this.getResolvedUserIdOnce().pipe(
      switchMap((userId) => {
        if (!userId) {
          this.toast.error('Primero inicia sesión para agregar productos');
          return of(null);
        }

        return this.http.post(`${this.baseUrl}/add-product`, { userId, productId, quantity }).pipe(
          switchMap(() => this.getCartByUserId(userId)),
          tap((updated) => {
            this.cartSubject.next(updated);
            this.toast.success('Producto agregado al carrito');
          }),
          catchError((err) => {
            console.error('addToCart error:', err);
            this.toast.error('No se pudo agregar al carrito');
            return of(null);
          })
        );
      })
    );
  }

  removeFromCart(productId: string): Observable<Cart | null> {
    return this.getResolvedUserIdOnce().pipe(
      switchMap((userId) => {
        if (!userId) {
          this.toast.error('Primero inicia sesión');
          return of(null);
        }

        return this.http.delete(`${this.baseUrl}/remove-product`, { body: { userId, productId } }).pipe(
          switchMap(() => this.getCartByUserId(userId)),
          tap((updated) => {
            this.cartSubject.next(updated);
            this.toast.success('Producto eliminado del carrito');
          }),
          catchError((err) => {
            console.error('removeFromCart error:', err);
            this.toast.error('No se pudo eliminar del carrito');
            return of(null);
          })
        );
      })
    );
  }

  clearCart(): Observable<Cart | null> {
    const cartId = this.cartSubject.value?._id;
    if (!cartId) return of(null);

    return this.http.delete(`${this.baseUrl}/${cartId}`).pipe(
      tap(() => {
        this.cartSubject.next(null);
        this.toast.success('Carrito eliminado');
      }),
      map(() => null),
      catchError((err) => {
        console.error('clearCart error:', err);
        this.toast.error('No se pudo vaciar el carrito');
        return of(null);
      })
    );
  }

  getItemCount(): Observable<number> {
    return this.cart$.pipe(
      map((cart) => cart?.products?.reduce((t, i) => t + i.quantity, 0) ?? 0)
    );
  }

  getCartTotal(): Observable<number> {
    return this.cart$.pipe(
      map((cart) => cart?.products?.reduce((t, i) => t + (i.product.price * i.quantity), 0) ?? 0)
    );
  }
}
