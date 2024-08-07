import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/services/car-service/car.service';
import { CarWashSessionService } from 'src/app/services/session-service/session.service';
import { CarWashStationService } from 'src/app/services/station-service/station.service';
import { LocalStorageService } from 'src/app/services/storage-service/local-storage.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  sessions: any[] = [];
  // Remplacez par l'ID de l'utilisateur actuel
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
    this.carWashSessionService.getSessionsByUserCarId(LocalStorageService.getUser().id).subscribe(
      data => {
        this.sessions = this.sortByMostRecent(data);
      },
      error => {
        console.error('Error fetching sessions:', error);
      }
    );
  }
  
  sortByMostRecent(sessions: any[]): any[] {
    if (!sessions) {
      return [];
    }
    // Sort sessions by washDate (oldest first), and by washTime for the same date
    return sessions.sort((a, b) => {
      const dateA = new Date(a.washDate).getTime();
      const dateB = new Date(b.washDate).getTime();
      if (dateA === dateB) {
        return b.washTime - a.washTime; // Inverse order of washTime
      }
      return dateA - dateB; // Inverse order of washDate
    });
  }

  
  formatTime(duration: number): string {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes} m`;
  }

  cancelReservation(): void {
        this.carWashSessionService.deleteCarWashSession(this.sessionToDelete.id).subscribe(() => {
          this.closeModal();
          this.loadSessions();
        });
   
  }

  updateSessionStatus(session: any): void {
    session.status = 'completed'; // Ensure the status matches exactly with what you use in your ngClass condition
    this.carWashSessionService.updateCarWashSession(session.id, session).subscribe(response => {
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
