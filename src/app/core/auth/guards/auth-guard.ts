import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const platform_id = inject(PLATFORM_ID);
  const router = inject(Router);

  /* Checks token and redirects login */

  if (isPlatformBrowser(platform_id)) {
    if (localStorage.getItem('freshToken')) {
      return true;
    } else {
      return router.parseUrl('/login');
    }
  }

  return true;
};
