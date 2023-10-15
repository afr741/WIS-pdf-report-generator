const XLSX = require("xlsx");
const AWS = require("aws-sdk");

exports.handler = async function (event) {
  const s3 = new AWS.S3();
  // console.log("Received S3 event:", JSON.stringify(event, null, 2));
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  // console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  const s3ObjectUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
  console.log("S3 Object URL:", s3ObjectUrl);

  const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  // console.log("RECEIVED OBJECT", data);
  const workbook = XLSX.read(data.Body);
  const sheetName = workbook.SheetNames[0];
  console.log("workbook", workbook);
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Process the extracted rows here
  console.log("Extracted rows:", rows);
};
