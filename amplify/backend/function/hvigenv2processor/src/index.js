/* Amplify Params - DO NOT EDIT
	API_HVIGEN_GRAPHQLAPIENDPOINTOUTPUT
	API_HVIGEN_GRAPHQLAPIIDOUTPUT
	API_HVIGEN_GRAPHQLAPIKEYOUTPUT
	API_HVIGEN_REPORTTABLE_ARN
	API_HVIGEN_REPORTTABLE_NAME
	API_HVIGEN_REPORTTEMPLATETABLE_ARN
	API_HVIGEN_REPORTTEMPLATETABLE_NAME
	API_HVIGEN_USERINFOTABLE_ARN
	API_HVIGEN_USERINFOTABLE_NAME
	AUTH_HVIGEND8BB609A_USERPOOLID
	ENV
	REGION
	STORAGE_HVIPDFGENERATORSTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

import { default as fetch, Request } from "node-fetch";
import * as XLSX from "xlsx";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const GRAPHQL_ENDPOINT = process.env.API_HVIGEN_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_HVIGEN_GRAPHQLAPIKEYOUTPUT;

const query2 = /* GraphQL */ `
  mutation MODIFY_REPORT($id: ID!, $dataRows:[AWSJSON]) {
    updateReport(input: { id: $id, dataRows: $dataRows }); {
      dataRows
    }
  }
`;

const query = /* GraphQL */ `
  query GET_REPORT_ID($attachmentUrl: String!) {
    reportsByAttachmentUrlAndName(attachmentUrl: $attachmentUrl) {
      nextToken
      items {
        id
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

export const handler = async (event) => {
  console.log("EVENT", JSON.stringify(event));

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  const KeyParts = key.split("/");
  const name = KeyParts[KeyParts.length - 1];

  function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  console.log("KEY", key, " AND BUCCKET", bucket);

  const s3 = new S3Client({});
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query, // Your GraphQL query
      variables: {
        attachmentUrl: name, // Provide the value for the attachmentUrl variable
      },
    }),
  };

  try {
    const s3Response = await s3.send(command);
    console.log("s3Response", s3Response);
  } catch (e) {
    console.log("error fetching s3:", e);
  }

  // const getDataRows = async () => {
  //   try {
  //     const s3Response = await s3.send(command);
  //     console.log("s3Response", s3Response);
  //     const workbook = XLSX.read(await streamToBuffer(s3Response.Body), {
  //       type: "buffer",
  //     });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     let rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  //     let dataRows = JSON.stringify(rawRows);
  //     console.log("dataRows: " + dataRows);
  //     return dataRows;
  //   } catch (err) {
  //     console.log(err);
  //     throw new Error("Error retrieving object");
  //   }
  // };

  let statusCode = 200;
  let body;
  let response;
  let responseDataRows;

  // await getDataRows()
  //   .then((dataRows) => {
  //     console.log("Retrieved dataRows:", dataRows);
  //     responseDataRows = dataRows;
  //     const request = new Request(GRAPHQL_ENDPOINT, options);

  //     try {
  //       response = fetch(request);
  //       body = response.json();
  //       console.log("list report query body", JSON.stringify(body));
  //       if (body.errors) {
  //         statusCode = 400;
  //       } else {
  //         // Extract the id
  //         const id = body.data.reportsByAttachmentUrlAndName.items[0].id;
  //         // Call the second request function with the extracted id
  //         // await secondRequest(id);  // to be added later once file processing starts
  //       }
  //     } catch (error) {
  //       statusCode = 400;
  //       body = {
  //         errors: [
  //           {
  //             status: response.status,
  //             message: error.message,
  //             stack: error.stack,
  //           },
  //         ],
  //       };
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("After dataRows extr Error:", error);
  //   });

  // to write to Report table of user
  // async function secondRequest(id) {
  //   console.log("secondRequest id", id);
  //   const secondOptions = {
  //     method: "POST",
  //     headers: {
  //       "x-api-key": GRAPHQL_API_KEY,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       query: query2,
  //       variables: {
  //         id: id,
  //         dataRows: responseDataRows,
  //       },
  //     }),
  //   };
  //   const secondRequest = new Request(GRAPHQL_ENDPOINT, secondOptions);
  //   let secondStatusCode = 200;
  //   let secondBody;
  //   let secondResponse;

  //   try {
  //     secondResponse = await fetch(secondRequest);
  //     secondBody = await secondResponse.json();
  //     console.log("second query body", JSON.stringify(secondBody));
  //     if (secondBody.errors) secondStatusCode = 400;
  //   } catch (error) {
  //     secondStatusCode = 400;
  //     secondBody = {
  //       errors: [
  //         {
  //           status: secondResponse.status,
  //           message: error.message,
  //           stack: error.stack,
  //         },
  //       ],
  //     };
  //   }
  // }

  return {
    statusCode,
    body: JSON.stringify(body),
    responseDataRows,
  };
};
