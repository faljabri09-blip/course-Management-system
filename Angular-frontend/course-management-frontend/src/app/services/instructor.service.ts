import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Instructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  courses: string[];
}

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private apiUrl = `${environment.apiUrl}/Instructor`;

  constructor(
    private http: HttpClient
  ) {}

  // =========================================
  // Get All Instructors
  // Used by Admin → Instructors
  // =========================================

  getAll(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(
      this.apiUrl
    );
  }

  // =========================================
  // Get Instructor By ID
  // =========================================

  getById(id: number): Observable<Instructor> {
    return this.http.get<Instructor>(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================================
  // Add Instructor
  // =========================================

  add(instructor: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(
      this.apiUrl,
      instructor
    );
  }

  // =========================================
  // Update Instructor
  // =========================================

  update(
    id: number,
    instructor: Instructor
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      instructor
    );
  }

  // =========================================
  // Delete Instructor
  // =========================================

  delete(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}