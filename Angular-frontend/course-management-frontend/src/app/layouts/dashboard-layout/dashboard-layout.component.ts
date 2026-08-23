import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {

  username: string = '';
  userRole: string = '';
  userInitial: string = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadUser();

  }


  // =========================================
  // LOAD USER FROM JWT
  // =========================================

  loadUser(): void {

    const token = localStorage.getItem('token');

    if (!token) {

      this.router.navigate(['/login']);

      return;

    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );


      // =====================================
      // USERNAME
      // =====================================

      this.username =
        payload.unique_name ||
        payload.name ||
        payload.sub ||
        'User';


      // =====================================
      // ROLE
      // =====================================

      this.userRole =
        payload.role ||
        payload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ||
        '';


      // =====================================
      // INITIAL
      // =====================================

      this.userInitial =
        this.username
          .charAt(0)
          .toUpperCase();


      console.log('Username:', this.username);
      console.log('Role:', this.userRole);

    } catch (error) {

      console.error(
        'Error reading JWT token:',
        error
      );

      localStorage.removeItem('token');

      this.router.navigate(['/login']);

    }

  }


  // =========================================
  // LOGOUT
  // =========================================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

}