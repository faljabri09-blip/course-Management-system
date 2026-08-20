import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Instructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  courses?: Course[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
  price: number;
  instructorId: number;
}

interface InstructorDto {
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.css']
})
export class InstructorsComponent implements OnInit {

  instructors: Instructor[] = [];

  loading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';

  showModal: boolean = false;

  isEditMode: boolean = false;

  selectedInstructorId: number | null = null;

  saving: boolean = false;

  // DELETE MODAL
  showDeleteModal: boolean = false;

  instructorToDelete: Instructor | null = null;

  deleting: boolean = false;

  form: InstructorDto = {
    name: '',
    email: '',
    phone: '',
    specialization: ''
  };


  constructor(
    private http: HttpClient
  ) {}


  ngOnInit(): void {
    this.loadInstructors();
  }


  // ==========================================
  // LOAD INSTRUCTORS
  // ==========================================

  loadInstructors(): void {

    this.loading = true;

    this.errorMessage = '';

    this.http
      .get<Instructor[]>(
        `${environment.apiUrl}/Instructor`
      )
      .subscribe({

        next: (data) => {

          this.instructors = data;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Error loading instructors:',
            error
          );

          this.errorMessage =
            'Unable to load instructors.';

          this.loading = false;

        }

      });

  }


  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  openAddModal(): void {

    this.isEditMode = false;

    this.selectedInstructorId = null;

    this.form = {
      name: '',
      email: '',
      phone: '',
      specialization: ''
    };

    this.errorMessage = '';

    this.successMessage = '';

    this.showModal = true;

  }


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  openEditModal(instructor: Instructor): void {

    this.isEditMode = true;

    this.selectedInstructorId = instructor.id;

    this.form = {
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      specialization: instructor.specialization
    };

    this.errorMessage = '';

    this.successMessage = '';

    this.showModal = true;

  }


  // ==========================================
  // CLOSE ADD / EDIT MODAL
  // ==========================================

  closeModal(): void {

    if (this.saving) {
      return;
    }

    this.showModal = false;

  }


  // ==========================================
  // SAVE INSTRUCTOR
  // ==========================================

  saveInstructor(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      !this.form.name.trim() ||
      !this.form.email.trim()
    ) {

      this.errorMessage =
        'Name and Email are required.';

      return;

    }


    this.saving = true;


    // ========================================
    // UPDATE
    // ========================================

    if (
      this.isEditMode &&
      this.selectedInstructorId !== null
    ) {

      this.http
        .put(
          `${environment.apiUrl}/Instructor/${this.selectedInstructorId}`,
          this.form
        )
        .subscribe({

          next: () => {

            this.saving = false;

            this.showModal = false;

            this.successMessage =
              'Instructor updated successfully.';

            this.loadInstructors();

          },

          error: (error) => {

            console.error(
              'Update instructor error:',
              error
            );

            this.saving = false;

            this.errorMessage =
              'Unable to update instructor.';

          }

        });

      return;
    }


    // ========================================
    // ADD
    // ========================================

    this.http
      .post<Instructor>(
        `${environment.apiUrl}/Instructor`,
        this.form
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.showModal = false;

          this.successMessage =
            'Instructor added successfully.';

          this.loadInstructors();

        },

        error: (error) => {

          console.error(
            'Add instructor error:',
            error
          );

          this.saving = false;

          this.errorMessage =
            'Unable to add instructor.';

        }

      });

  }


  // ==========================================
  // OPEN DELETE MODAL
  // ==========================================

  deleteInstructor(instructor: Instructor): void {

    this.instructorToDelete = instructor;

    this.errorMessage = '';

    this.successMessage = '';

    this.showDeleteModal = true;

  }


  // ==========================================
  // CANCEL DELETE
  // ==========================================

  cancelDelete(): void {

    if (this.deleting) {
      return;
    }

    this.showDeleteModal = false;

    this.instructorToDelete = null;

  }


  // ==========================================
  // CONFIRM DELETE
  // ==========================================

  confirmDelete(): void {

    if (!this.instructorToDelete) {
      return;
    }

    this.deleting = true;

    const instructorId =
      this.instructorToDelete.id;


    this.http
      .delete(
        `${environment.apiUrl}/Instructor/${instructorId}`
      )
      .subscribe({

        next: () => {

          this.deleting = false;

          this.showDeleteModal = false;

          this.successMessage =
            'Instructor deleted successfully.';

          this.instructors =
            this.instructors.filter(
              instructor =>
                instructor.id !== instructorId
            );

          this.instructorToDelete = null;

        },

        error: (error) => {

          console.error(
            'Delete instructor error:',
            error
          );

          this.deleting = false;

          this.errorMessage =
            'Unable to delete instructor.';

        }

      });

  }


  // ==========================================
  // COURSE COUNT
  // ==========================================

  getCourseCount(
    instructor: Instructor
  ): number {

    return instructor.courses
      ? instructor.courses.length
      : 0;

  }


  // ==========================================
  // GET INITIAL
  // ==========================================

  getInitial(
    name: string
  ): string {

    if (!name) {
      return 'I';
    }

    return name
      .charAt(0)
      .toUpperCase();

  }

}