import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router);

  tokenService.isAuthenticated.subscribe({
    next: (value) => {
      // console.log('route', route.url.join(""))
      const authRoute = route.url.join("")
      if(authRoute == 'login' || authRoute == 'register') {
        if (value) {
          router.navigate(['dashboard']);
        }
      } else {
        if (!value) {
          router.navigate(['login']);
        }
      }
    },
  });
  return true;
};
