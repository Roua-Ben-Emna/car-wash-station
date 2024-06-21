import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  responseMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    document.body.classList.add('hide-header-footer');

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
    
  ngOnDestroy(): void {
    document.body.classList.remove('hide-header-footer');

  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.value.email;
      this.userService.resetPasswordRequest(email).subscribe(
        (response) => {
          this.responseMessage = 'Password reset successful. Please check your email';
          this.errorMessage = null;
        },
        (errorResponse) => {
          this.errorMessage = 'Error resetting password. Please try again';
          this.responseMessage = null;
        }
      );
    } else {
      this.markFormGroupTouched(this.resetPasswordForm);
    }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
