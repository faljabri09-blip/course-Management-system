import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { AddCourseComponent } from './pages/add-course/add-course.component';
import { EditCourseComponent } from './pages/edit-course/edit-course.component';
import { StudentsComponent } from './pages/students/students.component';
import { InstructorsComponent } from './pages/instructors/instructors.component';
import { EnrollmentsComponent } from './pages/enrollments/enrollments.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [

  // ================================
  // Default Route
  // ================================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ================================
  // Authentication
  // ================================
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  // ================================
  // Dashboard
  // ================================
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // ================================
  // Courses
  // ================================
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'courses/add',
    component: AddCourseComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'courses/edit/:id',
    component: EditCourseComponent,
    canActivate: [AuthGuard]
  },

  // ================================
  // Students
  // ================================
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [AuthGuard]
  },

  // ================================
  // Instructors
  // ================================
  {
    path: 'instructors',
    component: InstructorsComponent,
    canActivate: [AuthGuard]
  },

  // ================================
  // Enrollments
  // ================================
  {
    path: 'enrollments',
    component: EnrollmentsComponent,
    canActivate: [AuthGuard]
  },

  // ================================
  // Unknown Route
  // ================================
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