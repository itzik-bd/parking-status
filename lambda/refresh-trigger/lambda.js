const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const ddb = new DynamoDBClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
const sns = new SNSClient({ apiVersion: '2010-03-31' });

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    try {
        return await logic(event);
    } catch (e) {
        console.log('an error occurred', e);
        return { statusCode: 500, body: e.stack };
    }
};

async function logic(event) {
    console.log(JSON.stringify(event));

    // This lambda is invoked from by 2 different events: DynamoDB and wait-and-refresh StepFunction.
    // DynamoDB notify about new/deleted connections
    // and the wait-and-refresh is invoked after previous update was completed
    const isFromDynamoDB = (event?.Records?.[0]?.eventSource === 'aws:dynamodb');
    console.log(`isFromDynamoDB=${isFromDynamoDB}`);

    // skip REMOVE row event from dynamo DB
    if (isFromDynamoDB && event?.Records?.[0]?.eventName === 'REMOVE') {
        console.log('got remove row event from DynamoDB - skip trigger');
        return;
    }

    let numberOfConnections = await countConnections();

    if (numberOfConnections === 0) {
        console.log('no connection present - skip trigger');
        return;
    }

    if (isFromDynamoDB && numberOfConnections > 1) {
        console.log(`there are currently ${numberOfConnections} active connection - skip trigger (assuming it isn't the first)`);
        return;
    }

    console.log(`triggering refresh (${numberOfConnections} active connections)`);
    await publishRefreshMessage();
}

async function countConnections() {
    const scanResult = await ddb.send(new ScanCommand({
        TableName: TABLE_NAME,
        Select: "COUNT"
    }));

    return scanResult['Count'];
}

async function publishRefreshMessage() {
    const message = {type: 'loading'};

    let result = await sns.send(new PublishCommand({
        Message: JSON.stringify(message),
        TopicArn: SNS_TOPIC_ARN
    }));

    console.log(`message was sent to SNS (message id = ${result.MessageId})`);
}
