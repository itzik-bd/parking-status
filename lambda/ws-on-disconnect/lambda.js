const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const ddb = new DynamoDBClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
    const connectionId = event.requestContext.connectionId;
    const reason = event.requestContext.disconnectReason;

    const deleteParams = {
        TableName: process.env.TABLE_NAME,
        Key: {
            connectionId: {
                "S": connectionId
            }
        }
    };

    try {
        console.log(`disconnecting session ${connectionId} due to: ${reason}`);
        await ddb.send(new DeleteItemCommand(deleteParams));
    } catch (err) {
        console.error(`failed to disconnect`, err);
        return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
    }

    console.log(`disconnected`);
    return { statusCode: 200, body: 'Disconnected.' };
};
