import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly platform_Id = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  logged = computed(() => this.authService.isLogged());
  count = computed(() => this.cartService.cartCount());
  wishCount = computed(() => this.wishlistService.wishlistCount());

  isMenuOpen = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform_Id)) {
      const token = localStorage.getItem('freshToken');
      if (token) {
        this.authService.isLogged.set(true);
        this.syncCart();
        this.syncWishlist();
        this.getCartCount();
        this.getWishlistCount();
      } else {
        this.loadGuestCounts();
      }
    }
  }

  logOut(): void {
    this.authService.signOut();
  }

  getCartCount(): void {
    this.cartService.GetLoggedUserCart().subscribe((res) => {
      this.cartService.cartCount.set(res.numOfCartItem);
    });
  }

  getWishlistCount(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe((res) => {
      this.wishlistService.wishlistCount.set(res.data.length);
    });
  }

  syncCart(): void {
    const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"product":[]}');
    if (localCart.product.length > 0) {
      localCart.product.forEach((item: any) => {
        this.cartService.AddProductToCart(item.product._id).subscribe({
          next: (res) => {
            this.cartService.cartCount.set(res.numOfCartItem);
          },
        });
      });
      localStorage.removeItem('guestCart');
    }
  }

  loadGuestCounts(): void {
    const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"product":[]}');
    this.cartService.cartCount.set(localCart.product.length);

    const localWish = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
    this.wishlistService.wishlistCount.set(localWish.length);

    const idsOnly = localWish.map((item: any) => item._id || item.id);
    this.wishlistService.wishlist.set(idsOnly);
  }

  syncWishlist(): void {
    const localWish = this.wishlistService.getLocalWishlist();
    if (localWish.length > 0) {
      localWish.forEach((item) => {
        this.wishlistService.addProductToWishlist(item._id).subscribe();
      });
      localStorage.removeItem('guestWishlist');
    }
  }
}
