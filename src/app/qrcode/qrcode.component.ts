import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { APIService, Report } from '../API.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Storage } from 'aws-amplify';
import { API, GraphQLQuery, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
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
    let hviVersion = this.dbEntryData[0].hviVersion;

    let parsedRawData = JSON.parse(dataRows[0]);
    console.log('parsedRawData', parsedRawData);

    // number of elements based on elments in this row
    const headerRowIndex = parsedRawData.findIndex((array: any) =>
      Object.values(array).includes('Bale ID')
    );

    console.log('headerRowIndex', headerRowIndex);

    const keys = Object.keys(parsedRawData[headerRowIndex]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const averageRow =
      parsedRawData[parsedRawData.length - (hviVersion == 'v2' ? 7 : 3)];
    const n24row = parsedRawData[parsedRawData.length - 2];
    console.log('average row', averageRow);
    // Convert array of objects to array of arrays
    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      return keys.map((key, keyIndex) => {
        let cellValue = obj[key];

        if (hviVersion == 'v1') {
          if (index === parsedRawData.length - 2 && key === '__EMPTY_1') {
            return averageRow.__EMPTY;
          }
          if (index === parsedRawData.length - 2 && key === '__EMPTY_4') {
            const finalValue = n24row.__EMPTY_1.match(/\d+/) + n24row.__EMPTY_4;
            console.log('finalValue', finalValue);
            return finalValue;
          }
        }

        if (hviVersion == 'v2') {
          //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
          if (obj.__EMPTY && keyIndex == 1) {
            // console.log('KEY OF ROW 31', obj.__EMPTY);
            return obj.__EMPTY;
          }
        } else {
          if (obj.__EMPTY && keyIndex == 1) {
            // console.log('KEY OF ROW 31', obj.__EMPTY);
            return obj.__EMPTY;
          }
        }
        let original = [0, 1, 14, 17];
        let isOneDec = [3, 4, 8, 10, 11, 12, 13, 15];
        let isTwoDec = [5, 6, 9, 16];
        let isThreeDec = [7];

        if (hviVersion == 'v2') {
          original = [16];
          isOneDec = [3, 7, 9, 10, 11, 12, 14];
          isTwoDec = [4, 5, 8, 13, 15];
          isThreeDec = [6];
        }

        if (hviVersion == 'v3') {
          original = [16];
          isOneDec = [4, 8, 10, 11, 12, 13, 14];
          isTwoDec = [3, 5, 6, 9, 15];
          isThreeDec = [7];
        }

        let roundedCellValue = original.includes(keyIndex)
          ? cellValue
          : isNaN(cellValue)
          ? cellValue
          : Number(cellValue).toFixed(
              isOneDec.includes(keyIndex)
                ? 1
                : isTwoDec.includes(keyIndex)
                ? 2
                : isThreeDec.includes(keyIndex)
                ? 3
                : 0
            );
        return roundedCellValue || '';
      });
    });

    console.log('extracted rows', extractedRows);
    // to find the start of data body using keyword based on HVI version
    // let startRowKeyWord =
    //   hviVersion == 'v1' ? 'Time' : hviVersion == 'v2' ? 'SCI' : 'Print Time';
    // let bodyStartIndex = extractedRows.findIndex((array: any) =>
    //   array.includes(startRowKeyWord)
    // );

    // to find the end of data body using "Average" and "Max" word
    let endRowKeyWord = hviVersion == 'v1' ? 'Average' : 'Max';
    let bodyEndIndex = extractedRows.findIndex((array: any) =>
      array.some(
        (element: any) =>
          typeof element === 'string' && element.includes(endRowKeyWord)
      )
    );
    console.log('bodyStartIndex', headerRowIndex, 'bodyEndIndex', bodyEndIndex);
    let extractedRowsBody = extractedRows.slice(
      headerRowIndex,
      bodyEndIndex + (hviVersion == 'v1' ? 2 : 1)
    );
    console.log('extractedRowsBody', extractedRowsBody);
    if (hviVersion == 'v1') {
      //removing empty row
      let emptyRow = extractedRowsBody.splice(extractedRowsBody.length - 2, 1);
      let lastRow = extractedRowsBody[extractedRowsBody.length - 1];
      const arrayOfArrays = lastRow.map((str: any) => str.split('\n'));

      // Rotate the array of arrays so that the first element of each sub-array are in the same array
      const rotatedArray = arrayOfArrays.reduce((acc: any, arr: any) => {
        arr.forEach((element: any, index: any) => {
          if (!acc[index]) {
            acc[index] = [];
          }
          acc[index].push(element);
        });
        return acc;
      }, []);
      for (let i = 1; i < rotatedArray.length; i++) {
        // Insert an empty string at index 4 for each array except the first one
        rotatedArray[i].splice(3, 0, '');
      }
      extractedRowsBody.splice(extractedRowsBody.length - 1, 1);
      let modifiedRowsBody = [...extractedRowsBody, ...rotatedArray];
      console.log('extractedRowsBody after splice', modifiedRowsBody);
      this.dataRows = modifiedRowsBody;
    } else {
      this.dataRows = extractedRowsBody;
    }
  }

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;

    const fetchProducts = async () => {
      try {
        const productsData = await API.graphql({
          query: `query GetReport($id: ID!) {
        getReport(id: $id) {
          __typename
          id
          name
          email
          labLocation
          hviVersion
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          createdAt
          updatedAt
          owner
        }
      }`,
          variables: { id: this.decodedID },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        console.log('productsData', productsData);
        return productsData;
      } catch (error) {
        return error;
      }
    };

    this.decodeQueryParam(queryParams['code']);
    console.log('this.decodedID', this.decodedID);

    fetchProducts()
      .then((res: any) => {
        console.log('res, res', res);
        const retrievedReport = res.data.getReport;
        console.log('retrievedReport', retrievedReport);
        this.dbEntryData = [retrievedReport];
        this.dateCreated = new Date(
          this.dbEntryData[0].createdAt
        ).toDateString();
        console.log('dbEntryData', this.dbEntryData);
        this.parseData(this.dbEntryData[0].dataRows);
        this.isLoading = false;
      })
      .catch((error) => console.error(error));

    const letterHeadImageFromS3 = await Storage.get('wis-letterhead');
    this.letterHeadPreviewUrl = letterHeadImageFromS3;
  }
}
