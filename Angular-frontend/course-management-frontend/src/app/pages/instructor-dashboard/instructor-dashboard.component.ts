import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import {
  Instructor,
  InstructorService
} from '../../services/instructor.service';


@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {

  // =========================================
  // Instructor Information
  // =========================================

  instructor: Instructor | null = null;

  username: string = '';

  role: string = '';

  userInitial: string = 'I';


  // =========================================
  // Statistics
  // =========================================

  totalCourses: number = 0;

  totalStudents: number = 0;

  totalEnrollments: number = 0;


  // =========================================
  // Loading
  // =========================================

  loading: boolean = false;

  errorMessage: string = '';


  // =========================================
  // Constructor
  // =========================================

  constructor(
    private authService: AuthService,
    private instructorService: InstructorService,
    private router: Router
  ) {}


  // =========================================
  // On Init
  // =========================================

  ngOnInit(): void {

    this.username = this.authService.getUsername();

    this.role = this.authService.getRole();

    this.setUserInitial();

    this.loadInstructor();

  }


  // =========================================
  // User Initial
  // =========================================

  setUserInitial(): void {

    if (this.username) {

      this.userInitial =
        this.username.charAt(0).toUpperCase();

    }

  }


  // =========================================
  // Load Instructor
  // =========================================

  loadInstructor(): void {

    this.loading = true;

    this.errorMessage = '';

    this.instructorService.getAll().subscribe({

      next: (instructors: Instructor[]) => {

        const loggedInUsername =
          this.username.trim().toLowerCase();


        // =====================================
        // Find logged-in instructor
        // =====================================

        const foundInstructor =
          instructors.find(
            (item: Instructor) => {

              const instructorName =
                item.name.trim().toLowerCase();

              const instructorEmail =
                item.email.trim().toLowerCase();

              return (
                instructorName === loggedInUsername ||
                instructorEmail === loggedInUsername
              );

            }
          );


        if (foundInstructor) {

          this.instructor = foundInstructor;

          this.totalCourses =
            foundInstructor.courses
              ? foundInstructor.courses.length
              : 0;

          this.totalStudents = 0;

          this.totalEnrollments = 0;

        }
        else {

          this.errorMessage =
            'Instructor information was not found.';

        }


        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Error loading instructor:',
          error
        );

        this.errorMessage =
          'Unable to load instructor information.';

        this.loading = false;

      }

    });

  }


  // =========================================
  // Go To Courses
  // =========================================

  goToCourses(): void {

    this.router.navigate([
      '/courses'
    ]);

  }


  // =========================================
  // Go To Students
  // =========================================

  goToStudents(): void {

    this.router.navigate([
      '/student-dashboard'
    ]);

  }


  // =========================================
  // Go To Enrollments
  // =========================================

  goToEnrollments(): void {

    this.router.navigate([
      '/enrollments'
    ]);

  }


  // =========================================
  // Logout
  // =========================================

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}