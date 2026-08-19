import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

interface EnrollmentRequest {
  studentId: number;
  courseId: number;
  status: string;
  grade: number | null;
}

@Component({
  selector: 'app-available-courses',
  templateUrl: './available-courses.component.html',
  styleUrls: ['./available-courses.component.css']
})
export class AvailableCoursesComponent implements OnInit {

  private apiUrl = 'https://localhost:7108/api';

  courses: Course[] = [];

  loading = false;

  errorMessage = '';

  successMessage = '';

  enrollingCourseId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {

    this.loading = true;
    this.errorMessage = '';

    this.http.get<Course[]>(`${this.apiUrl}/Course`)
      .subscribe({

        next: (data) => {
          this.courses = data;
          this.loading = false;
        },

        error: (error) => {

          console.error('Error loading courses:', error);

          this.loading = false;

          if (error.status === 401) {
            this.errorMessage =
              'Your session has expired. Please login again.';
          }
          else if (error.status === 403) {
            this.errorMessage =
              'You are not authorized to view courses.';
          }
          else {
            this.errorMessage =
              'Unable to load courses. Please try again.';
          }
        }
      });
  }

  enroll(courseId: number): void {

    this.errorMessage = '';
    this.successMessage = '';

    const studentIdString =
      localStorage.getItem('studentId');

    if (!studentIdString) {

      this.errorMessage =
        'Student information not found. Please login again.';

      return;
    }

    const studentId = Number(studentIdString);

    if (!studentId || studentId <= 0) {

      this.errorMessage =
        'Invalid student information. Please login again.';

      return;
    }

    this.enrollingCourseId = courseId;

    const enrollment: EnrollmentRequest = {

      studentId: studentId,

      courseId: courseId,

      status: 'Active',

      grade: null

    };

    this.http.post(
      `${this.apiUrl}/Enrollment`,
      enrollment
    )
    .subscribe({

      next: (response) => {

        console.log('Enrollment successful:', response);

        this.successMessage =
          'Course enrolled successfully!';

        this.errorMessage = '';

        this.enrollingCourseId = null;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },

      error: (error) => {

        console.error('Enrollment error:', error);

        this.enrollingCourseId = null;

        if (error.status === 400) {

          this.errorMessage =
            'You are already enrolled in this course.';

        }
        else if (error.status === 401) {

          this.errorMessage =
            'Please login again. Your session has expired.';

        }
        else if (error.status === 403) {

          this.errorMessage =
            'You are not authorized to enroll in this course.';

        }
        else {

          this.errorMessage =
            'Failed to enroll in the course. Please try again.';
        }
      }
    });
  }

  isEnrolling(courseId: number): boolean {

    return this.enrollingCourseId === courseId;

  }

  goToMyEnrollments(): void {

    this.router.navigate(['/my-enrollments']);

  }

  goBack(): void {

    this.router.navigate(['/student-dashboard']);

  }

}