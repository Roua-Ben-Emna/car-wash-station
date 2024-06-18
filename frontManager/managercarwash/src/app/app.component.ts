import { APP_INITIALIZER, Component } from '@angular/core';
import { CommonModule, IMAGE_CONFIG } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { FooterComponent } from './shared/layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Car Wash Station';
}
