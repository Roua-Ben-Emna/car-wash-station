import { Routes } from '@angular/router';
import { MainComponent } from './shared/layout/main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CarWashStationComponent } from './pages/car-wash-station/car-wash-station.component';
import { AuthenticationComponent } from './pages/manager/authentication/authentication.component';
import { EditAccountComponent } from './pages/manager/edit-account/edit-account.component';
import { ResetPasswordComponent } from './pages/manager/reset-password/reset-password.component';
import { SetNewPasswordComponent } from './pages/manager/set-new-password/set-new-password.component';
import { VerificationEmailComponent } from './pages/manager/verification-email/verification-email.component';
import { SessionListComponent } from './pages/session-list/session-list.component';
import { ListUserComponent } from './pages/admin/list-user/list-user.component';

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
      {
        path : 'admin/user',
        component :ListUserComponent
      },
      
    ]
  },
];
