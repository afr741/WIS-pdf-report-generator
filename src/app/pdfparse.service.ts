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
      labLocation,
      stations,
      variety,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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
      labLocation,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      id,
      numberOfSamples,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
    };
  }
  //Bohktar
  async processPDFDataV2(report: Report, handleShowError: any) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      labLocation,
      stations,
      variety,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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
      labLocation,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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
      labLocation,
      stations,
      variety,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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
      labLocation,
      variety,
      lotNum,
      extractedRowsBody,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
      id,
      numberOfSamples,
    };
  }

  // Vietnam new
  async processPDFDataV4(report: Report, handleShowError: any) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      labLocation,
      stations,
      variety,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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

    const masterObject = {
      'No.': ['No', 'No.', 'Sample Count'],
      'S.B. No.': ['S.B. No.'],
      'P.R No.': ['P.R No.'],
      'HVI ID No': ['Gin Code'],
      Container: ['Container'],
      'Mark/Lot No': [
        'Lot',
        'Lot No.',
        'Lot ID',
        'Mark',
        'Mark No.',
        'Gin Bale Number',
      ],
      'Bale/Sample No.': ['Bale No.', 'Sample No.', 'Bale ID', 'Bale '],
      SCI: ['SCI'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['     +b', '  +b', 'b+', '+b'],
      'C-G': ['C-G', 'Color Grade'],
      Area: ['Area'],
      Cnt: ['Cnt', 'Count'],
      'T.L': ['T.L', 'Leaf'],
      Len: ['Len', 'Length'],
      Unf: ['Unf', 'Uniformity', 'Unifor-\r\nmity'],
      Str: ['Str', 'Strength'],
      SFI: ['SFI'],
      ELG: ['ELG', 'Elongation', 'Elonga-\ntion', 'Elonga-\r\ntion'],
      Remarks: ['Remarks'],
    };

    type MasterObject = Record<string, string[]>;

    function processPDFContent(parsedPDF: any[], masterObject: MasterObject) {
      // Extract rows from the parsed PDF content starting with column names

      const isFirstStructure = Object.keys(parsedPDF[0]).some(
        (key) => key.includes('__EMPTY') || key.includes('VIT')
      );

      let startRowIndex = parsedPDF.findIndex((row) =>
        isFirstStructure
          ? Object.values(row).some((value: any) =>
              Object.values(masterObject).flat().includes(value)
            )
          : Object.keys(row).some((value: any) =>
              Object.values(masterObject).flat().includes(value)
            )
      );
      startRowIndex = startRowIndex == -1 ? 0 : startRowIndex;
      let endRowIndex = parsedPDF.findIndex((row) =>
        Object.values(row).some((value: any) =>
          value.toString().trim().includes('Average')
        )
      );
      console.log(
        'isFirstStructure:',
        isFirstStructure,
        'startRowIndex:',
        startRowIndex,
        'endRowIndex:',
        endRowIndex
      );
      endRowIndex = endRowIndex == -1 ? parsedPDF.length : endRowIndex + 1;

      const relevantRows = parsedPDF.slice(startRowIndex, endRowIndex);
      console.log('relevantRows', relevantRows);
      // Map column names to keys in masterObject or omit if not found.
      const columnMapping: Record<string, string> = {};
      const headerRow: any = relevantRows[0];
      for (const [key, value] of Object.entries(headerRow)) {
        const matchingKey = Object.keys(masterObject).find((masterKey) =>
          masterObject[masterKey].includes(
            String(isFirstStructure ? value : key).trim()
          )
        );
        if (matchingKey) {
          columnMapping[key] = matchingKey;
        }
      }

      // Filter and rename the column names in the header row.
      const sortedColumns = Object.keys(masterObject).map((key) =>
        Object.values(columnMapping).includes(key) ? key : key
      );

      // Process the data rows to match the sorted and filtered column names.
      const dataRows = relevantRows.slice(1).map((row) => {
        const filteredRow: Record<string, any> = {};
        for (const [originalKey, newKey] of Object.entries(columnMapping)) {
          if (sortedColumns.includes(newKey)) {
            filteredRow[newKey] = row[originalKey];
          }
        }
        return filteredRow;
      });

      return {
        headers: sortedColumns,
        rows: dataRows,
      };
    }

    const result = processPDFContent(parsedRawData, masterObject);
    console.log('result', result);

    function formatAndRoundResult(
      result: { headers: string[]; rows: Record<string, any>[] },
      roundToInteger: string[],
      roundOneDecimal: string[],
      roundTwoDecimal: string[]
    ) {
      const { headers, rows } = result;

      // Initialize the final array with the headers as the first row.
      const formattedResult: string[][] = [headers];

      // Iterate over each row and map it to an array of strings.
      rows.forEach((row) => {
        const formattedRow = headers.map((header) => {
          let value = row[header];

          if (value !== undefined && typeof value === 'number') {
            if (roundToInteger.includes(header)) {
              value = Math.round(value); // Round to integer
            } else if (roundOneDecimal.includes(header)) {
              value = value.toFixed(1); // Round to 2 decimal points
            } else if (roundTwoDecimal.includes(header)) {
              value = value.toFixed(2);
            }
          }

          // Replace undefined or missing values with "-"
          return value !== undefined ? String(value) : '-';
        });
        formattedResult.push(formattedRow);
      });

      return formattedResult;
    }

    const roundToInteger = ['SCI', 'Cnt', 'T.L']; // Columns to round to integer
    const roundTwoDecimal = ['Area', 'Len', 'Mic'];
    const roundOneDecimal = ['Rd', '+b', 'Unf', 'Str', 'SFI', 'ELG'];

    const extractedRowsBody = formatAndRoundResult(
      result,
      roundToInteger,
      roundOneDecimal,
      roundTwoDecimal
    );
    console.log('formattedOutput', extractedRowsBody);
    const numberOfSamples = extractedRowsBody.length - 2;

    return {
      customerName,
      reportNum,
      stations,
      labLocation,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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
      labLocation,
      lotNum,
      customerName,
      stations,
      variety,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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
    console.log('parsedRoawData', parsedRawData);

    //Jinan
    let columnTranslationsJinan: any = {
      棉包编号: 'Sample number',
      纺稳参数: 'SCI',
      等级: 'Grade',
      水分: 'Moist',
      马克隆: 'Mic',
      成熟度: 'Mat',
      上半均长: 'Len',
      整齐度: 'Unf',
      短纤维: 'SFI',
      强度: 'Str',
      伸长率: 'Elg',
      反射率: 'Rd',
      黄度: '+b',
      颜色等级: 'C Grade',
      杂质数: 'Tr Cnt',
      杂质面积: 'Tr Area',
      杂质编码: 'Tr Grade',
      光通量: 'luminous flux',
    };

    const columnTranslationsQingdao: any = {
      棉包编号: 'Package No',
      纺稳参数: 'SCI',
      等级: 'Grade',
      水分: 'Moist',
      马克隆: 'Mic',
      成熟度: 'Mat',
      上半均长: 'Len',
      整齐度: 'Unf',
      短纤维: 'SFI',
      强度: 'Str',
      伸长率: 'Elg',
      反射率: 'Rd',
      黄度: '+b',
      颜色等级: 'C-G',
      杂质数: 'Tr Cnt',
      杂质面积: 'Tr Area',
      杂质等级: 'Tr Grade',
      杂质编码: 'Tr Code',
      光通量: 'Luminous Flux',
    };

    const columnTranslationsJinao: any = {
      '\'上半部均长"': 'Len',
      '\'黄度"': '+b',
      "'SFI": 'SFI',
      'Sub ID': 'Sub ID',
      '\'色泽等级"': 'C Grade',
      MR: 'MR',
      '\'反射率"': 'Rd',
      '\'伸长率"': 'Elg',
      '\'马值"': 'Mic',
      '\'杂质面积比"': 'Tr Area',
      '\'整齐度"': 'Unf',
      '\'杂质粒数"': 'Tr Cnt',
      '\'强力"': 'Str',
      '\'叶屑等级"': 'Tr Grade',
    };
    const bottomTranslation: any = {
      最大: 'Max',
      最小: 'Min',
      平均值: 'Average',
      次: 'Freq',
      平均: 'Average',
      标准差: 'SD',
      最小值: 'Min',
      最大值: 'Max',
    };

    // Automatically determine which columnTranslations to use
    let columnTranslations: any;
    const checkColumn = (parsedRawData: any) => {
      // Look for a known unique column value to decide which translation to use
      const firstRow = parsedRawData[0]; // Assume the first row has column names
      if (firstRow['颜色等级'] === 'C Grade') {
        columnTranslations = columnTranslationsJinan; // Jinan translation
      } else if (firstRow['系统测试报告'] === '测试序号') {
        columnTranslations = columnTranslationsJinao; // Jinao translation
      } else {
        columnTranslations = columnTranslationsQingdao; // Qingdao translation
      }
    };

    // Call the function to check the first row and set columnTranslations
    checkColumn(parsedRawData);

    const masterObject = {
      'No.': ['No.', 'Package No', 'Sub ID'],
      'S.B. No.': ['S.B. No.'],
      'P.R No.': ['P.R No.'],
      'HVI ID No': ['HVI ID No'],
      'Cont./Mark/Lot No': ['Lot No'],
      'Bale/Sample No.': ['Sample number'],
      SCI: ['SCI'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['+b'],
      'C-G': ['C Grade', 'C-G'],
      Area: ['Tr Area'],
      Cnt: ['Tr Cnt'],
      'T.L': ['Tr Grade'],
      Len: ['Len'],
      Unf: ['Unf'],
      Str: ['Str'],
      SFI: ['SFI'],
      ELG: ['Elg'],
      Remarks: ['luminous flux', 'Luminous Flux'],
    };

    type MasterObject = Record<string, string[]>;

    function processPDFContent(parsedPDF: any[], masterObject: MasterObject) {
      // Extract rows from the parsed PDF content starting with column names
      let startRowIndex = parsedPDF.findIndex((row) =>
        Object.values(row).some((value: any) =>
          Object.keys(columnTranslations).includes(value)
        )
      );
      let endRowIndex = parsedPDF.findIndex((row) =>
        Object.values(row).some((value: any) =>
          value.toString().trim().toUpperCase().includes('Average')
        )
      );

      startRowIndex = startRowIndex == -1 ? 0 : startRowIndex;
      endRowIndex = endRowIndex == -1 ? parsedPDF.length - 1 : endRowIndex;

      const relevantRows = parsedPDF.slice(startRowIndex, endRowIndex);

      // Map column names to keys in masterObject or omit if not found.
      const columnMapping: Record<string, string> = {};
      const headerRow: any = relevantRows[0];
      for (const [key, value] of Object.entries(headerRow)) {
        const translatedValue = columnTranslations[value as string];
        const matchingKey = Object.keys(masterObject).find((masterKey) =>
          masterObject[masterKey].includes(
            String(translatedValue || value).trim()
          )
        );
        if (matchingKey) {
          columnMapping[key] = matchingKey;
        }
      }

      // Filter and rename the column names in the header row.
      const sortedColumns = Object.keys(masterObject).map((key) =>
        Object.values(columnMapping).includes(key) ? key : key
      );
      console.log(
        'sortedColumns',
        sortedColumns,
        'startRowIndex',
        startRowIndex,
        'endRowIndex',
        endRowIndex
      );
      // Process the data rows to match the sorted and filtered column names.
      const dataRows = relevantRows.slice(1).map((row) => {
        const filteredRow: Record<string, any> = {};
        for (const [originalKey, newKey] of Object.entries(columnMapping)) {
          if (sortedColumns.includes(newKey)) {
            filteredRow[newKey] = row[originalKey];
          }
        }
        return filteredRow;
      });

      return {
        headers: sortedColumns,
        rows: dataRows,
      };
    }

    // Example usage

    const result = processPDFContent(parsedRawData, masterObject);
    console.log(result);

    function formatAndRoundResult(
      result: { headers: string[]; rows: Record<string, any>[] },
      roundToInteger: string[],
      roundOneDecimal: string[],
      roundTwoDecimal: string[]
    ) {
      const { headers, rows } = result;

      // Initialize the final array with the headers as the first row.
      const formattedResult: string[][] = [headers];

      // Iterate over each row and map it to an array of strings.
      rows.forEach((row) => {
        const formattedRow = headers.map((header) => {
          let value = row[header];
          if (bottomTranslation[value]) {
            value = bottomTranslation[value];
          }
          if (value !== undefined && typeof value === 'number') {
            if (roundToInteger.includes(header)) {
              value = Math.round(value); // Round to integer
            } else if (roundOneDecimal.includes(header)) {
              value = value.toFixed(1); // Round to 2 decimal points
            } else if (roundTwoDecimal.includes(header)) {
              value = value.toFixed(2);
            }
          }

          // Replace undefined or missing values with "-"
          return value !== undefined ? String(value) : '-';
        });
        formattedResult.push(formattedRow);
      });

      return formattedResult;
    }

    const roundToInteger = ['SCI', 'T.L']; // Columns to round to integer
    const roundTwoDecimal = ['Area', 'Len', 'Mic'];
    const roundOneDecimal = ['Rd', '+b', 'Unf', 'Str', 'SFI', 'ELG'];

    const extractedRowsBody = formatAndRoundResult(
      result,
      roundToInteger,
      roundOneDecimal,
      roundTwoDecimal
    );
    console.log('formattedOutput', extractedRowsBody);
    const numberOfSamples = extractedRowsBody.length - 2;

    return {
      customerName,
      reportNum,
      labLocation,
      stations,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
      id,
      numberOfSamples,
      samplesSenderName,
    };
  }

  // India
  async processPDFDataV6(report: Report, handleShowError: any) {
    let {
      dataRows,
      reportNum,
      labLocation,
      lotNum,
      customerName,
      stations,
      variety,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
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
    console.log('parsedRawData', parsedRawData);

    type MasterObject = Record<string, string[]>;

    function processPDFContent(parsedPDF: any[], masterObject: MasterObject) {
      // Extract rows from the parsed PDF content starting with column names
      // and ending before "WAKEFIELD INSPECTION SERVICES".
      const startRowIndex = parsedPDF.findIndex((row) =>
        Object.values(row).some((value: any) =>
          Object.values(masterObject).flat().includes(value)
        )
      );
      const endRowIndex = parsedPDF.findIndex((row) =>
        Object.values(row).some((value: any) =>
          value
            .toString()
            .trim()
            .toUpperCase()
            .includes('WAKEFIELD INSPECTION SERVICES')
        )
      );

      if (startRowIndex === -1 || endRowIndex === -1) {
        throw new Error('Could not find valid start or end rows.');
      }

      const relevantRows = parsedPDF.slice(startRowIndex, endRowIndex);

      // Map column names to keys in masterObject or omit if not found.
      const columnMapping: Record<string, string> = {};
      const headerRow: any = relevantRows[0];
      for (const [key, value] of Object.entries(headerRow)) {
        const matchingKey = Object.keys(masterObject).find((masterKey) =>
          masterObject[masterKey].includes(String(value).trim())
        );
        if (matchingKey) {
          columnMapping[key] = matchingKey;
        }
      }

      // Filter and rename the column names in the header row.
      const sortedColumns = Object.keys(masterObject).map((key) =>
        Object.values(columnMapping).includes(key) ? key : key
      );

      // Process the data rows to match the sorted and filtered column names.
      const dataRows = relevantRows.slice(1).map((row) => {
        const filteredRow: Record<string, any> = {};
        for (const [originalKey, newKey] of Object.entries(columnMapping)) {
          if (sortedColumns.includes(newKey)) {
            filteredRow[newKey] = row[originalKey];
          }
        }
        return filteredRow;
      });

      return {
        headers: sortedColumns,
        rows: dataRows,
      };
    }

    // Example usage

    const masterObject = {
      'No.': ['No', 'No.', 'Sample Count', 'S.No'],
      'S.B. No.': ['S.B. No', 'S.B.No'],
      'P.R No.': ['P.R No', 'P.R No.', 'P.R.No.'],
      'HVI ID No': ['ID No'],
      'Cont./Mark/Lot No': ['Lot No.', ' Lot No.'],
      'Bale/Sample No.': ['Bale No.', 'Sample No.', 'Bale ID'],
      SCI: ['SCI'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['+b'],
      'C-G': ['C-G'],
      Area: ['Area'],
      Cnt: ['Cnt'],
      'T.L': ['T.L'],
      Len: ['Len'],
      Unf: ['Unf'],
      Str: ['Str'],
      SFI: ['SFI'],
      ELG: ['ELG'],
      Remarks: ['Remarks'],
    };

    const result = processPDFContent(parsedRawData, masterObject);
    console.log(result);

    function formatAndRoundResult(
      result: { headers: string[]; rows: Record<string, any>[] },
      roundToInteger: string[], // Columns to round to integer
      roundOneDecimal: string[],
      roundTwoDecimal: string[] // Columns to round to 2 decimal points
    ) {
      const { headers, rows } = result;

      // Initialize the final array with the headers as the first row.
      const formattedResult: string[][] = [headers];

      // Iterate over each row and map it to an array of strings.
      rows.forEach((row) => {
        const formattedRow = headers.map((header) => {
          let value = row[header];

          if (value !== undefined && typeof value === 'number') {
            if (roundToInteger.includes(header)) {
              value = Math.round(value); // Round to integer
            } else if (roundTwoDecimal.includes(header)) {
              value = value.toFixed(2); // Round to 2 decimal points
            } else if (roundOneDecimal.includes(header)) {
              value = value.toFixed(1); // Round to 2 decimal points
            }
          }

          // Replace undefined or missing values with "-"
          return value !== undefined ? String(value) : '-';
        });
        // Check if the length of the formattedRow is less than the headers length
        // Check if most fields are undefined
        const undefinedCount = formattedRow.filter(
          (cell) => cell === '-'
        ).length;
        if (undefinedCount < headers.length * 0.7) {
          // adjust the threshold as needed
          formattedResult.push(formattedRow);
        }
      });

      return formattedResult;
    }

    const roundToInteger = ['SCI', 'T.L', 'Cnt']; // Columns to round to integer
    const roundTwoDecimal = ['Area', 'Len', 'Mic'];
    const roundOneDecimal = ['Rd', '+b', 'Unf', 'Str', 'SFI', 'ELG'];

    const extractedRowsBody = formatAndRoundResult(
      result,
      roundToInteger,
      roundOneDecimal,
      roundTwoDecimal
    );
    console.log('formattedOutput', extractedRowsBody);
    const numberOfSamples = extractedRowsBody.length - 1;

    return {
      customerName,
      reportNum,
      labLocation,
      stations,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
      testingInstrumentType,
      dateOfTesting,
      dateOfSampling,
      samplingParty,
      samplingLocation,
      samplingPercentage,
      vesselOrConveyance,
      cropYear,
      conveyanceRefNo,
      id,
      numberOfSamples,
      samplesSenderName,
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
      case 'v5':
        const process5 = this.processPDFDataV5(dataItem, handleShowError);
        return process5;
      case 'v6':
        const process6 = this.processPDFDataV6(dataItem, handleShowError);
        return process6;
      default:
        handleShowError("version doesn't exist!");
    }
  }
}
