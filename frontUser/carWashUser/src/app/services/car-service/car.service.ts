import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.BASIC_URL}api/auth/car`;
  private carData: any;
  constructor(private http: HttpClient) { }

  getAllCarsByUser(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
  getAllCarsByStation(stationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/station/${stationId}`);
  }

  createCar(car: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, car);
  }

  getCarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateCar(id: number, car: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  setCarData(data: any): void {
    this.carData = data;
  }

  getCarData(): any {
    return this.carData;
  }

    // New method to search cars by make and model
    searchCarsByMakeAndModel(make: string, model: string): Observable<any[]> {
      const params = { make, model };
      return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
    }
}
