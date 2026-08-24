import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  EnrollmentService,
  Enrollment
} from '../../services/enrollment.service';

import {
  StudentService,
  Student
} from '../../services/student.service';


@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.css']
})
export class EnrollmentsComponent implements OnInit {

  // =========================================
  // USER INFORMATION
  // =========================================

  username: string = '';
  studentId: number = 0;
  role: string = '';
  isAdmin: boolean = false;


  // =========================================
  // ENROLLMENTS
  // =========================================

  enrollments: Enrollment[] = [];


  // =========================================
  // STUDENTS
  // =========================================

  students: Student[] = [];


  // =========================================
  // LOADING
  // =========================================

  loading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';


  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private router: Router
  ) {}


  // =========================================
  // ON INIT
  // =========================================

  ngOnInit(): void {

    this.loadUser();

    this.loadEnrollments();

  }


  // =========================================
  // LOAD USER
  // =========================================

  loadUser(): void {

    const savedStudentId =
      localStorage.getItem('studentId');

    const savedUsername =
      localStorage.getItem('username');

    const savedRole =
      localStorage.getItem('role');


    if (savedStudentId) {

      this.studentId =
        Number(savedStudentId);

    }


    if (savedUsername) {

      this.username =
        savedUsername;

    }


    if (savedRole) {

      this.role =
        savedRole;

    }


    this.isAdmin =
      this.role.trim().toLowerCase() === 'admin';


    console.log('=================================');
    console.log('CURRENT USER');
    console.log('Username:', this.username);
    console.log('Student ID:', this.studentId);
    console.log('Role:', this.role);
    console.log('Is Admin:', this.isAdmin);
    console.log('=================================');

  }


  // =========================================
  // LOAD ENROLLMENTS
  // =========================================

  loadEnrollments(): void {

    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';


    // =========================================
    // ADMIN
    // =========================================

    if (this.isAdmin) {

      console.log('Loading ALL enrollments for Admin...');


      this.enrollmentService
        .getAll()
        .subscribe({

          next: (data: Enrollment[]) => {

            console.log(
              'ALL ENROLLMENTS FROM API:',
              data
            );


            this.enrollments =
              data || [];


            // Clear old students

            this.students = [];


            // =========================================
            // GET UNIQUE STUDENT IDS
            // =========================================

            const studentIds =
              Array.from(
                new Set(
                  this.enrollments
                    .map(
                      enrollment =>
                        Number(enrollment.studentId)
                    )
                    .filter(
                      id => id > 0
                    )
                )
              );


            console.log(
              'Student IDs found in enrollments:',
              studentIds
            );


            // =========================================
            // NO STUDENTS
            // =========================================

            if (studentIds.length === 0) {

              console.log(
                'No valid student IDs found.'
              );

              this.loading = false;

              return;

            }


            // =========================================
            // LOAD EACH STUDENT BY ID
            // =========================================

            const requests =
              studentIds.map(
                (id: number) =>

                  this.studentService
                    .getById(id)
                    .pipe(

                      catchError(error => {

                        console.error(
                          `Error loading Student ID ${id}:`,
                          error
                        );

                        return of(null);

                      })

                    )
              );


            forkJoin(requests)
              .subscribe({

                next: (students) => {

                  console.log(
                    'STUDENTS LOADED BY ID:',
                    students
                  );


                  // =========================================
                  // STORE ONLY VALID STUDENTS
                  // =========================================

                  this.students =
                    students.filter(
                      (student): student is Student =>
                        student !== null
                    );


                  console.log(
                    'STUDENTS STORED:',
                    this.students
                  );


                  // =========================================
                  // CONNECT STUDENT TO ENROLLMENT
                  // =========================================

                  this.enrollments =
                    this.enrollments.map(
                      (enrollment: Enrollment) => {

                        const student =
                          this.students.find(
                            (item: Student) =>
                              Number(item.id) ===
                              Number(enrollment.studentId)
                          );


                        console.log(
                          '--------------------------------'
                        );

                        console.log(
                          'Enrollment ID:',
                          enrollment.id
                        );

                        console.log(
                          'Enrollment Student ID:',
                          enrollment.studentId
                        );

                        console.log(
                          'Matched Student:',
                          student
                        );


                        if (student) {

                          return {

                            ...enrollment,

                            student: student

                          };

                        }


                        return enrollment;

                      }
                    );


                  console.log(
                    'FINAL ENROLLMENTS:',
                    this.enrollments
                  );


                  this.loading = false;

                },

                error: (error) => {

                  console.error(
                    'Error loading students:',
                    error
                  );

                  this.loading = false;

                  this.handleError(
                    error,
                    'Unable to load student information.'
                  );

                }

              });

          },

          error: (error) => {

            console.error(
              'Error loading enrollments:',
              error
            );

            this.loading = false;

            this.handleError(
              error,
              'Unable to load enrollments.'
            );

          }

        });


      return;

    }


    // =========================================
    // STUDENT
    // =========================================

    console.log(
      'Loading enrollments for student:',
      this.studentId
    );


    if (!this.studentId || this.studentId <= 0) {

      this.errorMessage =
        'Student information was not found. Please login again.';

      this.loading = false;

      return;

    }


    this.enrollmentService
      .getByStudent(this.studentId)
      .subscribe({

        next: (data: Enrollment[]) => {

          console.log(
            'STUDENT ENROLLMENTS:',
            data
          );


          this.enrollments =
            data || [];


          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Error loading student enrollments:',
            error
          );

          this.loading = false;

          this.handleError(
            error,
            'Unable to load enrollments.'
          );

        }

      });

  }


  // =========================================
  // GET STUDENT NAME
  // =========================================

  getStudentName(
    studentId: number
  ): string {

    const id =
      Number(studentId);


    // =========================================
    // SEARCH IN STUDENTS ARRAY
    // =========================================

    const student =
      this.students.find(
        (item: Student) =>
          Number(item.id) === id
      );


    if (student) {

      const name =
        this.extractStudentName(student);


      if (name) {

        return name;

      }

    }


    // =========================================
    // SEARCH INSIDE ENROLLMENT
    // =========================================

    const enrollment =
      this.enrollments.find(
        (item: Enrollment) =>
          Number(item.studentId) === id
      );


    if (
      enrollment &&
      enrollment.student
    ) {

      const name =
        this.extractStudentName(
          enrollment.student
        );


      if (name) {

        return name;

      }

    }


    // =========================================
    // STUDENT LOGGED-IN USER
    // =========================================

    if (
      !this.isAdmin &&
      this.studentId === id &&
      this.username
    ) {

      return this.username;

    }


    // =========================================
    // FINAL FALLBACK
    // =========================================

    return 'Unknown Student';

  }


  // =========================================
  // EXTRACT STUDENT NAME
  // =========================================

  private extractStudentName(
    student: any
  ): string {

    if (!student) {

      return '';

    }


    // name

    if (
      typeof student.name === 'string' &&
      student.name.trim() &&
      student.name.trim().toLowerCase() !== 'string'
    ) {

      return student.name.trim();

    }


    // fullName

    if (
      typeof student.fullName === 'string' &&
      student.fullName.trim() &&
      student.fullName.trim().toLowerCase() !== 'string'
    ) {

      return student.fullName.trim();

    }


    // username

    if (
      typeof student.username === 'string' &&
      student.username.trim() &&
      student.username.trim().toLowerCase() !== 'string'
    ) {

      return student.username.trim();

    }


    // user.name

    if (
      student.user &&
      typeof student.user.name === 'string' &&
      student.user.name.trim() &&
      student.user.name.trim().toLowerCase() !== 'string'
    ) {

      return student.user.name.trim();

    }


    // user.fullName

    if (
      student.user &&
      typeof student.user.fullName === 'string' &&
      student.user.fullName.trim() &&
      student.user.fullName.trim().toLowerCase() !== 'string'
    ) {

      return student.user.fullName.trim();

    }


    // user.username

    if (
      student.user &&
      typeof student.user.username === 'string' &&
      student.user.username.trim() &&
      student.user.username.trim().toLowerCase() !== 'string'
    ) {

      return student.user.username.trim();

    }


    return '';

  }


  // =========================================
  // ACTIVE COURSES
  // =========================================

  get activeCount(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status
          .toLowerCase() === 'active'
    ).length;

  }


  // =========================================
  // COMPLETED COURSES
  // =========================================

  get completedCount(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status
          .toLowerCase() === 'completed'
    ).length;

  }


  // =========================================
  // DROPPED COURSES
  // =========================================

  get droppedCount(): number {

    return this.enrollments.filter(
      enrollment =>
        enrollment.status
          .toLowerCase() === 'dropped'
    ).length;

  }


  // =========================================
  // USER INITIAL
  // =========================================

  get userInitial(): string {

    if (!this.username) {

      return 'S';

    }


    return this.username
      .charAt(0)
      .toUpperCase();

  }


  // =========================================
  // HANDLE ERROR
  // =========================================

  private handleError(
    error: any,
    defaultMessage: string
  ): void {

    if (error?.status === 401) {

      this.errorMessage =
        'Unauthorized. Please login again.';

    }
    else if (error?.status === 403) {

      this.errorMessage =
        'You are not authorized to view this information.';

    }
    else {

      this.errorMessage =
        defaultMessage;

    }

  }


  // =========================================
  // LOGOUT
  // =========================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('studentId');

    localStorage.removeItem('username');

    localStorage.removeItem('role');


    this.router.navigate([
      '/login'
    ]);

  }

}