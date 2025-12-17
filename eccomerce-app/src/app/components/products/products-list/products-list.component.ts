import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../../core/types/Products';
import { ProductsCardComponent } from "../products-card/products-card.component";
import { ProductsService, SearchConfig } from '../../../core/services/products/products.service';
import { PlaceholderComponent } from "../../shared/placeholder/placeholder.component";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductsCardComponent, PlaceholderComponent, MatPaginatorModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  productResponse!: ProductResponse;

  page = 1;
  limit = 16;

  currentCfg: SearchConfig = { q: '', minPrice: 0, maxPrice: 0 };

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.searchConfig$.subscribe(cfg => {
      this.currentCfg = cfg;
      this.page = 1;
      this.loadProducts();
    });

    const saved = localStorage.getItem('searchConfig');
    if (saved) {
      this.currentCfg = JSON.parse(saved);
    }
    this.loadProducts();
  }

  private loadProducts() {
    const hasFilters =
      (this.currentCfg.q && this.currentCfg.q.length > 0) ||
      this.currentCfg.minPrice > 0 ||
      this.currentCfg.maxPrice > 0;

    const req$ = hasFilters
      ? this.productsService.searchProductsPaged(this.currentCfg, this.page, this.limit)
      : this.productsService.getProducts(this.page, this.limit);

    req$.subscribe({
      next: (data) => {
        this.productResponse = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadProducts();
  }

  get skeletonArray(): number[] {
    const expectedCount = this.productResponse?.products?.length || 8;
    return Array(expectedCount).fill(0);
  }

  retryLoadProducts(): void {
    this.loadProducts();
  }
}
