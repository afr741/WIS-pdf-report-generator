import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as CryptoJS from 'crypto-js';
import { APIService, Report, ReportTemplate } from '../API.service';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { Storage } from 'aws-amplify';
import { ZenObservable } from 'zen-observable-ts';

import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

// import letterHead from '../../assets/images/letterhead.png';
// const logo = require('../../assets/images/letterhead.png').default as string;
const REMARKS = {
  part1: [
    'Note: Samples were NOT drawn by WIS.',
    'Samples tested will be stored for 3 months only, after which they will be disposed of at Wakefield’s discretion, unless otherwise instructed.',
    'All comments and queries of results shown in this report should be made in writing within thirty days of the issue of this report.',
    'The report shall not be used for Litigation or Publicity.',
    "If reguired WIS may send its own personal to draw the samples at customer's cost.",
  ],
  part2:
    'This report reflects only the results of test carried out on samples submitted to us and tested on S.I.T.C. instruments on the date(s) mentioned and at the location shown, does not certify to any description given and is issued without prejudice. In all instance only the English version of this report is to be considered definitive and correct. Test and lab conditions The tests were made under the conditions laid down in the Guideline for Instrument Testing of Cotton, published by; ICAC Task Force on Commercial Standardization of Instrument Testing of Cotton (CSITC) and ITMF International Committee on Cotton Testing Methods (ICCTM)',
  part3: [
    'HVI Calibration Cottons used for calibration.',
    'A laboratory temperature of 21° ± 1° C',
    'A relative humidity of 65 ± 2%',
    'A sample moisture level between 6.75% and 8.25%',
    'Standard instrument tolerance applicable',
  ],
  part4: 'ЧСП "Точикистон-ВИС (Санчиши мустакили пахта)"',
  part5: 'JSC "Tajikistan-WIS (Independent inspection 0f cotton)"',
};

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],
})
export class PdfComponent implements OnInit {
  public reports: Array<Report> = [];
  public templateInfo: ReportTemplate[] = [];
  public selectedHviVersion: any = 'v1';
  public pdfData: any = null;
  private secretKey: string = 'wis';
  public isLoading: boolean = true;
  public qrImage: any = null;
  public qrImageURL: string = '';
  public error: string | null = null;
  public letterHeadPreviewUrl: string = '';
  public stampPreviewUrl: string = '';
  public letterHeadImage: any = null;
  public stampImage: any = null;
  private updateUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;
  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };
  constructor(private api: APIService, public router: Router) {}

  async ngOnInit() {
    let pollingAttempts = 0;

    this.updateUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.selectedHviVersion = updatedUser.hviVersion;
        console.log(
          'ZOZO UPDATED USER',
          updatedUser,
          'selecte version,',
          this.selectedHviVersion
        );

        // console.log('userList update ng init', this.userList);
      });

    this.api.ListUserInfos().then((user) => {
      this.selectedHviVersion = user.items[0]?.hviVersion;
      console.log('list user', user);
    });
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

          this.reports = this.reports.map(
            (report, index) =>
              (report = {
                ...report,
                updatedAt: new Date(report.updatedAt).toDateString(),
              })
          );
          // this.openPDF(this.reports[0]);
          if (this.reports[0].dataRows == null) {
            if (pollingAttempts < 5) {
              // Limit the number of polling attempts
              pollingAttempts++;
              setTimeout(fetchData, 3000);
            } else {
              console.log('Data not available after 5 polling attempts.');
              this.isLoading = false;
              this.error = 'Sorry, unable to extract data, please try again';
            }
          } else {
            if (this.reports[0].dataRows !== null) {
              this.handleProcessingVersion(this.reports[0]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
      console.log('sorted reports', this.reports);
    };
    const fetchTemplateData = async () => {
      await this.api
        .ListReportTemplates()
        .then((event) => {
          this.templateInfo = event.items as ReportTemplate[];
        })
        .catch((err) => {
          console.log(err);
        });
      console.log('template info', this.templateInfo);
      if (this.templateInfo[0].letterHeadImageName) {
        this.letterHeadPreviewUrl = await Storage.get(
          this.templateInfo[0].letterHeadImageName
        );
        this.letterHeadImage = await this.getBase64ImageFromURL(
          this.letterHeadPreviewUrl
        );
      }

      if (this.templateInfo[0].stampImageName) {
        this.stampPreviewUrl = await Storage.get(
          this.templateInfo[0].stampImageName
        );
        this.stampImage = await this.getBase64ImageFromURL(
          this.stampPreviewUrl
        );
      }
    };

    try {
      fetchTemplateData().then(() => fetchData());
    } catch (error) {
      // Handle errors if any of the async functions fail
      this.error = 'Error fetching, try again';
    }
    // fetchData(); // Start the initial data fetch.
  }
  ngOnDestroy() {
    if (this.updateUserPreferenceSubscription) {
      this.updateUserPreferenceSubscription.unsubscribe();
    }
    this.updateUserPreferenceSubscription = null;
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
    // console.log('encrypted url', ecnryptedURLParam, ' current url', appURL);
    this.qrImageURL = `${appURL}/qrcode?code=${ecnryptedURLParam}`;
    this.qrImage = await QRCode.toDataURL(this.qrImageURL);
    return { qrImage: this.qrImage, qrURL: this.qrImageURL };
  }

  getBase64ImageFromURL(url: string = '../../assets/images/letterhead.png') {
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

  async processPDFDataV1(report: Report) {
    try {
      let {
        dataRows,
        reportNum,
        lotNum,
        customerName,
        stations,
        variety,
        createdAt,
      } = report;
      let { testLocation, origin } = this.templateInfo[0];
      console.log('processpdfdata dataRows', dataRows);

      let formatedDate = () => {
        let createdDate = new Date(createdAt);
        const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
        let date = `${createdDate.getFullYear()}.${month}.${
          createdDate.getDate() < 10 ? 0 : ''
        }${createdDate.getDate()}.`;

        return date;
      };

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
      const numberOfSamples = extractedRowsBody.length - 4;

      // console.log('extractedRows', extractedRows);
      // console.log('extractedRowsBody,', extractedRowsBody);
      // console.log(
      //   'bodyStartIndex',
      //   bodyStartIndex,
      //   'bodyEndIndex',
      //   bodyEndIndex
      // );

      const { qrImage, qrURL } = await this.generateQRCodeImageAndURL();
      let docDefinition = {
        pageSize: 'A4',
        background: [
          {
            image: await this.stampImage,
            fit: [150, 150],
            absolutePosition: { x: 380, y: 660 },
          },
        ],
        content: [
          {
            width: 520,
            margin: [0, 10],
            image: await this.letterHeadImage,
          },
          {
            style: 'header',
            layout: 'noBorders',
            table: {
              widths: [140, 140, 140, 140, 140],
              body: [
                ['Test Location', testLocation, 'Recepient', customerName],
                ['CI Number', reportNum, 'ORIGIN', origin],
                [
                  'CI Report Number',
                  reportNum,
                  'Station(As advised)',
                  stations,
                ],
                ['Date', formatedDate(), 'Variety(As advised)', variety],
                [
                  'Lot number',
                  lotNum,
                  { text: 'Samples drawn by customer', bold: true },
                  `${numberOfSamples} samples`,
                ],
              ],
            },
          },
          {
            style: 'dataTable',
            layout: {
              hLineWidth: function (i: any, node: any) {
                if (i === 0 || i === node.table.body.length) {
                  return 0;
                }
                return i === node.table.headerRows ? 2 : 1;
              },
              vLineWidth: () => 0,
            },
            table: {
              headerRows: 1,
              // widths: columnWidthArray,
              // heights: 1,
              body: extractedRowsBody,
            },
          },

          { text: '\n\nRemarks', style: 'remarks' },
          {
            style: 'remarksBullets',
            ol: REMARKS.part1,
          },
          {
            style: 'remarksBullets',
            text: REMARKS.part2,
          },
          {
            style: 'remarksBullets',
            ol: REMARKS.part3,
          },
          {
            text: `${this.templateInfo[0].localCompanyName}\n ${this.templateInfo[0].localCompanyNameTranslation}`,
            style: 'contactsHeader',
          },

          {
            table: {
              widths: [170, 140, 140],
              body: [
                [
                  {
                    style: 'contactsColumns',
                    columns: [
                      {
                        width: 80,
                        text: `${this.templateInfo[0].address}, \nPh ${this.templateInfo[0].phone} \nFx ${this.templateInfo[0].fax}\nEm ${this.templateInfo[0].email}\n www.wiscontrol.com`,
                      },
                      {
                        width: 80,
                        text: `${this.templateInfo[0].addressTranslation}, \nPh ${this.templateInfo[0].phone} \nFx ${this.templateInfo[0].fax}\nEm ${this.templateInfo[0].email}\n www.wiscontrol.com`,
                      },
                    ],
                  },

                  {
                    link: qrURL,
                    image: qrImage,
                    fit: [90, 90],
                  },
                ],
              ],
            },
            layout: 'noBorders',
          },
        ],
        styles: {
          header: {
            fontSize: 8,
          },
          dataTable: {
            margin: [15, 5],
            fontSize: 6,
          },
          qrCodeText: {
            fontSize: 8,
          },
          remarks: {
            fontSize: 6,
          },
          remarksBullets: {
            fontSize: 6,
          },
          contactsHeader: {
            fontSize: 7,
            bold: true,
            margin: [0, 10, 0, 3],
          },
          contactsColumns: {
            fontSize: 6,
          },
        },
      };

      this.pdfData = docDefinition;
      this.isLoading = false;
    } catch (error) {
      this.error = `${error}`;
    }
  }

  async processPDFDataV2(report: Report) {
    try {
      let {
        dataRows,
        reportNum,
        lotNum,
        customerName,
        stations,
        variety,
        createdAt,
      } = report;
      let { testLocation, origin } = this.templateInfo[0];
      console.log('processpdfdata dataRows', dataRows);

      let formatedDate = () => {
        let createdDate = new Date(createdAt);
        const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
        let date = `${createdDate.getFullYear()}.${month}.${
          createdDate.getDate() < 10 ? 0 : ''
        }${createdDate.getDate()}.`;

        return date;
      };

      if (!dataRows || dataRows[0] === null) {
        // this.error = 'Faied to extract data rows!';
        return;
      }

      let parsedRawData = JSON.parse(dataRows[0]);
      console.log('parsedRawData', parsedRawData);

      // number of elements based on elments in this row
      const keys = Object.keys(parsedRawData[6]);

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
        array.includes('SCI')
      );

      // to find the end of data body using "Average" word
      let bodyEndIndex = extractedRows.findIndex((array: any) =>
        array.some(
          (element: any) =>
            typeof element === 'string' && element.includes('Max')
        )
      );

      let extractedRowsBody = extractedRows.slice(
        bodyStartIndex,
        bodyEndIndex + 1
      );
      const numberOfSamples = extractedRowsBody.length - 4;

      console.log('extractedRows', extractedRows);
      console.log('extractedRowsBody,', extractedRowsBody);
      console.log(
        'bodyStartIndex',
        bodyStartIndex,
        'bodyEndIndex',
        bodyEndIndex
      );

      const { qrImage, qrURL } = await this.generateQRCodeImageAndURL();
      let docDefinition = {
        pageSize: 'A4',
        background: [
          {
            image: await this.stampImage,
            fit: [150, 150],
            absolutePosition: { x: 380, y: 660 },
          },
        ],
        content: [
          {
            width: 520,
            margin: [0, 10],
            image: await this.letterHeadImage,
          },
          {
            style: 'header',
            layout: 'noBorders',
            table: {
              widths: [140, 140, 140, 140, 140],
              body: [
                ['Test Location', testLocation, 'Recepient', customerName],
                ['CI Number', reportNum, 'ORIGIN', origin],
                [
                  'CI Report Number',
                  reportNum,
                  'Station(As advised)',
                  stations,
                ],
                ['Date', formatedDate(), 'Variety(As advised)', variety],
                [
                  'Lot number',
                  lotNum,
                  { text: 'Samples drawn by customer', bold: true },
                  `${numberOfSamples} samples`,
                ],
              ],
            },
          },
          {
            style: 'dataTable',
            layout: {
              hLineWidth: function (i: any, node: any) {
                if (i === 0 || i === node.table.body.length) {
                  return 0;
                }
                return i === node.table.headerRows ? 2 : 1;
              },
              vLineWidth: () => 0,
            },
            table: {
              headerRows: 1,
              // widths: columnWidthArray,
              // heights: 1,
              body: extractedRowsBody,
            },
          },

          { text: '\n\nRemarks', style: 'remarks' },
          {
            style: 'remarksBullets',
            ol: REMARKS.part1,
          },
          {
            style: 'remarksBullets',
            text: REMARKS.part2,
          },
          {
            style: 'remarksBullets',
            ol: REMARKS.part3,
          },
          {
            text: `${this.templateInfo[0].localCompanyName}\n ${this.templateInfo[0].localCompanyNameTranslation}`,
            style: 'contactsHeader',
          },

          {
            table: {
              widths: [170, 140, 140],
              body: [
                [
                  {
                    style: 'contactsColumns',
                    columns: [
                      {
                        width: 80,
                        text: `${this.templateInfo[0].address}, \nPh ${this.templateInfo[0].phone} \nFx ${this.templateInfo[0].fax}\nEm ${this.templateInfo[0].email}\n www.wiscontrol.com`,
                      },
                      {
                        width: 80,
                        text: `${this.templateInfo[0].addressTranslation}, \nPh ${this.templateInfo[0].phone} \nFx ${this.templateInfo[0].fax}\nEm ${this.templateInfo[0].email}\n www.wiscontrol.com`,
                      },
                    ],
                  },

                  {
                    link: qrURL,
                    image: qrImage,
                    fit: [90, 90],
                  },
                ],
              ],
            },
            layout: 'noBorders',
          },
        ],
        styles: {
          header: {
            fontSize: 8,
          },
          dataTable: {
            margin: [15, 5],
            fontSize: 6,
          },
          qrCodeText: {
            fontSize: 8,
          },
          remarks: {
            fontSize: 6,
          },
          remarksBullets: {
            fontSize: 6,
          },
          contactsHeader: {
            fontSize: 7,
            bold: true,
            margin: [0, 10, 0, 3],
          },
          contactsColumns: {
            fontSize: 6,
          },
        },
      };

      this.pdfData = docDefinition;
      this.isLoading = false;
    } catch (error) {
      this.error = `${error}`;
    }
  }

  async processPDFDataV3(report: Report) {
    try {
      let {
        dataRows,
        reportNum,
        lotNum,
        customerName,
        stations,
        variety,
        createdAt,
      } = report;
      let { testLocation, origin } = this.templateInfo[0];
      console.log('processpdfdata dataRows', dataRows);

      let formatedDate = () => {
        let createdDate = new Date(createdAt);
        const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
        let date = `${createdDate.getFullYear()}.${month}.${
          createdDate.getDate() < 10 ? 0 : ''
        }${createdDate.getDate()}.`;

        return date;
      };

      if (!dataRows || dataRows[0] === null) {
        // this.error = 'Faied to extract data rows!';
        return;
      }

      let parsedRawData = JSON.parse(dataRows[0]);
      console.log('parsedRawData', parsedRawData);

      // number of elements based on elments in this row
      const keys = Object.keys(parsedRawData[5]);

      // const averageRow = parsedRawData[33];
      // Convert array of objects to array of arrays
      const extractedRows = parsedRawData.map((obj: any, index: any) => {
        return keys.map((key) => {
          let cellValue = obj[key];
          // if (index === 34 && key === '__EMPTY_1') {
          //   // console.log('averageRow', Object.values(averageRow)[0]);
          //   return Object.values(averageRow)[0];
          // }
          let roundedCellValue = isNaN(cellValue)
            ? cellValue
            : Number(cellValue).toFixed(2);
          return roundedCellValue || '';
        });
      });
      // to find the start of data body using "Time" word
      let bodyStartIndex = extractedRows.findIndex((array: any) =>
        array.includes('Print Time')
      );

      // to find the end of data body using "Average" word
      let bodyEndIndex = extractedRows.findIndex((array: any) =>
        array.some(
          (element: any) =>
            typeof element === 'string' && element.includes('Max')
        )
      );

      let extractedRowsBody = extractedRows.slice(
        bodyStartIndex,
        bodyEndIndex + 1
      );
      const numberOfSamples = extractedRowsBody.length - 4;

      console.log('extractedRows', extractedRows);
      console.log('extractedRowsBody,', extractedRowsBody);
      console.log(
        'bodyStartIndex',
        bodyStartIndex,
        'bodyEndIndex',
        bodyEndIndex
      );

      const { qrImage, qrURL } = await this.generateQRCodeImageAndURL();
      let docDefinition = {
        pageSize: 'A4',
        background: [
          {
            image: await this.stampImage,
            fit: [150, 150],
            absolutePosition: { x: 380, y: 660 },
          },
        ],
        content: [
          {
            width: 520,
            margin: [0, 10],
            image: await this.letterHeadImage,
          },
          {
            style: 'header',
            layout: 'noBorders',
            table: {
              widths: [140, 140, 140, 140, 140],
              body: [
                ['Test Location', testLocation, 'Recepient', customerName],
                ['CI Number', reportNum, 'ORIGIN', origin],
                [
                  'CI Report Number',
                  reportNum,
                  'Station(As advised)',
                  stations,
                ],
                ['Date', formatedDate(), 'Variety(As advised)', variety],
                [
                  'Lot number',
                  lotNum,
                  { text: 'Samples drawn by customer', bold: true },
                  `${numberOfSamples} samples`,
                ],
              ],
            },
          },
          {
            style: 'dataTable',
            layout: {
              hLineWidth: function (i: any, node: any) {
                if (i === 0 || i === node.table.body.length) {
                  return 0;
                }
                return i === node.table.headerRows ? 2 : 1;
              },
              vLineWidth: () => 0,
            },
            table: {
              headerRows: 1,
              // widths: columnWidthArray,
              // heights: 1,
              body: extractedRowsBody,
            },
          },

          { text: '\n\nRemarks', style: 'remarks' },
          {
            style: 'remarksBullets',
            ol: REMARKS.part1,
          },
          {
            style: 'remarksBullets',
            text: REMARKS.part2,
          },
          {
            style: 'remarksBullets',
            ol: REMARKS.part3,
          },
          {
            text: `${this.templateInfo[0].localCompanyName}\n ${this.templateInfo[0].localCompanyNameTranslation}`,
            style: 'contactsHeader',
          },

          {
            table: {
              widths: [170, 140, 140],
              body: [
                [
                  {
                    style: 'contactsColumns',
                    columns: [
                      {
                        width: 80,
                        text: `${this.templateInfo[0].address}, \nPh ${this.templateInfo[0].phone} \nFx ${this.templateInfo[0].fax}\nEm ${this.templateInfo[0].email}\n www.wiscontrol.com`,
                      },
                      {
                        width: 80,
                        text: `${this.templateInfo[0].addressTranslation}, \nPh ${this.templateInfo[0].phone} \nFx ${this.templateInfo[0].fax}\nEm ${this.templateInfo[0].email}\n www.wiscontrol.com`,
                      },
                    ],
                  },

                  {
                    link: qrURL,
                    image: qrImage,
                    fit: [90, 90],
                  },
                ],
              ],
            },
            layout: 'noBorders',
          },
        ],
        styles: {
          header: {
            fontSize: 8,
          },
          dataTable: {
            margin: [15, 5],
            fontSize: 6,
          },
          qrCodeText: {
            fontSize: 8,
          },
          remarks: {
            fontSize: 6,
          },
          remarksBullets: {
            fontSize: 6,
          },
          contactsHeader: {
            fontSize: 7,
            bold: true,
            margin: [0, 10, 0, 3],
          },
          contactsColumns: {
            fontSize: 6,
          },
        },
      };

      this.pdfData = docDefinition;
      this.isLoading = false;
    } catch (error) {
      this.error = `${error}`;
    }
  }

  async handleProcessingVersion(dataItem: any) {
    let version = this.selectedHviVersion;
    console.log(
      'handleProcessingVersion, version,',
      'handleProcessing dataItem',
      dataItem
    );
    switch (version) {
      case 'v1':
        return this.processPDFDataV1(dataItem);
        break;
      case 'v2':
        return this.processPDFDataV2(dataItem);
      case 'v3':
        return this.processPDFDataV3(dataItem);
        break;
      default:
        console.log(`version doesnt exist!`);
    }
  }

  handlBackButton() {
    this.router.navigate(['/upload']);
  }

  async openAndDownloadCallBack(dataItem: any) {
    console.log('openPDF', dataItem);
    if (dataItem.dataRows === null) {
      this.error = 'Row are not processed!';
      console.log(this.error);
    } else {
      this.error = null;
      await this.handleProcessingVersion(dataItem);
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
  handleEditTemplate(): void {
    this.router.navigate(['/edit']);
  }
}
