FROM python:3.8-alpine

WORKDIR /code

RUN apk --update add gcc make g++ zlib-dev
ADD requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
ADD . /code/

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]