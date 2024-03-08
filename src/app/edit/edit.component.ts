import {
  APIService,
  ReportTemplate,
  CreateReportTemplateInput,
  UpdateReportTemplateInput,
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

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  public lab = ['Dushanbe', 'Bokhtar', 'Khujand'];
  public createForm: FormGroup;
  private selectedFileLetterHead: File | null = null;
  private selectedStamp: File | null = null; // Store the selected file
  public error?: string | null = null;
  public isLoading: boolean = false;
  public templateInfos: Array<ReportTemplate> = [];
  public matchedIndex: number = 0;
  letterHeadPreviewUrl: string | ArrayBuffer | null | undefined = null;
  stampPreviewUrl: string | ArrayBuffer | null | undefined = null;
  public selectedLab: any = '';
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
      selectedLab: [this.selectedLab, Validators.required],
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
      console.log('this.templateInfos', event);
    });
    try {
      const letterHeadImageFromS3 = await Storage.get('wis-letterhead');
      const stampImageFromS3 = await Storage.get('wis-stamp');
      this.letterHeadPreviewUrl = letterHeadImageFromS3;
      this.stampPreviewUrl = stampImageFromS3;
      await this.api.ListUserInfos().then((user: any) => {
        if (user.items.length > 0) {
          console.log('user.items', user.items);
          this.selectedLab = user.items[0].labLocation;
          this.matchedIndex =
            this.selectedLab !== ''
              ? this.lab.indexOf(this.selectedLab)
              : this.matchedIndex;
          console.log('matchedIndex', this.matchedIndex);
          console.log('selectedLab', this.selectedLab);
        }
      });
    } catch (err) {
      console.log(err);
    }

    this.fetchData(); // Start the initial data fetch.
  }

  public fetchData = async () => {
    this.api
      .ListReportTemplates()
      .then((event) => {
        console.log('this.templateInfos', event);
        this.templateInfos = event.items as ReportTemplate[];
        if (this.templateInfos.length > 0) {
          const foundEntry = this.templateInfos.find(
            (item) => (item.countryCode = 'Dushanbe')
          );
          this.activeTemplateInfo = foundEntry;
          const {
            id,
            createdAt,
            updatedAt,
            __typename,
            templateId,
            ...fieldsToPrefill
          } = this.templateInfos[this.matchedIndex];

          console.log('activeTemplateInfo:', this.activeTemplateInfo);
          this.createForm.patchValue(fieldsToPrefill);
          this.isLoading = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('sorted templates', this.templateInfos);
  };

  public async onCreate(report: any) {
    console.log('report template', report);
    let stampImageNamePredefined = 'wis-stamp';
    let letterHeadImageNamePredefined = 'wis-letterhead';
    const { stampImage, letterHeadImage, selectedLab, ...rest } = report;

    if (this.activeTemplateInfo) {
      let modifiedReport: UpdateReportTemplateInput = {
        ...rest,
        countryCode: this.selectedLab,
        labLocation: this.selectedLab,
        id: this.activeTemplateInfo.id,
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
  public async labValueChange(value: any) {
    // console.log('lab valueChange', value);
    this.selectedLab = value;
    this.isLoading = true;
    this.fetchData();
  }

  backToUpload(): void {
    this.router.navigate(['/upload']);
  }
}
