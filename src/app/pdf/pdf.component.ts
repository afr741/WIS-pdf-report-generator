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

  constructor(private api: APIService, public router: Router) {}

  async ngOnInit() {
    /* fetch reports when app loads */
    this.api.ListReports().then((event) => {
      this.reports = event.items as Report[];
      console.log('reports', this.reports);
      //sort based on dates
      this.reports.sort((a, b) => {
        let dateA: any = new Date(a.updatedAt);
        let dateB: any = new Date(b.updatedAt);

        return dateB - dateA;
      });
    });
  }

  generatePDF() {
    let data = this.reports[0].dataRows as string[][] | undefined;
    console.log('Generating PDF', data);
    if (!data) return;
    let extractedRows = data.slice(12, 36);
    for (let i = 0; i < extractedRows.length; i++) {
      const innerArray = extractedRows[i];
      if (innerArray) {
        // Iterate through the inner array
        for (let j = 0; j < innerArray.length; j++) {
          if (innerArray[j] === null || innerArray[j] === undefined) {
            // Replace null with an empty string
            innerArray[j] = '';
          }
        }
      }
    }
    // let removedNulls = extractedRows.map((row: any): any => {
    //   if (row == null || row == undefined) return '';
    // });
    console.log(extractedRows);

    let docDefinition = {
      content: [
        { text: 'hello world' },
        { text: 'hello zozo' },
        {
          table: {
            body: extractedRows,
          },
        },
      ],
    };
    pdfMake
      .createPdf(docDefinition, undefined, undefined, pdfFonts.pdfMake.vfs)
      .open();
  }
}
