import { Injectable } from '@angular/core';
import { Report } from './API.service';

@Injectable({
  providedIn: 'root',
})
export class PdfparseService {
  constructor() {}

  //Dushanbe
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

    // number of elements based on elements in this row
    const keys = Object.keys(parsedRawData[7]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)![0]);
      const numB = parseInt(b.match(/\d+/)![0]);
      return numA - numB;
    });

    const averageRow = parsedRawData[parsedRawData.length - 3];
    const n24row = parsedRawData[parsedRawData.length - 2];

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

    let extractedRowsBody = extractedRows.slice(
      bodyStartIndex + 1,
      bodyEndIndex
    );

    let emptyRow = extractedRowsBody.splice(extractedRowsBody.length - 2, 1);

    const numberOfSamples = extractedRowsBody.length - 3;

    return {
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
      numberOfSamples,
    };
  }
  //Bohktar
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

    if (!dataRows || dataRows[0] === null) {
      handleShowError('Failed to extract data rows!');
      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);

    // number of elements based on elments in this row

    const keys = Object.keys(parsedRawData[6]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

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
    const numberOfSamples = extractedRowsBody.length - 9;

    return {
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
      numberOfSamples,
    };
  }
  // Hujand
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

    // number of elements based on elments in this row

    const keys = Object.keys(parsedRawData[5]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
      return keys.map((key, keyIndex) => {
        if (obj.__EMPTY && keyIndex == 1) {
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
    const numberOfSamples = extractedRowsBody.length - 9;

    return {
      customerName,
      reportNum,
      stations,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
      numberOfSamples,
    };
  }
  // Vietnam
  async processPDFDataV4(report: Report, handleShowError: any) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      stations,
      variety,
      createdAt,
      id,
      samplesSenderName,
      sellerName,
      buyerName,
      invoiceNumber,
    } = report;
    if (!dataRows || dataRows[0] === null) {
      handleShowError('Failed to extract data rows!');
      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);
    console.log('dataRows', dataRows);
    console.log('parsedRawData', parsedRawData);

    // number of elements based on elements in this row
    let startRowKeyWord = ['No.', 'Sample Count'];
    const firstRowIndex = parsedRawData.findIndex((object: any) =>
      Object.values(object).some((value) =>
        startRowKeyWord.includes(value as string)
      )
    );
    // to find the start of data body using "Time" word
    let bodyStartIndex = firstRowIndex == -1 ? 0 : firstRowIndex;
    console.log('bodyStartIndex', bodyStartIndex);
    //sort keys based number embeded in key string, excep "VIT" "__EMPTY" and  go first
    const customSort = (arr: string[]): string[] => {
      return arr.sort((a, b) => {
        if (a === '__EMPTY' || a.includes('VIT')) return -1;
        if (b === '__EMPTY' || b.includes('VIT')) return 1;

        const numA = parseInt(a.replace(/[^0-9]/g, ''));
        const numB = parseInt(b.replace(/[^0-9]/g, ''));

        return numA - numB;
      });
    };

    const keys = Object.keys(parsedRawData[bodyStartIndex]).includes('Mark')
      ? [
          'No',
          'Mark',
          'Bale No',
          'SCI',
          'Mic',
          'Rd',
          '     +b',
          'C-G',
          'Area',
          'Cnt',
          'T.L',
          'Len',
          'Unf',
          'Str',
          'SFI',
          'ELG',
        ]
      : Object.keys(parsedRawData[bodyStartIndex]).includes('     +b')
      ? [
          'No',
          'Lot',
          'SCI',
          'Mic',
          'Rd',
          '     +b',
          'C-G',
          'Area',
          'Cnt',
          'T.L',
          'Len',

          'Unf',
          'Str',
          'SFI',
          'ELG',
        ]
      : customSort(Object.keys(parsedRawData[bodyStartIndex]));
    console.log('keys', keys);

    const averageIndex2 = parsedRawData.findIndex((item: any) =>
      typeof item === 'object' ? item.text === 'Average' : item === 'Average'
    );

    let extractedRows = parsedRawData.map((obj: any, index: any) => {
      //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
      return keys.map((key: any, keyIndex: any) => {
        // if (obj.__EMPTY && keyIndex === bodyStartIndex) {
        //   return obj.__EMPTY;
        // }
        let cellValue = obj[key];
        let original: any = [];
        let singleDecimal: any = [12];
        let integers: any = [10];

        if (singleDecimal.includes(keyIndex)) {
          return Number(cellValue).toFixed(1);
        }

        let roundedCellValue = original.includes(keyIndex)
          ? cellValue
          : singleDecimal.includes(keyIndex)
          ? Number(cellValue).toFixed(1)
          : integers.includes(keyIndex)
          ? Number(cellValue).toFixed(0)
          : isNaN(Number(cellValue))
          ? cellValue
          : averageIndex2 === index && !Number.isNaN(Number(cellValue))
          ? Number(cellValue).toFixed(2)
          : cellValue;

        if (
          !isNaN(Number(roundedCellValue)) &&
          roundedCellValue.toString().split('.')[1]?.length > 2
        ) {
          roundedCellValue = Number(roundedCellValue).toFixed(2);
        }
        return roundedCellValue ?? '';
      });
    });

    if (firstRowIndex == -1) {
      extractedRows = [
        extractedRows[0].map((item: any, index: any) => {
          return keys[index];
        }),
      ].concat(extractedRows);
    }
    if (
      extractedRows[0].length > 0 &&
      new Set(extractedRows[0]).size !== extractedRows[0].length
    ) {
      extractedRows = extractedRows.map((row: any) => row.slice(1));
    }

    // to find the end of data body using "Average" word

    const averageIndex = extractedRows.findIndex((array: any) =>
      array.some(
        (element: any) =>
          typeof element === 'string' &&
          ['AVERAGE', 'Average', 'average'].some((avg) =>
            element.toUpperCase().includes(avg)
          )
      )
    );

    let bodyEndIndex =
      averageIndex !== -1 ? averageIndex + 1 : extractedRows.length;

    let extractedRowsBody = extractedRows.slice(bodyStartIndex, bodyEndIndex);

    const numberOfSamples =
      averageIndex !== -1
        ? extractedRowsBody.length - 2
        : extractedRowsBody.length - 1;

    console.log(
      'bodyStartIndex',
      bodyStartIndex,
      'bodyEndIndex',
      bodyEndIndex,
      'extractedRows:',
      extractedRows,
      'keys:',
      keys,
      'extractedRowsBody:',
      extractedRowsBody,
      'averageIndex',
      averageIndex
    );

    return {
      customerName,
      reportNum,
      stations,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
      numberOfSamples,
      samplesSenderName,
    };
  }
  //China - Shanghai
  async processPDFDataV5(report: Report, handleShowError: any) {
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

    const keys = Object.keys(parsedRawData[5]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
      return keys.map((key, keyIndex) => {
        if (obj.__EMPTY && keyIndex == 1) {
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

  // India
  async processPDFDataV6(report: Report, handleShowError: any) {
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

    const keys = Object.keys(parsedRawData[5]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
      return keys.map((key, keyIndex) => {
        if (obj.__EMPTY && keyIndex == 1) {
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

  //Uzbekistan - tashkent
  async processPDFDataV7(report: Report, handleShowError: any) {
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

    const keys = Object.keys(parsedRawData[5]).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
      return keys.map((key, keyIndex) => {
        if (obj.__EMPTY && keyIndex == 1) {
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
      case 'v4':
        const process4 = this.processPDFDataV4(dataItem, handleShowError);
        return process4;
      default:
        handleShowError("version doesn't exist!");
    }
  }
}
