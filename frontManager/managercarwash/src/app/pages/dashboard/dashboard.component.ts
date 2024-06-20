import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GoogleMapsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = { draggable: true }; 
  markerPosition?: google.maps.LatLngLiteral;
  selectedAddress: string = '';

  constructor() { }

  ngOnInit(): void {

  }

  
}

