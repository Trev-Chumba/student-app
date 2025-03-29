import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal(false); // Track authentication state

  constructor(private router: Router) {}

  login(userName: string, passWord: string) {
    console.log('User logged in:', userName);
    this.isLoggedIn.set(true);

    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.isLoggedIn();
  }
}
