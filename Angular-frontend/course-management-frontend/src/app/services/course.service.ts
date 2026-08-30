import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


// =========================================
// COURSE MODEL
// =========================================

export interface Course {

  id: number;

  title: string;

  description: string;

  credits: number;

  price: number;

  instructorId: number;
}


// =========================================
// COURSE DTO
// =========================================

export interface CourseDto {

  title: string;

  description: string;

  credits: number;

  price: number;

  instructorId: number;
}


// =========================================
// COURSE SERVICE
// =========================================

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl =
    `${environment.apiUrl}/Course`;


  constructor(
    private http: HttpClient
  ) {}


  // =========================================
  // GET ALL COURSES
  // =========================================

  getAll(): Observable<Course[]> {

    return this.http.get<Course[]>(
      this.apiUrl
    );

  }


  // =========================================
  // GET COURSE BY ID
  // =========================================

  getById(
    id: number
  ): Observable<Course> {

    return this.http.get<Course>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================================
  // ADD COURSE
  // =========================================

  add(
    course: CourseDto
  ): Observable<Course> {

    return this.http.post<Course>(
      this.apiUrl,
      course
    );

  }


  // =========================================
  // UPDATE COURSE
  // =========================================

  update(
    id: number,
    course: CourseDto
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      course,
      {
        responseType: 'text'
      }
    );

  }


  // =========================================
  // DELETE COURSE
  // =========================================

  delete(
    id: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    );

  }

}