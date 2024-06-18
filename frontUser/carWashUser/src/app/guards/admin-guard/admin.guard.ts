import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router,
    private snackBar: MatSnackBar
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean {
    if(LocalStorageService.isUserLoggedIn()) {
      this.router.navigateByUrl("");
      this.openSnackBar("You don't have access to this page");
      return false;
    }
    else if(!LocalStorageService.hasToken()){
      LocalStorageService.signOut();
      this.router.navigateByUrl("pages/my-account");
      this.openSnackBar("You are not logged in. Please login first")
      return false;
    }
    return true;
  };
  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      horizontalPosition: 'center', 
      verticalPosition: 'top', 
    });
  }
}
