// since Lambda@Edge doesn't support environment variables,
// I preferred to write the credentials to a file which is
// created during terraform apply (credentials are given as
// a secured parameters to the build), instead of reading them
// from SSM on every request (cost and latency wise).
// Note: this file is ignored by GIT.
const {USER, PASS} = require('credentials');

exports.handler = async (event) => {

    // Get the request and its headers
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // Build a Basic Authentication string
    const authString = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');

    // Challenge for auth if auth credentials are absent or incorrect
    if (typeof headers.authorization == 'undefined' || headers.authorization[0].value !== authString) {
        return {
            status: '401',
            statusDescription: 'Unauthorized',
            body: 'Unauthorized',
            headers: {
                'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
            },
        };
    }

    // for specific request paths, remove the prefix
    request.uri = request.uri.replace(/^\/images\//,"/");

    // User has authenticated
    return request;
};
