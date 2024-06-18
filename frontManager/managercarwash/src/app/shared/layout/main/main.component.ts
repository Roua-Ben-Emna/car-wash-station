import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { PageTitleService } from '../../../core/services/page-title.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FooterComponent,
    SidebarComponent,
    RouterOutlet,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, OnDestroy {
  title: string = '';
  breadCrumb: Array<string> = [];
  currentRoute?: String;
  parent? : string
  subs?: Subscription;
  constructor(
    private shareTitle: PageTitleService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.setBreadCrumb()
    this.subs = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.breadCrumb = [];
        // Rute telah berubah, lakukan sesuatu di sini
        // console.log('Navigasi ke:', event.url);
        this.currentRoute = event.url;
        this.setBreadCrumb()
      }
    });

    this.shareTitle.sharedData$.subscribe(({ pageTitle, breadCrumb }) => {
      this.title = pageTitle;
      // this.breadCrumb = breadCrumb
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  setBreadCrumb () {
    let splitRouter = this.currentRoute?.split('/');
    if(!splitRouter) return
    // splitRouter = splitRouter.split(";")[0]
    this.parent = splitRouter[1];
    for (let x = 2; x <= splitRouter.length - 1; x++) {
      this.breadCrumb.push(splitRouter[x].split(";")[0]);
    }
  }
}
