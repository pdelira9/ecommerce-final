/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ShippingAddress } from '../../types/ShippingAddress';
import { map } from 'rxjs/operators';

type GetAddressesResponse = {
  message: string;
  count: number;
  addresses: ShippingAddress[];
};

type CreateAddressResponse = {
  message: string;
  address: ShippingAddress;
};

type DefaultAddressResponse = {
  message: string;
  address: ShippingAddress;
};

@Injectable({ providedIn: 'root' })
export class ShippingAddressService {
  private base = `${environment.BACK_URL}/shipping-address`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<GetAddressesResponse>(this.base)
      .pipe(map((res) => res.addresses ?? []));
  }

  getDefault() {
    return this.http
      .get<DefaultAddressResponse>(`${this.base}/default`)
      .pipe(map((res) => res.address));
  }

  create(payload: Omit<ShippingAddress, '_id' | 'user'>) {
    return this.http
      .post<CreateAddressResponse>(this.base, payload)
      .pipe(map((res) => res.address));
  }
} */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ShippingAddress } from '../../types/ShippingAddress';
import { catchError, map, throwError } from 'rxjs';

type GetAddressesResponse = {
  message: string;
  count: number;
  addresses: ShippingAddress[];
};

type CreateAddressResponse = {
  message: string;
  address: ShippingAddress;
};

type DefaultAddressResponse = {
  message: string;
  address: ShippingAddress;
};

@Injectable({ providedIn: 'root' })
export class ShippingAddressService {
  private base = `${environment.BACK_URL}/shipping-address`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<GetAddressesResponse>(this.base).pipe(
      map((res) => res.addresses ?? []),
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudieron obtener las direcciones';
        return throwError(() => new Error(msg));
      })
    );
  }

  getDefault() {
    return this.http.get<DefaultAddressResponse>(`${this.base}/default`).pipe(
      map((res) => res.address),
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo obtener la dirección por defecto';
        return throwError(() => new Error(msg));
      })
    );
  }

  create(payload: Omit<ShippingAddress, '_id' | 'user'>) {
    return this.http.post<CreateAddressResponse>(this.base, payload).pipe(
      map((res) => res.address),
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo crear la dirección';
        return throwError(() => new Error(msg));
      })
    );
  }
}

