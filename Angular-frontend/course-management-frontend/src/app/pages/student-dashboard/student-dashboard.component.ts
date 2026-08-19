import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  username: string = 'Student';

  studentId: number = 1;

  courses: Course[] = [];

  enrollments: Enrollment[] = [];

  loadingCourses: boolean = false;

  loadingEnrollments: boolean = false;

  message: string = '';

  errorMessage: string = '';


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadStudent();

    this.loadCourses();

    this.loadEnrollments();

  }


  // =========================
  // Student Information
  // =========================

  loadStudent(): void {

    const savedStudentId = localStorage.getItem('studentId');

    const savedUsername = localStorage.getItem('username');

    if (savedStudentId) {
      this.studentId = Number(savedStudentId);
    }

    if (savedUsername) {
      this.username = savedUsername;
    }

  }


  // =========================
  // Get All Courses
  // =========================

  loadCourses(): void {

    this.loadingCourses = true;

    this.http.get<Course[]>(
      `${environment.apiUrl}/Course`
    ).subscribe({

      next: (data) => {

        this.courses = data;

        this.loadingCourses = false;

      },

      error: (error) => {

        console.error('Error loading courses:', error);

        this.errorMessage = 'Unable to load courses.';

        this.loadingCourses = false;

      }

    });

  }


  // =========================
  // Get Student Enrollments
  // =========================

  loadEnrollments(): void {

    this.loadingEnrollments = true;

    this.http.get<Enrollment[]>(
      `${environment.apiUrl}/Enrollment/student/${this.studentId}`
    ).subscribe({

      next: (data) => {

        this.enrollments = data;

        this.loadingEnrollments = false;

      },

      error: (error) => {

        console.error('Error loading enrollments:', error);

        this.loadingEnrollments = false;

      }

    });

  }


  // =========================
  // Check if Student Already
  // Enrolled in Course
  // =========================

  isEnrolled(courseId: number): boolean {

    return this.enrollments.some(
      enrollment =>
        enrollment.courseId === courseId &&
        enrollment.status !== 'Dropped'
    );

  }


  // =========================
  // Register Course
  // =========================

  enroll(courseId: number): void {

    this.message = '';

    this.errorMessage = '';

    if (this.isEnrolled(courseId)) {

      this.errorMessage = 'You are already enrolled in this course.';

      return;

    }


    const enrollment = {

      studentId: this.studentId,

      courseId: courseId,

      status: 'Active',

      grade: null

    };


    this.http.post<Enrollment>(
      `${environment.apiUrl}/Enrollment`,
      enrollment
    ).subscribe({

      next: () => {

        this.message = 'Course registered successfully.';

        this.loadEnrollments();

      },

      error: (error) => {

        console.error('Enrollment error:', error);

        this.errorMessage =
          'Unable to register for this course.';

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


    this.http.delete(
      `${environment.apiUrl}/Enrollment/${enrollmentId}`
    ).subscribe({

      next: () => {

        this.message = 'Course dropped successfully.';

        this.loadEnrollments();

      },

      error: (error) => {

        console.error('Drop course error:', error);

        this.errorMessage =
          'Unable to drop the course.';

      }

    });

  }


  // =========================
  // Logout
  // =========================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('studentId');

    localStorage.removeItem('username');

    this.router.navigate(['/login']);

  }


  // =========================
  // User Initial
  // =========================

  get userInitial(): string {

    return this.username
      ? this.username.charAt(0).toUpperCase()
      : 'S';

  }


  // =========================
  // Statistics
  // =========================

  get activeCourses(): number {

    return this.enrollments.filter(
      e => e.status === 'Active'
    ).length;

  }


  get completedCourses(): number {

    return this.enrollments.filter(
      e => e.status === 'Completed'
    ).length;

  }

}