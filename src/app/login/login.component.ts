import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthService';
import { Auth } from 'aws-amplify';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ButtonSize,
  ButtonRounded,
  ButtonFillMode,
  ButtonThemeColor,
} from '@progress/kendo-angular-buttons';

import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

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
  public isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    Auth.currentAuthenticatedUser()
      .then(() => {
        return this.router.navigate(['/upload']);
      })
      .catch(() => console.log('Not signed in'));
  }

  public registerForm: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    error: new FormControl(''),
  });

  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };
  onKeyDown(pressedKey: any) {
    if (pressedKey.key === 'Enter') {
      this.onSignIn();
    }
  }

  public async onSignIn() {
    this.registerForm.markAllAsTouched();
    const { email, password, error, code } = this.registerForm.value;
    console.log(email, password, error, code);
    this.isLoading = true;
    try {
      if (email && password) {
        const user = await this.authService.login(
          String(email),
          String(password)
        );
        let userGroupList = await this.authService
          .getUserEmailAndLab()
          .then((userInfo) => userInfo.userGroup);
        console.log('user', userGroupList);
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          return this.router.navigate(['/reset']);
        } else {
          if (userGroupList.includes('managers')) {
            return this.router.navigate(['edit']);
          } else if (userGroupList.includes('admins')) {
            return this.router.navigate(['pdf']);
          } else {
            return this.router.navigate(['upload']);
          }
        }
      } else {
        this.isLoading = false;
        this.error = "email or password can't be empty";
      }
    } catch (error: any) {
      this.isLoading = false;
      if (error.code == 'UserNotConfirmedException') {
        this.error = 'Validate your email Id';
      }
      if (error.code == 'UserNotFoundException') {
        this.error = error.message;
      }
      this.error = error;
      console.log(error);
    }
    return null;
  }
}
