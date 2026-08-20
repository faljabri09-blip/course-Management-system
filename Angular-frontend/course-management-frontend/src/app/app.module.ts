import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
// Courses
// =========================================

import { CoursesComponent } from './pages/courses/courses.component';
import { AddCourseComponent } from './pages/add-course/add-course.component';
import { EditCourseComponent } from './pages/edit-course/edit-course.component';


// =========================================
// Instructors
// =========================================

import { InstructorsComponent } from './pages/instructors/instructors.component';


// =========================================
// Enrollments
// =========================================

import { EnrollmentsComponent } from './pages/enrollments/enrollments.component';


// =========================================
// Student
// =========================================

import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';

import { AvailableCoursesComponent } from './pages/available-courses/available-courses.component';

import { MyEnrollmentsComponent } from './pages/my-enrollments/my-enrollments.component';

import { AddStudentComponent } from './pages/add-student/add-student.component';


// =========================================
// Interceptor
// =========================================

import { AuthInterceptor } from './interceptors/auth.interceptor';



@NgModule({

  // =========================================
  // Components
  // =========================================

  declarations: [

    AppComponent,

    // Authentication
    LoginComponent,
    RegisterComponent,

    // Admin Dashboard
    DashboardComponent,

    // Courses
    CoursesComponent,
    AddCourseComponent,
    EditCourseComponent,

    // Instructors
    InstructorsComponent,

    // Enrollments
    EnrollmentsComponent,

    // Student
    StudentDashboardComponent,
    AvailableCoursesComponent,
    MyEnrollmentsComponent,
    AddStudentComponent

  ],


  // =========================================
  // Modules
  // =========================================

  imports: [

    BrowserModule,

    AppRoutingModule,

    FormsModule,

    HttpClientModule

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

export class AppModule { }