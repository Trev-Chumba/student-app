import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiService } from './fetch-api.service';
import { API_ENDPOINTS } from '../api.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal(!!localStorage.getItem('token'));
  // Track authentication state

  constructor(
    private router: Router,
    private api: FetchApiService
  ) {}

  login(userName: string, passWord: string) {
    const requestBody: Object = {
      userName: userName,
      password: passWord,
    };

    this.api.post<any>(API_ENDPOINTS.LOGIN, requestBody).subscribe({
      next: (response: { token: string }) => {
        // console.log('Login Success:', response);
        localStorage.setItem('token', response.token);

        this.isLoggedIn.set(true);

        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.log('error', err);
      },
    });
  }

  logout() {
    this.isLoggedIn.set(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.isLoggedIn();
  }
}
