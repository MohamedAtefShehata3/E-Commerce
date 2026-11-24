import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { CartData } from '../../core/models/cart.interface';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly platform_id = inject(PLATFORM_ID);

  // cartDetails = signal<Cart>({} as Cart);
  cartDetails = signal<CartData>({ products: [], totalCartPrice: 0 } as unknown as CartData);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform_id)) {
      this.getCartData();
    }
  }

  getCartData(): void {
    const token = localStorage.getItem('freshToken');

    if (token) {
      this.cartService.GetLoggedUserCart().subscribe((res) => {
        this.cartDetails.set(res.data);
        this.cartService.saveCartLocally(res.data);
      });
    } else {
      this.cartDetails.set(this.cartService.getLocalCart());
    }
  }

  removeItem(prodId: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.RemoveProductFromCart(prodId).subscribe((res) => {
        this.cartDetails.set(res.data);
        this.cartService.cartCount.set(res.numOfCartItems);
      });
    } else {
      let cart = this.cartService.getLocalCart();
      cart.products = cart.products.filter((p: any) => p.product._id !== prodId);
      cart.totalCartPrice = cart.products.reduce((acc: any, p: any) => acc + p.price * p.count, 0);
      this.cartService.saveCartLocally(cart);
      this.cartDetails.set(cart);
      this.cartService.cartCount.set(cart.products.length);
    }
  }

  updateItemCount(prodId: string, count: number): void {
    const token = localStorage.getItem('freshToken');

    if (token) {
      this.cartService.UpdateCartProductQuantity(prodId, count).subscribe((res) => {
        this.cartDetails.set(res.data);
      });
    } else {
      let cart = JSON.parse(localStorage.getItem('guestCart') || '{"products":[]}');
      const item = cart.products.find((p: any) => p.product._id === prodId);

      if (item) {
        if (count <= 0) {
          this.removeItem(prodId);
          return;
        }
        item.count = count;
        cart.totalCartPrice = cart.products.reduce(
          (acc: any, p: any) => acc + p.price * p.count,
          0,
        );

        localStorage.setItem('guestCart', JSON.stringify(cart));
        this.cartDetails.set(cart);
      }
    }
  }

  cleanItems(): void {
    const token = localStorage.getItem('freshToken');

    if (token) {
      this.cartService.ClearUserCart().subscribe((res) => {
        this.cartDetails.set(res.data);
        this.cartService.cartCount.set(0);
      });
    } else {
      localStorage.removeItem('guestCart');
      this.cartDetails.set({ products: [], totalCartPrice: 0 } as any);
      this.cartService.cartCount.set(0);
    }
  }
}
