import logging
import json
import boto3
import os
import subprocess
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

camAddress = os.environ['CAMERA_ADDRESS']
imagesBucketName = os.environ['IMAGES_BUCKET_NAME']
imagesPeriodicBucketName = os.environ['IMAGES_PERIODIC_BUCKET_NAME']

def handler(event, context):

    isPeriodicSample = 'detail-type' in event and event['detail-type'] == 'Scheduled Event'
    bucketName = imagesPeriodicBucketName if isPeriodicSample else imagesBucketName
    targetFileName = datetime.now().strftime("image--%d-%m-%Y--%H-%M-%S.jpeg")
    targetFile = f"/tmp/{targetFileName}"

    logger.info(f'## isPeriodicSample: {isPeriodicSample}')
    logger.info(f'## bucketName: {bucketName}')

    # step 1: capture a screenshot from video stream
    command=f"ffmpeg -err_detect aggressive -fflags discardcorrupt -y -rtsp_transport tcp -i {camAddress} -vframes 1 {targetFile}"
    subprocess.call(command.split(" "))

    # step 2: upload the screenshot to S3
    s3 = boto3.resource('s3')
    s3.meta.client.upload_file(targetFile, bucketName, targetFileName)

    # step 3: cleanup
    os.remove(targetFile)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
