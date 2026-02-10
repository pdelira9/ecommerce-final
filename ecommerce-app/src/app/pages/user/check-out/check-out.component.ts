import { Component, computed, OnInit, signal } from '@angular/core';
import { Cart } from '../../../core/types/Cart';
import { Observable, of, take } from 'rxjs';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { PaymentService } from '../../../core/services/paymentMethods/payment-methods.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Store } from '@ngrx/store';
import { OrderService } from '../../../core/services/order/order.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { selectUserId } from '../../../core/store/auth/auth.selectors';
import { Order } from '../../../core/types/Order';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { PaymentMethodsListComponent } from '../../../components/payment/payment-methods-list/payment-methods-list.component';
import { ShippingAddressService } from '../../../core/services/shippingAddress/shipping-address.service';
import { ShippingAddress } from '../../../core/types/ShippingAddress';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [AsyncPipe, PaymentMethodsListComponent, CurrencyPipe, RouterLink],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent implements OnInit {
  cartSig = signal<Cart | null>(null);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  paymentMethods$: Observable<PaymentMethod[]> = of([]);
  paymentMethodId: string = '';

  shippingAddresses$: Observable<ShippingAddress[]> = of([]);
  selectedShippingAddressId: string = '';

  total = computed(
    () =>
      this.cartSig()?.products.reduce(
        (acc, p) => acc + p.product.price * p.quantity,
        0,
      ) || 0,
  );

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private store: Store,
    private orderservice: OrderService,
    private router: Router,
    private toast: ToastService,
    private addressService: ShippingAddressService,
  ) {}

  ngOnInit(): void {
    const userId = this.getUserId();
    if (!userId) return;

    this.cartService.cart$.subscribe((cart) => this.cartSig.set(cart));

  
    this.paymentService.loadPayMethods();
    this.paymentMethods$ = this.paymentService.paymetMethods$;

    this.paymentMethods$.pipe(take(1)).subscribe((methods) => {
      if (!this.paymentMethodId && methods && methods.length > 0) {
        this.paymentMethodId = methods[0]._id;
      }
    });

    this.shippingAddresses$ = this.addressService.getAll();

    this.shippingAddresses$.pipe(take(1)).subscribe((list) => {
      const def = list.find((a) => a.isDefault) ?? list[0];
      this.selectedShippingAddressId = def?._id ?? '';
    });
  }

  onPaymentSelected(id: string) {
    this.paymentMethodId = id;
  }

  onAddressSelected(id: string) {
    this.selectedShippingAddressId = id;
  }

  submitOrder() {
    const cart = this.cartSig();
    const user = this.getUserId();

    if (!cart || !user) return;

    if (!this.selectedShippingAddressId) {
      this.errorMsg.set('Selecciona una dirección de envío');
      return;
    }

    if (!this.paymentMethodId) {
      this.errorMsg.set('Selecciona un método de pago');
      return;
    }

    this.loading.set(true);

    const orderPayload = {
      user,
      products: cart.products.map((p) => ({
        productId: p.product._id,
        quantity: p.quantity,
        price: p.product.price,
      })),
      totalPrice: this.total(),
      status: 'pending',
      shippingAddress: this.selectedShippingAddressId,
      paymentMethod: this.paymentMethodId,
      shippingCost: 0,
    } as unknown as Order;

    this.orderservice.createOrder(orderPayload).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe(() => {
          this.cartSig.set(null);
          this.loading.set(false);
          this.router.navigateByUrl('/thank-you-page');
        });
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
        this.errorMsg.set('No se pudo generar la compra');
      },
    });
  }

  getUserId() {
    let id = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe((userId) => (id = userId ?? ''));
    return id;
  }
}
