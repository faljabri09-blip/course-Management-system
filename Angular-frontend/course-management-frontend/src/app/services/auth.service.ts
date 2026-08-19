import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  // =========================================
  // Login
  // =========================================

  login(data: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(

      tap(response => {

        console.log('Auth Response:', response);

        // Save token
        localStorage.setItem(
          'token',
          response.token
        );

        // Save username
        localStorage.setItem(
          'username',
          response.username
        );

        // Save role
        localStorage.setItem(
          'role',
          response.role
        );

      })

    );
  }


  // =========================================
  // Register
  // =========================================

  register(
    data: RegisterRequest
  ): Observable<RegisterResponse> {

    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data
    );

  }


  // =========================================
  // Logout
  // =========================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('role');

    localStorage.removeItem('studentId');

  }


  // =========================================
  // Get Token
  // =========================================

  getToken(): string | null {

    return localStorage.getItem('token');

  }


  // =========================================
  // Get Username
  // =========================================

  getUsername(): string {

    return localStorage.getItem('username') || '';

  }


  // =========================================
  // Get Role
  // =========================================

  getRole(): string {

    return localStorage.getItem('role') || '';

  }


  // =========================================
  // Is Logged In
  // =========================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

}