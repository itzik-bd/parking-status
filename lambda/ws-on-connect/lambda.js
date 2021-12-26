const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const SQS_TRIGGER_URL = process.env.SQS_TRIGGER_URL;
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async event => {
    const connectionId = event.requestContext.connectionId;

    const putParams = {
        TableName: TABLE_NAME,
        Item: {
            connectionId: connectionId
        }
    };

    try {
        console.log(`connecting session ${connectionId}`);
        await ddb.put(putParams).promise();
    } catch (err) {
        console.error(`failed to connect`, err);
        return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
    }

    console.log(`connected`);

    console.log(`pushing message to SQS ${SQS_TRIGGER_URL}`);
    const message = {};
    try {
        let result = await sqs.sendMessage({
            MessageBody: JSON.stringify(message),
            QueueUrl: SQS_TRIGGER_URL
        }).promise();
        console.log(`message was sent to SQS (message id = ${result.MessageId})`);
    } catch (e) {
        console.warn('failed to send message to SQS', e);
    }


    return { statusCode: 200, body: 'Connected.' };
};
