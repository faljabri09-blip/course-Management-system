import { NgModule } from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';


// =========================================
// Authentication
// =========================================

import { LoginComponent }
  from './pages/login/login.component';

import { RegisterComponent }
  from './pages/register/register.component';


// =========================================
// Dashboard Layout
// =========================================

import { DashboardLayoutComponent }
  from './layouts/dashboard-layout/dashboard-layout.component';


// =========================================
// Dashboards
// =========================================

import { DashboardComponent }
  from './pages/dashboard/dashboard.component';

import { StudentDashboardComponent }
  from './pages/student-dashboard/student-dashboard.component';

import { InstructorDashboardComponent }
  from './pages/instructor-dashboard/instructor-dashboard.component';


// =========================================
// Instructor Students
// =========================================

import { InstructorStudentsComponent }
  from './pages/instructor-students/instructor-students.component';


// =========================================
// Courses
// =========================================

import { CoursesComponent }
  from './pages/courses/courses.component';

import { AddCourseComponent }
  from './pages/add-course/add-course.component';

import { EditCourseComponent }
  from './pages/edit-course/edit-course.component';


// =========================================
// Instructors
// Admin Instructors Page
// =========================================

import { InstructorsComponent }
  from './pages/instructors/instructors.component';


// =========================================
// Enrollments
// =========================================

import { EnrollmentsComponent }
  from './pages/enrollments/enrollments.component';


// =========================================
// Students
// =========================================

import { AddStudentComponent }
  from './pages/add-student/add-student.component';


// =========================================
// Auth Guard
// =========================================

import { AuthGuard }
  from '../guards/auth.guard';


// =========================================
// Routes
// =========================================

const routes: Routes = [

  // =========================================
  // DEFAULT
  // =========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // =========================================
  // LOGIN
  // =========================================

  {
    path: 'login',
    component: LoginComponent
  },


  // =========================================
  // REGISTER
  // =========================================

  {
    path: 'register',
    component: RegisterComponent
  },


  // =========================================
  // DASHBOARD LAYOUT
  // =========================================

  {
    path: '',
    component: DashboardLayoutComponent,

    children: [

      // =====================================
      // ADMIN DASHBOARD
      // =====================================

      {
        path: 'dashboard',

        component: DashboardComponent,

        canActivate: [AuthGuard],

        data: {
          roles: ['Admin']
        }
      },


      // =====================================
      // STUDENT DASHBOARD
      // =====================================

      {
        path: 'student-dashboard',

        component: StudentDashboardComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Student',
            'Admin',
            'Instructor'
          ]
        }
      },


      // =====================================
      // INSTRUCTOR DASHBOARD
      // =====================================

      {
        path: 'instructor-dashboard',

        component: InstructorDashboardComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Admin',
            'Instructor'
          ]
        }
      },


      // =====================================
      // INSTRUCTOR → MY STUDENTS
      // =====================================

      {
        path: 'instructor-students',

        component: InstructorStudentsComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Admin',
            'Instructor'
          ]
        }
      },


      // =====================================
      // ADMIN → INSTRUCTORS
      // =====================================

      {
        path: 'instructors',

        component: InstructorsComponent,

        canActivate: [AuthGuard],

        data: {
          roles: ['Admin']
        }
      },


      // =====================================
      // ADD STUDENT
      // =====================================

      {
        path: 'add-student',

        component: AddStudentComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Admin',
            'Instructor'
          ]
        }
      },


      // =====================================
      // COURSES
      // =====================================

      {
        path: 'courses',

        component: CoursesComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Student',
            'Admin',
            'Instructor'
          ]
        }
      },


      // =====================================
      // ADD COURSE
      // =====================================

      {
        path: 'courses/add',

        component: AddCourseComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Admin'
          ]
        }
      },


      // =====================================
      // EDIT COURSE
      // =====================================

      {
        path: 'courses/edit/:id',

        component: EditCourseComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Admin',
            'Instructor'
          ]
        }
      },


      // =====================================
      // ENROLLMENTS
      // =====================================

      {
        path: 'enrollments',

        component: EnrollmentsComponent,

        canActivate: [AuthGuard],

        data: {
          roles: [
            'Student',
            'Admin',
            'Instructor'
          ]
        }
      }

    ]
  },


  // =========================================
  // UNKNOWN ROUTE
  // =========================================

  {
    path: '**',
    redirectTo: 'login'
  }

];


@NgModule({

  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ]

})
export class AppRoutingModule {}