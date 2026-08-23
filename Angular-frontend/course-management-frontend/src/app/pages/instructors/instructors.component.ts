import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Instructor,
  InstructorService
} from '../../services/instructor.service';

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.css']
})
export class InstructorsComponent implements OnInit {

  // =========================================
  // INSTRUCTORS
  // =========================================

  instructors: Instructor[] = [];


  // =========================================
  // MAIN LOADING
  // =========================================

  loading: boolean = false;
  errorMessage: string = '';


  // =========================================
  // EDIT MODAL
  // =========================================

  showEditModal: boolean = false;

  editLoading: boolean = false;

  editErrorMessage: string = '';

  editForm: Instructor = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    specialization: '',
    courses: []
  };


  // =========================================
  // DELETE MODAL
  // =========================================

  showDeleteModal: boolean = false;

  deleteLoading: boolean = false;

  deleteErrorMessage: string = '';

  deletingInstructor: Instructor | null = null;


  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(
    private instructorService: InstructorService,
    private router: Router
  ) {}


  // =========================================
  // ON INIT
  // =========================================

  ngOnInit(): void {
    this.loadInstructors();
  }


  // =========================================
  // LOAD ALL INSTRUCTORS
  // =========================================

  loadInstructors(): void {

    this.loading = true;
    this.errorMessage = '';

    this.instructorService.getAll().subscribe({

      next: (data: Instructor[]) => {

        console.log('Instructors loaded:', data);

        this.instructors = data || [];

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Error loading instructors:',
          error
        );

        console.error(
          'Status:',
          error?.status
        );

        console.error(
          'Backend response:',
          error?.error
        );

        this.errorMessage =
          'Unable to load instructors.';

        this.loading = false;
      }

    });

  }


  // =========================================
  // INSTRUCTORS WITH COURSES
  // =========================================

  getInstructorsWithCourses(): number {

    return this.instructors.filter(
      (instructor: Instructor) =>
        instructor.courses &&
        instructor.courses.length > 0
    ).length;

  }


  // =========================================
  // COURSES TEXT
  // =========================================

  getCoursesText(
    courses: string[] | undefined
  ): string {

    if (
      !courses ||
      courses.length === 0
    ) {
      return 'No courses';
    }

    return courses.join(', ');
  }


  // =========================================
  // ADD INSTRUCTOR
  // =========================================

  addInstructor(): void {

    this.router.navigate([
      '/instructors/add'
    ]);

  }


  // =========================================
  // VIEW INSTRUCTOR
  // =========================================

  viewInstructor(id: number): void {

    this.router.navigate([
      '/instructors',
      id
    ]);

  }


  // =========================================
  // EDIT INSTRUCTOR
  // =========================================
  //
  // IMPORTANT:
  // We DO NOT navigate to another page.
  // We open the Edit Modal directly.
  //
  // =========================================

  editInstructor(id: number): void {

    console.log('==============================');
    console.log('EDIT BUTTON CLICKED');
    console.log('Instructor ID:', id);
    console.log(
      'Token:',
      localStorage.getItem('token')
    );
    console.log('==============================');


    // =======================================
    // FIND INSTRUCTOR FROM CURRENT LIST
    // =======================================

    const instructor = this.instructors.find(
      (item: Instructor) =>
        item.id === id
    );


    if (!instructor) {

      console.error(
        'Instructor not found:',
        id
      );

      this.editErrorMessage =
        'Instructor information could not be found.';

      this.showEditModal = true;

      return;
    }


    // =======================================
    // RESET EDIT STATE
    // =======================================

    this.editErrorMessage = '';

    this.editLoading = false;


    // =======================================
    // COPY DATA INTO EDIT FORM
    // =======================================

    this.editForm = {

      id: instructor.id,

      name:
        instructor.name || '',

      email:
        instructor.email || '',

      phone:
        instructor.phone || '',

      specialization:
        instructor.specialization || '',

      courses:
        instructor.courses
          ? [...instructor.courses]
          : []

    };


    // =======================================
    // OPEN MODAL
    // =======================================

    this.showEditModal = true;


    console.log(
      'Edit modal opened:',
      this.editForm
    );

  }


  // =========================================
  // CLOSE EDIT MODAL
  // =========================================

  closeEditModal(): void {

    if (this.editLoading) {
      return;
    }

    this.showEditModal = false;

    this.editErrorMessage = '';

  }


  // =========================================
  // CLOSE EDIT MODAL ON BACKDROP
  // =========================================

  closeEditOnBackdrop(
    event: MouseEvent
  ): void {

    if (
      event.target === event.currentTarget &&
      !this.editLoading
    ) {

      this.closeEditModal();

    }

  }


  // =========================================
  // SAVE INSTRUCTOR
  // =========================================

  saveInstructor(): void {

    // =======================================
    // PREVENT DOUBLE CLICK
    // =======================================

    if (this.editLoading) {
      return;
    }


    // =======================================
    // VALIDATION
    // =======================================

    if (
      !this.editForm.name ||
      !this.editForm.name.trim()
    ) {

      this.editErrorMessage =
        'Instructor name is required.';

      return;
    }


    if (
      !this.editForm.email ||
      !this.editForm.email.trim()
    ) {

      this.editErrorMessage =
        'Instructor email is required.';

      return;
    }


    // =======================================
    // START LOADING
    // =======================================

    this.editLoading = true;

    this.editErrorMessage = '';


    // =======================================
    // PREPARE UPDATE DATA
    // =======================================

    const updatedInstructor: Instructor = {

      id:
        this.editForm.id,

      name:
        this.editForm.name.trim(),

      email:
        this.editForm.email.trim(),

      phone:
        this.editForm.phone
          ? this.editForm.phone.trim()
          : '',

      specialization:
        this.editForm.specialization
          ? this.editForm.specialization.trim()
          : '',

      courses:
        this.editForm.courses
          ? [...this.editForm.courses]
          : []

    };


    console.log(
      '================================'
    );

    console.log(
      'UPDATING INSTRUCTOR'
    );

    console.log(
      'ID:',
      updatedInstructor.id
    );

    console.log(
      'DATA:',
      updatedInstructor
    );

    console.log(
      '================================'
    );


    // =======================================
    // UPDATE API
    // =======================================

    this.instructorService
      .update(
        updatedInstructor.id,
        updatedInstructor
      )
      .subscribe({

        // ===================================
        // SUCCESS
        // ===================================

        next: (response) => {

          console.log(
            'Instructor updated successfully:',
            response
          );


          // =================================
          // UPDATE LOCAL LIST
          // =================================

          const index =
            this.instructors.findIndex(
              (item: Instructor) =>
                item.id === updatedInstructor.id
            );


          if (index !== -1) {

            this.instructors[index] = {
              ...updatedInstructor
            };

            this.instructors = [
              ...this.instructors
            ];

          }


          // =================================
          // CLOSE MODAL
          // =================================

          this.editLoading = false;

          this.showEditModal = false;

          this.editErrorMessage = '';


          console.log(
            'Instructor list updated locally.'
          );

        },


        // ===================================
        // ERROR
        // ===================================

        error: (error) => {

          console.error(
            'UPDATE INSTRUCTOR ERROR:',
            error
          );

          console.error(
            'STATUS:',
            error?.status
          );

          console.error(
            'BACKEND RESPONSE:',
            error?.error
          );


          this.editErrorMessage =
            error?.error?.message ||
            error?.error?.title ||
            'Unable to update instructor.';


          this.editLoading = false;

        }

      });

  }


  // =========================================
  // DELETE INSTRUCTOR
  // =========================================

  deleteInstructor(id: number): void {

    console.log(
      'DELETE BUTTON CLICKED:',
      id
    );


    // =======================================
    // FIND INSTRUCTOR
    // =======================================

    const instructor =
      this.instructors.find(
        (item: Instructor) =>
          item.id === id
      );


    if (!instructor) {

      console.error(
        'Instructor not found:',
        id
      );

      return;
    }


    // =======================================
    // STORE INSTRUCTOR
    // =======================================

    this.deletingInstructor = {
      ...instructor
    };


    // =======================================
    // RESET DELETE STATE
    // =======================================

    this.deleteErrorMessage = '';

    this.deleteLoading = false;


    // =======================================
    // OPEN DELETE MODAL
    // =======================================

    this.showDeleteModal = true;


    console.log(
      'Delete modal opened for:',
      instructor
    );

  }


  // =========================================
  // CLOSE DELETE MODAL
  // =========================================

  closeDeleteModal(): void {

    if (this.deleteLoading) {
      return;
    }


    this.showDeleteModal = false;

    this.deletingInstructor = null;

    this.deleteErrorMessage = '';

  }


  // =========================================
  // CLOSE DELETE ON BACKDROP
  // =========================================

  closeDeleteOnBackdrop(
    event: MouseEvent
  ): void {

    if (
      event.target === event.currentTarget &&
      !this.deleteLoading
    ) {

      this.closeDeleteModal();

    }

  }


  // =========================================
  // CONFIRM DELETE
  // =========================================

  confirmDelete(): void {

    if (
      this.deleteLoading ||
      !this.deletingInstructor
    ) {
      return;
    }


    const instructorId =
      this.deletingInstructor.id;


    // =======================================
    // START LOADING
    // =======================================

    this.deleteLoading = true;

    this.deleteErrorMessage = '';


    console.log(
      'Deleting instructor:',
      instructorId
    );


    // =======================================
    // DELETE API
    // =======================================

    this.instructorService
      .delete(instructorId)
      .subscribe({

        // ===================================
        // SUCCESS
        // ===================================

        next: () => {

          console.log(
            'Instructor deleted successfully.'
          );


          // ================================
          // REMOVE FROM LOCAL LIST
          // ================================

          this.instructors =
            this.instructors.filter(
              (item: Instructor) =>
                item.id !== instructorId
            );


          // ================================
          // CLOSE MODAL
          // ================================

          this.deleteLoading = false;

          this.showDeleteModal = false;

          this.deletingInstructor = null;

          this.deleteErrorMessage = '';


          console.log(
            'Instructor removed from list.'
          );

        },


        // ===================================
        // ERROR
        // ===================================

        error: (error) => {

          console.error(
            'DELETE INSTRUCTOR ERROR:',
            error
          );

          console.error(
            'STATUS:',
            error?.status
          );

          console.error(
            'BACKEND RESPONSE:',
            error?.error
          );


          this.deleteErrorMessage =
            error?.error?.message ||
            error?.error?.title ||
            'Unable to delete instructor.';


          this.deleteLoading = false;

        }

      });

  }

}