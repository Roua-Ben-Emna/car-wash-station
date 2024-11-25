import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarWashStationService } from '../../services/station-service/station.service';
import { HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { CarWashSessionService } from '../../services/session-service/session.service';
import { LocalStorageService } from '../../services/storage-service/local-storage.service';

@Component({
  selector: 'app-car-wash-station',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    HttpClientModule],
  templateUrl: './car-wash-station.component.html',
  styleUrl: './car-wash-station.component.css'
})
export class CarWashStationComponent {
  
  stations: any[] = [];
  showModal = false;
  isEditMode = false;
  showConfirmationModal = false;
  confirmedDeleteStationId: number | null = null;
  stationForm!: FormGroup;
  stationToEdit: any;
  map: any;
  marker: any;
  constructor(private fb: FormBuilder,
     private carWashStationService: CarWashStationService,  
     private cdr: ChangeDetectorRef,
     private router: Router,
     private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.loadStations();
    this.createForm();
  }
  ngAfterViewInit(): void {
  }

  loadStations(): void {
    this.carWashStationService.getAllCarWashStationsByUser(LocalStorageService.getUser().id).subscribe(
      data => {
        this.stations = data;
      },
      error => {
        console.error('Error fetching stations:', error);
      }
    );
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}:${minutes}`;
}

formatDurationShow(duration: number): string {
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  return `${hours}h ${minutes} m`;
}
  createForm(): void {
    this.stationForm = this.fb.group({
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      location: ['', Validators.required],
      maxCapacityCars: ['', Validators.required],
      parallelCarWashing: ['', Validators.required],
      estimateTypeExterior: [''],
      estimateTypeInterior: [''],
      estimateTypeExteriorInterior: [''],
      estimateCarSmall: ['',Validators.required],
      estimateCarMedium: ['',Validators.required],
      estimateCarLarge: ['',Validators.required],
      manager:  { id:  LocalStorageService.getUser().id }
    });
    
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.stationForm.reset();
    this.showModal = true;
    this.cdr.detectChanges();  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.initMap(lat, lng);
        
        if (this.map) {
          const customIcon = L.icon({
            iconUrl: '../assets/images/marker2.png', 
            iconSize: [38, 38], 
            iconAnchor: [19, 38], 
            popupAnchor: [0, -38] 
          });
          this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
          this.map.setView([lat, lng], 13);
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        const defaultLat = 51.505;
      const defaultLng = -0.09;
      this.initMap(defaultLat, defaultLng);
      }
    );
  }

  openEditModal(station: any): void {
    this.isEditMode = true;
    this.stationToEdit = station;
    this.stationForm.patchValue({
      name: station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      location: station.location,
      maxCapacityCars: station.maxCapacityCars,
      parallelCarWashing: station.parallelCarWashing,
      estimateTypeExterior: this.formatDuration(station.estimateTypeExterior),
      estimateTypeInterior: this.formatDuration(station.estimateTypeInterior),
      estimateTypeExteriorInterior: this.formatDuration(station.estimateTypeExteriorInterior),
      estimateCarSmall: this.formatDuration(station.estimateCarSmall),
      estimateCarMedium: this.formatDuration(station.estimateCarMedium),
      estimateCarLarge: this.formatDuration(station.estimateCarLarge),
      manager: { id:  LocalStorageService.getUser().id }
    });
    this.showModal = true;
    this.cdr.detectChanges();
    this.initMap(station.latitude, station.longitude);
    if (this.map) {
      const customIcon = L.icon({
        iconUrl: '../assets/images/marker2.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });
      this.marker = L.marker([station.latitude, station.longitude], { icon: customIcon }).addTo(this.map);
      this.map.setView([station.latitude, station.longitude], 13);
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  convertToMilliseconds(durationString: string): number | null {
    if (!durationString || durationString.trim() === '') {
      return null; 
    }
    const [hours, minutes] = durationString.split(':').map(Number);
    return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
  }
  
  onSubmit(): void {
    if (this.stationForm.valid) {
      const formValue = this.stationForm.value;
      formValue.estimateTypeExterior = this.convertToMilliseconds(formValue.estimateTypeExterior);
      formValue.estimateTypeInterior = this.convertToMilliseconds(formValue.estimateTypeInterior);
      formValue.estimateTypeExteriorInterior = this.convertToMilliseconds(formValue.estimateTypeExteriorInterior);
      formValue.estimateCarSmall = this.convertToMilliseconds(formValue.estimateCarSmall);
      formValue.estimateCarMedium = this.convertToMilliseconds(formValue.estimateCarMedium);
      formValue.estimateCarLarge = this.convertToMilliseconds(formValue.estimateCarLarge);
      
      if (formValue.estimateTypeExterior === null) {
        formValue.estimateTypeExterior = null;
      }
      if (formValue.estimateTypeInterior === null) {
        formValue.estimateTypeInterior = null;
      }
      if (formValue.estimateTypeExteriorInterior === null) {
        formValue.estimateTypeExteriorInterior = null;
      }
      if (formValue.estimateCarSmall === null) {
        formValue.estimateCarSmall = null;
      }
      if (formValue.estimateCarMedium === null) {
        formValue.estimateCarMedium = null;
      }
      if (formValue.estimateCarLarge === null) {
        formValue.estimateCarLarge = null;
      }  
    
      if (formValue.manager === null || !formValue.manager.id) {
        formValue.manager = { id: LocalStorageService.getUser().id };
      }
      if (this.isEditMode) {
        this.carWashStationService.updateCarWashStation(this.stationToEdit.id, this.stationForm.value).subscribe(
          () => {
            this.loadStations();
            this.closeModal();
          },
          error => {
            console.error('Error updating station:', error);
          }
        );
      } else {
        this.carWashStationService.createCarWashStation(this.stationForm.value).subscribe(
          () => {
            this.loadStations();
            this.closeModal();
          },
          error => {
            console.error('Error creating station:', error);
          }
        );
      }
    }
  }

  confirmDeleteStation(id: number): void {
    this.confirmedDeleteStationId = id;
    this.showConfirmationModal = true;
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.confirmedDeleteStationId = null;
  }

  deleteStation(): void {
    if (this.confirmedDeleteStationId !== null) {

    this.carWashStationService.deleteCarWashStation(this.confirmedDeleteStationId).subscribe(
      () => {
        this.closeConfirmationModal();
        this.loadStations();
      },
      error => {
        console.error('Error deleting station:', error);
      }
    );
  }

  }
  private initMap(lat: number, lng: number): void {
    this.map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.stationForm.patchValue({ latitude: lat, longitude: lng });
      this.setMapMarker(lat, lng);
    });


}

  private setMapMarker(lat: number, lng: number): void {
    const customIcon = L.icon({
      iconUrl: '../assets/images/marker2.png', 
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }
    this.map.setView([lat, lng], 13);
  }

  private resetMap(): void {
    this.map.setView([51.505, -0.09], 13); 
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }

  openReservationsModal(stationId: Number): void {
        this.router.navigate(['/sessions'], { queryParams: { stationId } });
  }

  focusNext(nextElementId: string) {
    const nextElement = this.el.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }

  
}