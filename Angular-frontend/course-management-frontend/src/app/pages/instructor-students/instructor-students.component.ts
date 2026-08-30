import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { AuthService } from '../../services/auth.service';

import {
  Instructor,
  InstructorService
} from '../../services/instructor.service';


// =====================================================
// COURSE
// =====================================================

interface Course {

  id: number;

  title: string;

  description: string;

  credits: number;

  price: number;

  instructorId: number;

}


// =====================================================
// ENROLLMENT
// =====================================================

interface Enrollment {

  id: number;

  studentId: number;

  courseId: number;

  enrollmentDate: string;

  status: string;

  grade: number | null;

}


// =====================================================
// STUDENT
// =====================================================

interface Student {

  id: number;

  name: string;

  email: string;

  phone?: string;

}


@Component({

  selector: 'app-instructor-students',

  templateUrl: './instructor-students.component.html',

  styleUrls: ['./instructor-students.component.css']

})
export class InstructorStudentsComponent
  implements OnInit {


  // =====================================================
  // USER
  // =====================================================

  username = '';

  role = '';


  // =====================================================
  // INSTRUCTOR
  // =====================================================

  instructor: Instructor | null = null;


  // =====================================================
  // DATA
  // =====================================================

  courses: Course[] = [];

  enrollments: Enrollment[] = [];

  students: Student[] = [];


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // ERROR
  // =====================================================

  errorMessage = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private http: HttpClient,

    private authService: AuthService,

    private instructorService: InstructorService,

    private router: Router

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.username =
      this.authService.getUsername();

    this.role =
      this.authService.getRole();


    console.log(
      'Logged in username:',
      this.username
    );


    console.log(
      'Logged in role:',
      this.role
    );


    this.loadInstructor();

  }


  // =====================================================
  // LOAD INSTRUCTOR
  // =====================================================

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


          // =============================================
          // Find current instructor
          // =============================================

          const foundInstructor =
            instructors.find(
              (item: Instructor) => {

                const instructorName =
                  item.name
                    ?.trim()
                    .toLowerCase() || '';


                const instructorEmail =
                  item.email
                    ?.trim()
                    .toLowerCase() || '';


                return (

                  instructorName ===
                    loggedInUsername

                  ||

                  instructorEmail ===
                    loggedInUsername

                );

              }
            );


          // =============================================
          // Instructor not found
          // =============================================

          if (!foundInstructor) {

            this.errorMessage =
              'Instructor information was not found.';

            this.loading = false;

            return;

          }


          // =============================================
          // Save instructor
          // =============================================

          this.instructor =
            foundInstructor;


          console.log(
            'Current instructor:',
            this.instructor
          );


          // =============================================
          // Load courses
          // =============================================

          this.loadCourses();

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


  // =====================================================
  // LOAD COURSES
  // =====================================================

  loadCourses(): void {

    this.http
      .get<Course[]>(
        `${environment.apiUrl}/Course`
      )
      .subscribe({

        next: (data: Course[]) => {

          this.courses =
            data || [];


          console.log(
            'All courses:',
            this.courses
          );


          // =============================================
          // Load enrollments
          // =============================================

          this.loadEnrollments();

        },


        error: (error) => {

          console.error(
            'Error loading courses:',
            error
          );


          this.errorMessage =
            'Unable to load courses.';


          this.loading = false;

        }

      });

  }


  // =====================================================
  // LOAD ENROLLMENTS
  // =====================================================

  loadEnrollments(): void {

    this.http
      .get<Enrollment[]>(
        `${environment.apiUrl}/Enrollment`
      )
      .subscribe({

        next: (data: Enrollment[]) => {

          this.enrollments =
            data || [];


          console.log(
            'All enrollments:',
            this.enrollments
          );


          // =============================================
          // Load students
          // =============================================

          this.loadStudents();

        },


        error: (error) => {

          console.error(
            'Error loading enrollments:',
            error
          );


          this.errorMessage =
            'Unable to load enrollments.';


          this.loading = false;

        }

      });

  }


  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  loadStudents(): void {

    this.http
      .get<Student[]>(
        `${environment.apiUrl}/Student`
      )
      .subscribe({

        next: (data: Student[]) => {

          const allStudents =
            data || [];


          // =============================================
          // 1. Get courses belonging to current instructor
          // =============================================

          const instructorCourseIds =
            this.courses

              .filter(course => {

                return (

                  this.instructor !== null

                  &&

                  course.instructorId ===
                    this.instructor.id

                );

              })

              .map(
                course =>
                  course.id
              );


          console.log(
            'Instructor Course IDs:',
            instructorCourseIds
          );


          // =============================================
          // 2. Get active enrollments
          //    in instructor courses
          // =============================================

          const instructorEnrollments =
            this.enrollments
              .filter(enrollment => {

                const active =
                  enrollment.status
                    ?.trim()
                    .toLowerCase() ===
                    'active';


                const instructorCourse =
                  instructorCourseIds
                    .includes(
                      enrollment.courseId
                    );


                return (
                  active &&
                  instructorCourse
                );

              });


          console.log(
            'Instructor enrollments:',
            instructorEnrollments
          );


          // =============================================
          // 3. Get student IDs
          // =============================================

          const studentIds =
            instructorEnrollments
              .map(
                enrollment =>
                  enrollment.studentId
              );


          // =============================================
          // 4. Remove duplicates
          // =============================================

          const uniqueStudentIds =
            [...new Set(studentIds)];


          console.log(
            'Instructor student IDs:',
            uniqueStudentIds
          );


          // =============================================
          // 5. Get actual student objects
          // =============================================

          this.students =
            allStudents.filter(student => {

              return uniqueStudentIds
                .includes(student.id);

            });


          console.log(
            'Final instructor students:',
            this.students
          );


          // =============================================
          // Finish loading
          // =============================================

          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );


          this.errorMessage =
            'Unable to load students.';


          this.loading = false;

        }

      });

  }


  // =====================================================
  // GET COURSE NAMES
  // =====================================================

  getCourseNames(
    studentId: number
  ): string {

    // =============================================
    // Get current instructor course IDs
    // =============================================

    const instructorCourseIds =
      this.courses

        .filter(course => {

          return (

            this.instructor !== null

            &&

            course.instructorId ===
              this.instructor.id

          );

        })

        .map(
          course =>
            course.id
        );


    // =============================================
    // Get student's active enrollments
    // =============================================

    const studentCourseIds =
      this.enrollments

        .filter(enrollment => {

          return (

            enrollment.studentId ===
              studentId

            &&

            enrollment.status
              ?.trim()
              .toLowerCase() ===
              'active'

            &&

            instructorCourseIds
              .includes(
                enrollment.courseId
              )

          );

        })

        .map(
          enrollment =>
            enrollment.courseId
        );


    // =============================================
    // Get course names
    // =============================================

    const courseNames =
      this.courses

        .filter(course => {

          return studentCourseIds
            .includes(
              course.id
            );

        })

        .map(
          course =>
            course.title
        );


    return courseNames.join(', ');

  }


  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  goBack(): void {

    this.router.navigate([
      '/instructor-dashboard'
    ]);

  }

}