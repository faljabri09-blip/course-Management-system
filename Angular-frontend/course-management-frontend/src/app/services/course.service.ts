import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
  price: number;
  instructorId: number;
}

export interface CourseDto {
  title: string;
  description: string;
  credits: number;
  price: number;
  instructorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = `${environment.apiUrl}/Course`;

  constructor(private http: HttpClient) {}

  // ============================
  // Get All Courses
  // ============================
  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  // ============================
  // Get Course By ID
  // ============================
  getById(id: number): Observable<Course> {
    return this.http.get<Course>(
      `${this.apiUrl}/${id}`
    );
  }

  // ============================
  // Add Course
  // ============================
  add(course: CourseDto): Observable<Course> {
    return this.http.post<Course>(
      this.apiUrl,
      course
    );
  }

  // ============================
  // Update Course
  // ============================
  update(
    id: number,
    course: CourseDto
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      course
    );
  }

  // ============================
  // Delete Course
  // ============================
  delete(id: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    );
  }
}