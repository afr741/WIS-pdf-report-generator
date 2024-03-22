import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from '../AuthService';
import * as CryptoJS from 'crypto-js';
import { APIService, Report, ReportTemplate } from '../API.service';
import { Router, NavigationEnd } from '@angular/router';
import * as QRCode from 'qrcode';
import { Storage } from 'aws-amplify';
import { ZenObservable } from 'zen-observable-ts';
import { NotificationService } from '@progress/kendo-angular-notification';
import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

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
  public selectedLab: any = '';
  public pdfData: any = null;
  public reportUserEmail: string = '';
  private secretKey: string = 'wis';
  public isLoading: boolean = true;
  public qrImage: any = null;
  public qrImageURL: string = '';
  public currentUserEmail: string = '';
  public activeTemplateInfo: ReportTemplate | undefined = undefined;
  public error: string | null = null;
  public letterHeadPreviewUrl: string = '';
  public stampPreviewUrl: string = '';
  public letterHeadImage: any = null;
  public stampImage: any = null;
  public isManagerUp: boolean = false;
  public isSuperUser: boolean = false;
  public isButtonDisabled: boolean = false;

  private updateUserPreferenceSubscription: ZenObservable.Subscription | null =
    null;
  public loader = {
    type: <LoaderType>'converging-spinner',
    themeColor: <LoaderThemeColor>'info',
    size: <LoaderSize>'large',
  };
  constructor(
    private api: APIService,
    public router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.updateUserPreferenceSubscription = this.api
      .OnUpdateUserInfoListener()
      .subscribe((user: any) => {
        const updatedUser = user.value.data.onUpdateUserInfo;
        this.selectedHviVersion = updatedUser.hviVersion;
        if (this.selectedLab !== updatedUser.labLocation) {
          this.selectedLab = updatedUser.labLocation;
          fetchTemplateData().then(() => fetchData());
        }

        // console.log('userList update ng init', this.userList);
      });
    this.authService.getUserEmailAndLab().then((res) => {
      console.log('user lab', res);
      this.isManagerUp = res.userGroup.includes('managers');
      this.isSuperUser = res.userGroup.includes('admins');
      this.currentUserEmail = res.email;
    });

    this.api
      .ListUserInfos()
      .then((user) => {
        this.selectedHviVersion = user.items[0]?.hviVersion;
        this.selectedLab = user.items[0]?.labLocation;
      })
      .then(() => {
        try {
          fetchTemplateData().then(() => fetchData());
        } catch (error) {
          // Handle errors if any of the async functions fail
          this.displayStatus(false);
          this.error = `Error fetching: ${error}`;
          this.isLoading = false;
        }
      });
    const fetchData = () => {
      this.api
        .ListReports()
        .then((event) => {
          if (event.items.length == 0) {
            this.reports = [];
          }
          this.reports = (event.items as Report[])
            .sort((a, b) => {
              // sort by most recent date
              let dateA: any = new Date(a.updatedAt);
              let dateB: any = new Date(b.updatedAt);
              return dateB - dateA;
            })
            .filter((report: any) => {
              //show report list based on access level
              if (this.isSuperUser) {
                return true;
              }
              if (this.isManagerUp) {
                return report.labLocation == this.selectedLab;
              }
              return report.email == this.currentUserEmail;
            })
            .map(
              (report, index) =>
                (report = {
                  ...report,
                  updatedAt: new Date(report.updatedAt).toDateString(),
                })
            );

          console.log('this.reports', this.reports);
        })
        .then(() => {
          if (this.selectedHviVersion && this.reports.length > 0) {
            this.isLoading = false;
            // this.openAndDownloadCallBack(this.reports[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    //get template info
    const fetchTemplateData = async () => {
      this.isLoading = true;
      this.api
        .ListReportTemplates()
        .then((event) => {
          console.log('template info event', event);
          this.templateInfo = event.items as ReportTemplate[];
          const foundEntry = this.templateInfo.find(
            (item) => item.labLocation == this.selectedLab
          );
          this.activeTemplateInfo = foundEntry;

          console.log('found template info', foundEntry);
        })
        .then(() => {
          this.fetchTemplateImages();
        });
    };
  }

  async fetchTemplateImages() {
    // console.log('this.activeTemplateInfo', this.activeTemplateInfo);

    if (this.activeTemplateInfo) {
      if (this.activeTemplateInfo.letterHeadImageName) {
        this.letterHeadPreviewUrl = await Storage.get(
          this.activeTemplateInfo.letterHeadImageName
        );
        this.letterHeadImage = await this.getBase64ImageFromURL(
          this.letterHeadPreviewUrl
        );
      }

      if (this.activeTemplateInfo.stampImageName) {
        this.stampPreviewUrl = await Storage.get(
          this.activeTemplateInfo.stampImageName
        );
        this.stampImage = await this.getBase64ImageFromURL(
          this.stampPreviewUrl
        );
      }
    }
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

  async generateQRCodeImageAndURL(id: any) {
    const textToEncrypt = id;

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
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      stations,
      variety,
      createdAt,
      id,
    } = report;

    if (!dataRows || dataRows[0] === null) {
      this.displayStatus(false);
      this.error = 'Faied to extract data rows!';
      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);
    console.log('parsedRawData', parsedRawData);

    // number of elements based on elments in this row
    const keys = Object.keys(parsedRawData[7]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)![0]);
      const numB = parseInt(b.match(/\d+/)![0]);
      return numA - numB;
    });

    const averageRow = parsedRawData[33];
    const n24row = parsedRawData[34];
    // Convert array of objects to array of arrays
    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      return keys.map((key, keyIndex) => {
        let original = [0, 1, 14, 17];
        let isOneDec = [3, 4, 8, 10, 11, 12, 13, 15];
        let isTwoDec = [5, 6, 9, 16];
        let isThreeDec = [7];
        let cellValue = obj[key];
        //replaces row that has rowCOunt with final stats row
        if (index === 34 && key === '__EMPTY_1') {
          return averageRow.__EMPTY;
        }
        if (index === 34 && key === '__EMPTY_4') {
          const finalValue = n24row.__EMPTY_1.match(/\d+/) + n24row.__EMPTY_4;
          console.log('finalValue', finalValue);
          return finalValue;
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

    extractedRowsBody.splice(extractedRowsBody.length - 2, 1);

    //render docDefinition
    await this.renderPDF(
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id
    );
  }

  async processPDFDataV2(report: Report) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      stations,
      variety,
      createdAt,
      id,
    } = report;

    console.log('processpdfdata dataRows v2', dataRows);

    if (!dataRows || dataRows[0] === null) {
      this.displayStatus(false);
      this.error = 'Faied to extract data rows!';

      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);
    console.log('parsedRawData', parsedRawData);

    // number of elements based on elments in this row

    const keys = Object.keys(parsedRawData[6]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
    // console.log('keys v2', keys);

    const averageRow = parsedRawData[33];
    // Convert array of objects to array of arrays
    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      return keys.map((key, keyIndex) => {
        let original = [16];
        let isOneDec = [3, 7, 9, 10, 11, 12, 14];
        let isTwoDec = [4, 5, 8, 13, 15];
        let isThreeDec = [6];
        let cellValue = obj[key];
        if (index === 34 && key === '__EMPTY_1') {
          // console.log('averageRow', Object.values(averageRow)[0]);
          return Object.values(averageRow)[0];
        }
        //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
        if (obj.__EMPTY && keyIndex == 1) {
          // console.log('KEY OF ROW 31', obj.__EMPTY);
          return obj.__EMPTY;
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
    // to find the start of data body using "Time" word
    let bodyStartIndex = extractedRows.findIndex((array: any) =>
      array.includes('SCI')
    );

    // to find the end of data body using "Average" word
    let bodyEndIndex = extractedRows.findIndex((array: any) =>
      array.some(
        (element: any) => typeof element === 'string' && element.includes('Max')
      )
    );

    let extractedRowsBody = extractedRows.slice(
      bodyStartIndex,
      bodyEndIndex + 1
    );

    await this.renderPDF(
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id
    );
  }

  async processPDFDataV3(report: Report) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      stations,
      variety,
      createdAt,
      id,
    } = report;

    if (!dataRows || dataRows[0] === null) {
      this.displayStatus(false);
      this.error = 'Faied to extract data rows!';
      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);
    console.log('parsedRawData v3', parsedRawData);

    // number of elements based on elments in this row

    const keys = Object.keys(parsedRawData[5]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
    // console.log('keys v3', keys);

    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
      return keys.map((key, keyIndex) => {
        if (obj.__EMPTY && keyIndex == 1) {
          // console.log('KEY OF ROW 31', obj.__EMPTY);
          return obj.__EMPTY;
        }
        let cellValue = obj[key];
        let original = [16];
        let isOneDec = [4, 8, 10, 11, 12, 13, 14];
        let isTwoDec = [3, 5, 6, 9, 15];
        let isThreeDec = [7];

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
    // to find the start of data body using "Time" word
    let bodyStartIndex = extractedRows.findIndex((array: any) =>
      array.includes('Print Time')
    );

    // to find the end of data body using "Average" word
    let bodyEndIndex = extractedRows.findIndex((array: any) =>
      array.some(
        (element: any) => typeof element === 'string' && element.includes('Max')
      )
    );

    let extractedRowsBody = extractedRows.slice(
      bodyStartIndex + 1,
      bodyEndIndex + 1
    );
    await this.renderPDF(
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id
    );
  }

  async handleProcessingVersion(dataItem: any) {
    let version = this.selectedHviVersion;

    switch (version) {
      case 'v1':
        await this.processPDFDataV1(dataItem);
        break;
      case 'v2':
        await this.processPDFDataV2(dataItem);
        break;
      case 'v3':
        await this.processPDFDataV3(dataItem);
        break;
      default:
        console.log(`version doesnt exist!`);
        this.displayStatus(false);
        this.error = 'version does not exist';
        this.isLoading = false;
    }
    this.isLoading = false;
  }
  public async renderPDF(
    customerName: any,
    reportNum: any,
    stations: any,
    variety: any,
    lotNum: any,
    extractedRowsBody: any,
    createdAt: any,
    id: any
  ) {
    const { qrImage, qrURL } = await this.generateQRCodeImageAndURL(id);

    console.log('extractedRowsBody', extractedRowsBody);
    let qrImageProcessed = this.getBase64ImageFromURL(qrImage);
    let testLocation = '';
    let origin = '';
    if (this.activeTemplateInfo?.testLocation) {
      testLocation = this.activeTemplateInfo?.testLocation;
    }
    if (this.activeTemplateInfo?.origin) {
      origin = this.activeTemplateInfo?.origin;
    }

    let formatedDate = () => {
      let createdDate = new Date(createdAt);
      const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
      let date = `${createdDate.getFullYear()}.${month}.${
        createdDate.getDate() < 10 ? 0 : ''
      }${createdDate.getDate()}.`;

      return date;
    };

    const numberOfSamples =
      extractedRowsBody.length -
      (this.selectedHviVersion == 'v1'
        ? 3
        : this.selectedHviVersion == 'v2'
        ? 9
        : 9);
    if (extractedRowsBody.length == 0) {
      this.displayStatus(false);
    }
    // if (!this.activeTemplateInfo) return;
    let phone: any = '';
    let address: any = '';
    let addressTranslation: any = '';
    let fax: any = '';
    let email: any = '';
    let localCompanyName: any = '';
    let localCompanyNameTranslation: any = '';

    if (this.activeTemplateInfo) {
      phone = this.activeTemplateInfo.phone;
      address = this.activeTemplateInfo.address;
      addressTranslation = this.activeTemplateInfo.addressTranslation;
      fax = this.activeTemplateInfo.fax;
      email = this.activeTemplateInfo.email;
      localCompanyName = this.activeTemplateInfo.localCompanyName;
      localCompanyNameTranslation =
        this.activeTemplateInfo.localCompanyNameTranslation;
    }

    let docDefinition = {
      pageSize: 'A4',
      background: [
        this.stampImage && {
          image: await this.stampImage,
          fit: [150, 150],
          absolutePosition: { x: 410, y: 680 },
        },
        {
          link: qrURL,
          image: await qrImageProcessed,
          fit: [90, 90],
          absolutePosition: { x: 280, y: 700 },
        },
      ],
      content: [
        this.letterHeadImage && {
          width: 500,
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
              ['CI Report Number', reportNum, 'Station(As advised)', stations],
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
          text: `${localCompanyName}\n ${localCompanyNameTranslation}`,
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
                      text: `${address}, \nPh ${phone} \nFx ${fax}\nEm ${email}\n www.wiscontrol.com`,
                    },
                    {
                      width: 80,
                      text: `${addressTranslation}, \nPh ${phone} \nFx ${fax}\nEm ${email}\n www.wiscontrol.com`,
                    },
                  ],
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
          margin: [0, 15],
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
  }

  handlBackButton() {
    this.router.navigate(['/upload']);
  }

  async openAndDownloadCallBack(dataItem: any) {
    // console.log('openAndDownloadCallBack dataitem', dataItem);
    if (dataItem.dataRows === null) {
      console.log('failed to process!', dataItem.dataRows);
      this.error = 'Row are not processed!';
      this.displayStatus(false);
    } else {
      console.log('all good!', dataItem);
      this.error = null;
      this.handleProcessingVersion(dataItem);
    }
  }
  async openPDF(dataItem: any) {
    await this.openAndDownloadCallBack(dataItem)
      .then(() => {
        // if (this.pdfData !== null)
        this.isButtonDisabled = true;
        setTimeout(() => {
          pdfMake
            .createPdf(this.pdfData, undefined, undefined, pdfFonts.pdfMake.vfs)
            .open();
          this.isButtonDisabled = false;
        }, 2000);
      })
      .catch((e) => {
        this.error = e;
        this.displayStatus(false);
      });

    // this.pdfData = null;
  }

  async downloadPDF(dataItem: any) {
    await this.openAndDownloadCallBack(dataItem).then(() => {
      this.isButtonDisabled = true;

      setTimeout(() => {
        pdfMake
          .createPdf(this.pdfData, undefined, undefined, pdfFonts.pdfMake.vfs)
          .download();
        this.isButtonDisabled = false;
      }, 2000);
    });

    // this.pdfData = null;
  }
  handleEditTemplate(): void {
    this.router.navigate(['/edit']);
  }
  public displayStatus(isUpdated: boolean): void {
    this.notificationService.show({
      content: isUpdated ? 'Updated!' : 'Update failed, try again',
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'bottom' },
      type: { style: isUpdated ? 'success' : 'error', icon: true },
      closable: true,
    });
  }
}
