import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Product, ProductResponse } from '../../types/Products';

export type Filters = {
  q: string;
  minPrice?: number;
  maxPrice?: number;
};

export type SearchConfig = {
  q: string;
  minPrice: number;
  maxPrice: number;
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = 'http://localhost:3000/api/products';

  private readonly searchConfigSubject = new BehaviorSubject<SearchConfig>({
    q: '',
    minPrice: 0,
    maxPrice: 0,
  });

  readonly searchConfig$ = this.searchConfigSubject.asObservable();

  setSearchConfig(cfg: SearchConfig) {
    this.searchConfigSubject.next(cfg);
    localStorage.setItem('searchConfig', JSON.stringify(cfg));
  }

  constructor(private httpClient: HttpClient) {}

  getProducts(page: number = 1, limit: number = 10) {
    return this.httpClient
      .get<ProductResponse>(this.baseUrl, { params: { page, limit } })
      .pipe(catchError((error) => throwError(() => new Error(error))));
  }

  getProductByID(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`);
  }

  searchProducts(searchConfig: SearchConfig): Observable<Product[]> {
    const f: Filters = { q: (searchConfig.q ?? '').trim() };

    if (Number(searchConfig.minPrice) > 0) f.minPrice = Number(searchConfig.minPrice);
    if (Number(searchConfig.maxPrice) > 0) f.maxPrice = Number(searchConfig.maxPrice);

    const params = new HttpParams({ fromObject: f as any });

    return this.httpClient.get<ProductResponse>(`${this.baseUrl}/search`, { params }).pipe(
      map((response) => response.products)
    );
  }

  searchProductsPaged(searchConfig: SearchConfig, page: number = 1, limit: number = 10) {
    const f: any = { q: (searchConfig.q ?? '').trim(), page, limit };

    if (Number(searchConfig.minPrice) > 0) f.minPrice = Number(searchConfig.minPrice);
    if (Number(searchConfig.maxPrice) > 0) f.maxPrice = Number(searchConfig.maxPrice);

    const params = new HttpParams({ fromObject: f });

    return this.httpClient.get<ProductResponse>(`${this.baseUrl}/search`, { params });
  }
}
