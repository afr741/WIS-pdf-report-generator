import { APIService, Report } from '../API.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Subscription type will be inferred from this library */
import { ZenObservable } from 'zen-observable-ts';
import { Storage, Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/AuthService';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public reports: Array<Report> = [];
  private selectedFile: File | null = null; // Store the selected file
  private hasUpdate: boolean = false;
  private currentReport: Report | null = null;
  constructor(
    private api: APIService,
    private fb: FormBuilder,
    public router: Router,
    public authService: AuthService
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
    /* fetch reports when app loads */
    this.api.ListReports().then((event) => {
      this.reports = event.items as Report[];
    });

    /* subscribe to new report being created */
    this.createSubscription = this.api
      .OnCreateReportListener()
      .subscribe((event: any) => {
        const newReport = event.value.data.onCreateReport;
        this.reports = [newReport, ...this.reports];
      });
    //TBD
    // this.modifySubscription = this.api
    //   .OnUpdateReportListener({ name: { eq: 'sampleName' } })
    //   .subscribe((event: any) => {
    //     console.log(event);
    //     // this.router.navigate(['/pdf']);
    //   });
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
      } catch (error) {
        console.log('Error uploading file locally: ', error);
      }
    }
  }

  // Handle file change event and update the formData
  onFileChange(event: any) {
    const fileList: FileList | null = event.target.files;
    if (fileList && fileList.length > 0) {
      console.log(this.createForm);
      this.selectedFile = fileList[0];
    }
  }

  private createReportWithAttachment(report: Report) {
    this.currentReport = report;
    console.log('currentreport', this.currentReport);
    this.api
      .CreateReport(report)
      .then(() => {
        console.log('Item created!', report);
        this.router.navigate(['/pdf']);
      })
      .catch((e) => {
        console.log('Error creating report...', e);
      });
  }
  public async onSignOut() {
    try {
      await this.authService.onSignOut();
      //temp workaround for persistence
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
