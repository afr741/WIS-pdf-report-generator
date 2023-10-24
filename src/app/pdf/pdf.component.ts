import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { APIService, Report } from '../API.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],
})
export class PdfComponent implements OnInit {
  public reports: Array<Report> = [];
  public pdfData: any = null;

  public isLoading: boolean = true;
  constructor(private api: APIService, public router: Router) {}

  async ngOnInit() {
    /* fetch reports when app loads */
    setTimeout(() => {
      this.isLoading = false;
      this.api
        .ListReports()
        .then((event) => {
          this.reports = event.items as Report[];
          console.log('reports', this.reports);
          //sort based on dates
          this.reports.sort((a, b) => {
            let dateA: any = new Date(a.updatedAt);
            let dateB: any = new Date(b.updatedAt);

            return dateB - dateA;
          });
        })
        .then(() => {
          this.processPDFData();
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);
  }

  processPDFData() {
    let data = this.reports[0].dataRows;
    if (!data) return;
    let extractedRows = data.slice(12, 36);
    let arrayedRows = [];
    // console.log('Extracted rows', extractedRows);
    for (let i = 0; i < extractedRows.length; i++) {
      let innerItem = extractedRows[i];
      if (innerItem) {
        let innerArray = JSON.parse(innerItem);
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
    }

    console.log('arrayedRows', arrayedRows);

    let docDefinition = {
      content: [
        { text: 'hello world' },
        { text: 'hello zozo' },
        {
          table: {
            body: arrayedRows,
          },
        },
      ],
    };

    this.pdfData = docDefinition;
  }

  openPDF() {
    pdfMake
      .createPdf(this.pdfData, undefined, undefined, pdfFonts.pdfMake.vfs)
      .open();
  }

  downloadPDF() {
    pdfMake
      .createPdf(this.pdfData, undefined, undefined, pdfFonts.pdfMake.vfs)
      .download();
  }
}
