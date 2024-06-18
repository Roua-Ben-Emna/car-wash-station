import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppNavigationBarComponent } from './maps/app-navigation-bar/app-navigation-bar.component';
import { GooglemapComponent } from './maps/googlemap/googlemap.component';
import { MapMarkerComponent } from './maps/map-marker/map-marker.component';
import { MapInfoWindowComponent } from './maps/map-info-window/map-info-window.component';
import { MapPolylineComponent } from './maps/map-polyline/map-polyline.component';
import { MapPolygonComponent } from './maps/map-polygon/map-polygon.component';
import { MapRectangleComponent } from './maps/map-rectangle/map-rectangle.component';
import { MapCircleComponent } from './maps/map-circle/map-circle.component';
import { MapGroundOverlayComponent } from './maps/map-ground-overlay/map-ground-overlay.component';
import { MapKmlLayerComponent } from './maps/map-kml-layer/map-kml-layer.component';
import { MapTrafficLayerComponent } from './maps/map-traffic-layer/map-traffic-layer.component';
import { MapTransitLayerComponent } from './maps/map-transit-layer/map-transit-layer.component';
import { MapBicyclingLayerComponent } from './maps/map-bicycling-layer/map-bicycling-layer.component';
import { MapDirectionsRendererComponent } from './maps/map-directions-renderer/map-directions-renderer.component';
import { MapHeatmapLayerComponent } from './maps/map-heatmap-layer/map-heatmap-layer.component';
import { GeocoderComponent } from './maps/geocoder/geocoder.component';
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

@NgModule({
  declarations: [
    AppComponent,
    AppNavigationBarComponent,
    GooglemapComponent,
    MapMarkerComponent,
    MapInfoWindowComponent,
    MapPolylineComponent,
    MapPolygonComponent,
    MapRectangleComponent,
    MapCircleComponent,
    MapGroundOverlayComponent,
    MapKmlLayerComponent,
    MapTrafficLayerComponent,
    MapTransitLayerComponent,
    MapBicyclingLayerComponent,
    MapDirectionsRendererComponent,
    MapHeatmapLayerComponent,
    GeocoderComponent,
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

    
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [CarListComponent]
})
export class AppModule { }
