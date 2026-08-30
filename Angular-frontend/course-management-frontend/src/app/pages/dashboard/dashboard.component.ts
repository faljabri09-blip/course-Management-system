import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';

import {
  Chart,
  registerables
} from 'chart.js';

import {
  StudentService,
  Student
} from '../../services/student.service';

import {
  InstructorService,
  Instructor
} from '../../services/instructor.service';

import {
  CourseService,
  Course
} from '../../services/course.service';

import {
  EnrollmentService,
  Enrollment
} from '../../services/enrollment.service';


Chart.register(...registerables);


// =========================================================
// Dashboard Enrollment Interface
// =========================================================

interface RecentEnrollment {

  student: string;

  course: string;

  date: string;

  status: 'Active' | 'Completed' | 'Dropped';

  grade: string;

}


// =========================================================
// Dashboard Component
// =========================================================

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent
  implements OnInit, AfterViewInit, OnDestroy {


  // =======================================================
  // USER
  // =======================================================

  username: string = 'Admin';


  // =======================================================
  // STATISTICS
  // =======================================================

  totalStudents: number = 0;

  totalInstructors: number = 0;

  totalCourses: number = 0;

  totalEnrollments: number = 0;


  // =======================================================
  // RECENT ENROLLMENTS
  // =======================================================

  recentEnrollments: RecentEnrollment[] = [];


  // =======================================================
  // ENROLLMENT STATUS
  // =======================================================

  activeEnrollments: number = 0;

  completedEnrollments: number = 0;

  droppedEnrollments: number = 0;


  // =======================================================
  // CHART INSTANCES
  // =======================================================

  private lineChart?: Chart;

  private doughnutChart?: Chart;

  private barChart?: Chart;


  // =======================================================
  // CONSTRUCTOR
  // =======================================================

  constructor(

    private router: Router,

    private studentService: StudentService,

    private instructorService: InstructorService,

    private courseService: CourseService,

    private enrollmentService: EnrollmentService

  ) {}


  // =======================================================
  // ON INIT
  // =======================================================

  ngOnInit(): void {

    this.loadUsername();

    this.loadDashboardData();

  }


  // =======================================================
  // LOAD USERNAME
  // =======================================================

  private loadUsername(): void {

    const storedUsername =
      localStorage.getItem('username');

    if (storedUsername) {

      this.username = storedUsername;

    }

  }


  // =======================================================
  // USER INITIAL
  // =======================================================

  get userInitial(): string {

    if (this.username) {

      return this.username
        .charAt(0)
        .toUpperCase();

    }

    return 'A';

  }


  // =======================================================
  // LOAD DASHBOARD DATA
  // =======================================================

  loadDashboardData(): void {

    // =====================================================
    // STUDENTS
    // =====================================================

    this.studentService
      .getAll()
      .subscribe({

        next: (students: Student[]) => {

          this.totalStudents =
            students.length;

        },

        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );

          this.totalStudents = 0;

        }

      });


    // =====================================================
    // INSTRUCTORS
    // =====================================================

    this.instructorService
      .getAll()
      .subscribe({

        next: (instructors: Instructor[]) => {

          this.totalInstructors =
            instructors.length;

        },

        error: (error) => {

          console.error(
            'Error loading instructors:',
            error
          );

          this.totalInstructors = 0;

        }

      });


    // =====================================================
    // COURSES
    // =====================================================

    this.courseService
      .getAll()
      .subscribe({

        next: (courses: Course[]) => {

          this.totalCourses =
            courses.length;

        },

        error: (error) => {

          console.error(
            'Error loading courses:',
            error
          );

          this.totalCourses = 0;

        }

      });


    // =====================================================
    // ENROLLMENTS
    // =====================================================

    this.enrollmentService
      .getAll()
      .subscribe({

        next: (enrollments: Enrollment[]) => {

          console.log(
            'Dashboard enrollments:',
            enrollments
          );


          // -----------------------------------------------
          // Total
          // -----------------------------------------------

          this.totalEnrollments =
            enrollments.length;


          // -----------------------------------------------
          // Status
          // -----------------------------------------------

          this.calculateEnrollmentStatus(
            enrollments
          );


          // -----------------------------------------------
          // Recent Enrollments
          // -----------------------------------------------

          this.loadRecentEnrollments(
            enrollments
          );


          // -----------------------------------------------
          // Update Chart
          // -----------------------------------------------

          this.refreshCharts();

        },

        error: (error) => {

          console.error(
            'Error loading enrollments:',
            error
          );

          this.totalEnrollments = 0;

          this.activeEnrollments = 0;

          this.completedEnrollments = 0;

          this.droppedEnrollments = 0;

          this.recentEnrollments = [];

        }

      });

  }


  // =======================================================
  // CALCULATE ENROLLMENT STATUS
  // =======================================================

  private calculateEnrollmentStatus(
    enrollments: Enrollment[]
  ): void {

    this.activeEnrollments =
      enrollments.filter(
        enrollment =>
          this.normalizeStatus(
            enrollment.status
          ) === 'Active'
      ).length;


    this.completedEnrollments =
      enrollments.filter(
        enrollment =>
          this.normalizeStatus(
            enrollment.status
          ) === 'Completed'
      ).length;


    this.droppedEnrollments =
      enrollments.filter(
        enrollment =>
          this.normalizeStatus(
            enrollment.status
          ) === 'Dropped'
      ).length;

  }


  // =======================================================
  // LOAD RECENT ENROLLMENTS
  // =======================================================

  private loadRecentEnrollments(
    enrollments: Enrollment[]
  ): void {

    if (
      !enrollments ||
      enrollments.length === 0
    ) {

      this.recentEnrollments = [];

      return;

    }


    // -----------------------------------------------------
    // Sort by newest enrollment date
    // -----------------------------------------------------

    const sortedEnrollments =
      [...enrollments].sort(
        (a, b) => {

          const dateA =
            this.getEnrollmentDate(a);

          const dateB =
            this.getEnrollmentDate(b);

          return dateB - dateA;

        }
      );


    // -----------------------------------------------------
    // Get latest 5
    // -----------------------------------------------------

    this.recentEnrollments =
      sortedEnrollments
        .slice(0, 5)
        .map(
          enrollment =>
            this.mapRecentEnrollment(
              enrollment
            )
        );


    console.log(
      'Recent enrollments:',
      this.recentEnrollments
    );

  }


  // =======================================================
  // MAP ENROLLMENT
  // =======================================================

  private mapRecentEnrollment(
    enrollment: Enrollment
  ): RecentEnrollment {

    return {

      student:
        this.getStudentName(
          enrollment
        ),

      course:
        this.getCourseName(
          enrollment
        ),

      date:
        this.formatDate(
          enrollment.enrollmentDate
        ),

      status:
        this.normalizeStatus(
          enrollment.status
        ) as
          'Active'
          | 'Completed'
          | 'Dropped',

      grade:
        enrollment.grade !== null &&
        enrollment.grade !== undefined
          ? String(enrollment.grade)
          : '-'

    };

  }


  // =======================================================
  // GET ENROLLMENT DATE
  // =======================================================

  private getEnrollmentDate(
    enrollment: Enrollment
  ): number {

    if (
      !enrollment.enrollmentDate
    ) {

      return 0;

    }


    const date =
      new Date(
        enrollment.enrollmentDate
      );


    const time =
      date.getTime();


    if (isNaN(time)) {

      return 0;

    }


    return time;

  }


  // =======================================================
  // GET STUDENT NAME
  // =======================================================

  private getStudentName(
    enrollment: Enrollment
  ): string {

    // -----------------------------------------------------
    // API returns Student object
    // -----------------------------------------------------

    if (
      enrollment.student &&
      typeof enrollment.student === 'object'
    ) {

      const student: any =
        enrollment.student;


      if (student.name) {

        return student.name;

      }


      if (student.fullName) {

        return student.fullName;

      }


      if (student.username) {

        return student.username;

      }


      if (student.firstName) {

        if (student.lastName) {

          return (
            student.firstName +
            ' ' +
            student.lastName
          );

        }

        return student.firstName;

      }

    }


    // -----------------------------------------------------
    // Fallback
    // -----------------------------------------------------

    return (
      'Student #' +
      enrollment.studentId
    );

  }


  // =======================================================
  // GET COURSE NAME
  // =======================================================

  private getCourseName(
    enrollment: Enrollment
  ): string {

    // -----------------------------------------------------
    // API returns Course object
    // -----------------------------------------------------

    if (
      enrollment.course &&
      typeof enrollment.course === 'object'
    ) {

      const course: any =
        enrollment.course;


      if (course.title) {

        return course.title;

      }


      if (course.name) {

        return course.name;

      }

    }


    // -----------------------------------------------------
    // Fallback
    // -----------------------------------------------------

    return (
      'Course #' +
      enrollment.courseId
    );

  }


  // =======================================================
  // NORMALIZE STATUS
  // =======================================================

  private normalizeStatus(
    status: string
  ): string {

    if (!status) {

      return 'Active';

    }


    const normalized =
      status
        .trim()
        .toLowerCase();


    if (
      normalized === 'active'
    ) {

      return 'Active';

    }


    if (
      normalized === 'completed'
    ) {

      return 'Completed';

    }


    if (
      normalized === 'dropped'
    ) {

      return 'Dropped';

    }


    return status;

  }


  // =======================================================
  // FORMAT DATE
  // =======================================================

  private formatDate(
    date: string
  ): string {

    if (!date) {

      return '-';

    }


    const parsedDate =
      new Date(date);


    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }


    return parsedDate.toLocaleDateString(
      'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =======================================================
  // AFTER VIEW INIT
  // =======================================================

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.createLineChart();

      this.createDoughnutChart();

      this.createBarChart();

    }, 300);

  }


  // =======================================================
  // REFRESH CHARTS
  // =======================================================

  private refreshCharts(): void {

    setTimeout(() => {

      this.updateBarChart();

    }, 100);

  }


  // =======================================================
  // LINE CHART
  // =======================================================

  createLineChart(): void {

    const canvasElement =
      document.getElementById(
        'enrollmentChart'
      );


    if (
      !(canvasElement instanceof HTMLCanvasElement)
    ) {

      return;

    }


    if (this.lineChart) {

      this.lineChart.destroy();

    }


    this.lineChart =
      new Chart(
        canvasElement,
        {

          type: 'line',

          data: {

            labels: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun'
            ],

            datasets: [

              {

                label: 'Enrollments',

                data: [
                  420,
                  610,
                  520,
                  760,
                  650,
                  920
                ],

                borderColor:
                  '#11157a',

                backgroundColor:
                  'rgba(17, 21, 122, 0.12)',

                borderWidth: 4,

                pointRadius: 6,

                pointHoverRadius: 8,

                pointBackgroundColor:
                  '#ffffff',

                pointBorderColor:
                  '#11157a',

                pointBorderWidth: 4,

                fill: true,

                tension: 0.35

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                display: false

              }

            },

            scales: {

              y: {

                beginAtZero: true,

                grid: {

                  color:
                    '#d9dcec'

                },

                ticks: {

                  color: '#555',

                  font: {

                    size: 11

                  }

                }

              },

              x: {

                grid: {

                  display: false

                },

                ticks: {

                  color: '#555',

                  font: {

                    size: 11

                  }

                }

              }

            }

          }

        }
      );

  }


  // =======================================================
  // DOUGHNUT CHART
  // =======================================================

  createDoughnutChart(): void {

    const canvasElement =
      document.getElementById(
        'coursesChart'
      );


    if (
      !(canvasElement instanceof HTMLCanvasElement)
    ) {

      return;

    }


    if (this.doughnutChart) {

      this.doughnutChart.destroy();

    }


    this.doughnutChart =
      new Chart(
        canvasElement,
        {

          type: 'doughnut',

          data: {

            labels: [

              'Tech',
              'Business',
              'Design',
              'Other'

            ],

            datasets: [

              {

                data: [

                  35,
                  18,
                  11,
                  8

                ],

                backgroundColor: [

                  '#11157a',
                  '#4d55b8',
                  '#777ed0',
                  '#d7dbea'

                ],

                borderWidth: 0,

                hoverOffset: 5

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: '68%',

            plugins: {

              legend: {

                display: false

              }

            }

          }

        }
      );

  }


  // =======================================================
  // BAR CHART
  // =======================================================

  createBarChart(): void {

    const canvasElement =
      document.getElementById(
        'statusChart'
      );


    if (
      !(canvasElement instanceof HTMLCanvasElement)
    ) {

      return;

    }


    if (this.barChart) {

      this.barChart.destroy();

    }


    this.barChart =
      new Chart(
        canvasElement,
        {

          type: 'bar',

          data: {

            labels: [

              'Active',
              'Completed',
              'Dropped'

            ],

            datasets: [

              {

                label: 'Enrollments',

                data: [

                  this.activeEnrollments,
                  this.completedEnrollments,
                  this.droppedEnrollments

                ],

                backgroundColor: [

                  '#11157a',
                  '#2f8635',
                  '#c91f1f'

                ],

                borderRadius: 2,

                barPercentage: 0.7

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                display: false

              }

            },

            scales: {

              y: {

                beginAtZero: true,

                display: false

              },

              x: {

                grid: {

                  display: false

                },

                ticks: {

                  color: '#555',

                  font: {

                    size: 11

                  }

                }

              }

            }

          }

        }
      );

  }


  // =======================================================
  // UPDATE BAR CHART
  // =======================================================

  private updateBarChart(): void {

    if (!this.barChart) {

      return;

    }


    this.barChart.data.datasets[0].data = [

      this.activeEnrollments,

      this.completedEnrollments,

      this.droppedEnrollments

    ];


    this.barChart.update();

  }


  // =======================================================
  // ADD STUDENT
  // =======================================================

  goToAddStudent(): void {

    this.router.navigate([
      '/add-student'
    ]);

  }


  // =======================================================
  // ADD COURSE
  // =======================================================

  goToCourses(): void {

    this.router.navigate([
      '/courses/add'
    ]);

  }


  // =======================================================
  // STUDENTS
  // =======================================================

  goToStudents(): void {

    this.router.navigate([
      '/students'
    ]);

  }


  // =======================================================
  // INSTRUCTORS
  // =======================================================

  goToInstructors(): void {

    this.router.navigate([
      '/instructors'
    ]);

  }


  // =======================================================
  // ENROLLMENTS
  // =======================================================

  goToEnrollments(): void {

    this.router.navigate([
      '/enrollments'
    ]);

  }


  // =======================================================
  // LOGOUT
  // =======================================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('studentId');

    localStorage.removeItem('username');

    localStorage.removeItem('role');


    this.router.navigate([
      '/login'
    ]);

  }


  // =======================================================
  // DESTROY
  // =======================================================

  ngOnDestroy(): void {

    if (this.lineChart) {

      this.lineChart.destroy();

    }


    if (this.doughnutChart) {

      this.doughnutChart.destroy();

    }


    if (this.barChart) {

      this.barChart.destroy();

    }

  }

}