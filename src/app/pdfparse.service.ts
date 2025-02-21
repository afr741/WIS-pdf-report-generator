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
      origin,
      stations,
      variety,
      createdAt,
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

    console.log('report', report);

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
          value.toString().trim().includes('System Testing')
        )
      );

      if (startRowIndex === -1 || endRowIndex === -1) {
        throw new Error('Could not find valid start or end rows.');
      }

      const relevantRows = parsedPDF.slice(startRowIndex, endRowIndex);

      // Map column names to keys in masterObject or omit if not found.
      const columnMapping: Record<string, string> = {};
      const headerRow: any = relevantRows[0];
      const averageRowCell = relevantRows[relevantRows.length - 2];
      const lastRowToReplace =
        relevantRows[relevantRows.length - 1]['__EMPTY_1'];
      console.log(
        'averageRowCell',
        averageRowCell,
        'headerRow',
        headerRow,
        'lastRowToReplace',
        lastRowToReplace
      );

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
      const dataRows = relevantRows.slice(1).map((row, index) => {
        const filteredRow: Record<string, any> = {};
        for (const [originalKey, newKey] of Object.entries(columnMapping)) {
          if (sortedColumns.includes(newKey)) {
            if (
              row[originalKey] == lastRowToReplace &&
              index === relevantRows.length - 2
            ) {
              filteredRow[newKey] = Object.values(averageRowCell)[0];
            } else {
              filteredRow[newKey] = row[originalKey];
            }
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
      'Bale/Sample No': ['Bale', 'Bale ID'],
      'Cont/Mark/Lot No': ['Lot No.', ' Lot No.'],
      'No.': ['No', 'No.', 'Sample Count', 'S.No'],
      Mst: ['Moist'],
      Amt: ['Amt'],
      UHML: ['UHML'],
      'Tr ID': ['Tr ID'],
      UI: ['UI'],
      Mat: ['Mat'],
      SCI: ['SCI'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['+b'],
      'C-G': ['C Grade'],
      Area: ['Tr Area'],
      Cnt: ['Tr Cnt'],
      'T L': ['T.L'],
      Unf: ['Unf'],
      Str: ['Str'],
      SFI: ['SFI'],
      ELG: ['Elg'],
      Remarks: ['Remarks'],
    };

    const result = processPDFContent(parsedRawData, masterObject);
    console.log(result);

    function formatAndRoundResult(
      result: { headers: string[]; rows: Record<string, any>[] },
      roundToInteger: string[], // Columns to round to integer
      roundOneDecimal: string[],
      roundTwoDecimal: string[], // Columns to round to 2 decimal points
      roundThreeDecimal: string[]
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
            } else if (roundThreeDecimal.includes(header)) {
              value = value.toFixed(3); // Round to 3 decimal points
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
          formattedResult.push(formattedRow);
        }
      });

      return formattedResult;
    }

    const roundToInteger = ['P.R No.', 'Amt']; // Columns to round to integer
    const roundTwoDecimal = ['Mic', 'Mat', 'SFI', 'C-G', 'Area', 'UI'];
    const roundOneDecimal = [
      'SCI',
      'Mst',
      'Str',
      'Unf',
      'ELG',
      'Rd',
      '+b',
      'Cnt',
    ];
    const roundThreeDecimal = ['UHML'];
    const extractedRowsBody = formatAndRoundResult(
      result,
      roundToInteger,
      roundOneDecimal,
      roundTwoDecimal,
      roundThreeDecimal
    );
    console.log('formattedOutput', extractedRowsBody);
    const numberOfSamples = extractedRowsBody.length - 3;

    return {
      customerName,
      reportNum,
      origin,
      stations,
      labLocation,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
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
  //Bohktar
  async processPDFDataV2(report: Report, handleShowError: any) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      labLocation,
      origin,
      stations,
      variety,
      createdAt,
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
    console.log('report', report);

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
      const endRowIndex =
        parsedPDF.findIndex((row) =>
          Object.values(row).some((value: any) =>
            value.toString().trim().includes('Max')
          )
        ) + 1;

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
      'Bale/Sample No': ['Bale ID'],
      'HVI ID No': ['ID No'],
      'Cont/Mark/Lot No': ['Lot No.', ' Lot No.'],
      Mst: ['Mst'],
      Amt: ['Amt'],
      UHML: ['UHML'],
      UI: ['UI'],
      Mat: ['Mat'],
      TrID: ['TrID'],
      SCI: ['SCI'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['+b'],
      'C-G': ['CGrd'],
      Area: ['TrAr'],
      Cnt: ['TrCnt'],
      'T L': ['T.L'],
      Len: ['Len'],
      Unf: ['Unf'],
      Str: ['Str'],
      SFI: ['SF'],
      ELG: ['Elg'],
      Remarks: ['Remarks'],
    };

    const result = processPDFContent(parsedRawData, masterObject);
    console.log(result);

    function formatAndRoundResult(
      result: { headers: string[]; rows: Record<string, any>[] },
      roundToInteger: string[], // Columns to round to integer
      roundOneDecimal: string[],
      roundTwoDecimal: string[], // Columns to round to 2 decimal points
      roundThreeDecimal: string[]
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
            } else if (roundThreeDecimal.includes(header)) {
              value = value.toFixed(3); // Round to 3 decimal points
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

    const roundToInteger = ['P.R No.', 'Amt']; // Columns to round to integer
    const roundTwoDecimal = ['Mic', 'Mat', 'SFI', 'C-G', 'Area'];
    const roundOneDecimal = [
      'SCI',
      'Mst',
      'Str',
      'UI',
      'ELG',
      'Rd',
      '+b',
      'Cnt',
    ];
    const roundThreeDecimal = ['UHML'];
    const extractedRowsBody = formatAndRoundResult(
      result,
      roundToInteger,
      roundOneDecimal,
      roundTwoDecimal,
      roundThreeDecimal
    );
    console.log('formattedOutput', extractedRowsBody);
    const numberOfSamples = extractedRowsBody.length - 8;

    return {
      customerName,
      reportNum,
      origin,
      stations,
      labLocation,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
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
  // Hujand
  async processPDFDataV3(report: Report, handleShowError: any) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      labLocation,
      origin,
      stations,
      variety,
      createdAt,
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

    console.log('report', report);

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
      const endRowIndex =
        parsedPDF.findIndex((row) =>
          Object.values(row).some((value: any) =>
            value.toString().trim().includes('Max')
          )
        ) + 1;

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
      'Bale/Sample No': ['Bale ID'],
      'Cont/Mark/Lot No': ['Lot No.', ' Lot No.'],
      Mst: ['Mst'],
      UHML: ['UHML'],
      UI: ['UI'],
      'Tr ID': ['Tr ID'],
      Amt: ['Amt'],
      SCI: ['SCI'],
      Grade: ['Grade'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['+b'],
      'C-G': ['C Grd'],
      Area: ['Tr Ar'],
      Cnt: ['Cnt'],
      'T L': ['T.L'],
      Len: ['Len'],
      Unf: ['Unf'],
      Str: ['Str'],
      SFI: ['SFI'],
      ELG: ['Elg'],
      Remarks: ['Remarks'],
    };

    const result = processPDFContent(parsedRawData, masterObject);
    console.log(result);

    function formatAndRoundResult(
      result: { headers: string[]; rows: Record<string, any>[] },
      roundToInteger: string[], // Columns to round to integer
      roundOneDecimal: string[],
      roundTwoDecimal: string[], // Columns to round to 2 decimal points
      roundThreeDecimal: string[]
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
            } else if (roundThreeDecimal.includes(header)) {
              value = value.toFixed(3); // Round to 2 decimal points
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

    const roundToInteger = ['P.R No.', 'Amt']; // Columns to round to integer
    const roundTwoDecimal = ['Mic', 'Mat', 'SFI', 'C-G', 'Area', 'UI'];
    const roundOneDecimal = [
      'SCI',
      'Mst',
      'Str',
      'Unf',
      'ELG',
      'Rd',
      '+b',
      'Cnt',
    ];
    const roundThreeDecimal = ['UHML'];

    const extractedRowsBody = formatAndRoundResult(
      result,
      roundToInteger,
      roundOneDecimal,
      roundTwoDecimal,
      roundThreeDecimal
    );
    console.log('formattedOutput', extractedRowsBody);
    const numberOfSamples = extractedRowsBody.length - 8;

    return {
      customerName,
      reportNum,
      origin,
      stations,
      labLocation,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
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

  // Vietnam new
  async processPDFDataV4(report: Report, handleShowError: any) {
    let {
      dataRows,
      reportNum,
      lotNum,
      customerName,
      labLocation,
      origin,
      stations,
      variety,
      createdAt,
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
      'S B No.': ['S.B. No.'],
      'P R No': ['P.R No.'],
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
      'T L': ['T.L', 'Leaf'],
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
      const dataRows =
        isFirstStructure && relevantRows.length > 1
          ? relevantRows.slice(1)
          : relevantRows;
      const processedRows = dataRows.map((row) => {
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
        rows: processedRows,
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
      origin,
      stations,
      labLocation,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
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
      origin,
      stations,
      variety,
      createdAt,
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
      'S B No': ['S.B. No.'],
      'P R No': ['P.R No.'],
      'HVI ID No': ['HVI ID No'],
      'Cont/Mark/Lot No': ['Lot No'],
      'Bale/Sample No': ['Sample number'],
      SCI: ['SCI'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['+b'],
      'C-G': ['C Grade', 'C-G'],
      Area: ['Tr Area'],
      Cnt: ['Tr Cnt'],
      'T L': ['Tr Grade'],
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
      origin,
      stations,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
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
      origin,
      stations,
      variety,
      createdAt,
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
      No: ['No', 'No.', 'Sample Count', 'S.No'],
      'P R No': ['P.R No', 'P.R No.', 'P.R.No.'],
      'HVI ID No': ['ID No'],
      'Cont/Mark/Lot No': ['Lot No.', ' Lot No.'],
      'S B  No': ['S.B. No', 'S.B.No', 'Bale No.', 'Sample No.', 'Bale ID'],
      // 'Bale/Sample No.': ['Bale No.', 'Sample No.', 'Bale ID'], removed per Senthil's req
      SCI: ['SCI'],
      Mic: ['Mic'],
      Rd: ['Rd'],
      '+b': ['+b'],
      'C-G': ['C-G'],
      Area: ['Area'],
      Cnt: ['Cnt'],
      'T L': ['T.L'],
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
      origin,
      stations,
      variety,
      sellerName,
      buyerName,
      invoiceNumber,
      lotNum,
      extractedRowsBody,
      createdAt,
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
