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

  // ==============================
  // DROP MODAL
  // ==============================

  showDropModal: boolean = false;

  selectedEnrollment: Enrollment | null = null;

  droppingCourseId: number | null = null;


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // ==============================
  // INIT
  // ==============================

  ngOnInit(): void {

    this.loadStudent();

    this.loadCourses();

    this.loadEnrollments();

  }


  // ==============================
  // LOAD STUDENT
  // ==============================

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


  // ==============================
  // LOAD COURSES
  // ==============================

  loadCourses(): void {

    this.loadingCourses = true;

    this.http
      .get<Course[]>(
        `${environment.apiUrl}/Course`
      )
      .subscribe({

        next: (data) => {

          this.courses = data;

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


  // ==============================
  // LOAD ENROLLMENTS
  // ==============================

  loadEnrollments(): void {

    this.loadingEnrollments = true;

    this.http
      .get<Enrollment[]>(
        `${environment.apiUrl}/Enrollment/student/${this.studentId}`
      )
      .subscribe({

        next: (data) => {

          console.log(
            'Enrollments:',
            data
          );

          this.enrollments = data;

          this.loadingEnrollments = false;

        },

        error: (error) => {

          console.error(
            'Error loading enrollments:',
            error
          );

          this.loadingEnrollments = false;

          this.errorMessage =
            'Unable to load enrollments.';

        }

      });

  }


  // ==============================
  // CHECK ENROLLMENT
  // ==============================

  isEnrolled(courseId: number): boolean {

    return this.enrollments.some(
      enrollment =>
        enrollment.courseId === courseId &&
        enrollment.status !== 'Dropped'
    );

  }


  // ==============================
  // REGISTER COURSE
  // ==============================

  enroll(courseId: number): void {

    this.message = '';

    this.errorMessage = '';


    if (this.isEnrolled(courseId)) {

      this.errorMessage =
        'You are already enrolled in this course.';

      return;

    }


    const enrollment = {

      studentId: this.studentId,

      courseId: courseId,

      status: 'Active',

      grade: null

    };


    this.http
      .post<Enrollment>(
        `${environment.apiUrl}/Enrollment`,
        enrollment
      )
      .subscribe({

        next: (data) => {

          console.log(
            'Enrollment successful:',
            data
          );

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
            'Unable to register for this course.';

        }

      });

  }


  // =====================================================
  // OPEN DROP MODAL
  // =====================================================

  openDropModal(enrollment: Enrollment): void {

    console.log(
      'Drop button clicked'
    );

    console.log(
      'Selected enrollment:',
      enrollment
    );


    // Save selected enrollment

    this.selectedEnrollment = enrollment;


    // Open modal

    this.showDropModal = true;


    // Clear messages

    this.message = '';

    this.errorMessage = '';

  }


  // =====================================================
  // CLOSE DROP MODAL
  // =====================================================

  closeDropModal(): void {

    // Don't close while deleting

    if (this.droppingCourseId !== null) {

      return;

    }


    this.showDropModal = false;

    this.selectedEnrollment = null;

  }


  // =====================================================
  // CONFIRM DROP COURSE
  // =====================================================

  confirmDropCourse(): void {

    console.log(
      'Confirm Drop clicked'
    );


    // Check selected enrollment

    if (this.selectedEnrollment === null) {

      console.error(
        'No enrollment selected.'
      );

      return;

    }


    const enrollmentId =
      this.selectedEnrollment.id;


    console.log(
      'Enrollment ID:',
      enrollmentId
    );


    // Check ID

    if (!enrollmentId) {

      this.errorMessage =
        'Enrollment ID is missing.';

      return;

    }


    // Start loading

    this.droppingCourseId =
      enrollmentId;


    this.message = '';

    this.errorMessage = '';


    // ==========================================
    // DELETE REQUEST
    // ==========================================

    this.http
      .delete(
        `${environment.apiUrl}/Enrollment/${enrollmentId}`
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Drop successful:',
            response
          );


          // Remove enrollment from screen

          this.enrollments =
            this.enrollments.filter(
              enrollment =>
                enrollment.id !== enrollmentId
            );


          // Close modal

          this.showDropModal = false;

          this.selectedEnrollment = null;


          // Stop loading

          this.droppingCourseId = null;


          // Success message

          this.message =
            'Course dropped successfully.';

          this.errorMessage = '';

        },


        error: (error) => {

          console.error(
            'Drop course error:',
            error
          );


          console.error(
            'Status:',
            error.status
          );


          console.error(
            'Error:',
            error.error
          );


          this.droppingCourseId = null;


          if (error.status === 401) {

            this.errorMessage =
              'Unauthorized. Please login again.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You are not authorized to drop this course.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'Enrollment not found.';

          }

          else {

            this.errorMessage =
              'Unable to drop the course.';

          }

        }

      });

  }


  // =====================================================
  // CHECK IF DROPPING
  // =====================================================

  isDropping(enrollmentId: number): boolean {

    return this.droppingCourseId === enrollmentId;

  }


  // ==============================
  // LOGOUT
  // ==============================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('studentId');

    localStorage.removeItem('username');

    this.router.navigate(['/login']);

  }


  // ==============================
  // USER INITIAL
  // ==============================

  get userInitial(): string {

    return this.username
      ? this.username.charAt(0).toUpperCase()
      : 'S';

  }


  // ==============================
  // ACTIVE COURSES
  // ==============================

  get activeCourses(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status === 'Active'
    ).length;

  }


  // ==============================
  // COMPLETED COURSES
  // ==============================

  get completedCourses(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status === 'Completed'
    ).length;

  }

}