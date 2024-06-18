import { Injectable } from '@angular/core';
import { CanActivate,Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean {
      if(LocalStorageService.hasToken() && LocalStorageService.isUserLoggedIn()){
        this.router.navigateByUrl("/home")
        return false;
      } else if(LocalStorageService.hasToken() && LocalStorageService.isAdminLoggedIn()){
        this.router.navigateByUrl("/admin/users")
        return false;
      }
    return true;
  }
  
}
