import { Component, computed, OnInit, signal } from '@angular/core';
import { Cart } from '../../../core/types/Cart';
import { Observable, of, take } from 'rxjs';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { PaymentService } from '../../../core/services/paymentMethods/payment-methods.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Store } from '@ngrx/store';
import { OrderService } from '../../../core/services/order/order.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { selectUserId } from '../../../core/store/auth/auth.selectors';
import { id } from 'zod/v4/locales';
import { Order } from '../../../core/types/Order';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { PaymentMethodsListComponent } from '../../../components/payment/payment-methods-list/payment-methods-list.component';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [AsyncPipe, PaymentMethodsListComponent, CurrencyPipe],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent implements OnInit {
  cartSig = signal<Cart | null>(null);
  loading = signal(false);
  errorMsg = signal<String | null>(null);

  paymentMethods$: Observable<PaymentMethod[]> = of([]);

  paymentMethodId: string = ''

  total = computed(
    () =>
      this.cartSig()?.products.reduce(
        (acc, p) => acc + p.product.price * p.quantity,
        0
      ) || 0
  );

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private store: Store,
    private orderservice: OrderService,
    private router: Router,
    private toast: ToastService
  ) {}
  ngOnInit(): void {
    const userId = this.getUserId();

    if (!userId) {
      return;
    }

    this.cartService.cart$.subscribe((cart) => this.cartSig.set(cart));
    this.paymentService.loadPayMethods();
    this.paymentMethods$ = this.paymentService.paymetMethods$;
  }

  onPaymentSelected(id: string){
    this.paymentMethodId = id;
  }


  submitOrder(){
    const cart = this.cartSig();
    const user = this.getUserId();

    if (!cart || !user) {
      return;
    }
    this.loading.set(true);

    const orderPayload = {
      user,
      products: cart.products.map(p => ({ productId: p.product._id, quantity: p.quantity, price: p.product.price })),
      totalPrice: this.total(),
      status: 'pending',
      shippingAddress: '6927c2dc2aad8bbe873a4d96',
      paymentMethod: this.paymentMethodId,
      shippingCost: 0,
    } as unknown as Order;

    
    this.orderservice.createOrder(orderPayload).subscribe({
      next:()=>{
        this.cartService.clearCart().subscribe(()=>{
          this.cartSig.set(null);
          this.loading.set(false);
          this.router.navigateByUrl('/thank-you-page');
        })
      },
      error:(error)=>{
        this.loading.set(false);
        console.log(error);
        this.errorMsg.set('No se pudo generar la compra');
      }
    
    })
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