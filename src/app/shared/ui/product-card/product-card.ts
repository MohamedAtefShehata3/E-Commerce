import { Component, inject, input, OnInit, InputSignal, computed } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  imports: [RouterLink],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);

  product: InputSignal<Product> = input.required();
  wishlistProd = computed(() => this.wishlistService.wishlist());

  ngOnInit(): void {}

  getWishList(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe((res) => {
      console.log(res.data);
    });
  }

  addToCart(prodId: string): void {
    const token = localStorage.getItem('freshToken');
    const currentProd = this.product();

    if (token) {
      this.cartService.AddProductToCart(prodId).subscribe((res) => {
        this.cartService.cartCount.set(res.numOfCartItem);
        this.toastrService.success(res.message);
      });
    } else {
      let cart = this.cartService.getLocalCart();
      const item = cart.products.find((p: any) => p.product._id === prodId);

      if (item) {
        item.count++;
      } else {
        cart.products.push({ count: 1, product: currentProd, price: currentProd.price });
      }

      cart.totalCartPrice = cart.products.reduce((acc: any, p: any) => acc + p.price * p.count, 0);
      this.cartService.saveCartLocally(cart);
      this.cartService.cartCount.set(cart.products.length);
      this.toastrService.info('Added to local cart');
    }
  }

  addToWish(prodId: string): void {
    const token = localStorage.getItem('freshToken');
    const currentProd = this.product();

    if (token) {
      if (this.wishlistProd().includes(prodId)) {
        this.wishlistService.removeProductFormWishlist(prodId).subscribe((res) => {
          this.wishlistService.wishlist.set(res.data);
          this.wishlistService.wishlistCount.set(res.data.length);
        });
      } else {
        this.wishlistService.addProductToWishlist(prodId).subscribe((res) => {
          this.wishlistService.wishlist.set(res.data);
          this.wishlistService.wishlistCount.set(res.data.length);
        });
      }
    } else {
      let localWish = this.wishlistService.getLocalWishlist();
      const index = localWish.findIndex((item) => item._id === prodId);

      if (index > -1) {
        localWish.splice(index, 1);
      } else {
        localWish.push(currentProd);
      }

      this.wishlistService.saveWishlistLocally(localWish);
      this.wishlistService.wishlist.set(localWish.map((i) => i._id));
      this.wishlistService.wishlistCount.set(localWish.length);
    }
  }
}
