import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, BASE_URL } from '../api.constants';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  generateExcel(userRequest: number, fileName: string): Observable<string> {
    const url = `${BASE_URL + API_ENDPOINTS.GENERATE_STUDENTS}/${userRequest}/${fileName}`;
    return new Observable((observer) => {
      const eventSource = new EventSource(url);

      eventSource.addEventListener('progress', (event: MessageEvent) => {
        const progress = parseFloat(event.data);
        console.log(`Progress: ${progress}%`);
        observer.next(`Progress: ${progress}%`);

        if (progress >= 100) {
          eventSource.close();
          observer.complete();
        }
      });

      eventSource.addEventListener('complete', (event: MessageEvent) => {
        console.log('Download Ready:', event.data);
        observer.next(`Download Ready: ${event.data}`);
        eventSource.close();
        observer.complete();
      });

      eventSource.addEventListener('error', (event: MessageEvent) => {
        console.error('Error:', event.data);
        observer.error(event.data);
        eventSource.close();
      });

      return () => eventSource.close();
    });
  }
}
