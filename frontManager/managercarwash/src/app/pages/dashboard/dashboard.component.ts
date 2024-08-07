import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CarWashStationService } from '../../services/station-service/station.service';
import { CarWashSessionService } from '../../services/session-service/session.service';
import { ChartModule } from 'primeng/chart';
import { isSameDay } from 'date-fns';
import { LocalStorageService } from '../../services/storage-service/local-storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  totalStations: number = 0;
  totalSessions: number = 0;
  averageWaitingTime: number = 0;
  chartData: any = {};
  currentWeekSessionCounts: any[] = [];
  stationWithMostSessions: string = '';

  constructor(
    private stationService: CarWashStationService,
    private sessionService: CarWashSessionService
  ) {}

  ngOnInit(): void {
    this.fetchStatistics();
    this.fetchCurrentWeekSessions();
  }

  fetchStatistics(): void {
    this.stationService.getAllCarWashStationsByUser(LocalStorageService.getUser().id).subscribe(stations => {
      this.totalStations = stations.length;
      const stationNames = stations.map(station => station.name);
      const sessionCounts = new Array(stations.length).fill(0);
      let totalWaitingTime = 0;
      let totalSessions = 0;
      let maxSessions = 0;
      let stationWithMostSessions = '';

      stations.forEach((station, index) => {
        this.sessionService.getCarWashSessionsByStationId(station.id).subscribe(sessions => {
          const sessionCount = sessions.length;
          this.totalSessions += sessionCount;
          sessionCounts[index] = sessionCount;

          sessions.forEach(session => {
            totalWaitingTime += session.estimatedWashDuration; // Assuming this is in minutes
          });

          if (sessionCount > maxSessions) {
            maxSessions = sessionCount;
            stationWithMostSessions = station.name;
          }

          if (totalSessions > 0) {
            this.averageWaitingTime = totalWaitingTime / totalSessions;
          }

          this.updateChartData(stationNames, sessionCounts);
          this.stationWithMostSessions = stationWithMostSessions;
        });
      });
    });
  }

  fetchCurrentWeekSessions(): void {
    const userId = LocalStorageService.getUser().id; // Replace with actual logic to get userId
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Get start of current week

    this.stationService.getAllCarWashStationsByUser(userId).subscribe(stations => {
      stations.forEach(station => {
        this.sessionService.getSessionsForStationInCurrentWeek(station.id).subscribe(sessions => {
          const sessionCounts = this.calculateSessionsByDay(sessions, startOfWeek);
          this.currentWeekSessionCounts.push({
            stationName: station.name,
            sessionCounts: sessionCounts
          });

          // Update chart data after fetching sessions
          this.updateChartData1();
        });
      });
    });
  }

  updateChartData1(): void {
    this.currentWeekSessionCounts.forEach(station => {
      const labels = this.generateDateLabels();
      const data = station.sessionCounts;
  
      // Initialize chartData[station.stationName] if it doesn't exist
      if (!this.chartData[station.stationName]) {
        this.chartData[station.stationName] = {
          labels: labels,
          datasets: [
            {
              label: 'Sessions in Current Week',
              data: data,
              fill: false,
              borderColor: '#42A5F5',
              borderWidth: 2
            }
          ]
        };
      } else {
        // Update existing chartData[station.stationName]
        this.chartData[station.stationName].labels = labels;
        this.chartData[station.stationName].datasets[0].data = data;
      }
    });
  }

  calculateSessionsByDay(sessions: any[], startOfWeek: Date): number[] {
    const sessionCounts = new Array(7).fill(0); // Initialize array for 7 days

    sessions.forEach(session => {
      const sessionDate = new Date(session.washDate);
      if (isSameDay(sessionDate, startOfWeek)) {
        sessionCounts[0]++;
      } else {
        const daysDiff = Math.floor((sessionDate.getTime() - startOfWeek.getTime()) / (1000 * 3600 * 24));
        if (daysDiff >= 0 && daysDiff < 7) {
          sessionCounts[daysDiff]++;
        }
      }
    });

    return sessionCounts;
  }

  generateDateLabels(): string[] {
    const labels = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Get start of current week

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      labels.push(formatDate(date, 'yyyy-MM-dd', 'en-US'));
    }

    return labels;
  }

  updateChartData(stationNames: string[], sessionCounts: number[]): void {
    this.chartData = {
      labels: stationNames,
      datasets: [
        {
          label: 'Number of Sessions',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: sessionCounts
        }
      ]
    };
  }
}
