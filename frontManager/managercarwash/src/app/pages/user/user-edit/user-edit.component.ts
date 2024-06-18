import { Component } from '@angular/core';
import { PageTitleService } from '../../../core/services/page-title.service';
import { UserService } from '../../../core/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  pageTitle = 'Create User'
  breadCrumb = ['User', 'Create']
  createUserSubscription? : Subscription
  userForm! : FormGroup
  isLoading : boolean = false
  alert? : { type : string, message : string }

  constructor(
    private shareTitle: PageTitleService,
    private userService : UserService,
    private fb : FormBuilder
  ) {
    this.userForm = this.fb.group({
      email     : ['', [Validators.required, Validators.email]],
      name      : ['', Validators.required],
      password  : ['', Validators.required],
      gender    : [''],
      phone     : ['', this.onlyNumbersValidator],
      birthDate : [''],
    })
  }

  ngOnInit(): void {
    this.sendDataToSidebar()
  }

  sendDataToSidebar(): void {
    this.shareTitle.setSharedTitle(this.pageTitle);
  }

  onSubmit() {
    this.isLoading = true
    if(this.userForm.invalid) return this.userForm.markAllAsTouched()

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
        error : (error) => {
          this.alert = {
            type : 'error',
            message : error
          }
        }
      })
  }

  onlyNumbersValidator(control : any) {
    const isValid = /^\d+$/.test(control.value);
    console.log('val', control.value)
    console.log('val', isValid)
    return isValid ? null : { 'invalidNumber': true };
  }
}
