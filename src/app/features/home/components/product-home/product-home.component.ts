import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/product/products.service';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { ProductCard } from '../../../../shared/ui/product-card/product-card';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../../../core/models/product.interface';

@Component({
  imports: [ProductCard],
  selector: 'app-product-home',
  styleUrl: './product-home.component.css',
  templateUrl: './product-home.component.html',
})
export class ProductHomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productList = signal<Product[]>([]);
  private readonly wishlistService = inject(WishlistService);
  private readonly platform_id = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform_id)) {
      this.getWishList();
    }
    this.getAllProductsData();
  }

  getAllProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getWishList(): void {
    const token = localStorage.getItem('freshToken');
    if (token) {
      this.wishlistService.getLoggedUserWishlist().subscribe({
        next: (res) => {
          const idOnly = res.data.map((item: any) => item.id || item._id);
          this.wishlistService.wishlist.set(idOnly);
          this.wishlistService.wishlistCount.set(res.data.length);
        },
      });
    } else {
      const localWishlist = this.wishlistService.getLocalWishlist();
      const idOnly = localWishlist.map((item: any) => item.id || item._id);
      this.wishlistService.wishlist.set(idOnly);
      this.wishlistService.wishlistCount.set(localWishlist.length);
    }
  }
}
