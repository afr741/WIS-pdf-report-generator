import { APIService, Report } from '../API.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Subscription type will be inferred from this library */
import { ZenObservable } from 'zen-observable-ts';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public reports: Array<Report> = [];

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
        const newRestaurant = event.value.data.onCreateReport;
        this.reports = [newRestaurant, ...this.reports];
      });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }

  public onCreate(report: Report) {
    this.api
      .CreateReport(report)
      .then(() => {
        console.log('item created!');
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('error creating report...', e);
      });
  }
}
