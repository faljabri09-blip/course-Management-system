import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';

import { Router } from '@angular/router';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


// =========================================
// Course Interface
// =========================================

interface Course {

  name: string;

  instructor: string;

  students: number;

  status: 'Active' | 'Inactive';

}


// =========================================
// Enrollment Interface
// =========================================

interface Enrollment {

  student: string;

  course: string;

  date: string;

  status: 'Active' | 'Completed' | 'Dropped';

  grade: string;

}


// =========================================
// Component
// =========================================

@Component({

  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']

})


export class DashboardComponent
  implements AfterViewInit, OnDestroy {


  // =========================================
  // Admin Information
  // =========================================

  username: string = 'Admin';


  // =========================================
  // Dashboard Statistics
  // =========================================

  totalStudents: number = 1250;

  totalInstructors: number = 48;

  totalCourses: number = 72;

  totalEnrollments: number = 3420;


  // =========================================
  // Recent Courses
  // =========================================

  recentCourses: Course[] = [

    {

      name: 'C# Programming',

      instructor: 'Fatma Aljabri',

      students: 35,

      status: 'Active'

    },

    {

      name: 'Database Management',

      instructor: 'Ahmed Ali',

      students: 28,

      status: 'Active'

    },

    {

      name: 'ASP.NET Core',

      instructor: 'Mohammed Said',

      students: 31,

      status: 'Active'

    },

    {

      name: 'Angular Development',

      instructor: 'Sara Ahmed',

      students: 24,

      status: 'Inactive'

    }

  ];


  // =========================================
  // Recent Enrollments
  // =========================================

  recentEnrollments: Enrollment[] = [

    {

      student: 'Fatma Aljabri',

      course: 'C# Programming',

      date: '16 Aug, 2026',

      status: 'Active',

      grade: '-'

    },

    {

      student: 'Fatma Al Mamari',

      course: 'Database',

      date: '15 Aug, 2026',

      status: 'Completed',

      grade: 'A'

    },

    {

      student: 'Maha Rashid',

      course: 'ASP.NET',

      date: '10 Aug, 2026',

      status: 'Active',

      grade: '-'

    }

  ];


  // =========================================
  // Charts
  // =========================================

  private lineChart: Chart | undefined;

  private doughnutChart: Chart | undefined;

  private barChart: Chart | undefined;


  // =========================================
  // Constructor
  // =========================================

  constructor(
    private router: Router
  ) {}


  // =========================================
  // User Initial
  // =========================================

  get userInitial(): string {

    if (
      this.username &&
      this.username.length > 0
    ) {

      return this.username
        .charAt(0)
        .toUpperCase();

    }

    return 'A';

  }


  // =========================================
  // After View Init
  // =========================================

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.createLineChart();

      this.createDoughnutChart();

      this.createBarChart();

    }, 0);

  }


  // =========================================
  // Enrollment Line Chart
  // =========================================

  createLineChart(): void {

    const canvasElement =
      document.getElementById('enrollmentChart');


    if (
      !(canvasElement instanceof HTMLCanvasElement)
    ) {

      return;

    }


    this.lineChart = new Chart(

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


              borderColor: '#11157a',


              backgroundColor:
                'rgba(17, 21, 122, 0.12)',


              borderWidth: 4,


              pointRadius: 6,


              pointHoverRadius: 8,


              pointBackgroundColor: '#ffffff',


              pointBorderColor: '#11157a',


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

                color: '#d9dcec'

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


  // =========================================
  // Courses Doughnut Chart
  // =========================================

  createDoughnutChart(): void {

    const canvasElement =
      document.getElementById('coursesChart');


    if (
      !(canvasElement instanceof HTMLCanvasElement)
    ) {

      return;

    }


    this.doughnutChart = new Chart(

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


  // =========================================
  // Enrollment Status Bar Chart
  // =========================================

  createBarChart(): void {

    const canvasElement =
      document.getElementById('statusChart');


    if (
      !(canvasElement instanceof HTMLCanvasElement)
    ) {

      return;

    }


    this.barChart = new Chart(

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

                50,

                30,

                10

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


  // =========================================
  // Navigation - Add Student
  // =========================================
  //
  // This button is used by the ADMIN
  // to open the Add Student page.
  //
  // Route:
  // /add-student
  // =========================================

  goToAddStudent(): void {

    this.router.navigate([
      '/add-student'
    ]);

  }


  // =========================================
  // Navigation - Courses
  // =========================================

  goToCourses(): void {

    this.router.navigate([
      '/courses'
    ]);

  }


  // =========================================
  // Navigation - Students
  // =========================================
  //
  // This method is kept in the project
  // in case another part of the dashboard
  // uses it.
  // =========================================

  goToStudents(): void {

    this.router.navigate([
      '/student-dashboard'
    ]);

  }


  // =========================================
  // Navigation - Instructors
  // =========================================

  goToInstructors(): void {

    this.router.navigate([
      '/instructors'
    ]);

  }


  // =========================================
  // Navigation - Enrollments
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

    localStorage.removeItem('token');

    localStorage.removeItem('studentId');

    localStorage.removeItem('username');

    this.router.navigate([
      '/login'
    ]);

  }


  // =========================================
  // Destroy Charts
  // =========================================

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