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
  markerOptions: google.maps.MarkerOptions = { draggable: true }; // Allow marker to be draggable
  markerPosition?: google.maps.LatLngLiteral;
  selectedAddress: string = '';

  constructor() { }

  ngOnInit(): void {
    this.setCurrentLocation();
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      const position = event.latLng.toJSON();
      this.markerPosition = position;
      this.getAddress(position.lat, position.lng);
    }
  }

  private getAddress(latitude: number, longitude: number): void {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };
    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        if (results && results[0]) {
          const address = results[0].formatted_address;
          this.selectedAddress = address;
        } else {
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  }

  private setCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.zoom = 13; // Adjust the zoom level as needed
          this.markerPosition = this.center; // Set marker position to current location
          this.getAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}

