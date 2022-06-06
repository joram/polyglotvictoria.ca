from slack_sdk.webhook import WebhookClient

from utils.secrets import secrets

webhook = WebhookClient(secrets.SLACK_WEBHOOK_URL)


def send_message(text:str):
    response = webhook.send(text=text)
