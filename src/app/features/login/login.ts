import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pasword: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe((res) => {
        if (res.message == 'success') {
          localStorage.setItem('freshToken', res.token);
          localStorage.setItem('freshUser', JSON.stringify(res.user));
          this.authService.isLogged.set(true);
          this.cartService.syncCartToService();
          this.syncWishlist();
          this.router.navigate(['/']);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  syncWishlist(): void {
    const localWish = this.wishlistService.getLocalWishlist();
    if (localWish.length > 0) {
      this.wishlistService.wishlistCount.set(localWish.length);
      localWish.forEach((item) => {
        this.wishlistService.addProductToWishlist(item._id).subscribe();
      });
      localStorage.removeItem('guestWishlist');
    }
  }
}
