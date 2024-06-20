import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { CarWashSessionService } from 'src/app/services/session-service/session.service';
import { CarWashStationService } from 'src/app/services/station-service/station.service';

@Component({
  selector: 'app-session-create',
  templateUrl: './session-create.component.html',
  styleUrls: ['./session-create.component.css']
})
export class SessionCreateComponent {
  carWashSessionForm: FormGroup;
  carWashStations: any[] = [];
  cars: any[] = [];
  userId!: number; 
  defaultStationId!: number;
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
      carWashStationId: [ Validators.required],
      carId: [ Validators.required],
      washType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  
    this.carWashStationService.getAllCarWashStations().subscribe(
      (stations) => {
        this.carWashStations = stations;
        
        console.log(this.carWashStations)
      },
      (error) => {
        console.error('Error fetching car wash stations:', error);
      }
    );

    // Assuming you want to get cars for a specific user or station, replace userId and stationId accordingly
    const userId = 1; // replace with the actual user ID
    this.carService.getAllCarsByUser(userId).subscribe(
      (cars) => {
        this.cars = cars;
      },
      (error) => {
        console.error('Error fetching cars:', error);
      }
    );
 
    this.setDefaultStation(this.carWashStationService.getStationData().id);

  }

  private setDefaultStation(stationId: number): void {
    this.carWashSessionForm.patchValue({ carWashStationId: stationId });
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
  onStationChange(): void {
    this.carWashSessionForm.get('carWashStationId')!.valueChanges.subscribe(stationId => {
      this.loadSelectedStation(stationId);
    });
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
      carWashStation: { id: this.carWashSessionForm.value.carWashStationId },
      car: { id: this.carWashSessionForm.value.carId },
      washType: this.carWashSessionForm.value.washType,
      
    };
console.log(newSession);
    this.carWashSessionService.createCarWashSession(newSession).subscribe(
      response => {
        console.log('Car wash session created:', response);
        this.router.navigate(['/session']);
      },
      error => {
        console.error('Error creating car wash session:', error);
      }
    );
  }
}
