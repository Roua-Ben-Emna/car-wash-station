import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CarWashSessionService } from '../../services/session-service/session.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { SidebarComponent } from '../../shared/layout/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/layout/footer/footer.component';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, SidebarComponent, FooterComponent, FormsModule],
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {
  sessions$!: Observable<any[]>;
  filteredSessions!: any[];
  filterForm!: FormGroup;
  showWashTypeDropdown = false;
  showStatusDropdown = false;

  showDatePicker = false;

  constructor(
    private route: ActivatedRoute,
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
    this.sessions$ = this.route.queryParams.pipe(
      switchMap(params => {
        const stationId = params['stationId'];
        return this.carWashSessionService.getCarWashSessionsByStationId(stationId);
      })
    );

    this.sessions$.subscribe(sessions => {
      this.filteredSessions = this.sortByStatusAndWashDateAndTime(sessions);
    });

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
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
    this.sessions$.subscribe(sessions => {
      let filteredSessions = sessions;

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
    });
  }

  formatDurationShow(duration: number): string {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  updateSessionStatus(session: any): void {
    session.status = 'Completed';
    this.carWashSessionService.updateCarWashSession(session.id, session).subscribe(() => {
      this.applyFilters();
    });
  }

  updateSessionStatusInProgress(session: any): void {
    session.status = 'In Progress';
    this.carWashSessionService.updateCarWashSession(session.id, session).subscribe(() => {
      this.applyFilters();
    });
  }

  deleteSession(sessionId: number): void {
    this.carWashSessionService.deleteCarWashSession(sessionId).subscribe(() => {
      this.applyFilters();
    });
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