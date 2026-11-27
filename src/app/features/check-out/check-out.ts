import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-check-out',
  styleUrl: './check-out.css',
  templateUrl: './check-out.html',
})
export class CheckOut implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  cartId = signal<string>('');
  cashOrVisa = signal<string>('cash');

  checkOutForm = this.fb.group({
    shippingAddress: this.fb.group({
      details: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
    }),
  });

  ngOnInit(): void {
    this.getCartId();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.cartId.set(param.get('id')!);
    });
  }

  changePayment(el: HTMLInputElement): void {
    this.cashOrVisa.set(el.value);
  }

  submitForm(): void {
    if (this.checkOutForm.valid) {
      if (this.cashOrVisa() == 'visa') {
        this.cartService
          .Checkoutsession(this.cartId(), this.checkOutForm.value)
          .subscribe((res) => {
            if (res.status === 'success') {
              window.open(res.session.url, '_self');
            }
          });
      } else {
        this.cartService
          .CreateCashOrder(this.cartId(), this.checkOutForm.value)
          .subscribe((res) => {
            if (res.status == 'success') {
              this.router.navigate(['/allorders']);
            }
          });
      }
    }
  }
}
