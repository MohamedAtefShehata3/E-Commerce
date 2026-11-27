import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/product/products.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Product } from '../../core/models/product.interface';

@Component({
  imports: [],
  selector: 'app-details',
  styleUrl: './details.css',
  templateUrl: './details.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Details implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly platform_Id = inject(PLATFORM_ID);

  wishListProd = computed(() => this.wishlistService.wishlist());

  swiperConfig = {
    spaceBetween: 10,
    navigation: false,
    pagination: { clickable: true },
    breakpoints: {
      0: { slidespreview: 1 },
    },
  };

  product = signal<Product>({} as Product);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getSpecificProductsData(params.get('id')!);
    });
  }

  getSpecificProductsData(id: string): void {
    this.productsService.getSpecificProducts(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addToCart(prodId: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.AddProductToCart(prodId).subscribe((res) => {
        this.cartService.cartCount.set(res.numOfCartItem);
      });
    }
  }

  addToWish(prodId: string): void {
    if (localStorage.getItem('freshToken')) {
      if (this.wishListProd().includes(prodId)) {
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
    }
  }

  getWishList(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe((res) => {
      // this.wishlistService.wishList.set(res.data);
      // console.log(res.data);
      const idsOnly = res.data.map((item: any) => item.id || item._id);
      this.wishlistService.wishlist.set(idsOnly);
    });
  }

  @ViewChild('swiperMain') swiperMain!: ElementRef;
  slideTo(index: number) {
    this.swiperMain.nativeElement.swiper.slideTo(index);
  }
}
