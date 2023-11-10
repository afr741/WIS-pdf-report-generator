import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthService';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ButtonSize,
  ButtonRounded,
  ButtonFillMode,
  ButtonThemeColor,
} from '@progress/kendo-angular-buttons';

export type Option = {
  type: string;
  data: string[];
  default: ButtonSize | ButtonRounded | ButtonFillMode | ButtonThemeColor;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public error: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {}

  public registerForm: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    error: new FormControl(''),
  });

  public async onSignIn() {
    this.registerForm.markAllAsTouched();
    const { email, password, error, code } = this.registerForm.value;
    console.log(email, password, error, code);

    try {
      if (email && password) {
        const user = await this.authService.login(
          String(email),
          String(password)
        );
        console.log(user);
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          return this.router.navigate(['/reset']);
        } else {
          return this.router.navigate(['upload']);
        }
      } else {
        this.error = "email or password can't be empty";
      }
    } catch (error: any) {
      if (error.code == 'UserNotConfirmedException') {
        this.error = 'Validate your email Id';
      }
      if (error.code == 'UserNotFoundException') {
        this.error = error.message;
      }
      this.error = error.message;
      console.log(error);
    }
    return null;
  }
}
