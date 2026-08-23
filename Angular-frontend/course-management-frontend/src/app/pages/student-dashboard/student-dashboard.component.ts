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
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  username = 'Student';

  courses: Course[] = [];
  enrollments: Enrollment[] = [];

  activeCourses = 0;
  completedCourses = 0;

  loadingCourses = false;
  loadingEnrollments = false;

  message = '';
  errorMessage = '';

  showDropModal = false;

  selectedEnrollment: Enrollment | null = null;

  droppingCourseId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadCourses();
    this.loadEnrollments();
  }


  // =====================================================
  // USER
  // =====================================================

  loadUser(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {

      const payload = JSON.parse(
        atob(
          token
            .split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      );

      console.log('JWT Payload:', payload);

      this.username =
        payload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ]
        ||
        payload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/name'
        ]
        ||
        payload.name
        ||
        payload.unique_name
        ||
        payload.username
        ||
        payload.sub
        ||
        'Student';

    } catch (error) {

      console.error(
        'Unable to read user from token:',
        error
      );

      this.username = 'Student';
    }
  }


  // =====================================================
  // COURSES
  // =====================================================

  loadCourses(): void {

    this.loadingCourses = true;
    this.errorMessage = '';

    this.http
      .get<Course[]>(
        `${environment.apiUrl}/Course`
      )
      .subscribe({

        next: (data) => {

          this.courses = data || [];

          this.loadingCourses = false;

        },

        error: (error) => {

          console.error(
            'Error loading courses:',
            error
          );

          this.errorMessage =
            'Unable to load courses.';

          this.loadingCourses = false;

        }

      });
  }


  // =====================================================
  // ENROLLMENTS
  // =====================================================

  loadEnrollments(): void {

    this.loadingEnrollments = true;

    this.http
      .get<Enrollment[]>(
        `${environment.apiUrl}/Enrollment`
      )
      .subscribe({

        next: (data) => {

          this.enrollments = data || [];

          this.calculateStatistics();

          this.loadingEnrollments = false;

        },

        error: (error) => {

          console.error(
            'Error loading enrollments:',
            error
          );

          this.errorMessage =
            'Unable to load enrollments.';

          this.loadingEnrollments = false;

        }

      });
  }


  // =====================================================
  // STATISTICS
  // =====================================================

  calculateStatistics(): void {

    this.activeCourses =
      this.enrollments.filter(
        enrollment =>
          enrollment.status === 'Active'
      ).length;

    this.completedCourses =
      this.enrollments.filter(
        enrollment =>
          enrollment.status === 'Completed'
      ).length;
  }


  // =====================================================
  // CHECK IF ENROLLED
  // =====================================================

  isEnrolled(courseId: number): boolean {

    return this.enrollments.some(
      enrollment =>
        enrollment.courseId === courseId &&
        enrollment.status !== 'Dropped'
    );
  }


  // =====================================================
  // REGISTER COURSE
  // =====================================================

  enroll(courseId: number): void {

    this.message = '';
    this.errorMessage = '';

    const request = {
      courseId: courseId
    };

    this.http
      .post(
        `${environment.apiUrl}/Enrollment`,
        request
      )
      .subscribe({

        next: () => {

          this.message =
            'Course registered successfully.';

          this.loadEnrollments();

        },

        error: (error) => {

          console.error(
            'Enrollment error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            error?.error ||
            'Unable to register for this course.';

        }

      });
  }


  // =====================================================
  // DROP MODAL
  // =====================================================

  openDropModal(
    enrollment: Enrollment
  ): void {

    this.selectedEnrollment = enrollment;

    this.showDropModal = true;
  }


  closeDropModal(): void {

    if (this.droppingCourseId !== null) {
      return;
    }

    this.showDropModal = false;

    this.selectedEnrollment = null;
  }


  isDropping(
    enrollmentId: number
  ): boolean {

    return this.droppingCourseId === enrollmentId;
  }


  // =====================================================
  // CONFIRM DROP
  // =====================================================

  confirmDropCourse(): void {

    if (!this.selectedEnrollment) {
      return;
    }

    const id =
      this.selectedEnrollment.id;

    this.droppingCourseId = id;

    this.http
      .put(
        `${environment.apiUrl}/Enrollment/${id}/drop`,
        {}
      )
      .subscribe({

        next: () => {

          this.message =
            'Course dropped successfully.';

          this.droppingCourseId = null;

          this.showDropModal = false;

          this.selectedEnrollment = null;

          this.loadEnrollments();

        },

        error: (error) => {

          console.error(
            'Drop course error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to drop this course.';

          this.droppingCourseId = null;

        }

      });
  }

}