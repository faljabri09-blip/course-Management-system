import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface StudentRequest {
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {

  // =========================================
  // Student Form
  // =========================================

  name: string = '';
  email: string = '';
  phone: string = '';

  // =========================================
  // Messages
  // =========================================

  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  // =========================================
  // Constructor
  // =========================================

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // =========================================
  // Add Student
  // =========================================

  addStudent(): void {

    this.successMessage = '';
    this.errorMessage = '';

    // =========================================
    // Validation
    // =========================================

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.phone.trim()
    ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    // =========================================
    // Email Validation
    // =========================================

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // =========================================
    // Start Loading
    // =========================================

    this.loading = true;

    // =========================================
    // Student Request
    // =========================================

    const student: StudentRequest = {
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim()
    };

    console.log('Adding student:', student);

    // =========================================
    // API Request
    // =========================================

    this.http.post(
      `${environment.apiUrl}/Student`,
      student
    ).subscribe({

      // =======================================
      // Success
      // =======================================

      next: (response) => {

        console.log(
          'Student added successfully:',
          response
        );

        this.loading = false;

        this.successMessage =
          'Student added successfully!';

        // =====================================
        // Clear Form
        // =====================================

        this.name = '';
        this.email = '';
        this.phone = '';

        // =====================================
        // Return To Dashboard
        // =====================================

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1200);
      },

      // =======================================
      // Error
      // =======================================

      error: (error) => {

        console.error(
          'Error adding student:',
          error
        );

        this.loading = false;

        // =====================================
        // Bad Request
        // =====================================

        if (error.status === 400) {

          this.errorMessage =
            'Invalid student information. Please check the entered data.';
        }

        // =====================================
        // Unauthorized
        // =====================================

        else if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';
        }

        // =====================================
        // Forbidden
        // =====================================

        else if (error.status === 403) {

          this.errorMessage =
            'Only administrators can add students.';
        }

        // =====================================
        // Conflict
        // =====================================

        else if (error.status === 409) {

          this.errorMessage =
            'A student with this information already exists.';
        }

        // =====================================
        // Server Error
        // =====================================

        else if (error.status === 500) {

          this.errorMessage =
            'Server error. Please try again later.';
        }

        // =====================================
        // Other Errors
        // =====================================

        else {

          this.errorMessage =
            'Unable to add student. Please try again.';
        }
      }
    });
  }

  // =========================================
  // Cancel
  // =========================================

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}