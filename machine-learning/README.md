# Machine learning model

## Creating dataset

### Collect data

* Created a [S3 bucket](../infrastructure/app/resource.bucket.images-periodic.tf) to store the images
* Created a [scheduler](../infrastructure/app/resource.scheduler.tf) to invoke [video-stream-capture](../infrastructure/app/resource.video-stream-capture.tf) lambda every 30 minutes for capture image and upload it to the S3 bucket

### Label data

Create a directory `mkdir parking-status-dataset`.

Manually download the images from the S3 bucket and label them into the following folders:
* `available/` - if the parking spot is available
* `taken/` - if no parking spot is available 

After all images were labeled, the directory should look like this (`tree --filelimit=5 parking-status-dataset`): 
```
parking-status-dataset
├── available  [895 entries exceeds filelimit, not opening dir]
└── taken  [776 entries exceeds filelimit, not opening dir]
```
  
### Preparing the dataset
* To minimize the size of the dataset, minimize images to 512x512 pixels (might take a while to finish):
  ```
  find parking-status-dataset -name '*.jpeg' -exec docker run --rm -v $(pwd):/imgs dpokidov/imagemagick /imgs/{} -resize 512x512 /imgs/{} \;
  ```
* Create a tgz file:
  ```
  find parking-status-dataset -name '*.jpeg' -print0 | tar --disable-copyfile -cvzf parking-status-dataset.tgz --files-from -
  ```
* Upload `parking-status-dataset.tgz` to a publicly available [S3 bucket](../infrastructure/shared/resource.bucket.ml.tf):
  ```
  aws s3 cp parking-status-dataset.tgz s3://parking-status-ml/
  ```
### 

## Train the model

* Open the (Jupyter notebook)[./parking-status-classification.ipynb) via [Google Colab](https://colab.research.google.com/github/itzik-bd/parking-status/blob/main/machine-learning/parking-status-classification.ipynb)
* Find the generated model under `/content/model.tflite` and download it to your local machine
* Upload the model to s3 bucket
  ```
  aws s3 cp model.tflite s3://parking-status-ml/
  ```
