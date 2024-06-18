import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeocoderComponent } from './maps/geocoder/geocoder.component';
import { GooglemapComponent } from './maps/googlemap/googlemap.component';
import { MapBicyclingLayerComponent } from './maps/map-bicycling-layer/map-bicycling-layer.component';
import { MapCircleComponent } from './maps/map-circle/map-circle.component';
import { MapDirectionsRendererComponent } from './maps/map-directions-renderer/map-directions-renderer.component';
import { MapGroundOverlayComponent } from './maps/map-ground-overlay/map-ground-overlay.component';
import { MapHeatmapLayerComponent } from './maps/map-heatmap-layer/map-heatmap-layer.component';
import { MapInfoWindowComponent } from './maps/map-info-window/map-info-window.component';
import { MapKmlLayerComponent } from './maps/map-kml-layer/map-kml-layer.component';
import { MapMarkerComponent } from './maps/map-marker/map-marker.component';
import { MapPolygonComponent } from './maps/map-polygon/map-polygon.component';
import { MapPolylineComponent } from './maps/map-polyline/map-polyline.component';
import { MapRectangleComponent } from './maps/map-rectangle/map-rectangle.component';
import { MapTrafficLayerComponent } from './maps/map-traffic-layer/map-traffic-layer.component';
import { MapTransitLayerComponent } from './maps/map-transit-layer/map-transit-layer.component';
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
  {path: 'map',component:GooglemapComponent},
  {path: 'map-marker', component: MapMarkerComponent},
  {path: 'map-info-window', component: MapInfoWindowComponent},
  {path: 'map-polyline', component: MapPolylineComponent},
  {path: 'map-polygon', component: MapPolygonComponent},
  {path: 'map-rectangle', component: MapRectangleComponent},
  {path: 'map-circle', component: MapCircleComponent},
  {path: 'map-ground-overlay', component: MapGroundOverlayComponent},
  {path: 'map-kml-layer', component: MapKmlLayerComponent},
  {path: 'map-traffic-layer', component: MapTrafficLayerComponent},
  {path: 'map-transit-layer', component: MapTransitLayerComponent},
  {path: 'map-bicycling-layer', component: MapBicyclingLayerComponent},
  {path: 'map-directions-renderer', component: MapDirectionsRendererComponent},
  {path: 'map-heatmap-layer', component: MapHeatmapLayerComponent},
  {path: 'map-geocoder-service', component: GeocoderComponent},
  {path:'car',component:CarListComponent},
  {path:'edit-car',component:CarEditComponent},
  {path:'create-car',component:CarCreateComponent},
  {path:'station',component:StationListComponent},
  {path:'session',component:SessionListComponent},
  {path:'create-session',component:SessionCreateComponent},
  {path:'edit-session',component:SessionEditComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'new-password',component:SetNewPasswordComponent},
  {path:'verification-email',component:VerificationEmailComponent},
  {path:'edit-account',component:EditAccountComponent},








  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
