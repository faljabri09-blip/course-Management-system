import { Injectable } from '@angular/core';

import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

import { AuthService }
  from '../app/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean {

    // ================================
    // Check Token
    // ================================

    const token = this.authService.getToken();

    if (!token) {

      this.router.navigate(['/login']);

      return false;
    }


    // ================================
    // Get User Role
    // ================================

    const userRole =
      this.authService.getRole();


    // ================================
    // Get Allowed Roles
    // ================================

    const allowedRoles =
      route.data['roles'] as string[];


    // ================================
    // No Role Restriction
    // ================================

    if (
      !allowedRoles ||
      allowedRoles.length === 0
    ) {

      return true;
    }


    // ================================
    // Normalize Role
    // ================================

    const normalizedUserRole =
      userRole.trim().toLowerCase();


    const normalizedAllowedRoles =
      allowedRoles.map(
        role => role.trim().toLowerCase()
      );


    // ================================
    // Check Permission
    // ================================

    if (
      normalizedAllowedRoles.includes(
        normalizedUserRole
      )
    ) {

      return true;
    }


    // ================================
    // No Permission
    // ================================

    this.redirectByRole(
      normalizedUserRole
    );

    return false;
  }


  // ================================
  // Redirect By Role
  // ================================

  private redirectByRole(
    role: string
  ): void {

    switch (role) {

      case 'admin':

        this.router.navigate([
          '/dashboard'
        ]);

        break;


      case 'instructor':

        this.router.navigate([
          '/instructor-dashboard'
        ]);

        break;


      case 'student':

        this.router.navigate([
          '/student-dashboard'
        ]);

        break;


      default:

        this.authService.logout();

        this.router.navigate([
          '/login'
        ]);

        break;
    }
  }
}