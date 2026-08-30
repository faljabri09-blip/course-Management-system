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

  // =====================================================
  // USER
  // =====================================================

  username = 'Student';

  studentId: number | null = null;


  // =====================================================
  // DATA
  // =====================================================

  courses: Course[] = [];

  enrollments: Enrollment[] = [];


  // =====================================================
  // STATISTICS
  // =====================================================

  activeCourses = 0;

  completedCourses = 0;


  // =====================================================
  // LOADING
  // =====================================================

  loadingCourses = false;

  loadingEnrollments = false;

  enrollingCourseId: number | null = null;

  droppingCourseId: number | null = null;


  // =====================================================
  // MESSAGES
  // =====================================================

  message = '';

  errorMessage = '';


  // =====================================================
  // DROP MODAL
  // =====================================================

  showDropModal = false;

  selectedEnrollment: Enrollment | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadUser();

    this.loadCourses();

    // Load enrollments after student ID is available
    if (this.studentId) {
      this.loadEnrollments();
    }

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


    // =====================================================
    // Get Student ID from localStorage
    // =====================================================

    const storedStudentId =
      localStorage.getItem('studentId');

    if (storedStudentId) {

      const id = Number(storedStudentId);

      if (!isNaN(id) && id > 0) {

        this.studentId = id;

      }

    }


    // =====================================================
    // Read JWT
    // =====================================================

    try {

      const payload = JSON.parse(
        atob(
          token
            .split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      );


      console.log(
        'JWT Payload:',
        payload
      );


      // =====================================================
      // Username
      // =====================================================

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


      // =====================================================
      // Student ID from JWT
      // =====================================================

      const jwtStudentId =
        payload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]
        ||
        payload[
          'http://schemas.microsoft.com/identity/claims/objectidentifier'
        ]
        ||
        payload.studentId
        ||
        payload.studentID;


      if (jwtStudentId) {

        const id = Number(jwtStudentId);

        if (!isNaN(id) && id > 0) {

          // JWT is the source of truth
          this.studentId = id;

          localStorage.setItem(
            'studentId',
            id.toString()
          );

        }

      }


      console.log(
        'Student ID:',
        this.studentId
      );


    } catch (error) {

      console.error(
        'Unable to read user from token:',
        error
      );

      this.username = 'Student';

    }


    // =====================================================
    // Validate Student ID
    // =====================================================

    if (!this.studentId) {

      console.error(
        'Student ID was not found.'
      );

      this.errorMessage =
        'Student information was not found. Please login again.';

    }

  }


  // =====================================================
  // COURSES
  // =====================================================

  loadCourses(): void {

    this.loadingCourses = true;

    this.http
      .get<Course[]>(
        `${environment.apiUrl}/Course`
      )
      .subscribe({

        next: (data: Course[]) => {

          console.log(
            'Courses loaded:',
            data
          );

          this.courses =
            data || [];

          this.loadingCourses = false;

        },

        error: (error: any) => {

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

    if (!this.studentId) {

      console.error(
        'Cannot load enrollments: Student ID not found.'
      );

      return;

    }


    this.loadingEnrollments = true;


    const url =
      `${environment.apiUrl}/Enrollment/student/${this.studentId}`;


    console.log(
      'Loading student enrollments:',
      url
    );


    this.http
      .get<Enrollment[]>(url)
      .subscribe({

        next: (data: Enrollment[]) => {

          console.log(
            'Student enrollments loaded:',
            data
          );


          this.enrollments =
            data || [];


          this.calculateStatistics();


          this.loadingEnrollments = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading student enrollments:',
            error
          );

          console.error(
            'Status:',
            error?.status
          );

          console.error(
            'Error body:',
            error?.error
          );


          this.errorMessage =
            error?.error?.message
            ||
            error?.error
            ||
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
  // CHECK ENROLLMENT
  // =====================================================

  isEnrolled(
    courseId: number
  ): boolean {

    return this.enrollments.some(
      enrollment =>
        enrollment.courseId === courseId &&
        enrollment.status === 'Active'
    );

  }


  // =====================================================
  // CHECK ENROLLING
  // =====================================================

  isEnrolling(
    courseId: number
  ): boolean {

    return this.enrollingCourseId === courseId;

  }


  // =====================================================
  // REGISTER COURSE
  // =====================================================

  enroll(
    courseId: number
  ): void {

    console.log(
      '===================================='
    );

    console.log(
      'ENROLL COURSE'
    );

    console.log(
      'Course ID:',
      courseId
    );

    console.log(
      'Student ID:',
      this.studentId
    );

    console.log(
      '===================================='
    );


    // =====================================================
    // Prevent multiple clicks
    // =====================================================

    if (
      this.enrollingCourseId !== null
    ) {

      return;

    }


    // =====================================================
    // Validate Student ID
    // =====================================================

    if (!this.studentId) {

      this.errorMessage =
        'Student ID was not found. Please login again.';

      return;

    }


    // =====================================================
    // Check if already enrolled
    // =====================================================

    if (this.isEnrolled(courseId)) {

      this.message =
        'You are already registered in this course.';

      return;

    }


    // =====================================================
    // Reset messages
    // =====================================================

    this.message = '';

    this.errorMessage = '';


    this.enrollingCourseId =
      courseId;


    // =====================================================
    // Request
    // =====================================================

    const request = {

      studentId: this.studentId,

      courseId: courseId,

      status: 'Active',

      grade: null

    };


    console.log(
      'Register Course Request:',
      request
    );


    // =====================================================
    // POST Enrollment
    // =====================================================

    this.http
      .post<Enrollment>(
        `${environment.apiUrl}/Enrollment`,
        request
      )
      .subscribe({

        next: (response: Enrollment) => {

          console.log(
            'Enrollment response:',
            response
          );


          this.message =
            'Course registered successfully.';


          this.enrollingCourseId =
            null;


          // =================================================
          // Add enrollment immediately to local list
          // =================================================

          if (response) {

            this.enrollments = [
              ...this.enrollments,
              response
            ];

            this.calculateStatistics();

          }


          // =================================================
          // Reload student enrollments from backend
          // =================================================

          this.loadEnrollments();

        },


        error: (error: any) => {

          console.error(
            '===================================='
          );

          console.error(
            'ENROLLMENT ERROR'
          );

          console.error(
            'Status:',
            error?.status
          );

          console.error(
            'Error:',
            error
          );

          console.error(
            'Error body:',
            error?.error
          );

          console.error(
            '===================================='
          );


          this.errorMessage =
            error?.error?.message
            ||
            error?.error
            ||
            'Unable to register for this course.';


          this.enrollingCourseId =
            null;

        }

      });

  }


  // =====================================================
  // OPEN DROP MODAL
  // =====================================================

  openDropModal(
    enrollment: Enrollment
  ): void {

    if (
      enrollment.status !== 'Active'
    ) {

      return;

    }


    console.log(
      'Opening drop modal for enrollment:',
      enrollment
    );


    this.selectedEnrollment =
      enrollment;


    this.showDropModal =
      true;


    this.message = '';

    this.errorMessage = '';

  }


  // =====================================================
  // CLOSE DROP MODAL
  // =====================================================

  closeDropModal(): void {

    if (
      this.droppingCourseId !== null
    ) {

      return;

    }


    this.showDropModal =
      false;


    this.selectedEnrollment =
      null;

  }


  // =====================================================
  // CHECK DROPPING
  // =====================================================

  isDropping(
    enrollmentId: number
  ): boolean {

    return (
      this.droppingCourseId === enrollmentId
    );

  }


  // =====================================================
  // CONFIRM DROP
  // =====================================================

  confirmDropCourse(): void {

    if (
      !this.selectedEnrollment
    ) {

      return;

    }


    if (
      this.droppingCourseId !== null
    ) {

      return;

    }


    const enrollmentId =
      this.selectedEnrollment.id;


    console.log(
      '===================================='
    );

    console.log(
      'DROP COURSE'
    );

    console.log(
      'Enrollment ID:',
      enrollmentId
    );

    console.log(
      'Student ID:',
      this.studentId
    );

    console.log(
      'URL:',
      `${environment.apiUrl}/Enrollment/${enrollmentId}`
    );

    console.log(
      '===================================='
    );


    this.droppingCourseId =
      enrollmentId;


    this.message = '';

    this.errorMessage = '';


    // =====================================================
    // DELETE Enrollment
    // =====================================================

    this.http
      .delete(
        `${environment.apiUrl}/Enrollment/${enrollmentId}`,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        next: (response: string) => {

          console.log(
            'DELETE SUCCESS:',
            response
          );


          // =================================================
          // Remove enrollment immediately from local list
          // =================================================

          this.enrollments =
            this.enrollments.filter(
              enrollment =>
                enrollment.id !== enrollmentId
            );


          this.calculateStatistics();


          // =================================================
          // Close modal
          // =================================================

          this.showDropModal =
            false;


          this.selectedEnrollment =
            null;


          this.droppingCourseId =
            null;


          // =================================================
          // Success message
          // =================================================

          this.message =
            'Course dropped successfully.';

          this.errorMessage = '';


          // =================================================
          // Reload from backend
          // =================================================

          this.loadEnrollments();


          console.log(
            'Enrollments refreshed after DROP.'
          );

        },


        error: (error: any) => {

          console.error(
            '===================================='
          );

          console.error(
            'DELETE ENROLLMENT ERROR'
          );

          console.error(
            'Status:',
            error?.status
          );

          console.error(
            'Error:',
            error
          );

          console.error(
            'Error Body:',
            error?.error
          );

          console.error(
            '===================================='
          );


          this.errorMessage =
            error?.error?.message
            ||
            error?.error
            ||
            'Unable to drop this course.';


          this.droppingCourseId =
            null;

        }

      });

  }

}