FROM python:3.8-alpine

WORKDIR /code

RUN apk --update add gcc make g++ zlib-dev

ADD requirements.txt .
RUN pip install -r requirements.txt
ADD . /code/

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]