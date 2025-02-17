import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from '../AuthService';
import * as CryptoJS from 'crypto-js';
import { APIService, Report, ReportTemplate } from '../API.service';
import { PdfparseService } from '../pdfparse.service';
import { Router } from '@angular/router';
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
  public certificationImagePreviewUrl: string = '';

  public letterHeadImage: any = null;
  public stampImage: any = null;
  public certificationImage: any = null;

  public isManagerUp: boolean = false;
  public isSuperUser: boolean = false;
  public isButtonDisabled: boolean = false;
  public customFonts: any;

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
        this.updateFonts();
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
          // console.log('event.items ', event.items);
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

  updateFonts() {
    (pdfMake as any).fonts =
      this.selectedHviVersion === 'v5'
        ? {
            NotoSansSC: {
              normal: `${window.location.origin}/assets/fonts/Noto_Sans_SC/static/NotoSansSC-Regular.ttf`,
              bold: `${window.location.origin}/assets/fonts/Noto_Sans_SC/static/NotoSansSC-Bold.ttf`,
            },
          }
        : (pdfMake as any).fonts;
  }

  async fetchTemplateImages() {
    if (this.activeTemplateInfo) {
      this.isLoading = true;
      const imagePromises = [];

      if (this.activeTemplateInfo.letterHeadImageName) {
        imagePromises.push(
          Storage.get(this.activeTemplateInfo.letterHeadImageName).then((url) =>
            /*************  ✨ Codeium Command ⭐  *************/
            /**
             * Fetches the template images associated with the currently selected lab.
             * If the lab has a letterhead, stamp, or certification image, it will be fetched and stored in
             * the component's properties.
             * @returns {Promise<void>}
             */
            /******  d3550224-273f-4527-b128-a859096a25fb  *******/ this.getBase64ImageFromURL(
              url
            ).then((image) => {
              this.letterHeadImage = image;
            })
          )
        );
      }

      if (this.activeTemplateInfo.stampImageName) {
        imagePromises.push(
          Storage.get(this.activeTemplateInfo.stampImageName).then((url) =>
            this.getBase64ImageFromURL(url).then((image) => {
              this.stampImage = image;
            })
          )
        );
        console.log('stampImage', this.stampImage);
      }

      if (this.activeTemplateInfo.certificationImageTop) {
        imagePromises.push(
          Storage.get(this.activeTemplateInfo.certificationImageTop).then(
            (url) =>
              this.getBase64ImageFromURL(url).then((image) => {
                this.certificationImage = image;
              })
          )
        );
      }

      Promise.all(imagePromises)
        .then(() => {
          this.isLoading = false;
        })
        .catch((error) => {
          console.error('Error loading images:', error);
          this.isLoading = false;
        });
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
      labLocation,
      stations,
      variety,
      invoiceNumber,
      sellerName,
      buyerName,
      lotNum,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
      samplesSenderName,
      extractedRowsBody,
      numberOfSamples,
      createdAt,
      id,
    } = res;

    console.log(
      'samplingparty',
      samplingParty,
      'samplingLocation',
      samplingLocation,
      'samplingPercentage',
      samplingPercentage,
      'vesselOrConveyance',
      vesselOrConveyance,
      'activeTemplateInfo',
      this.activeTemplateInfo
    );
    const { qrImage, qrURL } = await this.generateQRCodeImageAndURL(id);

    let qrImageProcessed = await this.getBase64ImageFromURL(qrImage);
    let testLocation = 'N/A';
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
    if (extractedRowsBody.length == 0) {
      this.displayStatus(false);
      // console.log('No data found', extractedRowsBody);
    }
    // if (!this.activeTemplateInfo) return;
    let phone: any = 'N/A';
    let address: any = 'N/A';
    let addressTranslation: any = 'N/A';
    let testingInstrumentType: any = 'N/A';
    let fax: any = 'N/A';
    let email: any = 'N/A';
    let localCompanyName: any = 'N/A';
    let localCompanyNameTranslation: any = 'N/A';

    let remarks: any = [
      `a) The samples tested will be stored for 3 months only, after which they will be disposed of at the Company's discretion, unless otherwise instructed.`,
      `b) Any comments and queries of results shown in this report should be made in writing within thirty days of the Report Date as shown above.`,
      'c) The report shall not be used for litigation or publicity.',
      'd) This report reflects the results of tests carried out on samples submitted to us by the party listed above and tested on the dates and location listed above.',
    ];
    let testConditionsList: any = [
      'The tests were made under the conditions laid down in the Guideline for Instrument Testing of Cotton, published by the ICAC Task Force on Commercial Standardization of Instrument Testing of Cotton (CSITC) and the ITMF International Committee on Cotton Testing Methods (ICCTM).',
      '1. Universal HVI Standards for Upland Cotton',
      '2. A laboratory temperature of 21° +/- 1° C',
      '3. A relative humidity of 65 +/- 2%',
      '4. A sample moisture level between 6.75% and 8.25%',
      '5. Standard instrument tolerance applicable',
    ];
    if (this.activeTemplateInfo) {
      phone = this.activeTemplateInfo.phone;
      address = this.activeTemplateInfo.address;
      addressTranslation = this.activeTemplateInfo.addressTranslation;
      testingInstrumentType = this.activeTemplateInfo.testingInstrumentType;
      fax = this.activeTemplateInfo.fax;
      email = this.activeTemplateInfo.email;
      localCompanyName = this.activeTemplateInfo.localCompanyName;
      localCompanyNameTranslation =
        this.activeTemplateInfo.localCompanyNameTranslation;
      // remarks = this.activeTemplateInfo.remarksList;
      // testConditionsList = this.activeTemplateInfo.testConditionsList;
    }
    const isLandscapeMode =
      this.selectedHviVersion == 'v6' ||
      this.selectedHviVersion == 'v4' ||
      this.selectedHviVersion == 'v3' ||
      this.selectedHviVersion == 'v2' ||
      this.selectedHviVersion == 'v1';

    let columnLength = extractedRowsBody[0].length;

    let selectedColumnWidth = isLandscapeMode
      ? 24
      : this.selectedHviVersion == 'v4'
      ? 16
      : 18;
    let columnWidthArray = columnLength
      ? Array(columnLength).fill(selectedColumnWidth)
      : [];
    const customColumnWidths: any =
      isLandscapeMode && this.selectedHviVersion === 'v6'
        ? {
            0: 42, // Pr.No
            1: 42, // Pr.No
            2: 28, // HVI id
            3: 54, // Cont/mark/lot no
            4: 28, // Bale/Bale/Sample No.
            18: 75, //Remarks
          }
        : isLandscapeMode && this.selectedHviVersion === 'v4'
        ? {
            0: 35, // No./Average
            5: 42, // Mark/Lot no
            6: 54, // Bale/Sample No
            20: 54, // Remarks
          }
        : isLandscapeMode && this.selectedHviVersion === 'v3' //Khujand
        ? {
            0: 35, // Bale ID,
            5: 35, // TrId
            12: 35, // G-C
            21: 50, // Remarks
          }
        : isLandscapeMode && this.selectedHviVersion === 'v2' //bohtar
        ? {
            0: 35,
            8: 30,
            13: 30, // C-G
            23: 50, // Remarks
          }
        : isLandscapeMode && this.selectedHviVersion === 'v1'
        ? {
            0: 35, //No/Average
            6: 30, //Tr ID,
            3: 32, // Mst
            13: 35, // C-G
            21: 50, // Remarks
          }
        : {};
    columnWidthArray = columnWidthArray.map((width, index) => {
      return customColumnWidths[index] || width;
    });
    const modifiedBody = extractedRowsBody.map((item: any) => {
      // console.log('item', item);
      return item.map((itemInner: any) => {
        if (Array.isArray(itemInner)) {
          return itemInner.map((itemInnerInner: any) => {
            if (itemInnerInner[0].text) {
              return {
                text: itemInnerInner.text || itemInnerInner,
                width: 90,
                _minWidth: 90,
              };
            } else {
              return { text: itemInnerInner, width: 90, _maxWidth: 90 };
            }
          });
        } else if (typeof itemInner === 'object') {
          return {
            text: itemInner.text || itemInner,
            width: 90,
            _maxWidth: 90,
          };
        } else {
          return { text: itemInner, width: 90, _maxWidth: 90 };
        }
      });
    });

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: isLandscapeMode ? 'landscape' : 'portrait',
      margin: [-20, 0],
      footer: (currentPage: any, pageCount: any) => {
        var t = {
          layout: 'noBorders',
          fontSize: isLandscapeMode ? 8 : 6,
          margin: [25, 0, 25, 0],
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  text: 'Page  ' + currentPage.toString() + ' of ' + pageCount,
                },
              ],
            ],
          },
        };

        return t;
      },

      content: [
        this.letterHeadImage && {
          width: isLandscapeMode ? 750 : 500,
          // margin: [0, 10],
          image: await this.letterHeadImage,
        },
        { text: 'S.I.T.C. Report', style: 'header' },
        {
          style: 'headerData',
          layout: 'noBorders',

          table: {
            widths: isLandscapeMode ? [150, 250, 150, 300] : [90, 163, 85, 200],

            body: [
              [
                'CI / Report Number',
                reportNum == '' || reportNum == null ? 'N/A' : reportNum,
                'Report Date',
                formatedDate(),
              ],
              [
                'Lab / Ref No',
                labLocation == '' || labLocation == null ? 'N/A' : labLocation,
                'Test Location',
                testLocation == '' || testLocation == null
                  ? 'N/A'
                  : testLocation,
              ],
              [
                'Recipient / Customer name',
                customerName == '' || customerName == null
                  ? 'N/A'
                  : customerName,
                'Testing Instrument type',
                testingInstrumentType == '' || testingInstrumentType == null
                  ? 'N/A'
                  : testingInstrumentType,
              ],
              [
                'Client Inv/Ref No. (As advised)',
                invoiceNumber == '' || invoiceNumber == null
                  ? 'N/A'
                  : invoiceNumber,
                'Origin',
                origin == '' || origin == null ? 'N/A' : origin,
              ],
              [
                'Buyer name',
                buyerName == '' || buyerName == null ? 'N/A' : buyerName,
                'Station(As advised)',
                stations == '' || stations == null ? 'N/A' : stations,
              ],
              [
                'Seller name',
                sellerName == '' || sellerName == null ? 'N/A' : sellerName,
                'Lot number',
                lotNum == '' || lotNum == null ? 'N/A' : lotNum,
              ],
              [
                'Vessel / Conveyance',
                vesselOrConveyance == '' || vesselOrConveyance == null
                  ? 'N/A'
                  : vesselOrConveyance,

                'Variety',
                variety == '' || variety == null ? 'N/A' : variety,
              ],
              [
                this.selectedHviVersion === 'v6'
                  ? 'BL No / Samples received from'
                  : 'B/L or Conveyance  Ref  No.',
                conveyanceRefNo == '' || conveyanceRefNo == null
                  ? 'N/A'
                  : conveyanceRefNo,

                'Crop year',
                cropYear == '' || cropYear == null ? 'N/A' : cropYear,
              ],
              [
                'Sampling location',
                samplingLocation == '' || samplingLocation == null
                  ? 'N/A'
                  : samplingLocation,
                'Date of sampling',
                dateOfSampling == '' || dateOfSampling == null
                  ? 'N/A'
                  : dateOfSampling,
              ],
              [
                'Sampling %',
                samplingPercentage == '' || samplingPercentage == null
                  ? 'N/A'
                  : samplingPercentage,
                'Date of testing',
                dateOfTesting == '' || dateOfTesting == null
                  ? 'N/A'
                  : dateOfTesting,
              ],
              [
                'Sampling party',
                samplingParty == '' || samplingParty == null
                  ? 'N/A'
                  : samplingParty,
                'Total sampling',
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

            fillColor: function (rowIndex: any, node: any, columnIndex: any) {
              return rowIndex % 2 === 0 ? '#c2ddf2' : null;
            },
          },
          table: {
            headerRows: 1,
            widths: columnWidthArray,

            body: modifiedBody,
          },
        },

        {
          text: '\n\nRemarks',
          style: 'remarksHeader',
          pageBreak: this.selectedHviVersion !== 'v6' ? 'before' : 'none',
        },
        remarks.length && {
          style: 'remarksBullets',
          layout: 'noBorders',
          table: {
            width: 500,
            body: remarks.map((item: any) => [item]),
          },
        },
        { text: '\n\nTest and Lab Conditions', style: 'remarksHeader' },

        testConditionsList.length && {
          style: 'remarksBullets',
          layout: 'noBorders',
          table: {
            width: 500,
            body: testConditionsList.map((item: any) => [item]),
          },
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
                      width: 90,
                      text: `${address}${
                        this.selectedHviVersion !== 'v5' ? `\nFx ${fax}` : ''
                      }\nPh ${phone} \nEm ${email}\n www.wiscontrol.com`,
                    },
                    this.selectedHviVersion !== 'v6'
                      ? {
                          width: 90,
                          text: `${addressTranslation}${
                            this.selectedHviVersion !== 'v5'
                              ? `\nFx ${fax}`
                              : ''
                          }\nPh ${phone} \nEm ${email}\n www.wiscontrol.com`,
                        }
                      : null,
                    (await this.certificationImage)
                      ? {
                          image: await this.certificationImage,
                          fit:
                            this.selectedHviVersion == 'v4'
                              ? [100, 100]
                              : [250, 400],
                        }
                      : null,
                  ],
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'stampAndQR',
          columns: [
            (await this.stampImage) && {
              image: await this.stampImage,
              fit:
                this.selectedHviVersion === 'v1'
                  ? [200, 200]
                  : this.selectedHviVersion === 'v2' ||
                    this.selectedHviVersion === 'v3'
                  ? [140, 140]
                  : [400, 900],
              x:
                this.selectedHviVersion === 'v1' ||
                this.selectedHviVersion === 'v2' ||
                this.selectedHviVersion === 'v3'
                  ? 250
                  : 0,
            },
            (await qrImageProcessed) && {
              link: qrURL,
              image: await qrImageProcessed,
              fit: [90, 90],
              x: 100,
            },
          ],
        },

        {
          text: "* This is a PDF report including a QR Code for verification purposes, however as PDF is not 100% secure from being amended after issuance of the original. If you have not received this report directly from the WIS company who's name appears in the letterhead and you wish to verify the contents, please contact info@wiscontrol.com",
          style: 'qrCodeDisclaimer',
        },
      ],
      defaultStyle: {
        font: this.selectedHviVersion === 'v5' ? 'NotoSansSC' : null,
      },
      styles: {
        header: {
          fontSize: 14,
          alignment: 'center',
        },
        columnGap: 10,
        headerData: {
          fontSize: 8,
          margin: [0, 10, 0, 10],
        },
        samplesSenderName: {
          margin: [170, 5],
          // widths: [100, 200],
          fontSize: 8,
          bold: true,
          color: 'blue',
        },
        dataTable: {
          margin: [0, 1],
          fontSize: isLandscapeMode ? 8 : 6,
        },
        qrCodeText: {
          fontSize: 8,
        },
        qrCodeDisclaimer: {
          margin: [0, 10],
          fontSize: 8,
        },
        remarksHeader: {
          bold: true,
          underline: true,
          fontSize: 7,
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
          margin: [0, 0],
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
            .createPdf(
              this.pdfData,
              undefined,
              undefined,
              this.selectedHviVersion === 'v5'
                ? this.customFonts
                : pdfFonts.pdfMake.vfs
            )
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
          .createPdf(
            this.pdfData,
            undefined,
            undefined,
            this.selectedHviVersion === 'v5'
              ? this.customFonts
              : pdfFonts.pdfMake.vfs
          )
          .download(`${dataItem.reportNum}-${dataItem.customerName}.pdf`);
        this.isButtonDisabled = false;
      }, 2000);
    });
  }

  handlBackButton() {
    this.router.navigate(['/upload']);
  }

  handleViewAgain() {
    window.location.reload();
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
