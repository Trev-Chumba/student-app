import { Injectable } from '@angular/core';
import { BASE_URL } from '../api.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchApiService {
  constructor(private http: HttpClient) {}

  private getHeaders(isJson = true): HttpHeaders {
    let token = localStorage.getItem('token'); // Retrieve JWT token
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (isJson) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${BASE_URL}${url}`, {
      headers: this.getHeaders(),
    });
  }

  // POST Request
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${BASE_URL}${url}`, body, {
      headers: this.getHeaders(),
    });
  }

  // POST for file uploads (multipart/form-data)
  postFile<T>(url: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${BASE_URL}${url}`, formData, {
      headers: this.getHeaders(false), // No 'Content-Type' for FormData
    });
  }
}
