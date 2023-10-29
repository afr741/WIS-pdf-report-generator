import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { APIService, Report } from '../API.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
})
export class QrcodeComponent implements OnInit {
  public queryParam: string;
  public dbEntryData: Report | null = null;
  // when pinging this page
  // take the query param from page URL
  // decode the query param, get page id(attachementurlname)
  // use the graphql api to to retrieve the db entry using attachementurlname
  // use retrieved data to display the results in html template

  constructor(private api: APIService, private route: ActivatedRoute) {
    this.queryParam = '1';
  }

  decodeQueryParam(queryParam: string): string {
    if (queryParam) console.log(queryParam);
    return '';
  }

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    this.decodeQueryParam(queryParams['code']);
    this.api.GetReport(this.queryParam).then((event) => {
      this.dbEntryData = event;
    });
  }
}
