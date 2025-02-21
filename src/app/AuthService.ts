import { Observable, catchError, from, switchMap, throwError } from 'rxjs';

import { Auth } from 'aws-amplify';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthService {
  private decodedToken: any | null;
  private user: any;
  //TBD make jwt work, currently using local storage
  public async login(email: string, password: string) {
    const user = await Auth.signIn(String(email), String(password));
    this.user = user;
    try {
      console.log(user.signInUserSession);
      let decoded = jwtDecode(user.signInUserSession.idToken.jwtToken);
      const JWTvalue = user.signInUserSession.getAccessToken().getJwtToken();
      this.decodedToken = decoded;
      //temp workaround for persistence
      localStorage.setItem('expiry', this.getExpiryTime());
      localStorage.setItem('id_token', JWTvalue);
    } catch (error) {
      console.log(error);
    }

    return user;
  }

  public async onreset(password: string) {
    let resetmessage = '';
    await Auth.completeNewPassword(this.user, password, {})
      .then(() => {
        // this.message = 'Password updated successfully.';
        console.log('Password updated successfully.');
        resetmessage = 'success';
      })
      .catch((error) => {
        console.log(error);
        resetmessage = error.message;
      });
    return resetmessage;
  }

  getExpiryTime() {
    return this.decodedToken && this.decodedToken.exp
      ? this.decodedToken.exp
      : //temp workaround for persistence
        localStorage.getItem('expiry') || null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = this.getExpiryTime();
    if (expiryTime) {
      var d = new Date(expiryTime * 1000); // The 0 there is the key, which sets the date to the epoch
      console.log('current time:', new Date().getTime(), 'expiryTime :' + d);
      return d.getTime() - new Date().getTime() < 5000;
    } else {
      return true;
    }
  }

  public isAuthenticated(): boolean {
    return Auth.currentAuthenticatedUser() !== null;
  }
  public async getUserEmailAndLab() {
    const emailAndLab = await Auth.currentAuthenticatedUser().then(
      (userInfo: any) => {
        return {
          email: userInfo.signInUserSession.idToken.payload.email,
          userGroup:
            userInfo.signInUserSession.accessToken.payload['cognito:groups'],
        };
      }
    );
    return emailAndLab;
  }

  public async getCurrentUserInfo() {
    return Auth.currentAuthenticatedUser();
  }
  public async onSignOut() {
    localStorage.removeItem('id_token');
    //temp workaround for persistence
    localStorage.removeItem('expiry');
    this.decodedToken = null;
    await Auth.signOut();
  }
}
