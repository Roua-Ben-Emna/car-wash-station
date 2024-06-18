import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service/auth.service';
import { LocalStorageService } from '../../../services/storage-service/local-storage.service';

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
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telephone: [null, [Validators.required]],
      password: [null, [Validators.required]],
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
        console.log(res);
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => this.resetForm()
    });
  }

  resetForm() {
    this.registerForm.reset();
  }

  login(){
    this.authService.login(
      this.loginForm.get(['email'])!.value,
      this.loginForm.get(['password'])!.value
    ).subscribe((res) => {
      console.log(res);
      if(LocalStorageService.isAdminLoggedIn()){
        this.router.navigateByUrl("");
      }else {
        this.router.navigateByUrl("");
      }
    }, error => {
      console.log(error);
      if(error.status == 406) {
        console.log("Account is not active. Please register first")
      } else {
        console.log("Bad crendentials")
      }
    })
   
  }
  toggleForm() {
    this.isLogin = !this.isLogin;
  }



}
