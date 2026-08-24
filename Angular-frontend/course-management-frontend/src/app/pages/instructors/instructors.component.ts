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
  // ADD MODAL
  // =========================================

  showAddModal: boolean = false;

  addLoading: boolean = false;

  addErrorMessage: string = '';

  addForm: Instructor = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    specialization: '',
    courses: []
  };


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
  // LOAD INSTRUCTORS
  // =========================================

  loadInstructors(): void {

    this.loading = true;
    this.errorMessage = '';

    this.instructorService.getAll().subscribe({

      next: (data: Instructor[]) => {

        console.log(
          'Instructors loaded:',
          data
        );

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
          error?.error?.message ||
          error?.error?.title ||
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

    this.addErrorMessage = '';

    this.addLoading = false;

    this.addForm = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      specialization: '',
      courses: []
    };

    this.showAddModal = true;

  }


  // =========================================
  // CLOSE ADD MODAL
  // =========================================

  closeAddModal(): void {

    if (this.addLoading) {
      return;
    }

    this.showAddModal = false;

    this.addErrorMessage = '';

  }


  // =========================================
  // CLOSE ADD ON BACKDROP
  // =========================================

  closeAddOnBackdrop(
    event: MouseEvent
  ): void {

    if (
      event.target === event.currentTarget &&
      !this.addLoading
    ) {

      this.closeAddModal();

    }

  }


  // =========================================
  // SAVE NEW INSTRUCTOR
  // =========================================

  saveNewInstructor(): void {

    if (this.addLoading) {
      return;
    }


    // =======================================
    // VALIDATION
    // =======================================

    if (
      !this.addForm.name ||
      !this.addForm.name.trim()
    ) {

      this.addErrorMessage =
        'Instructor name is required.';

      return;
    }


    if (
      !this.addForm.email ||
      !this.addForm.email.trim()
    ) {

      this.addErrorMessage =
        'Instructor email is required.';

      return;
    }


    // =======================================
    // START LOADING
    // =======================================

    this.addLoading = true;

    this.addErrorMessage = '';


    const newInstructor: Instructor = {

      id: 0,

      name:
        this.addForm.name.trim(),

      email:
        this.addForm.email.trim(),

      phone:
        this.addForm.phone
          ? this.addForm.phone.trim()
          : '',

      specialization:
        this.addForm.specialization
          ? this.addForm.specialization.trim()
          : '',

      courses: []

    };


    console.log(
      'Adding instructor:',
      newInstructor
    );


    // =======================================
    // ADD API
    // =======================================

    this.instructorService
      .add(newInstructor)
      .subscribe({

        next: (response: Instructor) => {

          console.log(
            'Instructor added successfully:',
            response
          );


          // =================================
          // ADD TO LOCAL LIST
          // =================================

          if (response) {

            this.instructors = [
              ...this.instructors,
              response
            ];

          } else {

            this.loadInstructors();

          }


          // =================================
          // CLOSE MODAL
          // =================================

          this.addLoading = false;

          this.showAddModal = false;

          this.addErrorMessage = '';

        },

        error: (error) => {

          console.error(
            'ADD INSTRUCTOR ERROR:',
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


          this.addErrorMessage =
            error?.error?.message ||
            error?.error?.title ||
            'Unable to add instructor.';

          this.addLoading = false;

        }

      });

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

  editInstructor(id: number): void {

    console.log(
      'EDIT BUTTON CLICKED:',
      id
    );


    const instructor =
      this.instructors.find(
        (item: Instructor) =>
          item.id === id
      );


    if (!instructor) {

      this.editErrorMessage =
        'Instructor information could not be found.';

      this.showEditModal = true;

      return;
    }


    this.editErrorMessage = '';

    this.editLoading = false;


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
  // CLOSE EDIT ON BACKDROP
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
      'Updating instructor:',
      updatedInstructor
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

        next: (response) => {

          console.log(
            'Instructor updated successfully:',
            response
          );


          // =================================
          // RELOAD DATA FROM BACKEND
          // =================================

          this.loadInstructors();


          // =================================
          // CLOSE MODAL
          // =================================

          this.editLoading = false;

          this.showEditModal = false;

          this.editErrorMessage = '';

        },

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

          console.error(
            'ERROR MESSAGE:',
            error?.message
          );


          this.editErrorMessage =
            error?.error?.message ||
            error?.error?.title ||
            error?.message ||
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


    this.deletingInstructor = {
      ...instructor
    };


    this.deleteErrorMessage = '';

    this.deleteLoading = false;

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

        next: (response) => {

          console.log(
            'Instructor deleted successfully:',
            response
          );


          // =================================
          // RELOAD DATA FROM BACKEND
          // =================================

          this.loadInstructors();


          // =================================
          // CLOSE MODAL
          // =================================

          this.deleteLoading = false;

          this.showDeleteModal = false;

          this.deletingInstructor = null;

          this.deleteErrorMessage = '';

        },

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

          console.error(
            'ERROR MESSAGE:',
            error?.message
          );


          this.deleteErrorMessage =
            error?.error?.message ||
            error?.error?.title ||
            error?.message ||
            'Unable to delete instructor.';

          this.deleteLoading = false;

        }

      });

  }

}