import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// type CountryOptions = 'TJK' | 'IND' | 'VTNM';
// type LabOptions = 'TJK-1' | 'TJK-2' | 'TJK-3';

@Injectable()
export class UserPreferencesService {
  private _userLab = new BehaviorSubject('Dushanbe');
  private _userCountry = new BehaviorSubject('TJK');
  getUserLab = this._userLab.asObservable();
  getUserCountry = this._userCountry.asObservable();

  public setUserLab(userLab: any) {
    this._userLab.next = userLab;
  }

  public setUserCountry(country: any) {
    this._userCountry.next = country;
  }
}
