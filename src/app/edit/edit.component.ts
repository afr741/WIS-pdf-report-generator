import {
  APIService,
  ReportTemplate,
  CreateReportTemplateInput,
  UpdateReportTemplateInput,
} from '../API.service';
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
  public createForm: FormGroup;
  private selectedFileLetterHead: File | null = null;
  private selectedStamp: File | null = null; // Store the selected file
  public error?: string | null = null;
  public isLoading: boolean = false;
  public templateInfos: Array<ReportTemplate> = [];
  letterHeadPreviewUrl: string | ArrayBuffer | null | undefined = null;
  stampPreviewUrl: string | ArrayBuffer | null | undefined = null;

  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };

  constructor(
    private fb: FormBuilder,
    private api: APIService,
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
    try {
      // const letterHeadImageFromS3 = await Storage.get('wis-letterhead');
      // const stampImageFromS3 = await Storage.get('wis-stamp');
      // this.letterHeadPreviewUrl = letterHeadImageFromS3;
      // this.stampPreviewUrl = stampImageFromS3;
      this.api.CreateReportTemplate({
        countryCode: 'TJK',
        templateId: '324234923423',
        localCompanyName: 'local company name',
        localCompanyNameTranslation: '',
        letterHeadImageName: '',
        stampImageName: '',
        address: '',
        addressTranslation: '',
        phone: '',
        fax: '',
        email: '',
        testLocation: '',
        origin: '',
      });
    } catch (err) {
      console.log(err);
    }

    const fetchData = async () => {
      // await this.api
      //   .GetReportTemplate('4e353648-aa38-4799-8e5e-ccaaac97e6e3')
      await this.api.ListReportTemplates().then((response) => {
        console.log('response', response);
      });
      await this.api
        .ListReportTemplates()
        .then((event) => {
          this.templateInfos = event.items as ReportTemplate[];
          console.log('this.templateInfos', this.templateInfos);
          // const {
          //   id,
          //   createdAt,
          //   updatedAt,
          //   __typename,
          //   templateId,
          //   ...fieldsToPrefill
          // } = this.templateInfos[0];

          // this.createForm.patchValue(fieldsToPrefill);
          // this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
      console.log('sorted reports', this.templateInfos);
    };

    fetchData(); // Start the initial data fetch.
  }

  public async onCreate(report: any) {
    console.log('report', report);
    let stampImageNamePredefined = 'wis-stamp';
    let letterHeadImageNamePredefined = 'wis-letterhead';

    const { stampImage, letterHeadImage, ...rest } = report;
    let currentReportID = this.templateInfos[0].id;
    let modifiedReport: UpdateReportTemplateInput = {
      ...rest,
      id: currentReportID,
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
    this.createReportWithAttachment(modifiedReport);
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

  private createReportWithAttachment(
    reportTemplate: UpdateReportTemplateInput
  ) {
    console.log('reportTemplate', reportTemplate);
    this.api
      .UpdateReportTemplate(reportTemplate)
      .then(() => {
        console.log('Item updated!', reportTemplate);
        this.displayStatus(true);
      })
      .catch((e) => {
        this.displayStatus(false);
        console.log('Error updating report...', e);
        this.error = 'Error updating report';
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

  backToUpload(): void {
    this.router.navigate(['/upload']);
  }
}
