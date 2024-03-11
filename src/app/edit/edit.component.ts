import {
  APIService,
  ReportTemplate,
  CreateReportTemplateInput,
  UpdateReportTemplateInput,
  UserInfo,
} from '../API.service';
import { AuthService } from '../AuthService';

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from 'aws-amplify';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ZenObservable } from 'zen-observable-ts';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  public lab = ['Dushanbe', 'Bokhtar', 'Khujand'];
  public createForm: FormGroup;
  private selectedFileLetterHead: File | null = null;
  private selectedStamp: File | null = null; // Store the selected file
  public error?: string | null = null;
  public userId: string = '';
  public selectedHviVersion: string = '';
  public selectedCountry: string = '';
  public isLoading: boolean = false;
  public templateInfos: Array<ReportTemplate> = [];
  private modifyUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;
  letterHeadPreviewUrl: string | ArrayBuffer | null | undefined = null;
  stampPreviewUrl: string | ArrayBuffer | null | undefined = null;
  public selectedLab: any = '';
  public userInfo: UserInfo | null = null;
  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };
  public activeTemplateInfo: ReportTemplate | undefined = undefined;
  constructor(
    private fb: FormBuilder,
    private api: APIService,
    private authService: AuthService,
    public router: Router,
    private notificationService: NotificationService
  ) {
    this.createForm = this.fb.group({
      localCompanyName: ['', Validators.required],
      localCompanyNameTranslation: ['', Validators.required],
      letterHeadImage: [null, Validators.required],
      stampImage: [null, Validators.required],
      address: ['', Validators.required],
      addressTranslation: ['', Validators.required],
      phone: ['', Validators.required],
      fax: ['', Validators.required],
      email: ['', Validators.required],
      origin: ['', Validators.required],
      testLocation: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.api.ListReportTemplates().then((event) => {
      console.log('this.templateInfos on init', event);
    });
    this.modifyUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        console.log('OnUpdateUserInfoListener', user);
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.userInfo = updatedUser;
        this.selectedLab = updatedUser.labLocation;
        this.fetchTemplateData();
      });

    try {
      const letterHeadImageFromS3 = await Storage.get('wis-letterhead');
      const stampImageFromS3 = await Storage.get('wis-stamp');
      this.letterHeadPreviewUrl = letterHeadImageFromS3;
      this.stampPreviewUrl = stampImageFromS3;
      await this.api.ListUserInfos().then((user: any) => {
        if (user.items.length > 0) {
          console.log('user.items', user.items);
          this.userInfo = user.items[0];
          this.selectedLab = user.items[0].labLocation;
          console.log('selectedLab', this.selectedLab);
        }
      });
    } catch (err) {
      console.log(err);
    }

    this.fetchTemplateData(); // Start the initial data fetch.
  }

  ngOnDestroy() {
    if (this.modifyUserPreferenceSubscription) {
      this.modifyUserPreferenceSubscription.unsubscribe();
    }
    this.modifyUserPreferenceSubscription = null;
  }

  public fetchTemplateData = async () => {
    this.api
      .ListReportTemplates()
      .then((event) => {
        console.log('this.templateInfos fetchTemplateData event', event);
        this.templateInfos = event.items as ReportTemplate[];
        if (this.templateInfos.length > 0) {
          const foundEntry = this.templateInfos.find(
            (item) => item.labLocation == this.selectedLab
          );
          console.log('EDIT COMP, foundEntry', foundEntry);
          if (foundEntry) {
            this.activeTemplateInfo = foundEntry;
            const {
              id,
              createdAt,
              updatedAt,
              __typename,
              templateId,
              ...fieldsToPrefill
            } = this.activeTemplateInfo;
            console.log('activeTemplateInfo', this.activeTemplateInfo);

            console.log('fieldsToPrefill:', fieldsToPrefill);
            this.createForm.patchValue(fieldsToPrefill);
          } else {
            this.createForm.reset();
            this.activeTemplateInfo = undefined;
            this.displayStatus(false);
          }
        }
        this.isLoading = false;
      })
      .catch((err) => {
        console.log(err);
        this.error = err;
        this.displayStatus(false);
        this.isLoading = false;
      });
    console.log('sorted templates', this.templateInfos);
  };

  public async onCreate(report: any) {
    console.log('report template', report);
    let stampImageNamePredefined = 'wis-stamp';
    let letterHeadImageNamePredefined = 'wis-letterhead';
    const { stampImage, letterHeadImage, ...rest } = report;

    if (this.activeTemplateInfo && this.userInfo) {
      let modifiedReport: UpdateReportTemplateInput = {
        ...rest,
        countryCode: this.userInfo.countryCode,
        labLocation: this.selectedLab,
        id: this.selectedLab,
      };

      if (this.selectedFileLetterHead || this.selectedStamp) {
        try {
          if (this.selectedFileLetterHead) {
            const letterheadUploadResponse = await Storage.put(
              letterHeadImageNamePredefined,
              this.selectedFileLetterHead
            );
          }
          if (this.selectedStamp) {
            const stampUploadResponse = await Storage.put(
              stampImageNamePredefined,
              this.selectedStamp
            );
          }
        } catch (error: any) {
          console.log('Error uploading file locally: ', error);
          this.error = error;
        }
      }
      this.updateReportWithAttachment(modifiedReport);
    } else {
      let modifiedReport: CreateReportTemplateInput = {
        ...rest,
        countryCode: this.selectedLab,
        labLocation: this.selectedLab,
        stampImageName: stampImageNamePredefined,
        letterHeadImageName: letterHeadImageNamePredefined,
        id: this.selectedLab,
        templateId: this.selectedLab,
      };
      console.log('updateReportWithAttachment modifiedReport:', modifiedReport);
      this.createReportWithAttachment(modifiedReport);
    }
  }

  // Handle file change event and update the formData
  onFileChangeLetterhead(event: any) {
    console.log('File changed', event);
    const fileList: any = event.files;
    if (fileList && fileList.length > 0) {
      this.selectedFileLetterHead = fileList[0].rawFile;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.letterHeadPreviewUrl = e.target?.result;
        console.log('letterhead file,', e.target?.result);
      };
      reader.readAsDataURL(fileList[0].rawFile);
    }
  }

  onFileChangeStamp(event: any) {
    console.log('File changed', event);
    const fileList: any = event.files;
    if (fileList && fileList.length > 0) {
      this.selectedStamp = fileList[0].rawFile;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.stampPreviewUrl = e.target?.result;
        console.log('letterhead file,', e.target?.result);
      };
      reader.readAsDataURL(fileList[0].rawFile);
    }
  }

  private updateReportWithAttachment(
    reportTemplate: UpdateReportTemplateInput
  ) {
    // console.log('reportTemplate', reportTemplate);
    this.api
      .UpdateReportTemplate(reportTemplate)
      .then(() => {
        console.log('Item updated!', reportTemplate);
        this.displayStatus(true);
      })
      .catch((e) => {
        this.displayStatus(false);
        console.log('Error updating template...', e);
        this.error = 'Error updating template';
      });
    // }
  }

  private createReportWithAttachment(
    reportTemplate: CreateReportTemplateInput
  ) {
    // console.log('createReportWithAttachment reportTempalte ', reportTemplate);
    this.api
      .CreateReportTemplate(reportTemplate)
      .then(() => {
        console.log('Item created!', reportTemplate);
        this.displayStatus(true);
      })
      .catch((e) => {
        this.displayStatus(false);
        console.log('Error creating template...', e);
        this.error = 'Error creating template';
      });
    // }
  }
  public displayStatus(isUpdated: boolean): void {
    this.notificationService.show({
      content: isUpdated
        ? 'The template is updated!'
        : 'Update failed, try again',
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'bottom' },
      type: { style: isUpdated ? 'success' : 'error', icon: true },
      closable: true,
    });
  }
  // public async labValueChange(value: any) {
  //   // console.log('lab valueChange', value);
  //   this.selectedLab = value;
  //   this.isLoading = true;
  //   if (this.userInfo !== null) {
  //     const { id, countryCode, hviVersion } = this.userInfo;
  //     try {
  //       await this.api
  //         .UpdateUserInfo({
  //           id: id,
  //           labLocation: value,
  //           countryCode: countryCode,
  //           hviVersion: hviVersion,
  //         })
  //         .then((response) => {
  //           console.log('update user iffom', response);
  //           this.fetchTemplateData();
  //         });
  //     } catch (err) {
  //       console.log(err);
  //       this.error = `${err}`;
  //       this.displayStatus(false);
  //     }
  //   }
  // }

  backToUpload(): void {
    this.router.navigate(['/upload']);
  }
}
