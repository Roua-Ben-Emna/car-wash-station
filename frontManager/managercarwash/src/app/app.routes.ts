import { Routes } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';
import { MainComponent } from './shared/layout/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { UserAddComponent } from './pages/user/user-add/user-add.component';
import { UserEditComponent } from './pages/user/user-edit/user-edit.component';
import { authGuard } from './core/guards/auth.guard';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MapComponent } from './pages/map/map.component';
import { CarWashStationComponent } from './pages/car-wash-station/car-wash-station.component';
import { AuthenticationComponent } from './pages/manager/authentication/authentication.component';
import { EditAccountComponent } from './pages/manager/edit-account/edit-account.component';
import { ResetPasswordComponent } from './pages/manager/reset-password/reset-password.component';
import { SetNewPasswordComponent } from './pages/manager/set-new-password/set-new-password.component';
import { VerificationEmailComponent } from './pages/manager/verification-email/verification-email.component';
import { SessionListComponent } from './pages/session-list/session-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthenticationComponent
  },

  {
    path:'reset-password',
    component:ResetPasswordComponent
  },
  {
    path:'set-new-password',
    component:SetNewPasswordComponent
  },
  {
    path:'verification-email',
    component:VerificationEmailComponent
  },

  {
    path: '',
    component: MainComponent,
    children : [
      {
        path : 'dashboard',
        component : DashboardComponent
      },
      {
        path : 'map',
        component :MapComponent
      },
      {
        path : 'station',
        component :CarWashStationComponent
      },
      {
        path: 'edit-account',
        component: EditAccountComponent
      },
      {
        path : 'sessions',
        component :SessionListComponent
      },
      
    ]
  },
  {
    path: '',
    component: MainComponent,
    canActivate : [authGuard],
    children: [
      {
        path: 'data',
        children: [
          {
            path: 'product',
            component: ProductComponent,
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: 'user',
            component: UserComponent,
          },
          {
            path: 'user/create',
            component: UserAddComponent,
          },
          {
            path: 'user/update/:id',
            component: UserAddComponent,
          },
        ],
      },
      {
        path: 'me',
        children: [
          {
            path: 'profile',
            component: ProfileComponent,
          },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
          },
        ],
      },
    ],
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', component: NotfoundComponent },
];
