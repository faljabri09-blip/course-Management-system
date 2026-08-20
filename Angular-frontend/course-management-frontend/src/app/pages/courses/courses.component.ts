import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Course,
  CourseService
} from '../../services/course.service';

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


    // Load courses

    this.loadCourses();

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


          this.courses =
            this.courses.filter(
              course =>
                course.id !== id
            );


          this.showDeleteModal = false;

          this.selectedCourseId = null;

          this.selectedCourseTitle = '';


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
  // Enroll Course
  // STUDENT
  // =====================================

  enrollCourse(courseId: number): void {

    if (!this.isStudent) {

      return;

    }


    console.log(
      'Enroll course:',
      courseId
    );


    /*
      سنربط هنا API التسجيل الحقيقي
      بعد أن نتأكد من CourseService
    */

  }


  // =====================================
  // Drop Course
  // STUDENT
  // =====================================

  dropCourse(courseId: number): void {

    if (!this.isStudent) {

      return;

    }


    console.log(
      'Drop course:',
      courseId
    );


    /*
      سنربط هنا API حذف التسجيل الحقيقي
      بعد أن نتأكد من CourseService
    */

  }


  // =====================================
  // Close Success Modal
  // =====================================

  closeSuccessModal(): void {

    this.showSuccessModal = false;

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