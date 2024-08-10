import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './user/authentication/authentication.component';
import { CarCreateComponent } from './car/car-create/car-create.component';
import { CarListComponent } from './car/car-list/car-list.component';
import { CarEditComponent } from './car/car-edit/car-edit.component';
import { StationListComponent } from './Station/station-list/station-list.component';
import { SessionListComponent } from './session/session-list/session-list.component';
import { SessionCreateComponent } from './session/session-create/session-create.component';
import { SessionEditComponent } from './session/session-edit/session-edit.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { SetNewPasswordComponent } from './user/set-new-password/set-new-password.component';
import { VerificationEmailComponent } from './user/verification-email/verification-email.component';
import { EditAccountComponent } from './user/edit-account/edit-account.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'authentication',component:AuthenticationComponent},
  {path:'car',component:CarListComponent},
  {path:'edit-car',component:CarEditComponent},
  {path:'create-car',component:CarCreateComponent},
  {path:'station',component:StationListComponent},
  {path:'session',component:SessionListComponent},
  {path:'create-session',component:SessionCreateComponent},
  {path:'edit-session',component:SessionEditComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'set-new-password',component:SetNewPasswordComponent},
  {path:'verification-email',component:VerificationEmailComponent},
  {path:'edit-account',component:EditAccountComponent},








  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
