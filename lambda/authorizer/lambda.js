exports.handler = async (event) => {

    // Get the request and its headers
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // Specify the username and password to be used
    const user = 'user';
    const pw = 'password';

    // Build a Basic Authentication string
    const authString = 'Basic ' + Buffer.from(user + ':' + pw).toString('base64');

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
