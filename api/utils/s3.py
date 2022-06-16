import json

import boto3

POLYGLOT_VICTORIA_BUCKET_NAME = "polyglotvictoria.ca"


def save_to_s3(bucket_name:str, bucket_key:str, json_data:dict):
    s3 = boto3.resource('s3')
    object = s3.Object(bucket_name, bucket_key)
    body = (bytes(json.dumps(json_data, indent=4, sort_keys=True).encode('UTF-8')))
    print(f"saving {body}")
    object.put(Body=body)
