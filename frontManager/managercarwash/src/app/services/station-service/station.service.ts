// src/app/services/car-wash-station.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CarWashStationService {
  private stationData: any;
  private apiUrl = `http://localhost:8090/api/auth/carwash-stations`; 

  constructor(private http: HttpClient) { }

  getAllCarWashStations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCarWashStationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  searchCarWashStationsByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${name}`);
  }

   createCarWashStation(carWashStation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, carWashStation);
  }

   updateCarWashStation(id: number, carWashStation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, carWashStation);
  } 

   deleteCarWashStation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  } 

  getCarWashStationsByProximity(latitude: number, longitude: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/nearby?latitude=${latitude}&longitude=${longitude}`);
  }
  setStationData(data: any): void {
    this.stationData = data;
  }

  getStationData(): any {
    return this.stationData;
  }
  getAllCarWashStationsByUser(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
