import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ShippingAddress } from '../../types/ShippingAddress';

@Injectable({ providedIn: 'root' })
export class ShippingAddressService {
  private base = `${environment.BACK_URL}/shipping-address`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<ShippingAddress[]>(this.base);
  }

  getDefault() {
    return this.http.get<ShippingAddress>(`${this.base}/default`);
  }

  create(payload: Omit<ShippingAddress, '_id' | 'user'>) {
    return this.http.post<ShippingAddress>(this.base, payload);
  }
}
