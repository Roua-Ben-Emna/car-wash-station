import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { CarWashSessionService } from 'src/app/services/session-service/session.service';
import { CarWashStationService } from 'src/app/services/station-service/station.service';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';

@Component({
  selector: 'app-session-edit',
  templateUrl: './session-edit.component.html',
  styleUrls: ['./session-edit.component.css']
})
export class SessionEditComponent implements OnInit {
  carWashSessionForm: FormGroup;
  carWashStations: any[] = [];
  cars: any[] = [];
  userId=LocalStorageService.getUser().id;
  sessionId!: number; // Store session ID
  selectedStation: any;
  showExteriorOption: boolean = false;
  showInteriorOption: boolean = false;
  showExteriorInteriorOption: boolean = false;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private carWashStationService: CarWashStationService,
    private carWashSessionService: CarWashSessionService,
    private router: Router
  ) {
    this.carWashSessionForm = this.fb.group({
      carWashStationId: ['', Validators.required],
      carId: ['', Validators.required],
      washType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carWashStationService.getAllCarWashStations().subscribe(
      (stations) => {
        this.carWashStations = stations;
      },
      (error) => {
        console.error('Error fetching car wash stations:', error);
      }
    );

    this.carService.getAllCarsByUser(this.userId).subscribe(
      (cars) => {
        this.cars = cars;
      },
      (error) => {
        console.error('Error fetching cars:', error);
      }
    );

    this.setDefaultStation();
  }

  private setDefaultStation(): void {
    const session = this.carWashSessionService.getSessionData();
    this.sessionId = session.id; // Set the session ID
    this.carWashSessionForm.patchValue({
      carWashStationId: session.carWashStation.id,
      carId: session.car.id,
      washType: session.washType
    });

    this.carWashStationService.getCarWashStationById(session.carWashStation.id).subscribe(
      (station) => {
        this.selectedStation = station;
        this.updateOptions();
      },
      (error) => {
        console.error('Error fetching station:', error);
      }
    );
  }

  onStationChange(): void {
    const stationId = this.carWashSessionForm.get('carWashStationId')?.value;
    if (stationId) {
      this.loadSelectedStation(stationId);
    }
  }

  private loadSelectedStation(stationId: number): void {
    this.carWashStationService.getCarWashStationById(stationId).subscribe(
      (station) => {
        this.selectedStation = station;
        this.updateOptions();
      },
      (error) => {
        console.error('Error fetching station:', error);
      }
    );
  }

  private updateOptions(): void {
    if (this.selectedStation) {
      this.showExteriorOption = this.selectedStation.estimateTypeExterior;
      this.showInteriorOption = this.selectedStation.estimateTypeInterior;
      this.showExteriorInteriorOption = this.selectedStation.estimateTypeExteriorInterior;
    }
  }

  onSubmit(): void {
    if (this.carWashSessionForm.invalid) {
      return;
    }

    const newSession = {
      id: this.sessionId, // Include the session ID here
      carWashStation: { id: this.carWashSessionForm.value.carWashStationId },
      car: { id: this.carWashSessionForm.value.carId },
      washType: this.carWashSessionForm.value.washType
    };

    // Check if sessionId is set and valid
    if (!this.sessionId) {
      console.error('Session ID is not set or invalid.');
      return;
    }

    this.carWashSessionService.updateCarWashSession(this.sessionId, newSession).subscribe(
      response => {
        console.log('Car wash session updated:', response);
        this.router.navigate(['/session']);
      },
      error => {
        console.error('Error updating car wash session:', error);
      }
    );
  }
}
