import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user-service/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-set-new-password',
  standalone: true,
  imports: [ ReactiveFormsModule,
    HttpClientModule,CommonModule],
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {
  setNewPasswordForm!: FormGroup;
  token!: string;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private passwordResetService: UserService,

  ) { }

  ngOnInit(): void {
    this.setNewPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
      }
    });
    document.body.classList.add('hide-header-footer');
  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')!.value;
    const confirmPassword = control.get('confirmPassword')!.value;
    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true }; 
    } else {
      return null;
    }
  }
  
  setNewPassword() {
    if (this.setNewPasswordForm.valid) {
      const newPassword = this.setNewPasswordForm.get('newPassword')!.value;
      this.passwordResetService.resetPassword(this.token, newPassword).subscribe(
        (response) => {
        },
        (error) => {
        }
      );
      this.setNewPasswordForm.reset();
    }
  }


  ngOnDestroy(): void {
    document.body.classList.remove('hide-header-footer');
  }
}
