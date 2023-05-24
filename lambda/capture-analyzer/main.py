import tflite_runtime.interpreter as tflite
from PIL import Image
import numpy as np
import boto3
from datetime import datetime, timezone
import os

TF_MODEL_FILE_PATH = 'model.tflite' # The default path to the saved TensorFlow Lite model

img_height = 180
img_width = 180
class_names = ['available', 'taken']

imagesBucketName = os.environ['IMAGES_BUCKET_NAME']

print('Loading TFLite model...')
interpreter = tflite.Interpreter(model_path=TF_MODEL_FILE_PATH)
classify_lite = interpreter.get_signature_runner('serving_default')

def softmax(z):
    assert len(z.shape) == 2

    s = np.max(z, axis=1)
    s = s[:, np.newaxis] # necessary step to do broadcasting
    e_x = np.exp(z - s)
    div = np.sum(e_x, axis=1)
    div = div[:, np.newaxis] # dito
    return e_x / div


def classify(image_path):
	print('Loading image...')
	image = Image.open(image_path)
	image = image.resize((img_width, img_height)).convert(mode='RGB')
	image_array = np.array(image, dtype=np.float32).reshape((img_height, img_width, 3))[None, :, :, :]

	print('Classifying...')
	predictions_lite = classify_lite(rescaling_1_input=image_array)['dense_1']
	score_lite = softmax(predictions_lite)
	prediction_label = class_names[np.argmax(score_lite)]
	print(
		"This image most likely belongs to {} with a {:.2f} percent confidence."
		.format(prediction_label, 100 * np.max(score_lite))
	)

	return True if prediction_label == 'available' else False

def handler(event, context):
	print(event)

	# step 1: download the screenshot from S3
	filename = event['Records'][0]['s3']['object']['key']
	local_image = f"/tmp/{filename}"
	print(f"Downloading image to {local_image}...")
	s3 = boto3.resource('s3')
	s3.meta.client.download_file(imagesBucketName, filename, local_image)

	# step 2: classify the screenshot
	isAvailable = classify(local_image)

	# step 3: cleanup
	os.remove(local_image)

	result = {
	   "type": "update",
	   "slots": [
		   {"available": isAvailable},
		   {"available": isAvailable},
		   {"available": isAvailable},

		   {"available": isAvailable},
		   {"available": isAvailable},
	   ],
	   "image": f"images/{filename}",
	   "lastUpdate": datetime.now(timezone.utc).isoformat()
	}

	print(result)
	return result