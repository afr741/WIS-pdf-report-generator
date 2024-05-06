import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './AuthService';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(' canActivate state', state);

    if (state.url === '/qrcode') {
      return true; // Allow access without authentication
    }
    if (!this.authService.isTokenExpired()) return true;
    else return this.router.navigate(['/login']);
  }
}
