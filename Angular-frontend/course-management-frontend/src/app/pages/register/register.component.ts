import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  RegisterRequest
} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // =====================================
  // Register Fields
  // =====================================

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';


  // =====================================
  // Messages
  // =====================================

  errorMessage: string = '';
  successMessage: string = '';


  // =====================================
  // Loading
  // =====================================

  loading: boolean = false;


  // =====================================
  // Constructor
  // =====================================

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // =====================================
  // Register
  // =====================================

  register(): void {

    // Clear messages
    this.errorMessage = '';
    this.successMessage = '';


    // =====================================
    // Validate Username
    // =====================================

    if (!this.username.trim()) {

      this.errorMessage =
        'Please enter a username.';

      return;
    }


    // =====================================
    // Validate Email
    // =====================================

    if (!this.email.trim()) {

      this.errorMessage =
        'Please enter your email.';

      return;
    }


    // =====================================
    // Validate Password
    // =====================================

    if (!this.password) {

      this.errorMessage =
        'Please enter a password.';

      return;
    }


    // =====================================
    // Validate Confirm Password
    // =====================================

    if (!this.confirmPassword) {

      this.errorMessage =
        'Please confirm your password.';

      return;
    }


    // =====================================
    // Check Password Match
    // =====================================

    if (this.password !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    // =====================================
    // Start Loading
    // =====================================

    this.loading = true;


    // =====================================
    // Register Data
    // =====================================

    const registerData: RegisterRequest = {

      username: this.username.trim(),

      email: this.email.trim(),

      password: this.password,

      role: 'student'

    };


    console.log(
      'Register Data:',
      registerData
    );


    // =====================================
    // Call Register API
    // =====================================

    this.authService.register(
      registerData
    ).subscribe({

      // =====================================
      // SUCCESS
      // =====================================

      next: (response) => {

        console.log(
          'Registration successful:',
          response
        );

        this.loading = false;

        this.successMessage =
          'Account created successfully! You can now login.';


        // =====================================
        // Clear Form
        // =====================================

        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';


        // =====================================
        // Redirect To Login
        // =====================================

        setTimeout(() => {

          this.router.navigate([
            '/login'
          ]);

        }, 2000);

      },


      // =====================================
      // ERROR
      // =====================================

      error: (error) => {

        console.error(
          'Registration error:',
          error
        );

        console.error(
          'Status:',
          error.status
        );

        console.error(
          'Backend Error:',
          error.error
        );


        this.loading = false;


        // =====================================
        // 400 Bad Request
        // =====================================

        if (error.status === 400) {

          this.errorMessage =
            error.error?.message ||
            error.error?.title ||
            'Registration failed. Please check your information.';

        }


        // =====================================
        // 409 Conflict
        // =====================================

        else if (error.status === 409) {

          this.errorMessage =
            error.error?.message ||
            'Username or email already exists.';

        }


        // =====================================
        // 0 Connection Error
        // =====================================

        else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please make sure the backend is running.';

        }


        // =====================================
        // Other Errors
        // =====================================

        else {

          this.errorMessage =
            error.error?.message ||
            error.error?.title ||
            `Registration failed. Server returned status ${error.status}.`;

        }

      }

    });

  }


  // =====================================
  // Go To Login
  // =====================================

  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }

}