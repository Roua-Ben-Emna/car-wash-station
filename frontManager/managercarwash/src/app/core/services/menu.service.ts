import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { apiEndpoint } from '../constants/constants';
import { IMenuResponse } from '../models/menu.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuSubject: BehaviorSubject<any[]> = new BehaviorSubject<IMenuResponse[]>([]);
  public menu$: Observable<any[]> = this.menuSubject.asObservable();
  constructor(
    private http : HttpClient,
    private tokenService : TokenService
  ) {
    const storedMenu = localStorage.getItem('sidebar');
    if (storedMenu) {
      this.menuSubject.next(JSON.parse(storedMenu));
    } else {
      this.tokenService.removeToken()
    }
   }

  getAll() : Observable<any> {
    return this.http.get(apiEndpoint.MenuEndPoint.get).pipe(
      catchError(error => {
        console.error('Error in serviceMenu:', error);
        throw error; // Rethrow the error after logging
      })
    );
  }

  setMenus(menus : Array<IMenuResponse>) {
    this.menuSubject.next(menus);
    localStorage.setItem('sidebar', JSON.stringify(menus));
  }

  getMenu(): IMenuResponse[] {
    return this.menuSubject.value;
  }
}
