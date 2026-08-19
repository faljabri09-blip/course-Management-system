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

    // Clear previous error
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
    // Call Login API
    // =====================================

    this.authService.login({

      username: this.username.trim(),

      password: this.password

    }).subscribe({

      // =====================================
      // Login Success
      // =====================================

      next: (response) => {

        console.log(
          'Login successful'
        );

        console.log(
          'Token:',
          response.token
        );

        console.log(
          'Username:',
          response.username
        );

        console.log(
          'Role:',
          response.role
        );


        this.loading = false;


        // =====================================
        // Redirect According To Role
        // =====================================

        if (
          response.role.toLowerCase() === 'student'
        ) {

          console.log(
            'Redirecting to Student Dashboard'
          );

          this.router.navigate([
            '/student-dashboard'
          ]);

        }

        else if (
          response.role.toLowerCase() === 'admin'
        ) {

          console.log(
            'Redirecting to Admin Dashboard'
          );

          this.router.navigate([
            '/dashboard'
          ]);

        }

        else {

          console.log(
            'Unknown role:',
            response.role
          );

          this.errorMessage =
            'User role is not recognized.';

        }

      },


      // =====================================
      // Login Error
      // =====================================

      error: (error) => {

        console.error(
          'Login error:',
          error
        );


        this.loading = false;


        // =====================================
        // Unauthorized
        // =====================================

        if (error.status === 401) {

          this.errorMessage =
            'Invalid username or password.';

        }


        // =====================================
        // Bad Request
        // =====================================

        else if (error.status === 400) {

          this.errorMessage =
            'Please check your login information.';

        }


        // =====================================
        // Server Connection Error
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