import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  pageTitle = 'Profile'

  constructor(
    private shareTitle: PageTitleService,
  ) {}

  ngOnInit(): void {
    this.sendDataToSidebar()
  }

  sendDataToSidebar(): void {
    this.shareTitle.setSharedTitle(this.pageTitle);
  }
}
