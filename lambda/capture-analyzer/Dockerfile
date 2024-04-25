FROM public.ecr.aws/lambda/python:3.9

WORKDIR ${LAMBDA_TASK_ROOT}

COPY requirements.txt requirements.txt
RUN ldd --version && pip install -r requirements.txt --target .

COPY model.tflite .
COPY main.py .

CMD [ "main.handler" ]
