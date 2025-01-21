import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { APIService, Report } from '../API.service';
// import { DataparseService } from '../dataparse.service';
import { PdfparseService } from '../pdfparse.service';

import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Storage } from 'aws-amplify';
import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';
import { API, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';

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

  constructor(
    private api: APIService,
    // private dataParsingService: DataparseService,
    private pdfService: PdfparseService,
    private route: ActivatedRoute
  ) {
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
    console.log('decryptedText', decryptedText);
    this.decodedID = decryptedText;
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

    await fetchProducts()
      .then((event: any) => {
        console.log('then event', event);
        this.dbEntryData = [event.data.getReport];
        this.dateCreated = new Date(
          this.dbEntryData[0].createdAt
        ).toDateString();

        console.log('dbEntryData', this.dbEntryData);
        this.pdfService
          .handleProcessingVersion(
            this.dbEntryData[0],
            this.dbEntryData[0].hviVersion,
            (e: any) => {
              console.log(e);
            }
          )
          .then((data) => {
            this.isLoading = false;
            this.dataRows = data.extractedRowsBody;
            console.log('data', data);
          });
        // this.dataRows = this.dataParsingService.handleProcessingVersion(
        //   this.dbEntryData[0].dataRows,
        //   this.dbEntryData[0].hviVersion
        // );
      })
      .catch((e: any) => console.log('error', e));

    const letterHeadImageFromS3 = await Storage.get(
      `wis-letterhead-${this.dbEntryData[0].labLocation}`
    );

    console.log('letterHeadImageFromS3list', letterHeadImageFromS3);
    this.letterHeadPreviewUrl = letterHeadImageFromS3;
  }
}
