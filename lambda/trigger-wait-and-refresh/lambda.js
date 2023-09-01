const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn")

const client = new SFNClient();

const STEP_FUNCTION_ARN = process.env.STEP_FUNCTION_ARN;

exports.handler = async (event) => {
    console.log(JSON.stringify(event));

    console.log(`invoking step function ${STEP_FUNCTION_ARN}`);
    try {
        await client.send(new StartExecutionCommand({
            stateMachineArn: STEP_FUNCTION_ARN,
            input: JSON.stringify({})
        }));
    } catch (e) {
        console.log('failed to start step function execution', e);
        return { statusCode: 500, body: e.stack };
    }

    console.log(`step function execution was started`);
};
