import { APP_INITIALIZER, Component } from '@angular/core';
import { CommonModule, IMAGE_CONFIG } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { LocalStorageService } from './services/storage-service/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Car Wash Station';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const isFirstVisit = LocalStorageService.getItem('isFirstVisit');

    if (isFirstVisit === null) {
      // This means it's the first time the user is visiting the app
      LocalStorageService.setItem('isFirstVisit', 'false');

      if (!LocalStorageService.isAdminLoggedIn() && !LocalStorageService.isManagerLoggedIn()) {
        this.router.navigate(['/login']);
      }
    }
  }
}
