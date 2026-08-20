import { NgModule } from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';


// =========================================
// Authentication
// =========================================

import { LoginComponent } from './pages/login/login.component';

import { RegisterComponent } from './pages/register/register.component';


// =========================================
// Admin Dashboard
// =========================================

import { DashboardComponent } from './pages/dashboard/dashboard.component';


// =========================================
// Student Dashboard
// =========================================

import { StudentDashboardComponent }
  from './pages/student-dashboard/student-dashboard.component';


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
// =========================================

import { InstructorsComponent }
  from './pages/instructors/instructors.component';


// =========================================
// Enrollments
// =========================================

import { EnrollmentsComponent }
  from './pages/enrollments/enrollments.component';


// =========================================
// Add Student
// =========================================

import { AddStudentComponent }
  from './pages/add-student/add-student.component';


// =========================================
// Auth Guard
// =========================================

import { AuthGuard } from '../guards/auth.guard';



const routes: Routes = [

  // =========================================
  // Default Route
  // =========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // =========================================
  // Authentication
  // =========================================

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },


  // =========================================
  // Admin Dashboard
  // =========================================

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Admin']
    }
  },


  // =========================================
  // Student Dashboard
  // Student + Admin
  // =========================================

  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Student', 'Admin']
    }
  },


  // =========================================
  // Add Student
  // Admin Only
  // =========================================

  {
    path: 'add-student',
    component: AddStudentComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Admin']
    }
  },


  // =========================================
  // Courses
  // Student + Admin
  // =========================================

  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Student', 'Admin']
    }
  },


  // =========================================
  // Add Course
  // Admin Only
  // =========================================

  {
    path: 'courses/add',
    component: AddCourseComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Admin']
    }
  },


  // =========================================
  // Edit Course
  // Admin Only
  // =========================================

  {
    path: 'courses/edit/:id',
    component: EditCourseComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Admin']
    }
  },


  // =========================================
  // Instructors
  // Admin Only
  // =========================================

  {
    path: 'instructors',
    component: InstructorsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Admin']
    }
  },


  // =========================================
  // Enrollments
  // Student + Admin
  // =========================================

  {
    path: 'enrollments',
    component: EnrollmentsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Student', 'Admin']
    }
  },


  // =========================================
  // Unknown Route
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

export class AppRoutingModule { }