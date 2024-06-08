import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataparseService {
  private dbEntryData: any[] = []; // Assuming this is a class property

  parseData(dataRows: any, hviVersion: any): any {
    if (!dataRows || dataRows[0] === null) {
      // this.error = 'Failed to extract data rows!';
      return;
    }

    let parsedRawData = JSON.parse(dataRows[0]);
    console.log('parsedRawData', parsedRawData);

    // number of elements based on elements in this row
    let parsedFirstRowIndex = () => {
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
    const keys = Object.keys(parsedRawData[parsedFirstRowIndex()]).sort(
      (a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      }
    );

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

        if (hviVersion == 'v') {
          //parsing skips the "row count" cell, have to manually insert it at position keyIndex 1
          if (obj.__EMPTY && keyIndex == 1) {
            return obj.__EMPTY;
          }
        } else {
          if (obj.__EMPTY && keyIndex == 1) {
            return obj.__EMPTY;
          }
        }
        let original = [0, 1, 14, 17];
        let isOneDec = [3, 4, 8, 10, 11, 12, 13, 15];
        let isTwoDec = [5, 6, 9, 16];
        let isThreeDec = [7];
        let isInteger = [7];

        if (hviVersion == 'v2') {
          original = [16];
          isOneDec = [3, 7, 9, 10, 11, 12, 14];
          isTwoDec = [4, 5, 8, 13, 15];
          isThreeDec = [6];
        }

        if (hviVersion == 'v3') {
          original = [16];
          isOneDec = [4, 8, 10, 11, 12, 13, 14];
          isTwoDec = [3, 5, 6, 9, 15];
          isThreeDec = [7];
        }
        if (hviVersion == 'v4') {
          original = [16, 2];
          isInteger = [0, 1, 3, 9, 10];
          isOneDec = [4, 8, 10, 11, 12, 13, 14];
          isTwoDec = [3, 5, 6, 9, 15];
          isThreeDec = [7];
        }

        let roundedCellValue = original.includes(keyIndex)
          ? cellValue
          : isNaN(cellValue)
          ? cellValue
          : Number(cellValue).toFixed(
              isInteger.includes(keyIndex)
                ? 0
                : isOneDec.includes(keyIndex)
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

    console.log('extracted rows', extractedRows);
    // to find the start of data body using keyword based on HVI version
    let startRowKeyWord =
      hviVersion == 'v1'
        ? 'Time'
        : hviVersion == 'v2'
        ? 'SCI'
        : hviVersion == 'v4'
        ? 'Sample Count'
        : 'Print Time';
    let bodyStartIndex = extractedRows.findIndex((array: any) =>
      array.includes(startRowKeyWord)
    );

    // to find the end of data body using "Average" and "Max" word
    let endRowKeyWord =
      hviVersion == 'v1' ? (hviVersion == 'v4' ? 'Sample' : 'Average') : 'Max';
    let bodyEndIndex =
      hviVersion == 'v4'
        ? extractedRows.length - 1
        : extractedRows.findIndex((array: any) =>
            array.some(
              (element: any) =>
                typeof element === 'string' && element.includes(endRowKeyWord)
            )
          );
    console.log('bodyStartIndex', bodyStartIndex, 'bodyEndIndex', bodyEndIndex);
    let extractedRowsBody = extractedRows.slice(
      bodyStartIndex + (hviVersion == 'v2' || hviVersion == 'v4' ? 0 : 1),
      bodyEndIndex + (hviVersion == 'v1' ? 2 : 1)
    );
    if (hviVersion == 'v1') {
      //removing empty row
      let emptyRow = extractedRowsBody.splice(extractedRowsBody.length - 2, 1);
      let lastRow = extractedRowsBody[extractedRowsBody.length - 1];
      const arrayOfArrays = lastRow.map((str: any) => str.split('\n'));

      // Rotate the array of arrays so that the first element of each sub-array are in the same array
      const rotatedArray = arrayOfArrays.reduce((acc: any, arr: any) => {
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
      extractedRowsBody.splice(extractedRowsBody.length - 1, 1);
      let modifiedRowsBody = [...extractedRowsBody, ...rotatedArray];

      console.log('extractedRowsBody after splice', modifiedRowsBody);
      return modifiedRowsBody;
    } else {
      return extractedRowsBody;
    }
  }
}
