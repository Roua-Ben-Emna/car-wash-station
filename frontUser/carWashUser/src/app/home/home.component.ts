import { Component, ElementRef, OnInit } from '@angular/core';
import { switchMap, timer } from 'rxjs';
import { CarWashStationService } from '../services/station-service/station.service';
import { CarWashSessionService } from '../services/session-service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  carWashStations: any[] = [];

  availabilityMap: { [key: number]: number } = {};
  constructor(private carWashStationService: CarWashStationService,
    private carWashSessionService: CarWashSessionService,
    private router: Router,
    private el: ElementRef) { }

    
 
  ngOnInit(): void {
 
    this.getCarWashStations();
  }

  
  private getCarWashStations(): void {
    timer(0, 1000).pipe(
      switchMap(() => this.carWashStationService.getAllCarWashStations())
    ).subscribe(
      (stations) => {
        this.carWashStations = stations;
        this.getTodayAvailability();
      },
      (error) => {
        console.error('Error fetching car wash stations:', error);
      }
    );
  }


  private getTodayAvailability(): void {
    const today = new Date(); // Get the current date
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


  reservation(data: any): void {
    this.carWashStationService.setStationData(data); 
    this.router.navigate(['/create-session']);
  }
  
}
