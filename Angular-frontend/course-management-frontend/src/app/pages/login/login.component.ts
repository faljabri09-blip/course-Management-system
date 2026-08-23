import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // =====================================
  // Login Fields
  // =====================================

  username: string = '';
  password: string = '';


  // =====================================
  // Messages
  // =====================================

  errorMessage: string = '';


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
  // Login
  // =====================================

  login(): void {

    this.errorMessage = '';


    // =====================================
    // Validate Inputs
    // =====================================

    if (
      !this.username.trim() ||
      !this.password.trim()
    ) {

      this.errorMessage =
        'Please enter username and password.';

      return;
    }


    // =====================================
    // Start Loading
    // =====================================

    this.loading = true;


    // =====================================
    // Login API
    // =====================================

    this.authService.login({

      username: this.username.trim(),

      password: this.password

    }).subscribe({

      // =====================================
      // SUCCESS
      // =====================================

      next: (response) => {

        console.log(
          'Login successful'
        );

        console.log(
          'Username:',
          response.username
        );

        console.log(
          'Role:',
          response.role
        );

        console.log(
          'Token:',
          response.token
        );


        this.loading = false;


        // =====================================
        // Get Role
        // =====================================

        const role =
          response.role.trim().toLowerCase();


        // =====================================
        // STUDENT
        // =====================================

        if (role === 'student') {

          console.log(
            'Redirecting Student...'
          );

          this.router.navigate([
            '/student-dashboard'
          ]);

        }


        // =====================================
        // ADMIN
        // =====================================

        else if (role === 'admin') {

          console.log(
            'Redirecting Admin...'
          );

          this.router.navigate([
            '/dashboard'
          ]);

        }


        // =====================================
        // INSTRUCTOR
        // =====================================

        else if (role === 'instructor') {

          console.log(
            'Redirecting Instructor...'
          );

          this.router.navigate([
            '/instructor-dashboard'
          ]);

        }


        // =====================================
        // UNKNOWN ROLE
        // =====================================

        else {

          console.error(
            'Unknown role:',
            response.role
          );

          this.errorMessage =
            'User role is not recognized.';
        }

      },


      // =====================================
      // ERROR
      // =====================================

      error: (error) => {

        console.error(
          'Login error:',
          error
        );

        this.loading = false;


        if (error.status === 401) {

          this.errorMessage =
            'Invalid username or password.';

        }

        else if (error.status === 400) {

          this.errorMessage =
            'Please check your login information.';

        }

        else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please make sure the backend is running.';

        }

        else {

          this.errorMessage =
            'Something went wrong. Please try again later.';
        }

      }

    });

  }


  // =====================================
  // Go To Register
  // =====================================

  goToRegister(): void {

    this.router.navigate([
      '/register'
    ]);

  }

}