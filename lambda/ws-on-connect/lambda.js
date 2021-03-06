const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

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
    return { statusCode: 200, body: 'Connected.' };
};
