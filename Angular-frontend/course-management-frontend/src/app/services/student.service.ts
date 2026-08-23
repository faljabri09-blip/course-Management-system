import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


// =========================================
// Student Model
// =========================================

export interface Student {

  id: number;

  name: string;

  email: string;

  phone: string;

}


// =========================================
// Student Request
// =========================================

export interface StudentRequest {

  name: string;

  email: string;

  phone: string;

}


// =========================================
// Student Service
// =========================================

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = `${environment.apiUrl}/Student`;


  constructor(
    private http: HttpClient
  ) {}


  // =========================================
  // Get All Students
  // =========================================

  getAll(): Observable<Student[]> {

    return this.http.get<Student[]>(
      this.apiUrl
    );

  }


  // =========================================
  // Get Student By ID
  // =========================================

  getById(
    id: number
  ): Observable<Student> {

    return this.http.get<Student>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================================
  // Add Student
  // ADMIN ONLY
  // =========================================

  add(
    student: StudentRequest
  ): Observable<Student> {

    return this.http.post<Student>(
      this.apiUrl,
      student
    );

  }


  // =========================================
  // Update Student
  // ADMIN ONLY
  // =========================================

  update(
    id: number,
    student: StudentRequest
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      student
    );

  }


  // =========================================
  // Delete Student
  // ADMIN ONLY
  // =========================================

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}