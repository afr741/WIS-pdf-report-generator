import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { APIService, Report } from '../API.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Storage } from 'aws-amplify';
import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
})
export class QrcodeComponent implements OnInit {
  public decodedID: string;
  private secretKey: string = 'wis';
  public dbEntryData: Report[] = [];
  public dataRows: any = {};
  public rawDataRows: any[] = [];
  public dataColumnNames: string[] = [];
  public dateCreated: string = '';
  public isLoading: boolean = true;
  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };
  letterHeadPreviewUrl: string | ArrayBuffer | null | undefined = null;

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

  parseData(dataRows: any): any {
    if (!dataRows || dataRows[0] === null) {
      // this.error = 'Faied to extract data rows!';
      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);
    console.log('parsedRawData', parsedRawData);

    // number of elements based on elments in this row
    const keys = Object.keys(parsedRawData[7]);

    const averageRow = parsedRawData[33];
    // Convert array of objects to array of arrays
    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      return keys.map((key) => {
        let cellValue = obj[key];
        if (index === 34 && key === '__EMPTY_1') {
          // console.log('averageRow', Object.values(averageRow)[0]);
          return Object.values(averageRow)[0];
        }
        let roundedCellValue = isNaN(cellValue)
          ? cellValue
          : Number(cellValue).toFixed(2);
        return roundedCellValue || '';
      });
    });
    // to find the start of data body using "Time" word
    let bodyStartIndex = extractedRows.findIndex((array: any) =>
      array.includes('Time')
    );

    // to find the end of data body using "Average" word
    let bodyEndIndex = extractedRows.findIndex((array: any) =>
      array.some(
        (element: any) =>
          typeof element === 'string' && element.includes('Average')
      )
    );

    let extractedRowsBody = extractedRows.slice(
      bodyStartIndex + 1,
      bodyEndIndex + 1
    );
    // const numberOfSamples = extractedRowsBody.length - 4;
    console.log('extractedRows', extractedRows);
    this.dataRows = extractedRowsBody;
  }

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;

    this.decodeQueryParam(queryParams['code']);

    await this.api.GetReport(this.decodedID).then((event) => {
      this.dbEntryData = [event];
      this.dateCreated = new Date(this.dbEntryData[0].createdAt).toDateString();

      console.log('dbEntryData', this.dbEntryData[0]);
      this.parseData(this.dbEntryData[0].dataRows);
      this.isLoading = false;
    });
    const letterHeadImageFromS3 = await Storage.get('wis-letterhead');
    this.letterHeadPreviewUrl = letterHeadImageFromS3;
  }
}
