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
  showModal = false;
  sessionToDelete: any;
  sessionToEdit: any;
  showEditModal = false;

  constructor(private carWashSessionService: CarWashSessionService,
    private router: Router) { }

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

    return sessions.sort((a, b) => {
      const dateA = new Date(a.washDate).getTime();
      const dateB = new Date(b.washDate).getTime();
      if (dateA === dateB) {
        return b.washTime - a.washTime; 
      }
      return dateA - dateB; 
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
    session.status = 'completed';
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
