import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
let isRefreshing : boolean = false

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const authService = inject(AuthService)

  tokenService.isAuthenticated.subscribe({
    next : (value) => {
      if(value) {
        req = req.clone({
          headers : req.headers.set('Authorization', `Bearer ${tokenService.getToken()}`),
          withCredentials : true
        })
      }
    }
  })
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401 ) {
        // access token is expired, try refreshing
        if(!isRefreshing) {
          isRefreshing = true
          return authService.refreshToken().pipe(
            switchMap((newToken : any) => {
              isRefreshing = false
              const accessToken = newToken['data']['accessToken']
              tokenService.setToken(accessToken)
              req = req.clone({
                headers : req.headers.set('Authorization', `Bearer ${accessToken}`),
              })
              return next(req)
            }),
          )
        } else {
          isRefreshing = false
          tokenService.removeToken();
          router.navigate(['login']);
        }
      } 
      const error = e.error?.message || e.statusText;
      return throwError(() => error);
    })
  );
};
