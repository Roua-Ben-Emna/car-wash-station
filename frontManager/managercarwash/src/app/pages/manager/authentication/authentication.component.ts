import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service/auth.service';
import { LocalStorageService } from '../../../services/storage-service/local-storage.service';

export function tunisianTelephoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^([2-9])[0-9]{7}$/.test(control.value);
    return valid ? null : { invalidTelephone: true };
  };
}

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinimumLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialCharacter && hasMinimumLength;

    return !passwordValid ? { passwordComplexity: true } : null;
  };
}

export function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid =  /^[A-Za-z\s]+$/.test(control.value);
    return valid ? null : { onlyLetters: true };
  };
}
@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ ReactiveFormsModule,
    HttpClientModule,CommonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})

export class AuthenticationComponent {


  isLogin: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';
  registerForm !: FormGroup;
  loginForm !: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router :Router) { }

    confirmationvalidator = (control: FormControl): { [s: string]: boolean } => {
      if (!control.value) {
        return { required: true }
      } else if (control.value !== this.registerForm.controls['password'].value) {
        return { confirm: true, error: true }
      }
      return {}
    }


  ngOnInit(): void {
    document.body.classList.add('hide-header-footer');
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required,onlyLettersValidator()]],
      lastname: [null, [Validators.required,onlyLettersValidator()]],
      email: [null, [Validators.required, Validators.email]],
      telephone: [null, [Validators.required, tunisianTelephoneValidator()]],
      password: [null, [Validators.required, passwordComplexityValidator()]],
      confirmPassword: [null, [Validators.required, this.confirmationvalidator]],
      userRole:'MANAGER'
      })
    
      this.loginForm = this.fb.group({
        email: [null, [Validators.required]],
        password: [null, [Validators.required]],
    })
  }
  
  ngOnDestroy(): void {
    document.body.classList.remove('hide-header-footer');

  }
 
  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.successMessage = "Please check your mailbox to verify your account";
        console.log(res);
      },
      error: (error) => {
        this.errorMessage = 'Error. Please try again';
        console.error('Error:', error);
      },
      complete: () => this.resetForm()
    });
  }

  resetForm() {
    this.registerForm.reset();
  }

  login() {
    this.authService.login(
      this.loginForm.get(['email'])!.value,
      this.loginForm.get(['password'])!.value
    ).subscribe((res) => {
      console.log(res);

      const userRole = res.body.role;
  
      if (userRole === "USER") {
        this.errorMessage = 'You are not allowed to log in.';
        console.log("User role 1 is not allowed to log in.");
      } else if (LocalStorageService.isManagerLoggedIn()) {
        this.router.navigateByUrl("dashboard");}
        else if (userRole === "ADMIN") {
          this.router.navigateByUrl("admin/user");
        }
  
    }, error => {
      console.log(error);
      if (error.status == 406) {
        this.errorMessage = 'Account is not active. Please register first';
        console.log("Account is not active. Please register first");
      } else {
        this.errorMessage = 'Bad credentials';
        console.log("Bad credentials");
      }
    });
  }
  
  toggleForm() {
    this.isLogin = !this.isLogin;
  }



}
