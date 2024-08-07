import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../services/storage-service/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUrl: string = '';
  menuActive = false;
  showProfileDropdown = false;
  user: any = {};

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit(): void {
    if (this.isUserLoggedIn()) {
      const user = LocalStorageService.getUser();
      this.user.firstname = user.firstname;
      this.user.lastname = user.lastname;
      this.user.role = user.role;
    }
    
  }

  isUserLoggedIn(): boolean {
    return LocalStorageService.isUserLoggedIn();
  }

  logout() {
    LocalStorageService.signOut();
    this.router.navigateByUrl('/');
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }
}
