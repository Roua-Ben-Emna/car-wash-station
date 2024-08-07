import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarWashSessionService {
  private sessionData: any;
  private apiUrl = `${environment.BASIC_URL}api/auth/carwash-sessions`;

  constructor(private http: HttpClient) {}

  getSessionsByUserCarId(userId: any): Observable<any[]> {
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

  getavailableDates(stationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/availability?stationId=${stationId}`);
  }

  getUnavailableDates(stationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/unavailability?stationId=${stationId}`);
  }


  countSessionsByStationAndDate(stationId: number, washDate:any): Observable<number> {
    const url = `${this.apiUrl}/countSessions`;
    const params = { stationId: stationId.toString(), washDate: washDate };
    return this.http.get<number>(url, { params });
  }
}
