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
  // GET ALL INSTRUCTORS
  // =========================================

  getAll(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(
      this.apiUrl
    );
  }

  // =========================================
  // GET INSTRUCTOR BY ID
  // =========================================

  getById(id: number): Observable<Instructor> {
    return this.http.get<Instructor>(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================================
  // ADD INSTRUCTOR
  // =========================================

  add(instructor: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(
      this.apiUrl,
      instructor
    );
  }

  // =========================================
  // UPDATE INSTRUCTOR
  // =========================================

  update(
    id: number,
    instructor: Instructor
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      instructor,
      {
        responseType: 'text'
      }
    );

  }

  // =========================================
  // DELETE INSTRUCTOR
  // =========================================

  delete(id: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    );

  }

}