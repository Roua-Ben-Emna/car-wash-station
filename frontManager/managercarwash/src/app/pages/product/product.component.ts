import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  pageTitle = "Product"
  users : Array<any> = []
  isLoading : boolean = false

  constructor(
    private shareTitle: PageTitleService,
  ) {}

  ngOnInit(): void {
    console.log('users', this.users)
    this.sendDataToSidebar()
  }

  sendDataToSidebar(): void {
    this.shareTitle.setSharedTitle(this.pageTitle);
  }
}
