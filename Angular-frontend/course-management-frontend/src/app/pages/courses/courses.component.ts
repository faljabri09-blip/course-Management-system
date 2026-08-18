import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Course,
  CourseService
} from '../../services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];

  loading = false;
  errorMessage = '';

  // Delete Modal
  showDeleteModal = false;
  selectedCourseId: number | null = null;
  selectedCourseTitle = '';

  // Success Modal
  showSuccessModal = false;

  // Error Modal
  showErrorModal = false;
  modalErrorMessage = '';

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  // ============================
  // Load Courses
  // ============================
  loadCourses(): void {

    this.loading = true;
    this.errorMessage = '';

    this.courseService.getAll().subscribe({

      next: (data: Course[]) => {

        this.courses = data;
        this.loading = false;

        console.log('Courses loaded:', data);
      },

      error: (error) => {

        this.loading = false;

        console.error(
          'Error loading courses:',
          error
        );

        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

        } else if (error.status === 403) {

          this.errorMessage =
            'You do not have permission to access courses.';

        } else {

          this.errorMessage =
            'Unable to load courses from the server.';
        }
      }

    });
  }

  // ============================
  // Add Course
  // ============================
  addCourse(): void {

    this.router.navigate([
      '/courses/add'
    ]);

  }

  // ============================
  // Edit Course
  // ============================
  editCourse(id: number): void {

    this.router.navigate([
      '/courses/edit',
      id
    ]);

  }

  // ============================
  // Open Delete Modal
  // ============================
  deleteCourse(
    id: number,
    title: string
  ): void {

    this.selectedCourseId = id;
    this.selectedCourseTitle = title;

    this.showDeleteModal = true;
  }

  // ============================
  // Cancel Delete
  // ============================
  cancelDelete(): void {

    this.showDeleteModal = false;

    this.selectedCourseId = null;
    this.selectedCourseTitle = '';

  }

  // ============================
  // Confirm Delete
  // ============================
  confirmDelete(): void {

    if (this.selectedCourseId === null) {
      return;
    }

    const id = this.selectedCourseId;

    console.log(
      'Deleting course:',
      id
    );

    this.courseService.delete(id).subscribe({

      // ============================
      // Success
      // ============================
      next: (response) => {

        console.log(
          'Delete successful:',
          response
        );

        // Remove course immediately
        this.courses = this.courses.filter(
          course => course.id !== id
        );

        // Close delete modal
        this.showDeleteModal = false;

        this.selectedCourseId = null;
        this.selectedCourseTitle = '';

        // Show success modal
        this.showSuccessModal = true;

      },

      // ============================
      // Error
      // ============================
      error: (error) => {

        console.error(
          'Delete error:',
          error
        );

        this.showDeleteModal = false;

        if (error.status === 401) {

          this.modalErrorMessage =
            'Your session has expired. Please login again.';

        } else if (error.status === 403) {

          this.modalErrorMessage =
            'Only Admin users can delete courses.';

        } else if (error.status === 404) {

          this.modalErrorMessage =
            'Course not found.';

        } else if (error.status === 500) {

          this.modalErrorMessage =
            'Server error. The course could not be deleted.';

        } else {

          this.modalErrorMessage =
            'Unable to delete the course.';
        }

        this.showErrorModal = true;

      }

    });

  }

  // ============================
  // Close Success Modal
  // ============================
  closeSuccessModal(): void {

    this.showSuccessModal = false;

  }

  // ============================
  // Close Error Modal
  // ============================
  closeErrorModal(): void {

    this.showErrorModal = false;

  }

}