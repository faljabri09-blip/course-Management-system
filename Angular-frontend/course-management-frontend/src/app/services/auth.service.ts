import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';


// =========================================
// Login Request
// =========================================

export interface LoginRequest {

  username: string;

  password: string;

}


// =========================================
// Login Response
// =========================================

export interface LoginResponse {

  token: string;

  username: string;

  role: string;

  studentId?: number | null;

}


// =========================================
// Register Request
// =========================================

export interface RegisterRequest {

  username: string;

  email: string;

  password: string;

  role: string;

}


// =========================================
// Register Response
// =========================================

export interface RegisterResponse {

  message?: string;

}


// =========================================
// Auth Service
// =========================================

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    `${environment.apiUrl}/Auth`;


  constructor(
    private http: HttpClient
  ) {}


  // =========================================
  // Login
  // =========================================

  login(
    data: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(

      tap(response => {

        console.log(
          'Auth Response:',
          response
        );


        // ===================================
        // Save Token
        // ===================================

        localStorage.setItem(
          'token',
          response.token
        );


        // ===================================
        // Save Username
        // ===================================

        localStorage.setItem(
          'username',
          response.username
        );


        // ===================================
        // Save Role
        // ===================================

        localStorage.setItem(
          'role',
          response.role
        );


        // ===================================
        // Save Student ID
        // ===================================

        if (
          response.studentId !== undefined &&
          response.studentId !== null
        ) {

          localStorage.setItem(
            'studentId',
            response.studentId.toString()
          );

        }

        else {

          localStorage.removeItem(
            'studentId'
          );

        }

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

    return localStorage.getItem(
      'token'
    );

  }


  // =========================================
  // Get Username
  // =========================================

  getUsername(): string {

    return localStorage.getItem(
      'username'
    ) || '';

  }


  // =========================================
  // Get Role
  // =========================================

  getRole(): string {

    return localStorage.getItem(
      'role'
    ) || '';

  }


  // =========================================
  // Get Student ID
  // =========================================

  getStudentId(): number | null {

    const studentId =
      localStorage.getItem(
        'studentId'
      );


    if (!studentId) {

      return null;

    }


    const id =
      Number(studentId);


    if (Number.isNaN(id)) {

      return null;

    }


    return id;

  }


  // =========================================
  // Check Login
  // =========================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

}