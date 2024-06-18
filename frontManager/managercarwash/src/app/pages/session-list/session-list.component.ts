import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable,timer  } from 'rxjs';
import { CarWashSessionService } from '../../services/session-service/session.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    HttpClientModule],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css'
})
export class SessionListComponent {
  sessions$! : Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private carWashSessionService: CarWashSessionService
  ) {}

  ngOnInit(): void {
    this.sessions$ = this.route.queryParams.pipe(
      switchMap(params => {
        const stationId = params['stationId'];
        // Fetch sessions initially
        return this.carWashSessionService.getCarWashSessionsByStationId(stationId);
      }),
      switchMap(() => {
        return timer(0, 1000).pipe(
          switchMap(() => {
            const stationId = this.route.snapshot.queryParams['stationId'];
            return this.carWashSessionService.getCarWashSessionsByStationId(stationId);
          })
        );
      }) 
    );
  }

  formatDurationShow(duration: number): string {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes} m`;
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
    this.sessions$.subscribe(sessions => {
 
        session.status = 'Completed';
        this.carWashSessionService.updateCarWashSession(session.id, session).subscribe(response => {
          // Refresh the sessions list after updating
          this.sessions$ = this.carWashSessionService.getCarWashSessionsByStationId(session.station.id);
        });
    
    });
  }
}