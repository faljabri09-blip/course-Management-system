import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Course,
  CourseDto,
  CourseService
} from '../../services/course.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {

  courseId!: number;

  course: CourseDto = {
    title: '',
    description: '',
    credits: 0,
    price: 0,
    instructorId: 0
  };

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid course ID.';
      return;
    }

    this.courseId = Number(id);

    if (isNaN(this.courseId) || this.courseId <= 0) {
      this.errorMessage = 'Invalid course ID.';
      return;
    }

    this.loadCourse();
  }

  // ==========================================
  // Load Course
  // ==========================================

  loadCourse(): void {

    this.loading = true;
    this.errorMessage = '';

    this.courseService.getById(this.courseId).subscribe({

      next: (data: Course) => {

        console.log('Course loaded:', data);

        this.course = {
          title: data.title,
          description: data.description,
          credits: data.credits,
          price: data.price,
          instructorId: data.instructorId
        };

        this.loading = false;
      },

      error: (error) => {

        console.error('LOAD COURSE ERROR:', error);
        console.log('Status:', error.status);
        console.log('Response:', error.error);

        this.loading = false;

        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

        } else if (error.status === 403) {

          this.errorMessage =
            'You do not have permission to view this course.';

        } else if (error.status === 404) {

          this.errorMessage =
            'Course not found.';

        } else {

          this.errorMessage =
            'Unable to load course from the server.';
        }
      }
    });
  }

  // ==========================================
  // Update Course
  // ==========================================

  updateCourse(): void {

    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.course.title.trim()) {

      this.errorMessage =
        'Course title is required.';

      return;
    }

    if (!this.course.description.trim()) {

      this.errorMessage =
        'Course description is required.';

      return;
    }

    if (this.course.credits <= 0) {

      this.errorMessage =
        'Credits must be greater than 0.';

      return;
    }

    if (this.course.price < 0) {

      this.errorMessage =
        'Price cannot be negative.';

      return;
    }

    if (this.course.instructorId <= 0) {

      this.errorMessage =
        'Instructor ID is required.';

      return;
    }

    this.saving = true;

    console.log('Updating course ID:', this.courseId);

    console.log('Update data:', this.course);

    this.courseService
      .update(this.courseId, this.course)
      .subscribe({

        next: (response) => {

          console.log('UPDATE SUCCESS:', response);

          this.saving = false;

          this.successMessage =
            'Course updated successfully.';

          setTimeout(() => {

            this.router.navigate(['/courses']);

          }, 1000);
        },

        error: (error) => {

          console.error('================================');
          console.error('UPDATE COURSE ERROR');
          console.error('Status:', error.status);
          console.error('Status Text:', error.statusText);
          console.error('Error:', error.error);
          console.error('URL:', error.url);
          console.error('================================');

          this.saving = false;

          if (error.status === 400) {

            this.errorMessage =
              'Invalid course data. Please check all fields.';

          } else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          } else if (error.status === 403) {

            this.errorMessage =
              'Only Admin users can update courses.';

          } else if (error.status === 404) {

            this.errorMessage =
              'Course not found.';

          } else if (error.status === 409) {

            this.errorMessage =
              'Cannot update this course because it is related to other records.';

          } else if (error.status === 500) {

            this.errorMessage =
              'Server error. Please check the Backend.';

          } else {

            this.errorMessage =
              'Unable to update the course. Status: ' +
              error.status;
          }
        }
      });
  }

  // ==========================================
  // Cancel
  // ==========================================

  cancel(): void {

    this.router.navigate(['/courses']);

  }
}