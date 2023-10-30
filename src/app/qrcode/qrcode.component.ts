import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { APIService, Report } from '../API.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
})
export class QrcodeComponent implements OnInit {
  public decodedID: string;
  private secretKey: string = 'wis';
  public dbEntryData: Report | null = null;
  // when pinging this page
  // take the query param from page URL
  // decode the query param, get page id(attachementurlname)
  // use the graphql api to to retrieve the db entry using attachementurlname
  // use retrieved data to display the results in html template

  constructor(private api: APIService, private route: ActivatedRoute) {
    this.decodedID = '';
  }

  convertToOriginal(urlFriendlyText: string): string {
    const decodedBase64 = decodeURIComponent(urlFriendlyText);

    return decodedBase64;
  }
  decodeQueryParam(queryParam: string): void {
    if (queryParam) console.log('queryParam', queryParam);

    const originalEncryptedText = this.convertToOriginal(queryParam);

    const decryptedText = CryptoJS.AES.decrypt(
      originalEncryptedText,
      this.secretKey
    ).toString(CryptoJS.enc.Utf8);
    console.log('Decrypted Text:', decryptedText);

    this.decodedID = decryptedText;
  }

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;

    this.decodeQueryParam(queryParams['code']);

    await this.api.GetReport(this.decodedID).then((event) => {
      this.dbEntryData = event;
      console.log(event);
    });
  }
}
