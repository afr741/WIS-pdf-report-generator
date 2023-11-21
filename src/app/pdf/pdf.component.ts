import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as CryptoJS from 'crypto-js';
import { APIService, Report } from '../API.service';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
// import letterHead from '../../assets/images/letterhead.png';
// const logo = require('../../assets/images/letterhead.png').default as string;

import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],
})
export class PdfComponent implements OnInit {
  public reports: Array<Report> = [];
  public listOfReports: Report[] = [];
  public pdfData: any = null;
  private secretKey: string = 'wis';
  public isLoading: boolean = true;
  public qrImage: any = null;
  public qrImageURL: string = '';
  public error: string | null = null;
  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };
  constructor(private api: APIService, public router: Router) {}

  async ngOnInit() {
    let pollingAttempts = 0;

    const fetchData = async () => {
      await this.api
        .ListReports()
        .then((event) => {
          this.reports = event.items as Report[];
          this.reports.sort((a, b) => {
            let dateA: any = new Date(a.updatedAt);
            let dateB: any = new Date(b.updatedAt);
            return dateB - dateA;
          });
        })
        .then(() => {
          this.listOfReports = this.reports;
        })
        .catch((err) => {
          console.log(err);
        });
      console.log('sorted reports', this.reports);

      if (this.reports[0].dataRows == null) {
        if (pollingAttempts < 10) {
          // Limit the number of polling attempts
          pollingAttempts++;
          setTimeout(fetchData, 3000);
        } else {
          console.log('Data not available after 10 polling attempts.');
          this.isLoading = false;
          // Handle the case where data is not available.
        }
      } else {
        this.isLoading = false;
        console.log(await this.processPDFData(this.reports[0]));
        // this.processPDFData();
      }
    };

    fetchData(); // Start the initial data fetch.
  }

  makeUrlFriendly(encryptedText: string): string {
    // URL-encode the base64 string
    const urlFriendlyText = encodeURIComponent(encryptedText);

    return urlFriendlyText;
  }

  async generateQRCodeImageAndURL() {
    const textToEncrypt = this.reports[0].id;

    const encryptedText = CryptoJS.AES.encrypt(
      textToEncrypt,
      this.secretKey
    ).toString();
    const ecnryptedURLParam: string = this.makeUrlFriendly(encryptedText);
    const appURL = window.location.origin;
    console.log('encrypted url', ecnryptedURLParam, ' current url', appURL);
    this.qrImageURL = `${appURL}/qrcode?code=${ecnryptedURLParam}`;
    this.qrImage = await QRCode.toDataURL(this.qrImageURL);
    return { qrImage: this.qrImage, qrURL: this.qrImageURL };
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  async processPDFData(report: Report) {
    // let data = this.reports[index].dataRows;
    let {
      dataRows,
      name,
      testLocation,
      reportNum,
      lotNum,
      customerName,
      origin,
      stations,
      variety,
      createdAt,
    } = report;

    let formatedDate = new Date(createdAt).toDateString();
    console.log('formated date', formatedDate);
    let data = dataRows;
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

    console.log(
      'lastTwoArrays:',
      lastTwoArrays,
      'mainArr:',
      mainArr,
      'extracted rows',
      extractedRows
    );
    let arrayedRows = [];
    for (let i = 0; i < extractedRows.length; i++) {
      let innerArray = extractedRows[i];

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

    console.log('arrayedRows', arrayedRows);
    const { qrImage, qrURL } = await this.generateQRCodeImageAndURL();
    let columnWidth = arrayedRows[0].length;
    let columnWidthArray = new Array(columnWidth).fill(10);
    console.log('columnWidthArray', columnWidthArray);
    let docDefinition = {
      content: [
        {
          width: 520,
          margin: [0, 10],
          image: await this.getBase64ImageFromURL(
            '../../assets/images/letterhead.png'
          ),
        },
        {
          table: {
            // widths: ['*', 'auto', 100, '*'],
            style: 'header',
            body: [
              ['Test Location', testLocation, 'Recepient', customerName],
              ['CI Number', reportNum, 'ORIGIN', origin],
              ['CI Report Number', reportNum, 'Station(As advised)', stations],
              ['Date', formatedDate, 'Variety(As advised)', variety],
              [
                'Lot number',
                lotNum,
                { text: 'Sample drawn by customer', bold: true },
                '24',
              ],
            ],
          },
        },
        {
          style: 'dataTable',
          layout: 'lightHorizontalLines',

          table: {
            margin: [-40, 10],
            widths: columnWidthArray,
            body: arrayedRows,
          },
        },
        { image: qrImage, width: 100 },
        {
          style: 'qrCodeText',
          text: 'Scan the QR Code or click here',
          link: qrURL,
        },
      ],
      styles: {
        header: {
          fontSize: 8,
          bold: true,
        },
        dataTable: {
          fontSize: 6,
        },
        qrCodeText: {
          fontSize: 8,
        },
      },
    };

    this.pdfData = docDefinition;
  }

  async openAndDownloadCallBack(dataItem: any) {
    console.log('openPDF', dataItem);
    if (dataItem.dataRows === null) {
      this.error = 'Row are not processed!';
      console.log(this.error);
    } else {
      this.error = null;
      await this.processPDFData(dataItem);
    }
  }
  async openPDF(dataItem: any) {
    await this.openAndDownloadCallBack(dataItem).then(() =>
      pdfMake
        .createPdf(this.pdfData, undefined, undefined, pdfFonts.pdfMake.vfs)
        .open()
    );

    // this.pdfData = null;
  }

  async downloadPDF(dataItem: any) {
    await this.openAndDownloadCallBack(dataItem).then(() =>
      pdfMake
        .createPdf(this.pdfData, undefined, undefined, pdfFonts.pdfMake.vfs)
        .download()
    );

    // this.pdfData = null;
  }
}
