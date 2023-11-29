import { APIService, Report } from '../API.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
/** Subscription type will be inferred from this library */
import { ZenObservable } from 'zen-observable-ts';
import { Storage } from 'aws-amplify';
import { Router } from '@angular/router';

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
  private currentReport: Report | null = null;
  constructor(
    private api: APIService,
    private fb: FormBuilder,
    public router: Router
  ) {
    // (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      testLocation: ['', Validators.required],
      reportNum: ['', Validators.required],
      lotNum: ['', Validators.required],
      customerName: ['', Validators.required],
      origin: ['', Validators.required],
      stations: ['', Validators.required],
      variety: ['', Validators.required],
      attachmentUrl: [null, Validators.required],
    });
  }

  private createSubscription: ZenObservable.Subscription | null = null;
  private modifySubscription: ZenObservable.Subscription | null = null;

  async ngOnInit() {
    /* subscribe to new report being created */
    this.createSubscription = this.api
      .OnCreateReportListener()
      .subscribe((event: any) => {
        const newReport = event.value.data.onCreateReport;
        this.reports = [newReport, ...this.reports];
      });
  }

  ngOnDestroy() {
    if (this.createSubscription) {
      this.createSubscription.unsubscribe();
    }
    this.createSubscription = null;

    if (this.modifySubscription) {
      this.modifySubscription.unsubscribe();
    }
    this.modifySubscription = null;
  }

  public async onCreate(report: Report) {
    if (this.selectedFile) {
      const uniqueIdentifier = new Date().getTime();
      const fileNameWithoutSpaces = this.selectedFile.name.replace(/ /g, '');
      const key = `${report.name}_${uniqueIdentifier}_${fileNameWithoutSpaces}`;

      try {
        const uploadResponse = await Storage.put(key, this.selectedFile, {
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        // Update the report's attachmentUrl with the URL of the uploaded file
        report.attachmentUrl = uploadResponse.key;
        this.currentReport = report;
        report.dataRows = null;
        this.createReportWithAttachment(report);
      } catch (error: any) {
        console.log('Error uploading file locally: ', error);
        this.error = error;
      }
    }
  }

  // Handle file change event and update the formData
  onFileChange(event: any) {
    console.log('File changed', event);
    const fileList: any = event.files;
    if (fileList && fileList.length > 0) {
      // console.log(this.createForm);
      this.selectedFile = fileList[0].rawFile;
      console.log('selected file,', fileList[0]);
    }
  }

  private createReportWithAttachment(report: Report) {
    this.currentReport = report;
    if (this.currentReport.name === '') {
      this.error = 'name is required';
    } else {
      console.log('currentreport', this.currentReport);
      this.api
        .CreateReport(report)
        .then(() => {
          console.log('Item created!', report);
          this.router.navigate(['/pdf']);
        })
        .catch((e) => {
          console.log('Error creating report...', e);
          this.error = 'Error creating report';
        });
    }
  }
}
