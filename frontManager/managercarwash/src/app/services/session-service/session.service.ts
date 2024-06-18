import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarWashSessionService {
  private sessionData: any;
  private apiUrl = `http://localhost:8090/api/auth/carwash-sessions`;

  constructor(private http: HttpClient) {}

  getSessionsByUserCarId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
  getAllCarWashSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCarWashSessionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getCarsForSessionsByStationId(stationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${stationId}/cars`);
  }

  getCarWashSessionsByStationId(stationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/station/${stationId}`); 
  }

  createCarWashSession(carWashSession: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, carWashSession);
  }

  updateCarWashSession(id: number, carWashSession: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, carWashSession);
  }

  deleteCarWashSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setSessionData(data: any): void {
    this.sessionData = data;
  }

  getSessionData(): any {
    return this.sessionData;
  }
}
