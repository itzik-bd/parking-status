const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    console.log(JSON.stringify(event));

    // skip REMOVE row event from dynamo DB
    if (event?.Records[0]?.eventName === 'REMOVE') {
        console.log('got remove row event from DynamoDB - skip trigger');
        return;
    }

    let scanResult;

    try {
        scanResult = await ddb.scan({
            TableName: TABLE_NAME,
            Select: "COUNT"
        }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    let numberOfConnections = scanResult['Count'];

    if (numberOfConnections === 0) {
        console.log('no connection present - skip trigger');
        return;
    }

    if (numberOfConnections > 1) {
        console.log(`there are currently ${numberOfConnections} active connection - skip trigger (assuming it isn't the first)`);
        return;
    }

    console.log(`triggering as this is the first active connection`);
    const message = {type: 'loading'};
    let result;
    try {
        result = await sns.publish({
            Message: JSON.stringify(message),
            TopicArn: SNS_TOPIC_ARN
        }).promise();
    } catch (e) {
        console.log('failed to send message to SNS', e);
        return { statusCode: 500, body: e.stack };
    }

    console.log(`message was sent to SNS (message id = ${result.MessageId})`);
};
