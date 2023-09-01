const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const ddb = new DynamoDBClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async event => {
    const connectionId = event.requestContext.connectionId;

    const putParams = {
        TableName: TABLE_NAME,
        Item: {
            connectionId: {
                "S": connectionId
            }
        }
    };

    try {
        console.log(`connecting session ${connectionId}`);
        await ddb.send(new PutItemCommand(putParams));
    } catch (err) {
        console.error(`failed to connect`, err);
        return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
    }

    console.log(`connected`);
    return { statusCode: 200, body: 'Connected.' };
};
