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


    // ---------------------------------------------
    // Student ID from localStorage
    // ---------------------------------------------

    const storedStudentId =
      localStorage.getItem('studentId');

    if (storedStudentId) {

      const id = Number(storedStudentId);

      if (!isNaN(id) && id > 0) {

        this.studentId = id;

      }

    }


    // ---------------------------------------------
    // Read JWT
    // ---------------------------------------------

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


      // ---------------------------------------------
      // Username
      // ---------------------------------------------

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


      // ---------------------------------------------
      // Student ID from JWT
      // ---------------------------------------------

      if (!this.studentId) {

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

            this.studentId = id;

            localStorage.setItem(
              'studentId',
              id.toString()
            );

          }

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


    // ---------------------------------------------
    // Validate Student ID
    // ---------------------------------------------

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

          this.courses = data || [];

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

    this.loadingEnrollments = true;

    this.http
      .get<Enrollment[]>(
        `${environment.apiUrl}/Enrollment`
      )
      .subscribe({

        next: (data: Enrollment[]) => {

          console.log(
            'Enrollments loaded:',
            data
          );


          this.enrollments =
            data || [];


          this.calculateStatistics();


          this.loadingEnrollments = false;

        },

        error: (error: any) => {

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
  // CHECK ENROLLMENT
  // =====================================================

  isEnrolled(courseId: number): boolean {

    return this.enrollments.some(
      enrollment =>
        enrollment.courseId === courseId &&
        enrollment.status !== 'Dropped'
    );

  }


  // =====================================================
  // CHECK ENROLLING
  // =====================================================

  isEnrolling(courseId: number): boolean {

    return this.enrollingCourseId === courseId;

  }


  // =====================================================
  // REGISTER COURSE
  // =====================================================

  enroll(courseId: number): void {

    if (
      this.enrollingCourseId !== null
    ) {

      return;

    }


    if (!this.studentId) {

      this.errorMessage =
        'Student ID was not found. Please login again.';

      return;

    }


    if (this.isEnrolled(courseId)) {

      this.message =
        'You are already registered in this course.';

      return;

    }


    this.message = '';

    this.errorMessage = '';

    this.enrollingCourseId = courseId;


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


          this.enrollingCourseId = null;


          // -----------------------------------------
          // Add immediately to UI
          // -----------------------------------------

          if (response) {

            this.enrollments = [
              ...this.enrollments,
              response
            ];

          }


          this.calculateStatistics();

        },


        error: (error: any) => {

          console.error(
            'Enrollment error:',
            error
          );


          console.error(
            'Enrollment error body:',
            error?.error
          );


          this.errorMessage =
            error?.error?.message
            ||
            error?.error
            ||
            'Unable to register for this course.';


          this.enrollingCourseId = null;

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

    // ---------------------------------------------
    // Check selected enrollment
    // ---------------------------------------------

    if (
      !this.selectedEnrollment
    ) {

      return;

    }


    // ---------------------------------------------
    // Prevent double click
    // ---------------------------------------------

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
      'DELETE ENROLLMENT'
    );

    console.log(
      'Enrollment ID:',
      enrollmentId
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


    // =================================================
    // DELETE FROM BACKEND
    // =================================================

    this.http
      .delete(
        `${environment.apiUrl}/Enrollment/${enrollmentId}`,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (response: string) => {

          console.log(
            'DELETE SUCCESS:',
            response
          );


          // ---------------------------------------------
          // 1. Remove enrollment immediately
          // ---------------------------------------------

          this.enrollments =
            this.enrollments.filter(
              enrollment =>
                enrollment.id !== enrollmentId
            );


          // ---------------------------------------------
          // 2. Update statistics
          // ---------------------------------------------

          this.calculateStatistics();


          // ---------------------------------------------
          // 3. Clear selected enrollment
          // ---------------------------------------------

          this.selectedEnrollment =
            null;


          // ---------------------------------------------
          // 4. Close modal
          // ---------------------------------------------

          this.showDropModal =
            false;


          // ---------------------------------------------
          // 5. Stop loading
          // ---------------------------------------------

          this.droppingCourseId =
            null;


          // ---------------------------------------------
          // 6. Show success message
          // ---------------------------------------------

          this.message =
            'Course dropped successfully.';


          this.errorMessage = '';


          console.log(
            'Enrollment removed from UI.'
          );

        },


        // =================================================
        // ERROR
        // =================================================

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