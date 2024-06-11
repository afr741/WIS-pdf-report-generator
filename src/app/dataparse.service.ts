import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataparseService {
  private dbEntryData: any[] = []; // Assuming this is a class property

  parsedFirstRowIndex = (hviVersion: string): number => {
    switch (hviVersion) {
      case 'v1':
        return 7;
      case 'v2':
        return 6;

      case 'v3':
        return 5;

      case 'v4':
        return 1;

      default:
        return 1;
    }
  };

  parseData(dataRows: any, hviVersion: any): any {
    if (!dataRows || dataRows[0] === null) {
      // this.error = 'Failed to extract data rows!';
      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);
    // number of elements based on elements in this row

    const keys = Object.keys(
      parsedRawData[this.parsedFirstRowIndex(hviVersion)]
    ).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const averageRow =
      parsedRawData[parsedRawData.length - (hviVersion == 'v2' ? 7 : 3)];

    const n24row = parsedRawData[parsedRawData.length - 2];

    // Convert array of objects to array of arrays
    const extractedRows = parsedRawData.map((obj: any, index: any) => {
      return keys.map((key, keyIndex) => {
        let cellValue = obj[key];

        if (hviVersion == 'v1') {
          if (index === parsedRawData.length - 2 && key === '__EMPTY_1') {
            return averageRow.__EMPTY;
          }
          if (index === parsedRawData.length - 2 && key === '__EMPTY_4') {
            const finalValue = n24row.__EMPTY_1.match(/\d+/) + n24row.__EMPTY_4;
            console.log('finalValue', finalValue);
            return finalValue;
          }
        }

        if (hviVersion == 'v2') {
          //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
          if (obj.__EMPTY && keyIndex == 1) {
            return obj.__EMPTY;
          }
        }

        if (hviVersion == 'v3') {
          //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
          if (obj.__EMPTY && keyIndex == 1) {
            return obj.__EMPTY;
          }
        } else {
          if (obj.__EMPTY && keyIndex == 1) {
            return obj.__EMPTY;
          }
        }

        //format cell decimal count per version
        let original: number[] = [];
        let isOneDec: number[] = [];
        let isTwoDec: number[] = [];
        let isThreeDec: number[] = [];
        let isInteger: number[] = [];

        switch (hviVersion) {
          case 'v1':
            original = [0, 1, 14, 17];
            isOneDec = [3, 4, 8, 10, 11, 12, 13, 15];
            isTwoDec = [5, 6, 9, 16];
            isThreeDec = [7];
            break;
          case 'v2':
            original = [16];
            isOneDec = [3, 7, 9, 10, 11, 12, 14];
            isTwoDec = [4, 5, 8, 13, 15];
            isThreeDec = [6];
            break;
          case 'v3':
            original = [16];
            isOneDec = [4, 8, 10, 11, 12, 13, 14];
            isTwoDec = [3, 5, 6, 9, 15];
            isThreeDec = [7];
            break;
          case 'v4':
            original = [16, 2];
            isInteger = [0, 1, 3, 9, 10];
            isOneDec = [4, 8, 10, 11, 12, 13, 14];
            isTwoDec = [3, 5, 6, 9, 15];
            isThreeDec = [7];
            break;
        }

        let decimalCount: number = 0;

        if (isInteger.includes(keyIndex)) {
          decimalCount = 0;
        } else if (isOneDec.includes(keyIndex)) {
          decimalCount = 1;
        } else if (isTwoDec.includes(keyIndex)) {
          decimalCount = 2;
        } else if (isThreeDec.includes(keyIndex)) {
          decimalCount = 3;
        }

        const roundedCellValue = isNaN(cellValue)
          ? cellValue
          : Number(cellValue).toFixed(decimalCount);

        return roundedCellValue || '';
      });
    });

    console.log('extracted rows', extractedRows);
    // to find the start of data body using keyword based on HVI version
    let startRowKeyWord: string;
    let endRowKeyWord: string;
    let bodyStartIndex: number;
    let bodyEndIndex: number;

    switch (hviVersion) {
      case 'v1':
        startRowKeyWord = 'Time';
        endRowKeyWord = 'Average';
        break;
      case 'v2':
        startRowKeyWord = 'SCI';
        endRowKeyWord = 'Max';
        break;
      case 'v4':
        startRowKeyWord = 'Sample Count';
        endRowKeyWord = 'Sample';
        break;
      default:
        startRowKeyWord = 'Print Time';
        endRowKeyWord = 'Max'; // Default to 'Max' for unknown versions
        break;
    }

    bodyStartIndex =
      extractedRows.findIndex((array: any) => array.includes(startRowKeyWord)) +
      (['v2', 'v4'].includes(hviVersion) ? 0 : 1);

    if (hviVersion === 'v4') {
      bodyEndIndex = extractedRows.length;
    } else {
      bodyEndIndex =
        extractedRows.findIndex((array: any) =>
          array.some(
            (element: any) =>
              typeof element === 'string' && element.includes(endRowKeyWord)
          )
        ) + (hviVersion === 'v1' ? 2 : 1);
    }

    let extractedRowsBody = extractedRows.slice(bodyStartIndex, bodyEndIndex);
    //v1 processing step
    if (hviVersion === 'v1') {
      // Remove empty row
      extractedRowsBody.splice(-2, 1);

      // Rotate the array of arrays
      const rotatedArray = extractedRowsBody[extractedRowsBody.length - 1]
        .map((str: any) => str.split('\n'))
        .reduce((acc: any, arr: any) => {
          arr.forEach((element: any, index: any) => {
            if (!acc[index]) {
              acc[index] = [];
            }
            acc[index].push(element);
          });
          return acc;
        }, []);

      for (let i = 1; i < rotatedArray.length; i++) {
        // Insert an empty string at index 4 for each array except the first one
        rotatedArray[i].splice(3, 0, '');
      }

      // Remove last row
      extractedRowsBody.pop();

      // Combine rotatedArray with extractedRowsBody
      extractedRowsBody.push(...rotatedArray);
    }

    console.log('extractedRowsBody after splice', extractedRowsBody);
    return extractedRowsBody;
  }
}
