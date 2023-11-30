import { Component, OnInit } from '@angular/core';

import { AuthService } from './AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'authdemo';
  public isAuthenticated: boolean = false;

  email: string | null = null;
  password: string | null = null;
  userName: string | null = null;
  mobile?: number | null = null;
  error?: string | null = null;
  code?: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('is authenticated', this.isAuthenticated);
  }
}
