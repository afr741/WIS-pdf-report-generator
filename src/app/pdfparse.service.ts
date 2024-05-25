import { Injectable } from '@angular/core';
import { Report } from './API.service';

@Injectable({
  providedIn: 'root',
})
export class PdfparseService {
  constructor() {}

  processPDFDataV1(report: Report, handleShowError: any) {
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
      handleShowError('Failed to extract data rows!');
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

    const averageRow = parsedRawData[parsedRawData.length - 3];
    const n24row = parsedRawData[parsedRawData.length - 2];
    // console.log('average row', averageRow, 'n24row', n24row);
    // Convert array of objects to array of arrays
    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      return keys.map((key, keyIndex) => {
        let original = [0, 1, 14, 17];
        let isOneDec = [3, 4, 8, 10, 11, 12, 13, 15];
        let isTwoDec = [5, 6, 9, 16];
        let isThreeDec = [7];
        let cellValue = obj[key];
        //replaces row that has rowCOunt with final stats row
        if (index === parsedRawData.length - 2 && key === '__EMPTY_1') {
          return averageRow.__EMPTY;
        }
        if (index === parsedRawData.length - 2 && key === '__EMPTY_4') {
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
    let bodyEndIndex = extractedRows.length - 1;

    console.log('bodyStartIndex', bodyStartIndex, 'bodyEndIndex', bodyEndIndex);

    let extractedRowsBody = extractedRows.slice(
      bodyStartIndex + 1,
      bodyEndIndex
    );

    let emptyRow = extractedRowsBody.splice(extractedRowsBody.length - 2, 1);
    return {
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
    };
  }
  async processPDFDataV2(report: Report, handleShowError: any) {
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
      handleShowError('Failed to extract data rows!');
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

    const averageRow = parsedRawData[parsedRawData.length - 6];
    // Convert array of objects to array of arrays
    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      return keys.map((key, keyIndex) => {
        let original = [16];
        let isOneDec = [3, 7, 9, 10, 11, 12, 14];
        let isTwoDec = [4, 5, 8, 13, 15];
        let isThreeDec = [6];
        let cellValue = obj[key];

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

    return {
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
    };
  }

  async processPDFDataV3(report: Report, handleShowError: any) {
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
      handleShowError('Failed to extract data rows!');
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
    return {
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
    };
  }

  async handleProcessingVersion(
    dataItem: any,
    selectedHviVersion: any,
    handleShowError: any
  ): Promise<any> {
    const version = selectedHviVersion;

    switch (version) {
      case 'v1':
        const process = this.processPDFDataV1(dataItem, handleShowError);
        return process;
      case 'v2':
        const process2 = this.processPDFDataV2(dataItem, handleShowError);
        return process2;
      case 'v3':
        const process3 = this.processPDFDataV3(dataItem, handleShowError);
        return process3;
      default:
        handleShowError("version doesn't exist!");
    }
  }
}
