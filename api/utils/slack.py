from slack_sdk.webhook import WebhookClient

from utils.secrets import secrets


def send_message(text:str):
    if secrets.SLACK_WEBHOOK_URL is None:
        print(f"no webhook, not sending message: '{text}'")
        return
    webhook = WebhookClient(secrets.SLACK_WEBHOOK_URL)
    response = webhook.send(text=text)
    print(response)
