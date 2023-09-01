const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("@aws-sdk/client-apigatewaymanagementapi");

const ddb = new DynamoDBClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
    console.log(`got event: ${JSON.stringify(event)}`);
    let connectionData;

    try {
        connectionData = await ddb.send(new ScanCommand({
            TableName: process.env.TABLE_NAME,
            ProjectionExpression: 'connectionId'
        }));
    } catch (e) {
        return { statusCode: 500, body: e.stack };
    }

    const apigwManagementApi = new ApiGatewayManagementApiClient({
        apiVersion: '2018-11-29',
        endpoint: process.env.WS_ENDPOINT_URL
    });

    const postData = extractMessage(event);

    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
        try {
            console.log(`sending to client ${connectionId}`);
            await apigwManagementApi.send(new PostToConnectionCommand({
                ConnectionId: connectionId,
                Data: postData
            }));
        } catch (e) {
            if (e.statusCode === 410) {
                console.log(`Found stale connection, deleting ${connectionId}`);
                await ddb.send(new DeleteItemCommand({
                    TableName: process.env.TABLE_NAME,
                    Key: {
                        connectionId: {
                            "S": connectionId
                        }
                    }
                }));
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

function extractMessage(event) {
    let data = JSON.parse(event.Records[0].Sns.Message); // assuming this is already stringified JSON

    // from lambda
    if (data?.responsePayload) {
        data = data.responsePayload;
    }

    return JSON.stringify(data);
}
