import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from './AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'authdemo';
  public shouldRenderLogout: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        if (currentRoute === '/login' || currentRoute.startsWith('/qrcode')) {
          this.shouldRenderLogout = false;
        } else {
          this.shouldRenderLogout = true;
        }
      }
    });
  }
  async handleLogOut() {
    await this.authService
      .onSignOut()
      .then(() => this.router.navigate(['/login']));
  }
}
