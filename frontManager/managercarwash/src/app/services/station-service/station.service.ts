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

  // Method to get all car wash stations
  getAllCarWashStations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Method to get a car wash station by ID
  getCarWashStationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  // Method to search car wash stations by name
  searchCarWashStationsByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${name}`);
  }

  // Method to create a new car wash station
   createCarWashStation(carWashStation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, carWashStation);
  }
 
  // Method to update a car wash station by ID
   updateCarWashStation(id: number, carWashStation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, carWashStation);
  } 

  // Method to delete a car wash station by ID
   deleteCarWashStation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  } 


  // Method to get car wash stations by proximity (latitude and longitude)
  getCarWashStationsByProximity(latitude: number, longitude: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/nearby?latitude=${latitude}&longitude=${longitude}`);
  }
  setStationData(data: any): void {
    this.stationData = data;
  }

  getStationData(): any {
    return this.stationData;
  }
}
