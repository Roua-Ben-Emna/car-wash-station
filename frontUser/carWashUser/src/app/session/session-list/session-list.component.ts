import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { CarWashSessionService } from 'src/app/services/session-service/session.service';
import { CarWashStationService } from 'src/app/services/station-service/station.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  sessions: any[] = [];
  userId: number = 1; // Remplacez par l'ID de l'utilisateur actuel
  showModal = false;
  sessionToDelete: any;
  sessionToEdit: any;
  showEditModal = false;

  constructor(private carWashSessionService: CarWashSessionService,
    private router: Router,
    private carWashStationService: CarWashStationService,
    private carService: CarService) { }

  ngOnInit(): void {
    this.loadSessions();
  }


  loadSessions(): void {
    this.carWashSessionService.getSessionsByUserCarId(this.userId).subscribe(
      data => {
        this.sessions = this.sortByMostRecent(data);
      },
      error => {
        console.error('Error fetching sessions:', error);
      }
    );
  }
  sortByMostRecent(sessions: any[]): any[] {
    return sessions.sort((a, b) => new Date(b.washTime).getTime() - new Date(a.washTime).getTime());
  }
  
  formatTime(duration: number): string {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes} m`;
  }

  cancelReservation(): void {
    const cancelledStatus = 'cancelled';

    // Update the session status to 'cancelled'

        this.carWashSessionService.deleteCarWashSession(this.sessionToDelete.id).subscribe(() => {
          // Reload sessions to reflect the cancelled reservation
          this.closeModal();
          this.loadSessions();
        });
   
  }


  openModal(session: any): void {
    this.sessionToDelete = session;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.sessionToDelete = null;
  }
  
  editSession(session: any): void {
    this.carWashSessionService.setSessionData(session); 
    this.router.navigate(['/edit-session']); 
  }

}
