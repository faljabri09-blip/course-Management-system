import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

import {
  Instructor,
  InstructorService
} from '../../services/instructor.service';

import { environment } from '../../../environments/environment';


// =========================================
// Course
// =========================================

interface InstructorCourse {

  id: number;

  title: string;

  description?: string;

  credits?: number;

  price?: number;

  instructorId: number;

}


// =========================================
// Enrollment
// =========================================

interface Enrollment {

  id: number;

  studentId: number;

  courseId: number;

  status: string;

  grade?: string | null;

  enrollmentDate?: string;

}


// =========================================
// Student
// =========================================

interface Student {

  id: number;

  name: string;

  email: string;

  phone?: string;

}


// =========================================
// Instructor Student
// =========================================

interface InstructorStudent {

  studentId: number;

  studentName: string;

  email: string;

  courseId: number;

  courseTitle: string;

  status: string;

}


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


  // =========================================
  // Instructor Students
  // =========================================

  instructorStudents: InstructorStudent[] = [];

  loadingStudents: boolean = false;


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

    private http: HttpClient,

    private router: Router

  ) {}


  // =========================================
  // On Init
  // =========================================

  ngOnInit(): void {

    this.username =
      this.authService.getUsername();

    this.role =
      this.authService.getRole();

    this.setUserInitial();

    this.loadInstructor();

  }


  // =========================================
  // User Initial
  // =========================================

  setUserInitial(): void {

    if (this.username) {

      this.userInitial =
        this.username
          .charAt(0)
          .toUpperCase();

    }

  }


  // =========================================
  // Load Instructor
  // =========================================

  loadInstructor(): void {

    this.loading = true;

    this.errorMessage = '';


    this.instructorService
      .getAll()
      .subscribe({

        next: (instructors: Instructor[]) => {

          const loggedInUsername =
            this.username
              .trim()
              .toLowerCase();


          // =====================================
          // Find Logged In Instructor
          // =====================================

          const foundInstructor =
            instructors.find(
              (item: Instructor) => {

                const instructorName =
                  item.name
                    .trim()
                    .toLowerCase();

                const instructorEmail =
                  item.email
                    .trim()
                    .toLowerCase();


                return (

                  instructorName ===
                  loggedInUsername

                  ||

                  instructorEmail ===
                  loggedInUsername

                );

              }
            );


          // =====================================
          // Instructor Found
          // =====================================

          if (foundInstructor) {

            this.instructor =
              foundInstructor;


            this.totalCourses =
              foundInstructor.courses
                ? foundInstructor.courses.length
                : 0;


            // ===================================
            // Load Students
            // ===================================

            this.loadInstructorStudents();

          }

          else {

            this.errorMessage =
              'Instructor information was not found.';

          }


          this.loading = false;

        },


        // =====================================
        // Error
        // =====================================

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
  // Load Students Of Instructor
  // =========================================

  loadInstructorStudents(): void {

    if (!this.instructor) {

      return;

    }


    this.loadingStudents = true;

    this.instructorStudents = [];


    // =========================================
    // Get All Courses
    // =========================================

    this.http
      .get<InstructorCourse[]>(
        `${environment.apiUrl}/Course`
      )
      .subscribe({

        next: (courses: InstructorCourse[]) => {


          // ===================================
          // Instructor Courses Only
          // ===================================

          const myCourses =
            courses.filter(
              course =>
                course.instructorId ===
                this.instructor?.id
            );


          console.log(
            'Instructor courses:',
            myCourses
          );


          if (myCourses.length === 0) {

            this.totalStudents = 0;

            this.loadingStudents = false;

            return;

          }


          // ===================================
          // Load Enrollments
          // ===================================

          let completedRequests = 0;


          myCourses.forEach(
            course => {


              this.http
                .get<Enrollment[]>(
                  `${environment.apiUrl}/Enrollment/course/${course.id}`
                )
                .subscribe({

                  next: (
                    enrollments: Enrollment[]
                  ) => {


                    console.log(
                      `Enrollments for course ${course.title}:`,
                      enrollments
                    );


                    // =========================
                    // Active Students Only
                    // =========================

                    enrollments
                      .filter(
                        enrollment =>
                          enrollment.status
                            ?.toLowerCase() ===
                          'active'
                      )
                      .forEach(
                        enrollment => {

                          this.loadStudentForEnrollment(
                            enrollment,
                            course
                          );

                        }
                      );


                    completedRequests++;


                    if (
                      completedRequests ===
                      myCourses.length
                    ) {

                      this.loadingStudents =
                        false;

                    }

                  },


                  error: (error) => {

                    console.error(
                      `Error loading enrollments for course ${course.id}:`,
                      error
                    );


                    completedRequests++;


                    if (
                      completedRequests ===
                      myCourses.length
                    ) {

                      this.loadingStudents =
                        false;

                    }

                  }

                });

            }

          );

        },


        error: (error) => {

          console.error(
            'Error loading instructor courses:',
            error
          );


          this.loadingStudents = false;


          this.errorMessage =
            'Unable to load instructor courses.';

        }

      });

  }


  // =========================================
  // Load Student
  // =========================================

  loadStudentForEnrollment(

    enrollment: Enrollment,

    course: InstructorCourse

  ): void {


    this.http
      .get<Student>(
        `${environment.apiUrl}/Student/${enrollment.studentId}`
      )
      .subscribe({

        next: (student: Student) => {


          // ===================================
          // Prevent Duplicate
          // ===================================

          const exists =
            this.instructorStudents.some(

              item =>

                item.studentId ===
                  student.id

                &&

                item.courseId ===
                  course.id

            );


          if (exists) {

            return;

          }


          // ===================================
          // Add Student
          // ===================================

          this.instructorStudents = [

            ...this.instructorStudents,

            {

              studentId:
                student.id,

              studentName:
                student.name,

              email:
                student.email,

              courseId:
                course.id,

              courseTitle:
                course.title,

              status:
                enrollment.status

            }

          ];


          // ===================================
          // Unique Students Count
          // ===================================

          const uniqueStudentIds =
            new Set(

              this.instructorStudents.map(
                item =>
                  item.studentId
              )

            );


          this.totalStudents =
            uniqueStudentIds.size;


          console.log(
            'Instructor students:',
            this.instructorStudents
          );

        },


        error: (error) => {

          console.error(
            `Unable to load student ${enrollment.studentId}:`,
            error
          );

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
  // Go To My Students
  // =========================================

  goToStudents(): void {

    this.router.navigate([
      '/instructor-students'
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