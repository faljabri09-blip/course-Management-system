import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    // Clear previous error
    this.errorMessage = '';

    // Validate inputs
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    // Start loading
    this.loading = true;

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({

      next: (response) => {

        console.log('Login successful');
        console.log('Token:', response.token);

        // AuthService already saves the token
        // Navigate to Dashboard
        this.loading = false;

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {

        console.error('Login error:', error);

        this.loading = false;

        // Display error message
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        }
        else if (error.status === 400) {
          this.errorMessage = 'Please check your login information.';
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

}