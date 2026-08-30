import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  CourseDto,
  CourseService
} from '../../services/course.service';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {

  // ==========================================
  // COURSE
  // ==========================================

  course: CourseDto = {

    title: '',

    description: '',

    credits: 0,

    price: 0,

    instructorId: 0

  };


  // ==========================================
  // STATE
  // ==========================================

  loading = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================
  // VALIDATION MODAL
  // ==========================================

  showValidationModal = false;

  validationMessage = '';


  // ==========================================
  // SUCCESS MODAL
  // ==========================================

  showSuccessModal = false;


  // ==========================================
  // ERROR MODAL
  // ==========================================

  showErrorModal = false;

  modalErrorMessage = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}


  // ==========================================
  // VALIDATE FORM
  // ==========================================

  validateForm(): boolean {

    // Course Title

    if (
      !this.course.title ||
      !this.course.title.trim()
    ) {

      this.validationMessage =
        'Please enter the course title to continue.';

      this.showValidationModal = true;

      return false;
    }


    // Description

    if (
      !this.course.description ||
      !this.course.description.trim()
    ) {

      this.validationMessage =
        'Please enter a description for the course to continue.';

      this.showValidationModal = true;

      return false;
    }


    // Credits

    if (
      this.course.credits === null ||
      this.course.credits === undefined ||
      this.course.credits <= 0
    ) {

      this.validationMessage =
        'Please enter the number of credits for this course.';

      this.showValidationModal = true;

      return false;
    }


    // Price

    if (
      this.course.price === null ||
      this.course.price === undefined ||
      this.course.price < 0
    ) {

      this.validationMessage =
        'Please enter a valid course price.';

      this.showValidationModal = true;

      return false;
    }


    // Instructor ID

    if (
      this.course.instructorId === null ||
      this.course.instructorId === undefined ||
      this.course.instructorId <= 0
    ) {

      this.validationMessage =
        'Please enter the Instructor ID assigned to this course.';

      this.showValidationModal = true;

      return false;
    }


    return true;
  }


  // ==========================================
  // ADD COURSE
  // ==========================================

  addCourse(): void {

    // Validate first

    if (!this.validateForm()) {

      return;
    }


    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.modalErrorMessage = '';


    console.log(
      'Adding course:',
      this.course
    );


    // ==========================================
    // POST /api/Course
    // ==========================================

    this.courseService
      .add(this.course)
      .subscribe({

        // =====================================
        // SUCCESS
        // =====================================

        next: (response) => {

          console.log(
            'Course added successfully:',
            response
          );


          this.loading = false;


          this.successMessage =
            'Course added successfully.';

          this.showSuccessModal = true;

        },


        // =====================================
        // ERROR
        // =====================================

        error: (error) => {

          console.error(
            '================================'
          );

          console.error(
            'ADD COURSE ERROR'
          );

          console.error(
            'Status:',
            error.status
          );

          console.error(
            'Status Text:',
            error.statusText
          );

          console.error(
            'Error:',
            error.error
          );

          console.error(
            'URL:',
            error.url
          );

          console.error(
            '================================'
          );


          this.loading = false;


          if (error.status === 400) {

            this.modalErrorMessage =
              'The course information is not valid. Please check the entered data.';

          }

          else if (error.status === 401) {

            this.modalErrorMessage =
              'Your session has expired. Please login again.';

          }

          else if (error.status === 403) {

            this.modalErrorMessage =
              'Only Admin users can add courses.';

          }

          else if (error.status === 409) {

            this.modalErrorMessage =
              'This course cannot be added because of a conflict.';

          }

          else if (error.status === 500) {

            this.modalErrorMessage =
              'Something went wrong on the server. Please try again later.';

          }

          else {

            this.modalErrorMessage =
              'Unable to add the course. Please try again.';

          }


          this.showErrorModal = true;

        }

      });

  }


  // ==========================================
  // CLOSE VALIDATION MODAL
  // ==========================================

  closeValidationModal(): void {

    this.showValidationModal = false;

    this.validationMessage = '';

  }


  // ==========================================
  // CLOSE SUCCESS MODAL
  // ==========================================

  closeSuccessModal(): void {

    this.showSuccessModal = false;

    this.successMessage = '';


    this.router.navigate([
      '/courses'
    ]);

  }


  // ==========================================
  // CLOSE ERROR MODAL
  // ==========================================

  closeErrorModal(): void {

    this.showErrorModal = false;

    this.modalErrorMessage = '';

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {

    this.router.navigate([
      '/courses'
    ]);

  }

}