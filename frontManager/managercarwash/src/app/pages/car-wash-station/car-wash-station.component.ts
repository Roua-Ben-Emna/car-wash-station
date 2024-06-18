import { ChangeDetectorRef, Component } from '@angular/core';
import { SseService } from '../../services/sse.service';
import { CarWashStation } from '../../models/car-wash-station.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarWashStationService } from '../../services/station-service/station.service';
import { HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';
import { Router } from '@angular/router';
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
  ) { }

  ngOnInit(): void {
    this.loadStations();
    this.createForm();
  }
  ngAfterViewInit(): void {
  }

  loadStations(): void {
    this.carWashStationService.getAllCarWashStations().subscribe(
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
      currentCarsInWash: ['', Validators.required],
      estimateTypeExterior: [''],
      estimateTypeInterior: [''],
      estimateTypeExteriorInterior: [''],
      estimateCarSmall: ['',Validators.required],
      estimateCarMedium: ['',Validators.required],
      estimateCarLarge: ['',Validators.required],
      manager:  { id: 1 }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.stationForm.reset();
    this.showModal = true;
    this.cdr.detectChanges();  // Ensure DOM is updated
    this.initMap();
    setTimeout(() => {
      this.resetMap();
      this.map.invalidateSize();
    }, 0);
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
      currentCarsInWash: station.currentCarsInWash,
      estimateTypeExterior: this.formatDuration(station.estimateTypeExterior),
      estimateTypeInterior: this.formatDuration(station.estimateTypeInterior),
      estimateTypeExteriorInterior: this.formatDuration(station.estimateTypeExteriorInterior),
      estimateCarSmall: this.formatDuration(station.estimateCarSmall),
      estimateCarMedium: this.formatDuration(station.estimateCarMedium),
      estimateCarLarge: this.formatDuration(station.estimateCarLarge),
      manager: { id: 1 }
    });
    this.showModal = true;
    this.cdr.detectChanges();  // Ensure DOM is updated
    this.initMap();
    setTimeout(() => {
      this.setMapMarker(station.latitude, station.longitude);
      this.map.invalidateSize();
    }, 0);
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
      
      // Check for null values and assign null if necessary
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
        formValue.manager = { id: 1 };
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
  private initMap(): void {
    if (this.map) {
      this.map.remove();  // Remove the existing map
    }
    
  // Use the browser's Geolocation API to get the current position
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    this.stationForm.patchValue({ latitude: lat, longitude: lng });

    this.map = L.map('map').setView([lat, lng], 13); // Center the map on the current location

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.stationForm.patchValue({ latitude: lat, longitude: lng });
      this.setMapMarker(lat, lng);
    });

    this.setMapMarker(lat, lng);
  }, () => {
    // If geolocation fails, default to a fixed location
    const lat = 51.505;
    const lng = -0.09;
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
  });
  }

  private setMapMarker(lat: number, lng: number): void {
    const customIcon = L.icon({
      iconUrl: '../assets/images/marker2.png', // Replace with the path to your custom icon
      iconSize: [38, 38], // Size of the icon
      iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -38] // Point from which the popup should open relative to the iconAnchor
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
    
  
    // Navigate to the sessions list page with the station ID as a parameter
    this.router.navigate(['/sessions'], { queryParams: { stationId } });
  }
}