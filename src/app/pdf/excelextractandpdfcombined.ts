import { APIService, Report } from '../API.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Subscription type will be inferred from this library */
import { ZenObservable } from 'zen-observable-ts';
import { Storage, Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public reports: Array<Report> = [];
  private selectedFile: File | null = null; // Store the selected file

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
    console.log(this.selectedFile);
    if (this.selectedFile) {
      const workbook = XLSX.readFile(this.selectedFile.name);
      console.log('workbook: ' + workbook);
    }

    // if (this.selectedFile) {
    //   const uniqueIdentifier = new Date().getTime();
    //   const fileNameWithoutSpaces = this.selectedFile.name.replace(/ /g, '');
    //   const key = `${report.name}_${uniqueIdentifier}_${fileNameWithoutSpaces}`;
    //   try {
    //     const uploadResponse = await Storage.put(key, this.selectedFile, {
    //       contentType:
    //         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //     });
    //     // Update the report's attachmentUrl with the URL of the uploaded file
    //     report.attachmentUrl = uploadResponse.key;
    //     this.createReportWithAttachment(report);
    //   } catch (error) {
    //     console.log('Error uploading file locally: ', error);
    //   }
    // }
  }

  // Handle file change event and update the formData
  onFileChange(event: any) {
    // const fileList: FileList | null = event.target.files;
    // if (fileList && fileList.length > 0) {
    //   console.log(this.createForm);
    //   this.selectedFile = fileList[0];
    // }

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binarystr = e.target.result;
      const workbook = XLSX.read(binarystr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(data);
      this.generatePDF(data);
    };
    reader.readAsBinaryString(file);
  }

  private createReportWithAttachment(report: Report) {
    console.log(report);
    this.api
      .CreateReport(report)
      .then(() => {
        console.log('Item created!', report);
        this.router.navigate(['/pdf']);
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('Error creating report...', e);
      });
  }
  logOut() {
    Auth.signOut({ global: true })
      .then((data) => {
        this.router.navigate(['/login']);
      })
      .catch((err) => console.log(err));
  }
}