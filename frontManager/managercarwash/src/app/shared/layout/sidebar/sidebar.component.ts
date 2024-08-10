import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MenuService } from '../../../core/services/menu.service';
import { LocalStorageService } from '../../../services/storage-service/local-storage.service';
import { Router } from '@angular/router';

interface Menu {
  id      : number
  name    : string
  url     : string
  icon?   : string
  isOpen? : Boolean
  childs? : any
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, HttpClientModule],
  providers : [AuthService],
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  
})

export class SidebarComponent implements OnInit {
  isOpen = true
  menuActive = false;
  user: any = {}; 
  sidebars! : Array<Menu>
  constructor(
    private router : Router,
    private menuService : MenuService,
  ){
  }

  ngOnInit(): void {
    this.menuService.menu$.subscribe(menuData => {
      this.sidebars = menuData;
    });
    this.user.firstname = LocalStorageService.getUser().firstname;
    this.user.lastname = LocalStorageService.getUser().lastname;
    this.user.role = LocalStorageService.getUser().role;
    
  }
  isManagerLoggedIn(): boolean {
    return LocalStorageService.isManagerLoggedIn();
  }

  toggleSubmenu(parentIndex: number, menuIndex: number) {
    this.sidebars[parentIndex].childs[menuIndex].isOpen = !this.sidebars[parentIndex].childs[menuIndex].isOpen;
  }
  toggleMenu(event: Event) {
    event.preventDefault(); 
    this.menuActive = !this.menuActive;
    console.log("Menu toggled:", this.menuActive); 
  }



  isAdminLoggedIn(): boolean {
    return LocalStorageService.isAdminLoggedIn();
  }

  onLogout() {
    LocalStorageService.signOut();
    this.router.navigateByUrl('/login'); 
  
  }
}
