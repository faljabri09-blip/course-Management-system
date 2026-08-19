import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Instructor {
  id: number;
  name: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
  price: number;
  instructorId: number;
  instructor?: Instructor;
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
  selector: 'app-my-enrollments',
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.css']
})
export class MyEnrollmentsComponent implements OnInit {

  // =========================
  // Enrollments
  // =========================

  enrollments: Enrollment[] = [];


  // =========================
  // Page Status
  // =========================

  loading = false;

  errorMessage = '';

  successMessage = '';

  droppingEnrollmentId: number | null = null;


  // =========================
  // Constructor
  // =========================

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // =========================
  // Page Load
  // =========================

  ngOnInit(): void {
    this.loadEnrollments();
  }


  // =========================
  // Load Student Enrollments
  // =========================

  loadEnrollments(): void {

    const studentId = localStorage.getItem('studentId');

    if (!studentId) {

      this.errorMessage =
        'Student ID was not found. Please login again.';

      return;
    }

    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.http.get<Enrollment[]>(
      `${environment.apiUrl}/Enrollment/student/${studentId}`
    )
    .subscribe({

      next: (data) => {

        this.enrollments = data;

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Error loading enrollments:',
          error
        );

        this.loading = false;

        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

        }
        else if (error.status === 403) {

          this.errorMessage =
            'You are not authorized to view enrollments.';

        }
        else {

          this.errorMessage =
            'Unable to load your enrollments.';

        }

      }

    });
  }


  // =========================
  // Drop Course
  // =========================

  dropCourse(enrollmentId: number): void {

    const confirmed = confirm(
      'Are you sure you want to drop this course?'
    );

    if (!confirmed) {
      return;
    }


    this.droppingEnrollmentId = enrollmentId;

    this.errorMessage = '';

    this.successMessage = '';


    this.http.delete(
      `${environment.apiUrl}/Enrollment/${enrollmentId}`
    )
    .subscribe({

      next: () => {

        this.enrollments =
          this.enrollments.filter(
            enrollment =>
              enrollment.id !== enrollmentId
          );


        this.successMessage =
          'Course dropped successfully.';


        this.droppingEnrollmentId = null;


        setTimeout(() => {

          this.successMessage = '';

        }, 3000);

      },


      error: (error) => {

        console.error(
          'Error dropping course:',
          error
        );


        this.droppingEnrollmentId = null;


        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

        }
        else if (error.status === 403) {

          this.errorMessage =
            'You are not authorized to drop this course.';

        }
        else {

          this.errorMessage =
            'Unable to drop this course. Please try again.';

        }

      }

    });
  }


  // =========================
  // Check Drop Loading
  // =========================

  isDropping(enrollmentId: number): boolean {

    return this.droppingEnrollmentId === enrollmentId;

  }


  // =========================
  // Browse Courses
  // =========================

  browseCourses(): void {

    this.router.navigate([
      '/available-courses'
    ]);

  }


  // =========================
  // Student Dashboard
  // =========================

  goToDashboard(): void {

    this.router.navigate([
      '/student-dashboard'
    ]);

  }

}