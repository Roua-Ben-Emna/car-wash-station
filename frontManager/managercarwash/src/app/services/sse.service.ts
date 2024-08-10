import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private eventSource!: EventSource;

  constructor() { }

  connect(url: string): Observable<any> {
    this.eventSource = new EventSource(url);
    return new Observable(observer => {
      this.eventSource.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
        } catch (error) {
          observer.error('Failed to parse SSE data as JSON');
        }
      };
      this.eventSource.onerror = error => {
        observer.error(error);
      };
    });
  }
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
