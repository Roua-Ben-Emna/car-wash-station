import { Component, OnInit, ViewChild } from '@angular/core';
import { CarWashStationService } from 'src/app/services/station-service/station.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { Observable,timer  } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CarWashSessionService } from 'src/app/services/session-service/session.service';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';
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
  availabilityMap: { [key: number]: number } = {};
  stationCapacity: number = 0;

  constructor(private carWashStationService: CarWashStationService,
    private carWashSessionService: CarWashSessionService,
    private router: Router) { }

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
        this.getTodayAvailability();
      },
      (error) => {
        console.error('Error fetching car wash stations:', error);
      }
    );
  }

  private getTodayAvailability(): void {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); 
    console.log(today)
    this.carWashStations.forEach(station => {
      this.carWashSessionService.countSessionsByStationAndDate(station.id, today).subscribe(
        (availability: number) => {
          
          this.availabilityMap[station.id] = station.maxCapacityCars - availability;
        },
        (error) => {
          console.error('Error fetching availability:', error);
          this.availabilityMap[station.id] = -1; 
        }
      );
    });
  }

 

  ngAfterViewInit(): void {
    this.initializeMap();
  }
  private initializeMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.map.setView([lat, lon], 13);
      const customIcon = L.icon({
        iconUrl: 'assets/images/slider/marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32] 
      });

      L.marker([lat, lon], { icon: customIcon }).addTo(this.map)
        .bindPopup('Vous êtes ici.')
        .openPopup();


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
          iconUrl: 'assets/images/slider/marker2.png', 
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
  
        this.nearcarWashStations.forEach((station) => {
          const marker = L.marker([station.latitude, station.longitude], { icon: customIcon }).addTo(this.map);
          const popupContent = `
            <div class="popup-container">
              <div class="popup-header">
                <center><p><strong>${station.name}</strong></p></center>
              </div>
              <div class="popup-body">
                <p><strong>Today's Availability:</strong> ${this.availabilityMap[station.id] !== undefined ? this.availabilityMap[station.id] : 'Loading...'} places </p>
                <p><strong>Location:</strong> ${station.location}</p>
                <p><strong>Services:</strong></p>
                <ul class="services-list">
                  ${this.getServicesList(station)}
                </ul>
               <center> <button class="btn btn-primary btn-reserve" style="border-radius: 5px;" data-station-id="${station.id}">To book</button></center>
              </div>
            </div>
          `;
          marker.bindPopup(popupContent);
        });
  
        this.map.on('popupopen', (e: any) => {
          const popupNode = e.popup.getElement();
          const reserveButton = popupNode.querySelector('.btn-reserve');
          if (reserveButton) {
            const stationId = reserveButton.getAttribute('data-station-id');
            const station = this.nearcarWashStations.find(s => s.id === +stationId);
            reserveButton.addEventListener('click', () => {
              this.reservation(station);
            });
          }
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
isUserLoggedIn(): boolean {
  return LocalStorageService.isUserLoggedIn();
}

  reservation(data: any): void {
    const isLoggedIn = this.isUserLoggedIn(); 
    if (!isLoggedIn) {
      this.router.navigate(['/authentication']);
    } else {
      this.carWashStationService.setStationData(data); 
      this.router.navigate(['/create-session']); 
    }
  }

searchStations(): void {
    if (!this.searchQuery.trim()) {
      this.carWashStations = this.nearcarWashStations;
      this.notFound = false;
    } else {
      this.carWashStations = this.nearcarWashStations.filter(station =>
        station.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        station.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.notFound = this.carWashStations.length === 0;
    }
  }
}
