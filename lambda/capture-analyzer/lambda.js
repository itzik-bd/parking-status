const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01'});

const bucketName = process.env['BUCKET_NAME'];
const BUCKET_PENDING_DIR = process.env['BUCKET_PENDING_DIR'];
const BUCKET_PROCESSED_DIR = process.env['BUCKET_PROCESSED_DIR'];

exports.handler = async (eventS3) => {

    const sourceFile = eventS3.Records[0].s3.object.key;
    const targetFile = sourceFile.replace(`${BUCKET_PENDING_DIR}/`, `${BUCKET_PROCESSED_DIR}/`);

    // move the file from "pending" to "processed" directory
    console.log(`move the file from "pending" to "processed" directory (${sourceFile} -> ${targetFile})`);
    await s3.copyObject({
        Bucket : bucketName,
        CopySource : `${bucketName}/${sourceFile}`,
        Key : targetFile,
        ACL : 'public-read',
    }).promise();
    await s3.deleteObject({
        Bucket : bucketName,
        Key : sourceFile,
    }).promise();

    return processImage(targetFile);
};

function processImage(file) {
    return {
        "type": "update",
        "slots": [
            {"available": false},
            {"available": false},
            {"available": true},

            {"available": true},
            {"available": true},

            {"available": false},
            {"available": true},
            {"available": true},
            {"available": false}
        ],
        "image": file,
        "lastUpdate": new Date().getTime()
    };
}
