import { Component } from '@angular/core';
import { PageTitleService } from '../../../core/services/page-title.service';
import { UserService } from '../../../core/services/user.service';
import { Subscription, finalize } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  pageTitle = 'Create User'
  breadCrumb = ['User', 'Create']
  createUserSubscription? : Subscription
  updateUserSubscription? : Subscription
  userForm! : FormGroup
  userId? : number
  isLoading : boolean = false
  alert? : { type : string, message : string }

  constructor(
    private shareTitle: PageTitleService,
    private userService : UserService,
    private fb : FormBuilder,
    private route : ActivatedRoute,
    private location : Location,
  ) {
    this.userForm = this.fb.group({
      email     : ['', [Validators.required, Validators.email]],
      name      : ['', Validators.required],
      gender    : ['Male'],
      phone     : ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(15)]],
      birthDate : [null],
      avatar    : [''],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.userId = param['id']
      if(this.userId) {
        this.userService.getById(this.userId).subscribe({
          next: ({ data }) =>{
            this.userForm.get('email')?.setValue(data.email)
            this.userForm.get('name')?.setValue(data.name)
            this.userForm.get('phone')?.setValue(data.phone)
            this.userForm.get('gender')?.setValue(data.gender)
            this.userForm.get('birthDate')?.setValue(data.birthDate)
          },
          error : (error : HttpErrorResponse) => {
            if(error.status == 404) {
              alert(error.error.message)
              this.location.back()
            }
          }
        })
      }
    })
    this.sendDataToSidebar()
  }

  sendDataToSidebar(): void {
    this.shareTitle.setSharedTitle(this.pageTitle);
  }

  onSubmit() {
    if(this.userForm.invalid) return this.userForm.markAllAsTouched()
    this.isLoading = true
    if(!this.userId) {
      this.create()
    } else {
      this.update()
    }
  
  }

  create() {
    this.createUserSubscription = this.userService.create(this.userForm.value)
    .pipe(finalize(() => {
      this.isLoading = false
    }))
    .subscribe({
      next : ({data, message}) =>{
        this.userForm.reset(null)
        this.alert = {
          type : 'success',
          message : 'User created successfully'
        }
      },
      error : ({ error }) => {
        this.alert = {
          type : 'error',
          message : error.message
        }
      }
    })
  }

  update() {
    this.updateUserSubscription = this.userService.update({...this.userForm.value, id : this.userId})
    .pipe(finalize(() => {
      this.isLoading = false
    }))
    .subscribe({
      next : ({data, message}) =>{
        this.userForm.reset(null)
        this.alert = {
          type : 'success',
          message : 'User updated successfully'
        }
        this.userForm.get('email')?.setValue(data.email)
        this.userForm.get('name')?.setValue(data.name)
        this.userForm.get('phone')?.setValue(data.phone)
        this.userForm.get('gender')?.setValue(data.gender)
        this.userForm.get('birthDate')?.setValue(data.birthDate)
      },
      error : ({ error }) => {
        console.log('error', error)
        this.alert = {
          type : 'error',
          message : error.message
        }
      }
    })
  }

}
