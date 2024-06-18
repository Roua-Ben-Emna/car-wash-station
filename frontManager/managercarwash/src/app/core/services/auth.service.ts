import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';
import { apiEndpoint } from '../constants/constants';
import { ILogin, ILoginResponse } from '../models/auth.model';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http : HttpClient,
    private tokenService : TokenService,
    private menuService : MenuService,
  ) { }

  login(data : ILogin) : Observable<any> {
    return this.http.post<ILoginResponse>(apiEndpoint.AuthEndpoint.login, data, {withCredentials : true})
      .pipe(
        map(response => {
          this.tokenService.setToken(response.data.accessToken)
          return response
        }),
      )
  }

  refreshToken() : Observable<any> {
    return this.http.post<any>(apiEndpoint.AuthEndpoint.refreshToken, null)
  }

  logout() {
    this.tokenService.removeToken()
  }

}
