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
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { Request, default as fetch } from "node-fetch";

const GRAPHQL_ENDPOINT = process.env.API_HVIGEN_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_HVIGEN_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `
  query GET_REPORT_ID($id: ID!) {
    getReport(id: $id) {
      id
      name
      email
      labLocation
      hviVersion
      reportNum
      lotNum
      customerName
      origin
      stations
      variety
      attachmentUrl
      dataRows
      createdAt
      updatedAt
      owner
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

export const handler = async (event) => {
  console.log("EVENT", JSON.stringify(event));

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

  let statusCode = 200;
  let body;
  let response;

  getDataRows()
    .then((dataRows) => {
      console.log("Retrieved dataRows:", dataRows);
      const request = new Request(GRAPHQL_ENDPOINT, options);

      try {
        response = fetch(request);
        body = response.json();
        console.log("list report query body", JSON.stringify(body));
        if (body.errors) {
          statusCode = 400;
        }
      } catch (error) {
        statusCode = 400;
        body = {
          errors: [
            {
              status: response.status,
              message: error.message,
              stack: error.stack,
            },
          ],
        };
      }
    })
    .catch((error) => {
      console.error("After dataRows extr Error:", error);
    });

  return {
    statusCode,
    body: JSON.stringify(body),
  };
};
