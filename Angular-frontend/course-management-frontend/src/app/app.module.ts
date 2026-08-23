import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


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

import {
  StudentDashboardComponent
} from './pages/student-dashboard/student-dashboard.component';


// =========================================
// Instructor Dashboard
// Instructor Only
// =========================================

import {
  InstructorDashboardComponent
} from './pages/instructor-dashboard/instructor-dashboard.component';


// =========================================
// Courses
// =========================================

import {
  CoursesComponent
} from './pages/courses/courses.component';

import {
  AddCourseComponent
} from './pages/add-course/add-course.component';

import {
  EditCourseComponent
} from './pages/edit-course/edit-course.component';


// =========================================
// Enrollments
// =========================================

import {
  EnrollmentsComponent
} from './pages/enrollments/enrollments.component';


// =========================================
// Student Pages
// =========================================

import {
  AvailableCoursesComponent
} from './pages/available-courses/available-courses.component';

import {
  MyEnrollmentsComponent
} from './pages/my-enrollments/my-enrollments.component';

import {
  AddStudentComponent
} from './pages/add-student/add-student.component';


// =========================================
// Interceptor
// =========================================

import {
  AuthInterceptor
} from './interceptors/auth.interceptor';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { InstructorsComponent } from './pages/instructors/instructors.component';


@NgModule({

  // =========================================
  // Components
  // =========================================

  declarations: [

    // Main
    AppComponent,


    // =======================================
    // Authentication
    // =======================================

    LoginComponent,
    RegisterComponent,


    // =======================================
    // Admin Dashboard
    // =======================================

    DashboardComponent,


    // =======================================
    // Student Dashboard
    // =======================================

    StudentDashboardComponent,


    // =======================================
    // Instructor Dashboard
    // =======================================

    InstructorDashboardComponent,


    // =======================================
    // Courses
    // =======================================

    CoursesComponent,
    AddCourseComponent,
    EditCourseComponent,


    // =======================================
    // Enrollments
    // =======================================

    EnrollmentsComponent,


    // =======================================
    // Student Pages
    // =======================================

    AvailableCoursesComponent,
    MyEnrollmentsComponent,
    AddStudentComponent,
    DashboardLayoutComponent,
    InstructorsComponent

  ],


  // =========================================
  // Modules
  // =========================================

  imports: [

    BrowserModule,

    CommonModule,

    FormsModule,

    HttpClientModule,

    AppRoutingModule

  ],


  // =========================================
  // Providers
  // =========================================

  providers: [

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],


  // =========================================
  // Bootstrap
  // =========================================

  bootstrap: [

    AppComponent

  ]

})

export class AppModule {

}