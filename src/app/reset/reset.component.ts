import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../AuthService';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  title = 'resetPassword';
  email: string | null = null;
  password: string | null = null;
  confirmPassword: string | null = null;
  error?: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {}

  public async OnConfirm() {
    if (this.password && this.password === this.confirmPassword) {
      const response = await this.authService.onreset(this.password);
      console.log('response', response);
      if (response == 'success') {
        return this.router.navigate(['login']);
      } else {
        this.error = response;
        // return this.router.navigate(['upload']);
      }
    } else {
      this.error = 'Passwords do not match';
    }
    return null;
  }
}
