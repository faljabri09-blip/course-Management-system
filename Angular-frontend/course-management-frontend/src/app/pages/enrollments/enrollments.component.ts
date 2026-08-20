import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
  price: number;
  instructorId: number;
}

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  status: string;
  grade: number | null;
  course?: Course;
}

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.css']
})
export class EnrollmentsComponent implements OnInit {

  username: string = 'Student';

  studentId: number = 1;

  enrollments: Enrollment[] = [];

  loading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadStudent();

    this.loadEnrollments();

  }

  // ==========================================
  // LOAD STUDENT
  // ==========================================

  loadStudent(): void {

    const savedStudentId =
      localStorage.getItem('studentId');

    const savedUsername =
      localStorage.getItem('username');

    if (savedStudentId) {

      this.studentId = Number(savedStudentId);

    }

    if (savedUsername) {

      this.username = savedUsername;

    }

  }

  // ==========================================
  // LOAD ENROLLMENTS
  // ==========================================

  loadEnrollments(): void {

    this.loading = true;

    this.errorMessage = '';

    this.http.get<Enrollment[]>(
      `${environment.apiUrl}/Enrollment/student/${this.studentId}`
    )
    .subscribe({

      next: (data: Enrollment[]) => {

        this.enrollments = data;

        this.loading = false;

        console.log(
          'Student enrollments:',
          this.enrollments
        );

      },

      error: (error) => {

        console.error(
          'Error loading enrollments:',
          error
        );

        this.loading = false;

        if (error.status === 401) {

          this.errorMessage =
            'Unauthorized. Please login again.';

        } else if (error.status === 403) {

          this.errorMessage =
            'You are not authorized to view enrollments.';

        } else {

          this.errorMessage =
            'Unable to load enrollments.';

        }

      }

    });

  }

  // ==========================================
  // ACTIVE COURSES
  // ==========================================

  get activeCount(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status === 'Active'
    ).length;

  }

  // ==========================================
  // COMPLETED COURSES
  // ==========================================

  get completedCount(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status === 'Completed'
    ).length;

  }

  // ==========================================
  // DROPPED COURSES
  // ==========================================

  get droppedCount(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status === 'Dropped'
    ).length;

  }

  // ==========================================
  // USER INITIAL
  // ==========================================

  get userInitial(): string {

    if (!this.username) {

      return 'S';

    }

    return this.username
      .charAt(0)
      .toUpperCase();

  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('studentId');

    localStorage.removeItem('username');

    this.router.navigate(['/login']);

  }

}