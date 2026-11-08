import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'FreshCart - Home',
  },

  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop').then((m) => m.Shop),
    title: 'FreshCart - Shop',
  },

  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
    title: 'FreshCart - Categories',
  },

  {
    path: 'brands',
    loadComponent: () => import('./features/brands/brands').then((m) => m.Brands),
    title: 'FreshCart - Brands',
  },

  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist').then((m) => m.Wishlist),
    title: 'FreshCart - WishList',
  },

  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
    title: 'FreshCart - Cart',
  },

  {
    path: 'details/:id/:slug',
    loadComponent: () => import('./features/details/details').then((m) => m.Details),
    title: 'FreshCart - Product Details',
  },

  {
    path: 'checkout/:id',
    loadComponent: () => import('./features/check-out/check-out').then((m) => m.CheckOut),
    title: 'FreshCart - CheckOut',
    canActivate: [authGuard],
  },

  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders').then((m) => m.Orders),
    title: 'FreshCart - My Orders',
    canActivate: [authGuard],
  },

  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    title: 'FreshCart - Login',
  },

  {
    path: 'register',
    loadComponent: () => import('./features/register/register').then((m) => m.Register),
    title: 'FreshCart - Register',
  },

  {
    path: 'forget-password',
    loadComponent: () =>
      import('./features/forget-password/forget-password').then((m) => m.ForgetPassword),
    title: 'FreshCart - Forget Password',
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found').then((m) => m.PageNotFound),
    title: 'FreshCart - 404 Not Found',
  },
];
