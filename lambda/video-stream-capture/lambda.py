import json
import boto3
import os
import subprocess
from datetime import datetime

def handler(event, context):

    camAddress = os.environ['CAMERA_ADDRESS']
    bucketName = os.environ['BUCKET_NAME']
    bucketPendingDir = os.environ['BUCKET_PENDING_DIR']
    targetFileName = datetime.now().strftime("image--%d-%m-%Y--%H-%M-%S.jpeg")
    targetFile = f"/tmp/{targetFileName}"

    # step 1: capture a screenshot from video stream
    command=f"ffmpeg -err_detect aggressive -fflags discardcorrupt -y -rtsp_transport tcp -i {camAddress} -vframes 1 {targetFile}"
    subprocess.call(command.split(" "))

    # step 2: upload the screenshot to S3
    s3 = boto3.resource('s3')
    s3.meta.client.upload_file(targetFile, bucketName, bucketPendingDir + "/" + targetFileName)

    # step 3: cleanup
    os.remove(targetFile)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
