import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Course {
  name: string;
  instructor: string;
  students: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  // =========================
  // User Information
  // =========================

  username: string = 'Admin';

  // =========================
  // Dashboard Statistics
  // =========================

  totalStudents: number = 120;

  totalCourses: number = 15;

  totalInstructors: number = 8;

  totalEnrollments: number = 245;


  // =========================
  // Recent Courses
  // =========================

  recentCourses: Course[] = [
    {
      name: 'Web Development',
      instructor: 'Ahmed Ali',
      students: 35,
      status: 'Active'
    },
    {
      name: 'Database Management',
      instructor: 'Fatma Saif',
      students: 28,
      status: 'Active'
    },
    {
      name: 'C# Programming',
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


  // =========================
  // Constructor
  // =========================

  constructor(private router: Router) {}


  // =========================
  // User Initial
  // =========================

  get userInitial(): string {

    return this.username
      ? this.username.charAt(0).toUpperCase()
      : 'A';

  }


  // =========================
  // Logout
  // =========================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

}