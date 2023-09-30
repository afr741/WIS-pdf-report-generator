import { APIService, Report } from '../API.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Subscription type will be inferred from this library */
import { ZenObservable } from 'zen-observable-ts';
import { Storage } from 'aws-amplify';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public reports: Array<Report> = [];
  private selectedFile: File | null = null; // Store the selected file

  constructor(private api: APIService, private fb: FormBuilder) {
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

  private subscription: ZenObservable.Subscription | null = null;

  async ngOnInit() {
    /* fetch reports when app loads */
    this.api.ListReports().then((event) => {
      this.reports = event.items as Report[];
    });

    /* subscribe to new restaurants being created */
    this.subscription = this.api
      .OnCreateReportListener()
      .subscribe((event: any) => {
        const newReport = event.value.data.onCreateReport;
        this.reports = [newReport, ...this.reports];
      });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }

  public async onCreate(report: Report) {
    // Check if a file is selected and needs to be uploaded
    if (this.selectedFile) {
      try {
        const uploadResponse = await Storage.put(
          report.name,
          this.selectedFile,
          {
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }
        );

        // Update the report's attachmentUrl with the URL of the uploaded file
        report.attachmentUrl = uploadResponse.key;
        console.log('UPDATED report', report);
        // Create the report with the updated attachmentUrl
        await this.createReportWithAttachment(report);

        // console.log('FILE', this.selectedFile);
        // await Storage.put(report.name, this.selectedFile, {
        //   contentType:
        //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // })
        //   .then((uploadResponse: any) => {
        //     report.attachmentUrl = '';
        //     this.createReportWithAttachment(report);
        //   })
        //   .catch((e) => console.log(`error uploading file to storage: ${e}`));
      } catch (error) {
        console.log('Error uploading file locally: ', error);
      }
    } else {
      // No file selected, create the report without an attachment
      this.createReportWithAttachment(report);
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
    this.api
      .CreateReport(report)
      .then(() => {
        console.log('Item created!', report);
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('Error creating report...', e);
      });
  }
}
