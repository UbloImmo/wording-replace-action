FROM python:3.12-alpine

WORKDIR /code

RUN apk add --no-cache gcc musl-dev linux-headers

COPY src/python/requirements.txt /code/requirements.txt

RUN pip install -r requirements.txt

COPY src/python /code
