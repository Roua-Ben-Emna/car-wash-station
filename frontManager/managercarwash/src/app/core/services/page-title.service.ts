import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private sharedDataSubject = new BehaviorSubject<any>({}); // Ganti tipe data sesuai kebutuhan
  sharedData$ = this.sharedDataSubject.asObservable();

  setSharedTitle(pageTitle: string): void {
    this.sharedDataSubject.next({pageTitle});
  }
}
