import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductsService, SearchConfig } from '../../../core/services/products/products.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css',
})
export class SearchProductsComponent implements OnInit {

  searchProductForm = new FormGroup({
    q: new FormControl('', { nonNullable: true }),
    minPrice: new FormControl(0, { nonNullable: true }),
    maxPrice: new FormControl(0, { nonNullable: true }),
  });

  searchConfig$ = this.searchProductForm.valueChanges.pipe(
    debounceTime(250),
    map((config) => {
      const normalized: SearchConfig = {
        q: (config.q ?? '').trim(),
        minPrice: Number(config.minPrice ?? 0),
        maxPrice: Number(config.maxPrice ?? 0),
      };
      this.productService.setSearchConfig(normalized);
      return normalized;
    }),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );

  products$ = this.searchConfig$.pipe(
    switchMap((cfg) => this.productService.searchProducts(cfg))
  );

  constructor(private productService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('searchConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.searchProductForm.patchValue(
        {
          q: parsed.q ?? '',
          minPrice: Number(parsed.minPrice ?? 0),
          maxPrice: Number(parsed.maxPrice ?? 0),
        },
        { emitEvent: true }
      );
    }

    this.searchConfig$.subscribe(() => {
      if (location.pathname !== '/products') {
        this.router.navigateByUrl('/products');
      }
    });
  }
}
