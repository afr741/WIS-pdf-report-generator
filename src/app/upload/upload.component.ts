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
        const createdAttachmentURL = await Storage.get(uploadResponse.key);

        // Update the report's attachmentUrl with the URL of the uploaded file
        report.attachmentUrl = createdAttachmentURL;
        await this.createReportWithAttachment(report);
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
