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

  parseData(data: any): any {
    if (!data || data[0] === null) return;
    let parsedRawData = JSON.parse(data[0]);
    let removedEmptyArraysData = parsedRawData.filter(
      (array: []) => array.length !== 0
    );
    console.log('raw ALL', removedEmptyArraysData);
    // to find the start of data extraction
    let timeIndex = removedEmptyArraysData.findIndex((array: any) =>
      array.includes('Time')
    );

    // to find the end of data extraction
    let averageIndex = removedEmptyArraysData.findIndex((array: any) =>
      array.some(
        (element: any) =>
          typeof element === 'string' && element.includes('Average')
      )
    );
    console.log('time', timeIndex, 'average', averageIndex);
    let extractedRows = removedEmptyArraysData.slice(
      timeIndex + 1,
      averageIndex + 2
    );
    const lastTwoArrays = extractedRows.slice(-2);
    const mainArr = [null]
      .concat(lastTwoArrays[0])
      .concat([null])
      .concat(lastTwoArrays[1].toSpliced(0, 3));

    const combinedArray = mainArr;
    extractedRows.splice(-2);
    extractedRows.push(combinedArray);

    // console.log(
    //   'lastTwoArrays:',
    //   lastTwoArrays,
    //   'mainArr:',
    //   mainArr,
    //   'extracted rows',
    //   extractedRows
    // );
    let arrayedRows = [];
    let firstRow = extractedRows[0];
    for (let i = 0; i < extractedRows.length; i++) {
      let innerArray = extractedRows[i];

      let filteredArray = [];
      for (let j = 0; j < innerArray.length; j++) {
        if (firstRow[j] !== null) {
          if (innerArray[j] === null || innerArray[j] === undefined) {
            // Replace null with an empty string
            innerArray[j] = '';
          } else {
            innerArray[j] = isNaN(Number(innerArray[j]))
              ? innerArray[j].toString()
              : Number(innerArray[j]).toFixed(2).toString();
          }

          filteredArray.push(innerArray[j]);
        }
      }

      arrayedRows.push(filteredArray);
    }

    // converting data into a data structure where first row(dataColumnNames) values is the key of each subsequent array item

    this.dataColumnNames = arrayedRows[0];

    const [keys, ...values] = arrayedRows; // Destructuring keys and values

    this.dataRows = values.map((row: any) => {
      const obj: any = {};
      keys.forEach((key: any, index: any) => {
        obj[key] = row[index];
      });
      return obj;
    });

    console.log(
      'dataRows',
      this.dataRows,
      'dataColumnNames',
      this.dataColumnNames
    );
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
