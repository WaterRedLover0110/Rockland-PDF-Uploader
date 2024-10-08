const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const BUCKET_NAME = process.env.S3_BUCKET;
const TABLE_NAME = process.env.DYNAMO_DB_TABLE;

module.exports.uploadPDF = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName, fileContent } = body;

    // Check if the file is a PDF
    if (!fileName.endsWith('.pdf')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Only PDF files are allowed." }),
      };
    }

    const fileKey = `${uuidv4()}.pdf`;  // Keep the file format as .pdf
    
    // Upload the file to S3
    await s3.putObject({
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      Body: Buffer.from(fileContent, "base64"),
      ContentType: "application/pdf",  // Explicitly set the content type to PDF
    }).promise();

    // Store file metadata in DynamoDB
    const metadata = {
      rl_file_upload_id: uuidv4(),
      fileName,
      fileKey,
      uploadDate: new Date().toISOString(),
    };

    await dynamoDB.put({
      TableName: process.env.DYNAMO_DB_TABLE,
      Item: metadata,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully!",
        metadata,
      }),
    };
  } catch (error) {
    console.error("Error uploading file", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "File upload failed" }),
    };
  }
};

module.exports.getFiles = async () => {
  try {
    const params = {
      TableName: process.env.DYNAMO_DB_TABLE,
    };

    const data = await dynamoDB.scan(params).promise();
    
    // Generate presigned URLs for each file
    const s3 = new AWS.S3();
    const itemsWithPresignedUrls = data.Items.map(item => {
      const url = s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET,
        Key: item.fileKey,
        Expires: 60 * 5,  // URL expires in 5 minutes
      });
      
      return {
        ...item,
        viewUrl: url  // Attach the presigned URL to each item
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(itemsWithPresignedUrls),
    };
  } catch (error) {
    console.error("Error fetching files", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve files" }),
    };
  }
};

