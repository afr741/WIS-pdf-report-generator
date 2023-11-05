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
  public dataRows: any[] = [];
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

  parseData(data: any): any {
    // for (const item of data) {
    //   const parsedItem = JSON.parse(item.replace(/\\/g, '')) as string;
    //   this.dataRows.push(parsedItem);
    // }
    let arrayedRows = [];
    let extractedRows = JSON.parse(data[0]);
    for (let i = 0; i < extractedRows.length; i++) {
      let innerArray = extractedRows[i];
      // console.log('Generating inner array', innerArray);
      // // Iterate through the inner array
      for (let j = 0; j < innerArray.length; j++) {
        if (innerArray[j] === null || innerArray[j] === undefined) {
          // Replace null with an empty string
          innerArray[j] = '';
        } else {
          // Convert the item to a string and rounds the numbers down
          innerArray[j] = isNaN(Number(innerArray[j]))
            ? innerArray[j].toString()
            : Number(innerArray[j]).toFixed(2).toString();
        }
      }
      arrayedRows.push(innerArray);
    }
    this.dataRows = arrayedRows;
    console.log('arrayedRows', this.dataRows);
  }

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;

    this.decodeQueryParam(queryParams['code']);

    await this.api.GetReport(this.decodedID).then((event) => {
      this.dbEntryData = event;
      console.log(event);
      this.parseData(this.dbEntryData.dataRows);
    });
  }
}
