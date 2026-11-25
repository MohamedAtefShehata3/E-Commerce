import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductCard } from '../../shared/ui/product-card/product-card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductsService } from '../../core/services/product/products.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Product } from '../../core/models/product.interface';
import { isPlatformBrowser } from '@angular/common';
@Component({
  imports: [ProductCard, RouterLink, NgxPaginationModule],
  selector: 'app-shop',
  styleUrl: './shop.css',
  templateUrl: './shop.html',
})
export class Shop implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly platform_id = inject(PLATFORM_ID);

  productList = signal<Product[]>([]);
  categoryName = signal('');

  pageSize = signal<number>(0);
  currentPage = signal<number>(0);
  total = signal<number>(0);

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.get('category')) {
        this.getProductsByCategoryData(params.get('category')!);
        this.categoryName.set(params.get('slug')!);
      } else if (params.get('brand')) {
        this.getProductsBybrandData(params.get('brand')!);
        this.categoryName.set(params.get('slug')!);
      } else {
        if (isPlatformBrowser(this.platform_id)) {
          this.getWishList();
        }
        this.getAllProductsData();
        this.categoryName.set('');
      }
    });
  }

  getAllProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.pageSize.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.total.set(res.results);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProductsByCategoryData(categoryId: string): void {
    this.productsService.getProductsByCategory(categoryId).subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProductsBybrandData(brandId: string): void {
    this.productsService.getProductsBybrand(brandId).subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  pageChanged(e: number): void {
    this.productsService.getAllProducts(e).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.pageSize.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.total.set(res.results);
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
          const idsOnly = res.data.map((item: any) => item.id || item._id);
          this.wishlistService.wishlist.set(idsOnly); // was wishList
          this.wishlistService.wishlistCount.set(res.data.length);
        },
      });
    } else {
      const localWish = this.wishlistService.getLocalWishlist();
      const idsOnly = localWish.map((item: any) => item.id || item._id);
      this.wishlistService.wishlist.set(idsOnly); // was wishList
      this.wishlistService.wishlistCount.set(localWish.length);
    }
  }
}
