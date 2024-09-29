import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from '../AuthService';
import * as CryptoJS from 'crypto-js';
import { APIService, Report, ReportTemplate } from '../API.service';
import { PdfparseService } from '../pdfparse.service';
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
    private authService: AuthService,
    private pdfService: PdfparseService
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
      this.isManagerUp = res?.userGroup?.includes('managers') ?? false;
      this.isSuperUser = res?.userGroup?.includes('admins') ?? false;
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
          this.handleShowError(error);
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
        })
        .then(() => {
          this.fetchTemplateImages();
        });
    };
  }

  ngOnDestroy() {
    if (this.updateUserPreferenceSubscription) {
      this.updateUserPreferenceSubscription.unsubscribe();
    }
    this.updateUserPreferenceSubscription = null;
  }

  async fetchTemplateImages() {
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
    const fetchedImageURL = `${appURL}/qrcode?code=${ecnryptedURLParam}`;
    const fetchedImage = await QRCode.toDataURL(fetchedImageURL);

    return { qrImage: fetchedImage, qrURL: fetchedImageURL };
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

  public async renderPDF(res: any) {
    const {
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
    } = res;
    console.log('extractedRowsBody', extractedRowsBody);
    const { qrImage, qrURL } = await this.generateQRCodeImageAndURL(id);

    let qrImageProcessed = await this.getBase64ImageFromURL(qrImage);
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

    const numberOfSamples = () => {
      switch (this.selectedHviVersion) {
        case 'v1':
          return extractedRowsBody.length - 3;
        case 'v2':
          return extractedRowsBody.length - 9;

        case 'v3':
          return extractedRowsBody.length - 9;

        case 'v4':
          return extractedRowsBody.length - 1;

        default:
          return extractedRowsBody.length - 1;
      }
    };

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
    let singlePageRowLimit = 34;
    let remarks: any = [];
    if (this.activeTemplateInfo) {
      phone = this.activeTemplateInfo.phone;
      address = this.activeTemplateInfo.address;
      addressTranslation = this.activeTemplateInfo.addressTranslation;
      fax = this.activeTemplateInfo.fax;
      email = this.activeTemplateInfo.email;
      localCompanyName = this.activeTemplateInfo.localCompanyName;
      localCompanyNameTranslation =
        this.activeTemplateInfo.localCompanyNameTranslation;
      remarks = this.activeTemplateInfo.remarksList;
    }

    let docDefinition = {
      pageSize: 'A4',
      background:
        this.stampImage && extractedRowsBody.length < singlePageRowLimit
          ? [
              {
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
            ]
          : null,
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
                `${numberOfSamples()} samples`,
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
        {},
        {
          style: 'remarksBullets',
          ol: remarks,
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

        extractedRowsBody.length > singlePageRowLimit
          ? this.stampImage && {
              image: await this.stampImage,
              fit: [150, 150],
              absolutePosition: { x: 410, y: 680 },
            }
          : null,
        extractedRowsBody.length > singlePageRowLimit
          ? {
              link: qrURL,
              image: await qrImageProcessed,
              fit: [90, 90],
              absolutePosition: { x: 280, y: 680 },
            }
          : null,
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

  async openAndDownloadCallBack(dataItem: any) {
    if (dataItem.dataRows === null) {
      this.handleShowError('Row are not processed');
    } else {
      this.error = null;
      await this.pdfService
        .handleProcessingVersion(
          dataItem,
          this.selectedHviVersion,
          this.handleShowError
        )
        .then((res) => {
          this.renderPDF(res);
        });
    }
  }
  async openPDF(dataItem: any) {
    await this.openAndDownloadCallBack(dataItem)
      .then(() => {
        this.isButtonDisabled = true;
        setTimeout(() => {
          pdfMake
            .createPdf(this.pdfData, undefined, undefined, pdfFonts.pdfMake.vfs)
            .open();
          this.isButtonDisabled = false;
        }, 2000);
      })
      .catch((e) => {
        this.handleShowError(e);
      });
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
  }

  handlBackButton() {
    this.router.navigate(['/upload']);
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

  handleShowError(errorText: any) {
    this.displayStatus(false);
    this.error = errorText ? `${errorText}` : 'error occured!';
    this.isLoading = false;
  }
}
