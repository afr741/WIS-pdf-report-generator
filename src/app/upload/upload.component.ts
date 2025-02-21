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
  // public reports: Array<Report> = [];
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
      dateOfTesting: ['', Validators.required],
      dateOfSampling: ['', Validators.required],
      samplingParty: ['', Validators.required],
      samplingLocation: ['', Validators.required],
      samplingPercentage: ['', Validators.required],
      vesselOrConveyance: ['', Validators.required],
      cropYear: ['', Validators.required],
      conveyanceRefNo: ['', Validators.required],
      testingInstrumentType: ['', Validators.required], //temp to be removed
    });
    // this.createForm.valueChanges.subscribe((formData) => {
    //   localStorage.setItem('formData', JSON.stringify(formData));
    // });
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
    //autofill using previous data form store
    // const storedFormData = localStorage.getItem('formData');
    // if (storedFormData) {
    //   this.createForm.patchValue(JSON.parse(storedFormData));
    // }
    this.modifyUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        console.log('OnUpdateUserInfoListener', user);
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.selectedLab = updatedUser.labLocation;
        this.selectedHviVersion = updatedUser.hviVersion;
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
      this.error = '';
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
          console.log('onCreate report structure', report);
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
    const maxRetries = 8; // Maximum number of retries
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        console.log(`Attempt ${attempt + 1} to create report...`);

        // Check if the report already exists before creating it again
        let existingReports = await this.api.ListReports();
        let existingReport = existingReports.items.find(
          (r: any) => r.name === report.name
        );

        if (existingReport) {
          console.log('Report already exists:', existingReport);
          this.currentReport = existingReport;
          this.isLoading = false;
          this.router.navigate(['/pdf']);
          return;
        }

        // Attempt to create the report
        const res = await this.api.CreateReport(report);
        console.log('Report creation response:', res);

        // Wait for the report to appear in ListReports
        success = await this.waitForReportToBeFound(report);
      } catch (error: any) {
        console.error(`Error creating report (attempt ${attempt + 1}):`, error);
      }

      if (!success) {
        attempt++;
        const delay = Math.pow(1, attempt) * 1000; // Exponential backoff: 2^attempt * 1000ms
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!success) {
      console.error('Failed to create report after multiple attempts.');
      this.error = 'Error creating report. Please try again later.';
      this.isLoading = false;
    }
  }

  // Wait until the report is found in the list of existing reports
  private async waitForReportToBeFound(report: Report): Promise<boolean> {
    let retries = 0;
    const maxRetries = 4;
    const delayMs = 1500;

    while (retries < maxRetries) {
      console.log(`Checking if report exists (attempt ${retries + 1})...`);
      let existingReports = await this.api.ListReports();
      let existingReport = existingReports.items.find(
        (r: any) => r.name === report.name
      );
      console.log('existingReports', existingReports);
      console.log('existingReport', existingReport);

      if (existingReport) {
        console.log('Report found:', existingReport);
        this.currentReport = existingReport;
        this.isLoading = false;
        this.router.navigate(['/pdf']);
        return true;
      }

      retries++;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    console.warn('Report not found after multiple checks.');
    return false;
  }

  // Handle file change event and update the formData
  public onFileChange(event: any) {
    // this.createForm.valueChanges.subscribe((formData) => {
    //   localStorage.setItem('formData', JSON.stringify(formData));
    // });

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
