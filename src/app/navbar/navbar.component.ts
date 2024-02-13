import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';
import { APIService, Report } from '../API.service';
import { bellIcon, menuIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { ZenObservable } from 'zen-observable-ts';

// const logo = require('../../assets/images/wis-logo.jpeg').default as string;
import { UserPreferencesService } from '../UserPreferencesService';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  public menuIcon: SVGIcon = menuIcon;
  public bellIcon: SVGIcon = bellIcon;
  public isAdmin: boolean = true;
  public isPreferenceSet: boolean = false;
  public isModalOpen: boolean = false;
  public userCategory: string = '';
  public userEmail: string = '';
  public selectedCountry: string = '';
  public selectedLab: string = '';
  public userList: any = [];
  private createUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;
  private modifyUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;

  public userId: string = '';

  // public wisLogo: any = logo;
  public kendokaAvatar =
    'https://www.telerik.com/kendo-angular-ui-develop/components/navigation/appbar/assets/kendoka-angular.png';

  public lab = ['Dushanbe', 'Bokhtar', 'Khujand'];
  public country = ['Tajikistan', 'India', 'Vietnam'];

  constructor(
    private authService: AuthService,
    private userPreferenceService: UserPreferencesService,
    private router: Router,
    private api: APIService
  ) {}

  public async ngOnInit() {
    this.createUserPreferenceSubscription = this.api
      .OnCreateUserInfoListener()
      .subscribe((user: any) => {
        const newUser = user.value.data.onCreateUserInfo;
        this.userList = [newUser];
        // console.log('userList create ng init', this.userList);
      });

    this.modifyUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.userList = [updatedUser];
        // console.log('userList update ng init', this.userList);
      });

    await this.api.ListUserInfos().then((user: any) => {
      if (user.items.length > 0) {
        this.isPreferenceSet = true;
        console.log('user list', user);
        this.userList = user.items;
        this.userId = user.items[0]?.id;
        this.selectedCountry = user.items[0]?.countryCode;
        this.selectedLab = user.items[0]?.labLocation;
      } else {
        this.openModal();
      }
    });

    const emailAndLab = await this.authService.getUserEmailAndLab();
    this.userEmail = emailAndLab.email;
    this.userCategory = emailAndLab.userGroup;
    // console.log('email and lab', emailAndLab);
  }

  ngOnDestroy() {
    if (this.createUserPreferenceSubscription) {
      this.createUserPreferenceSubscription.unsubscribe();
    }
    this.createUserPreferenceSubscription = null;

    if (this.modifyUserPreferenceSubscription) {
      this.modifyUserPreferenceSubscription.unsubscribe();
    }
    this.modifyUserPreferenceSubscription = null;
  }
  async handleLogOut() {
    await this.authService
      .onSignOut()
      .then(() => this.router.navigate(['/login']));
  }

  handleNav(routeName: string) {
    this.router.navigate([`/${routeName}`]);
  }

  public createUserPreference() {
    this.api.CreateUserInfo({
      labLocation: this.selectedLab,
      countryCode: this.selectedCountry,
    });
    this.isPreferenceSet = true;
  }

  public updateUserPreference() {
    if (
      this.userList[0].countryCode !== this.selectedCountry ||
      this.userList[0].labLocation !== this.selectedLab
    ) {
      this.api.UpdateUserInfo({
        id: this.userId,
        labLocation: this.selectedLab,
        countryCode: this.selectedCountry,
      });
    }
  }

  public closeModal(): void {
    if (this.selectedLab !== '' && this.selectedCountry !== '') {
      if (this.userList.length === 0) {
        this.createUserPreference();
      } else {
        this.updateUserPreference();
      }
      this.isModalOpen = false;
    } else {
      this.isModalOpen = true;
    }
  }

  public openModal(): void {
    this.isModalOpen = true;
  }

  public labValueChange(value: any): void {
    console.log('lab valueChange', value);
    this.selectedLab = value;
  }
  public countryValueChange(value: any): void {
    console.log('counttry valueChange', value);
    this.selectedCountry = value;
  }
}
