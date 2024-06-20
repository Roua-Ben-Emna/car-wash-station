import { Component, OnInit, ViewChild } from '@angular/core';
import { CarWashStationService } from 'src/app/services/station-service/station.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { Observable,timer  } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent implements OnInit {

  carWashStations: any[] = [];
  nearcarWashStations: any[] = [];
  selectedStationInfo: any;
  map: any;
  searchQuery: string = '';
  notFound: boolean = false;

  constructor(private carWashStationService: CarWashStationService, private router: Router) { }

  ngOnInit(): void {
    this.getCarWashStations();
  }

  private getCarWashStations(): void {
    timer(0, 1000).pipe(
      switchMap(() => this.carWashStationService.getAllCarWashStations())
    ).subscribe(
      (stations) => {
        this.carWashStations = stations;
        this.nearcarWashStations = stations; 
      },
      (error) => {
        console.error('Error fetching car wash stations:', error);
      }
    );
  }
  ngAfterViewInit(): void {
    this.initializeMap();
  }
  private initializeMap(): void {
    // Create the Leaflet map
    this.map = L.map('map').setView([51.505, -0.09], 13);

    // Add an OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Get the current location
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.map.setView([lat, lon], 13);

      // Create a custom marker icon for the current location
      const customIcon = L.icon({
        iconUrl: 'assets/images/slider/marker.png', // Path to your custom image
        iconSize: [32, 32], // Size of the icon in pixels
        iconAnchor: [16, 32], // Anchor point of the icon (bottom middle point)
        popupAnchor: [0, -32] // Anchor point of the popup relative to the icon
      });

      // Place a marker at the current location with the custom icon
      L.marker([lat, lon], { icon: customIcon }).addTo(this.map)
        .bindPopup('Vous êtes ici.')
        .openPopup();

      // Fetch and display nearby car wash stations
      this.getNearbyCarWashStations(lat, lon);
    }, (error) => {
      console.error('Erreur de géolocalisation : ', error);
    });
  }

  private getNearbyCarWashStations(latitude: number, longitude: number): void {
    this.carWashStationService.getCarWashStationsByProximity(latitude, longitude).subscribe(
      (stations) => {
        this.nearcarWashStations = stations;
        const customIcon = L.icon({
          iconUrl: 'assets/images/slider/marker2.png', // Path to your custom image
          iconSize: [32, 32], // Size of the icon in pixels
          iconAnchor: [16, 32], // Anchor point of the icon (bottom middle point)
          popupAnchor: [0, -32] // Anchor point of the popup relative to the icon
        });
        // Add a marker for each car wash station
        this.nearcarWashStations.forEach((station) => {
          const marker = L.marker([station.latitude, station.longitude], { icon: customIcon }).addTo(this.map);
          const popupContent = `
          <div class="popup-container">
            <div class="popup-header">
              <b>${station.name}</b>
            </div>
            <div class="popup-body">
              <p><strong>Location:</strong> ${station.location}</p>
              <p><strong>Available places:</strong> ${station.currentCarsInWash} / ${station.maxCapacityCars}</p>
              <p><strong>Services:</strong></p>
              <ul class="services-list">
                ${this.getServicesList(station)}
              </ul>
              <button class="btn btn-primary btn-reserve" style="border-radius: 5px;">Réserver</button>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent).on('popupopen', () => {
          const popup = marker.getPopup();
          const content = popup?.getContent() as HTMLElement;
          const reserveButton = content.querySelector('.btn-reserve');
          reserveButton?.addEventListener('click', () => {
            this.reservation(station);
          });
        });
        

});
      },
      (error) => {
        console.error('Error fetching nearby car wash stations:', error);
      }
    );
  }


 getServicesList(station: any): string {
  let servicesList = '';
  if (station.estimateTypeExterior) {
    servicesList += '<li>Exterior</li>';
  }
  if (station.estimateTypeInterior) {
    servicesList += '<li>Interior</li>';
  }
  if (station.estimateTypeExteriorInterior) {
    servicesList += '<li>Interior & Exterior</li>';
  }
  return servicesList;
}

  reservation(data: any): void {
    this.carWashStationService.setStationData(data); 
    this.router.navigate(['/create-session']);
  }

searchStations(): void {
    if (!this.searchQuery.trim()) {
      // If search query is empty, display all stations
      this.carWashStations = this.nearcarWashStations;
      this.notFound = false;
    } else {
      // Filter stations based on the search query
      this.carWashStations = this.nearcarWashStations.filter(station =>
        station.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        station.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      // Display "Not Found" message if no stations match the search query
      this.notFound = this.carWashStations.length === 0;
    }
  }
}
