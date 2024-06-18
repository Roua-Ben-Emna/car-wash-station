import { Component } from '@angular/core';
import { PageTitleService } from '../../core/services/page-title.service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { finalize } from 'rxjs';
import { ISearch, ISort, IUser, IUserSearch } from '../../core/models/user.model';
import { IPagination } from '../../core/models/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  pageTitle = 'User'
  breadCrumb = ['User']
  users : IUser[] = []
  isLoading : boolean = false
  filter : IUserSearch
  ISearch = ISearch
  pagination : IPagination
  pages : Array<number> = []

  skeletonLoading = Array.from({ length: 10 }, (_, index) => index + 1);

  constructor(
    private shareTitle: PageTitleService,
    private router : ActivatedRoute,
    private uService : UserService,
  ) {
    this.pagination = {
      perPage     : 10,
      currentPage : 1,
      totalItems  : 10,
      totalPages  : 10,
      pages       : []
    }

    this.filter = {
      page        : 1,
      perPage     : 10,
      sort        : ISort.DESC,
      sortBy      : 'updatedAt',
      search      : ISearch.NAME,
      searchValue : '',
    }

  }

  ngOnInit(): void {
    this.router.params.subscribe((query) => {
      this.filter.page = query['page'] || 1
      this.filter.perPage = query['perPage'] || this.filter.perPage
      this.getUsers()
    })
    this.sendDataToSidebar()
  }

  sendDataToSidebar(): void {
    this.shareTitle.setSharedTitle(this.pageTitle);
  }

  getUsers(page : number | null = null) {
    if(page) {
      this.filter.page = page
    }
    this.isLoading = true
    this.uService.getAll(this.filter)
      .pipe(finalize(() =>{
        this.isLoading = false
      }))
      .subscribe({
        next : (result) => {
          this.users = result.data
          if(result.pagination) {
            this.pagination = result.pagination
          }
        }, error : (error) => {
          console.log('errr', error)
          // alert(error)
        }
    })
  }

  changePerPage(event : any) {
    this.filter.perPage = event.target.value
    this.filter.page = 1
    this.getUsers()
  }

  selectedSearch(searchBy : ISearch) {
    this.filter.search = searchBy
  }
}
