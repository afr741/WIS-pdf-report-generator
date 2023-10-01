import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    public amplifyService: AuthenticatorService,
    public router: Router
  ) {
    this.amplifyService = amplifyService;
    amplifyService.subscribe((data: any) => {
      if (data.authStatus === 'authenticated') {
        this.router.navigate(['/upload']);
      }
    });
  }

  ngOnInit(): void {}
}
