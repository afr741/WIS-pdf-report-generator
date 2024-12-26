import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SVGIcon, bellIcon, menuIcon } from '@progress/kendo-svg-icons';

import { APIService } from '../API.service';
import { AuthService } from '../AuthService';
import { ZenObservable } from 'zen-observable-ts';
import { routeData } from '../configs/locationCofigs';

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
  public kendokaAvatar: any =
    'https://www.telerik.com/kendo-angular-ui-develop/components/navigation/appbar/assets/kendoka-angular.png';
  public sectionName: string = '';
  public wislogo: any;
  public labNameList = [];
  public labListData: any = {};
  public hviVersionsList = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private api: APIService
  ) {}

  public async ngOnInit() {
    this.setSectionName(this.router.url);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setSectionName(event.url);
        let navUrl = event.url.split('/')[1];
        this.wislogo = routeData.filter(
          (item) => item.routeId === navUrl
        )[0].icon;
        console.log('route', this.router, 'kendokaAvatar', this.kendokaAvatar);
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
      this.isManagerUp = res?.userGroup?.includes('managers') ?? false;
    });
    this.modifyUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.userList = [updatedUser];
        // console.log('userList subscription', this.userList);
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
    await this.api.ListLabs().then((labs: any) => {
      console.log('labs', labs);
      this.labListData = labs.items;
      this.labNameList = labs.items.map((item: any) => {
        return item.label;
      });
      this.hviVersionsList = labs.items
        .map((item: any) => {
          return item.defaultHVIProcessingVersion;
        })
        .sort();
    });

    const emailAndLab = await this.authService.getUserEmailAndLab();
    this.userEmail = emailAndLab.email;
    this.userCategory = emailAndLab.userGroup;
    // console.log('email and lab', emailAndLab);
    console.log('labNameList', this.labNameList);
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

  setSectionName(url: string) {
    let navUrl = url.split('/')[1];
    switch (navUrl) {
      case '':
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
    this.selectedHviVersion = this.labListData.find(
      (item: any) => item.label === value
    )?.defaultHVIProcessingVersion;
  }

  public hviValueChange(value: any): void {
    console.log('hvi valueChange', value);
    this.selectedHviVersion = value;
  }
}
