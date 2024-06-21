import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/storage-service/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }
  user: any = {}; 
  ngOnInit(): void {
    this.user.firstname = LocalStorageService.getUser().firstname;
    this.user.lastname = LocalStorageService.getUser().lastname;
    this.user.role = LocalStorageService.getUser().role;
  }

  isUserLoggedIn(): boolean {
    return LocalStorageService.isUserLoggedIn();
  }

  setActiveLink(link: string): boolean {
    return this.router.url === link;
  }
}
