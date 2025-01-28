import { APIService, Report } from '../API.service';
import { AuthService } from '../AuthService';
import * as XLSX from 'xlsx';

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
/** Subscription type will be inferred from this library */
import { ZenObservable } from 'zen-observable-ts';
import { Storage, Amplify } from 'aws-amplify';

import { Router } from '@angular/router';
import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public reports: Array<Report> = [];
  private selectedFile: File | null = null; // Store the selected file
  public error?: string | null = null;
  public isLoading: boolean = false;
  private currentReport: Report | null = null;
  public jsonData: any = null;
  public selectedLab: any = '';
  public selectedHviVersion: any = '';
  public reportEmail: string = '';
  constructor(
    private authService: AuthService,
    private api: APIService,
    private fb: FormBuilder,
    public router: Router
  ) {
    // (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      hviVersion: ['', Validators.required],
      labLocation: ['', Validators.required],
      reportNum: ['', Validators.required],
      email: ['', Validators.required],
      lotNum: ['', Validators.required],
      customerName: ['', Validators.required],
      origin: ['', Validators.required],
      stations: ['', Validators.required],
      variety: ['', Validators.required],
      attachmentUrl: [null, Validators.required],
      dataRows: ['', Validators.required],
      samplesSenderName: ['', Validators.required],
      sellerName: ['', Validators.required],
      buyerName: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      testingInstrumentType: ['', Validators.required],
      dateOfTesting: ['', Validators.required],
      dateOfSampling: ['', Validators.required],
      samplingParty: ['', Validators.required],
      samplingLocation: ['', Validators.required],
      samplingPercentage: ['', Validators.required],
      vesselOrConveyance: ['', Validators.required],
      cropYear: ['', Validators.required],
      conveyanceRefNo: ['', Validators.required],
    });
  }

  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };

  private createSubscription: ZenObservable.Subscription | null = null;
  private modifySubscription: ZenObservable.Subscription | null = null;
  private modifyUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;

  async ngOnInit() {
    /* subscribe to new report being created */

    this.modifyUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        console.log('OnUpdateUserInfoListener', user);
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.selectedLab = updatedUser.labLocation;
        this.selectedHviVersion = updatedUser.hviVersion;
      });
    this.createSubscription = this.api
      .OnCreateReportListener()
      .subscribe((event: any) => {
        const newReport = event.value.data.onCreateReport;
        this.reports = [newReport, ...this.reports];
        console.log('sub created newReport', newReport, 'event', event);
      });

    this.api.ListUserInfos().then((user: any) => {
      if (user.items.length > 0) {
        this.selectedLab = user.items[0].labLocation;
        this.selectedHviVersion = user.items[0].hviVersion;
      }
    });

    this.api.ListReports().then((reports) => {
      console.log('reports', reports);
    });
    this.authService.getUserEmailAndLab().then((res) => {
      console.log('user lab', res);
      this.reportEmail = res.email;
    });
  }

  public async onCreate(report: Report) {
    if (this.selectedFile) {
      const uniqueIdentifier = new Date().getTime();
      console.log('uniqueIdentifier', uniqueIdentifier);
      const fileNameWithoutSpaces = this.selectedFile.name.replace(/ /g, '');

      const key = `${report.name.replace(
        / /g,
        ''
      )}_${uniqueIdentifier}_${fileNameWithoutSpaces}`;

      try {
        this.isLoading = true;
        const uploadResponse = await Storage.put(key, this.selectedFile, {
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          level: 'private',
        }).then((res) => {
          console.log('res', res);
          report.attachmentUrl = res.key;
          report.dataRows = [JSON.stringify(this.jsonData)];
          report.email = this.reportEmail;
          report.labLocation = this.selectedLab;
          report.hviVersion = this.selectedHviVersion;

          // Create the report and wait until it's found in the list of existing reports
          this.createReportAndWaitForConfirmation(report);
        });
      } catch (error: any) {
        this.isLoading = false;
        console.log('Error uploading file locally: ', error);
        this.error = error;
      }
    }
  }

  // Create the report and wait until it's found in the list of existing reports
  private async createReportAndWaitForConfirmation(report: Report) {
    try {
      await this.api.CreateReport(report);

      // Wait until the report is found in the list of existing reports
      await this.waitForReportToBeFound(report);
    } catch (error: any) {
      console.log('Error creating report:', error);
      this.error = 'Error creating report';
      this.isLoading = false;
    }
  }

  // Wait until the report is found in the list of existing reports
  private async waitForReportToBeFound(report: Report) {
    let existingReports = await this.api.ListReports();
    let existingReport = existingReports.items.find(
      (r: any) => r.name === report.name
    );

    while (!existingReport) {
      // If the report is not found, wait for 1 second and try again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      existingReports = await this.api.ListReports();
      existingReport = existingReports.items.find(
        (r: any) => r.name === report.name
      );
    }

    console.log('Report found:', existingReport);
    this.currentReport = existingReport;
    this.isLoading = false;
    this.router.navigate(['/pdf']);
  }

  // Handle file change event and update the formData
  public onFileChange(event: any) {
    console.log('File changed', event);
    const fileList: any = event.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0].rawFile;
      this.selectedFile = file;
      let fileReader = new FileReader();
      let arrayBuffer: any;
      fileReader.onload = (e) => {
        arrayBuffer = fileReader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join('');
        var workbook = XLSX.read(bstr, { type: 'binary' });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log('this.jsonData', this.jsonData);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  // private createReportWithAttachment(report: Report) {
  //   if (report.name === '') {
  //     this.error = 'name is required';
  //   } else {
  //     console.log('report inside create report', report);
  //     this.api
  //       .CreateReport(report)
  //       .then((res) => {
  //         console.log('Item created!', res);
  //       })
  //       .catch((e) => {
  //         this.isLoading = false;
  //         console.log('Error creating report...', e);
  //         this.error = 'Error creating report';
  //       })
  //       .finally(() => {
  //         this.isLoading = false;
  //         this.api.ListReports().then((event) => {
  //           const updatedReports = (event.items as Report[]).sort((a, b) => {
  //             // sort by most recent date
  //             let dateA: any = new Date(a.updatedAt);
  //             let dateB: any = new Date(b.updatedAt);
  //             return dateB - dateA;
  //           });
  //           console.log('ListReports updatedReports', updatedReports);
  //         });
  //         this.router.navigate(['/pdf']);
  //       });
  //   }
  // }

  ngOnDestroy() {
    if (this.modifyUserPreferenceSubscription) {
      this.modifyUserPreferenceSubscription.unsubscribe();
    }
    this.modifyUserPreferenceSubscription = null;

    if (this.createSubscription) {
      this.createSubscription.unsubscribe();
    }
    this.createSubscription = null;

    if (this.modifySubscription) {
      this.modifySubscription.unsubscribe();
    }
    this.modifySubscription = null;
  }
}
