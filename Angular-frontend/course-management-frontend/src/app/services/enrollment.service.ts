import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


// =========================================
// Enrollment Model
// =========================================

export interface Enrollment {

  id: number;

  studentId: number;

  courseId: number;

  status: string;

  grade?: string | null;

  enrollmentDate: string;

  student?: any;

  course?: any;

}


// =========================================
// Enrollment Request
// =========================================

export interface EnrollmentRequest {

  studentId: number;

  courseId: number;

  status: string;

  grade?: string | null;

}


// =========================================
// Enrollment Service
// =========================================

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiUrl =
    `${environment.apiUrl}/Enrollment`;


  constructor(
    private http: HttpClient
  ) {}


  // =========================================
  // Get All Enrollments
  // =========================================

  getAll(): Observable<Enrollment[]> {

    return this.http.get<Enrollment[]>(
      this.apiUrl
    );

  }


  // =========================================
  // Get Enrollment By ID
  // =========================================

  getById(
    id: number
  ): Observable<Enrollment> {

    return this.http.get<Enrollment>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================================
  // Get Student Enrollments
  // =========================================

  getByStudent(
    studentId: number
  ): Observable<Enrollment[]> {

    return this.http.get<Enrollment[]>(
      `${this.apiUrl}/student/${studentId}`
    );

  }


  // =========================================
  // Get Course Enrollments
  // =========================================

  getByCourse(
    courseId: number
  ): Observable<Enrollment[]> {

    return this.http.get<Enrollment[]>(
      `${this.apiUrl}/course/${courseId}`
    );

  }


  // =========================================
  // Add Enrollment
  // =========================================

  add(
    enrollment: EnrollmentRequest
  ): Observable<Enrollment> {

    return this.http.post<Enrollment>(
      this.apiUrl,
      enrollment
    );

  }


  // =========================================
  // Update Enrollment
  // =========================================

  update(
    id: number,
    enrollment: EnrollmentRequest
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      enrollment
    );

  }


  // =========================================
  // Delete Enrollment
  // =========================================

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}