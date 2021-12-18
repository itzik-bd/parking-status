const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
    let connectionData;

    try {
        connectionData = await ddb.scan({ TableName: process.env.TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: process.env.WS_ENDPOINT_URL
    });

    const postData = JSON.stringify(JSON.parse(event.Records[0].body).responsePayload);

    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
        try {
            console.log(`sending to client ${connectionId}`);
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
        } catch (e) {
            if (e.statusCode === 410) {
                console.log(`Found stale connection, deleting ${connectionId}`);
                await ddb.delete({ TableName: process.env.TABLE_NAME, Key: { connectionId } }).promise();
            } else {
                throw e;
            }
        }
    });

    try {
        await Promise.all(postCalls);
    } catch (err) {
        console.error(`failed to notify clients`, err);
        return { statusCode: 500, body: 'Failed to notify clients: ' + JSON.stringify(err) };
    }

    console.log(`done`);
    return { statusCode: 200, body: 'Data sent.' };
};
