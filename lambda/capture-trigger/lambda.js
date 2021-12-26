const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (_event) => {
    let connectionData;

    try {
        connectionData = await ddb.scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    const numberOfConnections = connectionData.Items.length;

    if (numberOfConnections === 0) {
        console.log('no connection present - skip trigger');
        return;
    }

    console.log(`triggering as there are ${numberOfConnections} active connections`);
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
