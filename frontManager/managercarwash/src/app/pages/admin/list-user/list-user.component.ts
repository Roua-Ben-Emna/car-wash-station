import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-service/user.service';
import { Router } from '@angular/router';
import { CarWashStationService } from '../../../services/station-service/station.service';
import { CarWashSessionService } from '../../../services/session-service/session.service';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../../services/storage-service/local-storage.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
  sessions$: Observable<any[]> = new Observable();
  users: any[] = [];
  selectedManagerStations: any[] = [];
  showStationsModal = false;
  showStationsSection = false;
  selectedManagerId: number | null = null;
  selectedManagerName: string = '';
  selectedManagerSurname: string = '';
  selectedStationSessions: any[] = [];
  showSessionsSection = false;
  selectedStationName: string = '';
  filteredSessions: any[] = [];
  filterForm: FormGroup;
  showWashTypeDropdown = false;
  showStatusDropdown = false;
  showDatePicker = false;
  currentUserId = LocalStorageService.getUser().id;
  constructor(
    private userService: UserService, 
    private carWashStationService: CarWashStationService,
    private carWashSessionService: CarWashSessionService, 
    private formBuilder: FormBuilder
  ) { 
    this.filterForm = this.formBuilder.group({
      dateFilter: [''],
      washTypeFilter: [''],
      statusFilter: ['']
    });

  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
        console.log(this.users);
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  disableUser(userId: number): void {
    this.userService.disableUserAccount(userId).subscribe(
      () => {
        this.loadUsers(); // Refresh the user list after disabling an account
      },
      error => {
        console.error('Error disabling user account:', error);
      }
    );
  }

  enableUser(userId: number): void {
    this.userService.enableUserAccount(userId).subscribe(
      () => {
        this.loadUsers(); // Refresh the user list after enabling an account
      },
      error => {
        console.error('Error enabling user account:', error);
      }
    );
  }

  viewManagerStations(managerId: number): void {
    const manager = this.users.find(user => user.id === managerId);
    if (manager) {
      this.selectedManagerName = manager.firstname;
      this.selectedManagerSurname = manager.lastname;
    }
    this.carWashStationService.getAllCarWashStationsByUser(managerId).subscribe(
      data => {
        this.selectedManagerStations = data;
        this.selectedManagerStations.forEach(station => {
          this.carWashSessionService.getCarWashSessionsByStationId(station.id).subscribe(sessions => {
            station.sessionsCount = sessions.length;
          });
        });
        this.showStationsSection = true;
        this.selectedManagerId = managerId;
      },
      error => {
        console.error('Error fetching manager stations:', error);
        this.selectedManagerStations = [];
      }
    );
  }

  viewStationSessions(stationId: number, stationName: string): void {
    this.carWashSessionService.getCarWashSessionsByStationId(stationId).subscribe(
      data => {
        this.filteredSessions = data;
        this.selectedStationName = stationName;
        this.showSessionsSection = true;
        this.applyFilters(); // Apply filters after fetching sessions
      },
      error => {
        console.error('Error fetching station sessions:', error);
        this.filteredSessions = [];
      }
    );
  }

  hideStationsSection(): void {
    this.showStationsSection = false;
    this.selectedManagerId = null;
    this.selectedManagerName = '';
    this.selectedManagerSurname = '';
  }

  hideSessionsSection(): void {
    this.showSessionsSection = false;
    this.selectedStationName = '';
  }

  toggleWashTypeDropdown(): void {
    this.showWashTypeDropdown = !this.showWashTypeDropdown;
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  setWashTypeFilter(washType: string): void {
    this.filterForm.patchValue({ washTypeFilter: washType });
    this.applyFilters();
    this.showWashTypeDropdown = false;
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    if (this.filteredSessions.length) {
      let filteredSessions = this.filteredSessions;

      if (filters.dateFilter) {
        const filterDate = new Date(filters.dateFilter);
        filteredSessions = filteredSessions.filter(session => {
          const sessionDate = new Date(session.washDate);
          return (
            sessionDate.getFullYear() === filterDate.getFullYear() &&
            sessionDate.getMonth() === filterDate.getMonth() &&
            sessionDate.getDate() === filterDate.getDate()
          );
        });
      }

      const washTypeFilter = filters.washTypeFilter || '';
      if (washTypeFilter) {
        filteredSessions = filteredSessions.filter(session => session.washType === washTypeFilter);
      }

      const statusFilter = filters.statusFilter || '';
      if (statusFilter) {
        filteredSessions = filteredSessions.filter(session => session.status === statusFilter);
      }

      this.filteredSessions = this.sortByStatusAndWashDateAndTime(filteredSessions);
    }
  }

  sortByStatusAndWashDateAndTime(sessions: any[] | null): any[] {
    if (!sessions) {
      return [];
    }
    return sessions.sort((a, b) => {
      const statusPriority = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
      const statusA = statusPriority.indexOf(a.status);
      const statusB = statusPriority.indexOf(b.status);

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      const dateA = new Date(a.washDate).getTime();
      const dateB = new Date(b.washDate).getTime();
      if (dateA === dateB) {
        return a.washTime - b.washTime;
      }
      return dateA - dateB;
    });
  }

  toggleStatusDropdown(): void {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  setFilter(filterName: string, value: string): void {
    this.filterForm.patchValue({ [filterName]: value });
    this.applyFilters();
    this.showStatusDropdown = false;
  }
}
