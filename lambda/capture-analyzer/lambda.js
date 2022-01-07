exports.handler = async (eventS3) => {
    const file = eventS3.Records[0].s3.object.key;
    return processImage(file);
};

function processImage(file) {
    return {
        "type": "update",
        "slots": [
            {"available": false},
            {"available": false},
            {"available": true},

            {"available": true},
            {"available": true},
        ],
        "image": `images/${file}`,
        "lastUpdate": new Date().getTime()
    };
}
