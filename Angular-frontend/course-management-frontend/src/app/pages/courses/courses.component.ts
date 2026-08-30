import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Course,
  CourseService
} from '../../services/course.service';

import {
  Enrollment,
  EnrollmentService
} from '../../services/enrollment.service';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  // =====================================
  // Courses
  // =====================================

  courses: Course[] = [];

  loading = false;

  errorMessage = '';


  // =====================================
  // Student Enrollments
  // =====================================

  enrollments: Enrollment[] = [];

  studentId: number | null = null;


  // =====================================
  // User Role
  // =====================================

  role = '';

  isAdmin = false;

  isStudent = false;


  // =====================================
  // Delete Modal
  // =====================================

  showDeleteModal = false;

  selectedCourseId: number | null = null;

  selectedCourseTitle = '';


  // =====================================
  // Success Modal
  // =====================================

  showSuccessModal = false;

  successMessage = '';


  // =====================================
  // Error Modal
  // =====================================

  showErrorModal = false;

  modalErrorMessage = '';


  // =====================================
  // Constructor
  // =====================================

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private router: Router
  ) {}


  // =====================================
  // On Init
  // =====================================

  ngOnInit(): void {

    // Get logged-in user's role

    this.role =
      this.authService.getRole();

    console.log(
      'Current Role:',
      this.role
    );


    // Check permissions

    this.isAdmin =
      this.role.toLowerCase() === 'admin';

    this.isStudent =
      this.role.toLowerCase() === 'student';


    console.log(
      'Is Admin:',
      this.isAdmin
    );

    console.log(
      'Is Student:',
      this.isStudent
    );


    // Get Student ID

    if (this.isStudent) {

      this.studentId =
        this.authService.getStudentId();

      console.log(
        'Current Student ID:',
        this.studentId
      );

    }


    // Load courses

    this.loadCourses();


    // Load student's enrollments

    if (this.isStudent) {

      this.loadStudentEnrollments();

    }

  }


  // =====================================
  // Load Courses
  // =====================================

  loadCourses(): void {

    this.loading = true;

    this.errorMessage = '';


    this.courseService.getAll().subscribe({

      // =================================
      // Success
      // =================================

      next: (data: Course[]) => {

        this.courses = data;

        this.loading = false;

        console.log(
          'Courses loaded:',
          data
        );

      },


      // =================================
      // Error
      // =================================

      error: (error) => {

        this.loading = false;

        console.error(
          'Error loading courses:',
          error
        );


        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

        }

        else if (error.status === 403) {

          this.errorMessage =
            'You do not have permission to access courses.';

        }

        else {

          this.errorMessage =
            'Unable to load courses from the server.';

        }

      }

    });

  }


  // =====================================
  // Load Student Enrollments
  // =====================================

  loadStudentEnrollments(): void {

    if (this.studentId === null) {

      console.error(
        'Student ID not found.'
      );

      return;

    }


    this.enrollmentService
      .getByStudent(this.studentId)
      .subscribe({

        // ===============================
        // Success
        // ===============================

        next: (data: Enrollment[]) => {

          this.enrollments = data;

          console.log(
            'Student enrollments:',
            data
          );

        },


        // ===============================
        // Error
        // ===============================

        error: (error) => {

          console.error(
            'Error loading student enrollments:',
            error
          );

        }

      });

  }


  // =====================================
  // Check If Course Is Registered
  // =====================================

  isCourseRegistered(
    courseId: number
  ): boolean {

    return this.enrollments.some(
      enrollment =>
        enrollment.courseId === courseId
    );

  }


  // =====================================
  // Get Enrollment ID
  // =====================================

  getEnrollmentId(
    courseId: number
  ): number | null {

    const enrollment =
      this.enrollments.find(
        item =>
          item.courseId === courseId
      );


    if (!enrollment) {

      return null;

    }


    return enrollment.id;

  }


  // =====================================
  // Add Course
  // ADMIN ONLY
  // =====================================

  addCourse(): void {

    if (!this.isAdmin) {

      return;

    }


    this.router.navigate([
      '/courses/add'
    ]);

  }


  // =====================================
  // Edit Course
  // ADMIN ONLY
  // =====================================

  editCourse(id: number): void {

    if (!this.isAdmin) {

      return;

    }


    this.router.navigate([
      '/courses/edit',
      id
    ]);

  }


  // =====================================
  // Delete Course
  // ADMIN ONLY
  // =====================================

  deleteCourse(
    id: number,
    title: string
  ): void {

    if (!this.isAdmin) {

      return;

    }


    this.selectedCourseId = id;

    this.selectedCourseTitle = title;

    this.showDeleteModal = true;

  }


  // =====================================
  // Confirm Delete
  // ADMIN ONLY
  // =====================================

  confirmDelete(): void {

    if (!this.isAdmin) {

      return;

    }


    if (
      this.selectedCourseId === null
    ) {

      return;

    }


    const id =
      this.selectedCourseId;


    this.courseService
      .delete(id)
      .subscribe({

        // ===============================
        // Success
        // ===============================

        next: (response) => {

          console.log(
            'Delete successful:',
            response
          );


          // Remove course immediately

          this.courses =
            this.courses.filter(
              course =>
                course.id !== id
            );


          this.showDeleteModal = false;

          this.selectedCourseId = null;

          this.selectedCourseTitle = '';


          this.successMessage =
            'Course deleted successfully.';

          this.showSuccessModal = true;

        },


        // ===============================
        // Error
        // ===============================

        error: (error) => {

          console.error(
            'Delete error:',
            error
          );


          this.showDeleteModal = false;


          if (error.status === 401) {

            this.modalErrorMessage =
              'Your session has expired. Please login again.';

          }

          else if (error.status === 403) {

            this.modalErrorMessage =
              'Only Admin users can delete courses.';

          }

          else if (error.status === 404) {

            this.modalErrorMessage =
              'Course not found.';

          }

          else {

            this.modalErrorMessage =
              'Unable to delete the course.';

          }


          this.showErrorModal = true;

        }

      });

  }


  // =====================================
  // Cancel Delete
  // =====================================

  cancelDelete(): void {

    this.showDeleteModal = false;

    this.selectedCourseId = null;

    this.selectedCourseTitle = '';

  }


  // =====================================
  // Register Course
  // STUDENT ONLY
  // =====================================

  enrollCourse(
    courseId: number
  ): void {

    if (!this.isStudent) {

      return;

    }


    // Check Student ID

    if (this.studentId === null) {

      this.modalErrorMessage =
        'Student information was not found. Please login again.';

      this.showErrorModal = true;

      return;

    }


    // Prevent duplicate registration

    if (
      this.isCourseRegistered(courseId)
    ) {

      this.modalErrorMessage =
        'You are already registered for this course.';

      this.showErrorModal = true;

      return;

    }


    console.log(
      'Register course:',
      courseId
    );


    // =================================
    // POST /api/Enrollment
    // =================================

    this.enrollmentService
      .add({

        studentId:
          this.studentId,

        courseId:
          courseId,

        status:
          'Registered',

        grade:
          null

      })
      .subscribe({

        // ===============================
        // Success
        // ===============================

        next: (enrollment: Enrollment) => {

          console.log(
            'Registration successful:',
            enrollment
          );


          // Add enrollment immediately

          this.enrollments = [
            ...this.enrollments,
            enrollment
          ];


          this.successMessage =
            'Course registered successfully.';

          this.showSuccessModal = true;

        },


        // ===============================
        // Error
        // ===============================

        error: (error) => {

          console.error(
            'Registration error:',
            error
          );


          if (error.status === 400) {

            this.modalErrorMessage =
              'You cannot register for this course.';

          }

          else if (error.status === 401) {

            this.modalErrorMessage =
              'Your session has expired. Please login again.';

          }

          else if (error.status === 403) {

            this.modalErrorMessage =
              'You do not have permission to register for this course.';

          }

          else if (error.status === 409) {

            this.modalErrorMessage =
              'You are already registered for this course.';

          }

          else {

            this.modalErrorMessage =
              'Unable to register for the course.';

          }


          this.showErrorModal = true;

        }

      });

  }


  // =====================================
  // Drop Course
  // STUDENT ONLY
  // =====================================

  dropCourse(
    courseId: number
  ): void {

    if (!this.isStudent) {

      return;

    }


    // Find Enrollment ID

    const enrollmentId =
      this.getEnrollmentId(courseId);


    if (enrollmentId === null) {

      this.modalErrorMessage =
        'Enrollment record was not found.';

      this.showErrorModal = true;

      return;

    }


    console.log(
      'Drop course:',
      courseId
    );

    console.log(
      'Enrollment ID:',
      enrollmentId
    );


    // =================================
    // DELETE /api/Enrollment/{id}
    // =================================

    this.enrollmentService
      .delete(enrollmentId)
      .subscribe({

        // ===============================
        // Success
        // ===============================

        next: (response) => {

          console.log(
            'Drop successful:',
            response
          );


          // Remove enrollment immediately

          this.enrollments =
            this.enrollments.filter(
              enrollment =>
                enrollment.id !== enrollmentId
            );


          this.successMessage =
            'Course dropped successfully.';

          this.showSuccessModal = true;

        },


        // ===============================
        // Error
        // ===============================

        error: (error) => {

          console.error(
            'Drop error:',
            error
          );


          if (error.status === 401) {

            this.modalErrorMessage =
              'Your session has expired. Please login again.';

          }

          else if (error.status === 403) {

            this.modalErrorMessage =
              'You do not have permission to drop this course.';

          }

          else if (error.status === 404) {

            this.modalErrorMessage =
              'Enrollment record was not found.';

          }

          else {

            this.modalErrorMessage =
              'Unable to drop the course.';

          }


          this.showErrorModal = true;

        }

      });

  }


  // =====================================
  // Close Success Modal
  // =====================================

  closeSuccessModal(): void {

    this.showSuccessModal = false;

    this.successMessage = '';

  }


  // =====================================
  // Close Error Modal
  // =====================================

  closeErrorModal(): void {

    this.showErrorModal = false;

    this.modalErrorMessage = '';

  }


  // =====================================
  // Dashboard
  // =====================================

  goToDashboard(): void {

    if (this.isStudent) {

      this.router.navigate([
        '/student-dashboard'
      ]);

    }

    else {

      this.router.navigate([
        '/dashboard'
      ]);

    }

  }

}