import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  private loginSubscription?: Subscription;
  loginForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private authService: AuthService,
    private menuService: MenuService,
  ) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): any {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    this.isLoading = true;
    this.loginSubscription = this.authService.login(this.loginForm.value)
      .pipe(finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.getMenus()
          // this.router.navigate(['admin/user'])
        },
        error: ({error} : HttpErrorResponse) => {
          console.log('error ', error);
          this.error = error.message;
        },
      });
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  getMenus() {
    this.menuService.getAll().subscribe({
      next: ({ data }) => {
        this.menuService.setMenus(data)
      }
    })
  }
}
