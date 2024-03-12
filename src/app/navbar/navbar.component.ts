import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../AuthService';
import { Router, NavigationEnd } from '@angular/router';
import { APIService, Report } from '../API.service';
import { bellIcon, menuIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { ZenObservable } from 'zen-observable-ts';
import { Storage } from 'aws-amplify';

// const logo = require('../../assets/images/wis-logo.jpeg').default as string;
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
  public selectedLab: string = '';
  public selectedHviVersion: string = '';
  public userList: any = [];
  private createUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;
  private modifyUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;

  public userId: string = '';
  public isManagerUp: boolean = false;

  // public wisLogo: any = logo;
  public kendokaAvatar =
    'https://www.telerik.com/kendo-angular-ui-develop/components/navigation/appbar/assets/kendoka-angular.png';
  public sectionName: any = '';
  public wislogo: any;
  public lab = ['Dushanbe', 'Bokhtar', 'Khujand'];
  // public country = ['Tajikistan', 'India', 'Vietnam'];
  public hviVersions = ['v1', 'v2', 'v3'];
  constructor(
    private authService: AuthService,
    private router: Router,
    private api: APIService
  ) {}

  public async ngOnInit() {
    this.wislogo = await Storage.get('wis.jpg');

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let navUrl = event.url.split('/')[1];
        switch (navUrl) {
          case '':
            this.sectionName = 'Upload section';
            break;
          case 'upload':
            this.sectionName = 'Upload section';
            break;
          case 'pdf':
            this.sectionName = 'Generated Reports';
            break;
          case 'edit':
            this.sectionName = 'Edit Template';
            break;
          case 'qrcode':
            this.sectionName = 'QrCode Section';
            break;
          default:
            this.sectionName = '';
            break;
        }
      }
    });

    this.createUserPreferenceSubscription = this.api
      .OnCreateUserInfoListener()
      .subscribe((user: any) => {
        const newUser = user.value.data.onCreateUserInfo;
        this.userList = [newUser];
        // console.log('userList create ng init', this.userList);
      });

    this.authService.getUserEmailAndLab().then((res) => {
      console.log('user lab', res);
      this.isManagerUp = res.userGroup.includes('managers');
    });
    this.modifyUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.userList = [updatedUser];
        console.log('userList subscription', this.userList);
      });

    await this.api.ListUserInfos().then((user: any) => {
      console.log('user list', user);

      if (user.items.length > 0) {
        this.isPreferenceSet = true;
        this.userList = user.items;
        this.userId = user.items[0]?.id;
        this.selectedLab = user.items[0]?.labLocation;
        this.selectedHviVersion = user.items[0]?.hviVersion;
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
  handleEditNav() {
    this.router.navigate(['/edit']);
  }
  handlePdfNav() {
    this.router.navigate(['/pdf']);
  }
  handleUploadNav() {
    this.router.navigate(['/upload']);
  }

  public createUserPreference() {
    this.api.CreateUserInfo({
      labLocation: this.selectedLab,
      hviVersion: this.selectedHviVersion,
    });
    this.isPreferenceSet = true;
  }

  public updateUserPreference() {
    if (
      this.userList[0].labLocation !== this.selectedLab ||
      this.userList[0].hviVersion !== this.selectedHviVersion
    ) {
      this.api.UpdateUserInfo({
        id: this.userId,
        labLocation: this.selectedLab,
        hviVersion: this.selectedHviVersion,
      });
    }
  }

  public closeModal(): void {
    if (this.selectedLab !== '') {
      if (this.userList.length === 0) {
        this.createUserPreference();
      } else {
        this.updateUserPreference();
        console.log('PROFILE IS UPDATED!');
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
  // public countryValueChange(value: any): void {
  //   console.log('counttry valueChange', value);
  //   this.selectedCountry = value;
  // }
  public hviValueChange(value: any): void {
    console.log('hvi valueChange', value);
    this.selectedHviVersion = value;
  }
}
