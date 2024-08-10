import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { CarWashSessionService } from 'src/app/services/session-service/session.service';
import { CarWashStationService } from 'src/app/services/station-service/station.service';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';

@Component({
  selector: 'app-session-create',
  templateUrl: './session-create.component.html',
  styleUrls: ['./session-create.component.css']
})
export class SessionCreateComponent implements OnInit {
  carWashSessionForm: FormGroup;
  carWashStations: any[] = [];
  cars: any[] = [];
  userId= LocalStorageService.getUser().id ; 
  selectedStation: any;
  defaultStationId!: number;
  showExteriorOption: boolean = false;
  showInteriorOption: boolean = false;
  showExteriorInteriorOption: boolean = false;
  minDate: Date;
  maxDate: Date;
  availableDates: Date[] = [];
  unavailableDates: Date[] = [];
  isDateDisabled: boolean = false;
  currentSessionCount: number = 0;
  stationCapacity: number = 0;
  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private carWashStationService: CarWashStationService,
    private carWashSessionService: CarWashSessionService,
    private router: Router,
    private el: ElementRef
  ) {
    const today = new Date();
    this.minDate = today;
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 1);
    this.maxDate = endDate;

    this.carWashSessionForm = this.fb.group({
      carWashStationId: ['', Validators.required],
      carId: ['', Validators.required],
      washType: ['', Validators.required],
      washDate: [null, Validators.required]
    });

    
  }

  ngOnInit(): void {
    this.loadCarWashStations();
    this.loadCars();
    this.defaultStationId=this.carWashStationService.getStationData().id
    this.setDefaultStation( this.defaultStationId);
    
  }

  private loadCarWashStations(): void {
    this.carWashStationService.getAllCarWashStations().subscribe(
      (stations) => {
        this.carWashStations = stations;
      },
      (error) => {
        console.error('Error fetching car wash stations:', error);
      }
    );
  }

  private loadCars(): void {
    this.carService.getAllCarsByUser(this.userId).subscribe(
      (cars) => {
        this.cars = cars;
      },
      (error) => {
        console.error('Error fetching cars:', error);
      }
    );
  }

  private setDefaultStation(stationId: number): void {
    this.carWashSessionForm.patchValue({ carWashStationId: stationId });
    this.carWashStationService.getCarWashStationById(stationId).subscribe(
      (station) => {
        this.selectedStation = station;
        this.updateOptions();
        this.fetchAvailableDates(stationId);
        this.fetchUnavailableDates(stationId);
      },
      (error) => {
        console.error('Error fetching station:', error);
      }
    );
  }

  private fetchUnavailableDates(stationId: number): void {
    this.carWashSessionService.getUnavailableDates(stationId).subscribe(
      (unavailableDates: Date[]) => {
        this.unavailableDates = unavailableDates.map(date => new Date(date));
        console.log('Fetched unavailable dates:', this.unavailableDates);
      },
      (error) => {
        console.error('Error fetching unavailable dates:', error);
      }
    );
  }
  private fetchAvailableDates(stationId: number): void {
    this.carWashSessionService.getavailableDates(stationId).subscribe(
      (availableDates: Date[]) => {
        this.availableDates = availableDates;
        console.log('Fetched available dates:', this.availableDates);
      },
      (error) => {
        console.error('Error fetching available dates:', error);
      }
    );
  }

  onStationChange(): void {
    const stationId = this.carWashSessionForm.value.carWashStationId;
    this.loadSelectedStation(stationId);
    this.updateUnavailableDates(stationId);
  }

  updateUnavailableDates(stationId: number): void {
    this.carWashSessionService.getUnavailableDates(stationId).subscribe(
      (dates: Date[]) => {
        this.unavailableDates = dates;
      },
      (error) => {
        console.error('Error loading unavailable dates:', error);
      }
    );
  }
  private loadSelectedStation(stationId: number): void {
    this.carWashStationService.getCarWashStationById(stationId).subscribe(
      (station) => {
        this.selectedStation = station;
        this.updateOptions();
        this.fetchAvailableDates(stationId);
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
    if (this.carWashSessionForm.invalid || this.isDateDisabled) {
      return;
    }


    

    const newSession = {
      carWashStation:{ id:this.carWashSessionForm.value.carWashStationId} ,
      car:{ id: this.carWashSessionForm.value.carId},
      washType: this.carWashSessionForm.value.washType,
      washDate: this.carWashSessionForm.value.washDate.setHours(0, 0, 0, 0)
    };

    console.log('newSession :', newSession);


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

  onDateChange(event: any): void {

    const selectedDate = new Date(event);
    selectedDate.setHours(0, 0, 0, 0); 
    console.log('selectedDate:', selectedDate);
    this.isDateDisabled = this.unavailableDates.some(d => this.isSameDate(new Date(d), selectedDate));
    console.log('Is date disabled:', this.isDateDisabled);

    if (this.isDateDisabled) {
      this.carWashSessionForm.patchValue({ washDate: null });
    } else {
      this.fetchCurrentSession(this.carWashSessionForm.value.carWashStationId,this.carWashSessionForm.value.washDate);
      console.log(this.carWashSessionForm.value.washDate)
      this.fetchStationCapacity(this.carWashSessionForm.value.carWashStationId);
    }
  }


  private stripTime(date: Date): Date {
    const strippedDate = new Date(date);
    strippedDate.setHours(0, 0, 0, 0); 
    return strippedDate;
  }
  
  private isSameDate(date1: Date, date2: Date): boolean {
    const strippedDate1 = this.stripTime(date1);
    const strippedDate2 = this.stripTime(date2);
    return strippedDate1.getTime() === strippedDate2.getTime();
  }

  private fetchStationCapacity(stationId: number): void {
    this.carWashStationService.getCarWashStationById(stationId).subscribe(
      (data) => {
        this.stationCapacity = data.maxCapacityCars;
      },
      (error) => {
        console.error('Error', error);
      }
    );
    }

  private fetchCurrentSession(stationId: number, washDate: any){
    this.carWashSessionService.countSessionsByStationAndDate(stationId, washDate).subscribe(
      (data) => {
       this.currentSessionCount=data
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  isUnavailable(date: any): boolean {
    if (!this.selectedStation) return false;
    return this.unavailableDates.some(d => this.isSameDate1(new Date(d), date));
  }

  private isSameDate1(date1: Date, date2: any): boolean {
    // Logic to compare dates
    return date1.getFullYear() === date2.year && date1.getMonth() === date2.month && date1.getDate() === date2.day;
  }
  
  focusNext(nextElementId: string) {
    const nextElement = this.el.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }


}
