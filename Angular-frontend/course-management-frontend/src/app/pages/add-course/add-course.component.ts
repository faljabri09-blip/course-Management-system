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

  course: CourseDto = {
    title: '',
    description: '',
    credits: 0,
    price: 0,
    instructorId: 0
  };

  loading = false;

  showSuccessModal = false;
  showErrorModal = false;

  errorMessage = '';

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  addCourse(): void {

    // Validation
    if (!this.course.title.trim()) {
      this.showError('Please enter the course title.');
      return;
    }

    if (!this.course.description.trim()) {
      this.showError('Please enter the course description.');
      return;
    }

    if (this.course.credits <= 0) {
      this.showError('Credits must be greater than 0.');
      return;
    }

    if (this.course.price < 0) {
      this.showError('Price cannot be negative.');
      return;
    }

    if (this.course.instructorId <= 0) {
      this.showError('Please enter a valid Instructor ID.');
      return;
    }

    this.loading = true;

    this.courseService.add(this.course).subscribe({

      next: (response) => {

        console.log('Course added successfully:', response);

        this.loading = false;

        this.showSuccessModal = true;
      },

      error: (error) => {

        console.error('Add course error:', error);

        this.loading = false;

        if (error.status === 401) {

          this.showError(
            'Your session has expired. Please login again.'
          );

        }
        else if (error.status === 403) {

          this.showError(
            'Only Admin users can add courses.'
          );

        }
        else if (error.status === 400) {

          this.showError(
            'Invalid course information. Please check your data.'
          );

        }
        else {

          this.showError(
            'Unable to add the course. Please try again.'
          );
        }
      }

    });
  }


  showError(message: string): void {

    this.errorMessage = message;

    this.showErrorModal = true;
  }


  closeErrorModal(): void {

    this.showErrorModal = false;

    this.errorMessage = '';
  }


  closeSuccessModal(): void {

    this.showSuccessModal = false;

    // Return to Courses page
    this.router.navigate(['/courses']);
  }


  cancel(): void {

    this.router.navigate(['/courses']);
  }

}