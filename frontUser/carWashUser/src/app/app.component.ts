import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Car Wash Station';
  constructor(private router: Router) {}
  isAuthenticationRoute(): boolean {
    // Get the current route URL
    const currentRoute = this.router.url;
    
    // Check if the current route is the authentication route
    return currentRoute.includes('authentication');
  }
  }
