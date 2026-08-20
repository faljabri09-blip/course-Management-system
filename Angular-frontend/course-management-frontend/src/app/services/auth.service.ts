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
  studentId?: number | null;
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

  login(data: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(

      tap(response => {

        console.log('Auth Response:', response);

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'username',
          response.username
        );

        localStorage.setItem(
          'role',
          response.role
        );

        if (
          response.studentId !== undefined &&
          response.studentId !== null
        ) {

          localStorage.setItem(
            'studentId',
            response.studentId.toString()
          );

        } else {

          localStorage.removeItem('studentId');

        }

      })

    );
  }

  register(
    data: RegisterRequest
  ): Observable<RegisterResponse> {

    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  getUsername(): string {

    return localStorage.getItem('username') || '';
  }

  getRole(): string {

    return localStorage.getItem('role') || '';
  }

  getStudentId(): number | null {

    const studentId =
      localStorage.getItem('studentId');

    if (!studentId) {
      return null;
    }

    const id = Number(studentId);

    if (isNaN(id)) {
      return null;
    }

    return id;
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }
}