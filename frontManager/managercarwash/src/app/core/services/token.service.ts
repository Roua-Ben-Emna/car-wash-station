import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  isAuthenticated : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor() { 
    const token = this.getToken()
    if(token) {
      this.isAuthenticated.next(token ? true : false)
    }
  }

  setToken (token : string){
    if(!this.isAuthenticated.getValue()) {
      this.isAuthenticated.next(true)
    }
    localStorage.setItem(constants.ACCESS_TOKEN, token)
  }

  getToken () {
    return localStorage.getItem(constants.ACCESS_TOKEN)
  }

  removeToken () {
    this.isAuthenticated.next(false)
    localStorage.removeItem(constants.ACCESS_TOKEN)
  }

}
