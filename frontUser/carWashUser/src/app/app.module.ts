import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './user/authentication/authentication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VerificationEmailComponent } from './user/verification-email/verification-email.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { SetNewPasswordComponent } from './user/set-new-password/set-new-password.component';
import { EditAccountComponent } from './user/edit-account/edit-account.component';
import { CarListComponent } from './car/car-list/car-list.component';
import { CarCreateComponent } from './car/car-create/car-create.component';
import { CarEditComponent } from './car/car-edit/car-edit.component';
import { StationListComponent } from './Station/station-list/station-list.component';
import { SessionListComponent } from './session/session-list/session-list.component';
import { SessionCreateComponent } from './session/session-create/session-create.component';
import { SessionEditComponent } from './session/session-edit/session-edit.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AuthenticationComponent,
    VerificationEmailComponent,
    ResetPasswordComponent,
    SetNewPasswordComponent,
    EditAccountComponent,
    CarListComponent,
    CarCreateComponent,
    CarEditComponent,
    StationListComponent,
    SessionListComponent,
    SessionCreateComponent,
    SessionEditComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    CalendarModule,
    BrowserAnimationsModule,
    DropdownModule, 
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [CarListComponent]
})
export class AppModule { }
