import requests
from django.conf import settings
from django.core.mail import send_mail
from .audit import create_audit

def send_alert_email(user, sensor, measurement, msg):
    subject = f"⚠️ Alerte Température - Capteur #{sensor.sensor_id}"
    message = (
        f"Alerte : {msg}\n"
        f"Capteur : {sensor.name} (ID {sensor.sensor_id})\n"
        f"Localisation : {sensor.location}\n\n"
        f"Température : {measurement.temperature}°C\n"
        f"Humidité : {measurement.humidity}%\n"
        f"Heure : {measurement.timestamp}\n\n"
        f"⚠️ Valeur en dehors des seuils autorisés !"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],  # tu peux mettre la liste interne
        fail_silently=True,
    )
    create_audit("EMAIL_SENT", sensor=sensor, details="Email alert sent")

def send_telegram(text: str) -> bool:
    """Envoie un message Telegram via l'API officielle. Retourne True si OK."""
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        r = requests.post(url, data={"chat_id": chat_id, "text": text})
        return r.ok
    except Exception:
        return False
def send_alert_telegram(user, sensor, measurement, msg):
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    text = (
        f"⚠️ *ALERTE TEMPÉRATURE : {msg}*\n"
        f"Capteur: {sensor.name} (ID {sensor.sensor_id})\n"
        f"Température : {measurement.temperature}°C\n"
        f"Humidité : {measurement.humidity}%\n"
        f"Heure: {measurement.timestamp}\n"
        f"User Email address : {user.email}\n"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}

    try:
        requests.post(url, data=payload)
        create_audit("TELEGRAM_SENT", sensor=sensor, details="Telegram alert sent")
    except Exception:
        pass


def send_twilio_alert(msg, sensor, measurement):
    """
    Envoie un appel vocal via Twilio.
    Remplace PagerDuty pour les pays non supportés (ex: Maroc).
    """
    account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
    auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
    from_number = getattr(settings, 'TWILIO_PHONE_NUMBER', None)
    to_number = getattr(settings, 'TARGET_PHONE_NUMBER', None)

    if not account_sid or "CHANGE_ME" in account_sid:
        print("⚠️ Twilio non configuré (SID manquant)")
        return False

    try:
        from twilio.rest import Client
        client = Client(account_sid, auth_token)

        # Message TwiML pour le TTS (Text-To-Speech)
        twiml_msg = f"<Response><Say language='fr-FR'>Alerte Critique sur le capteur {sensor.name}. Température de {measurement.temperature} degrés. Veuillez intervenir immédiatement.</Say></Response>"

        call = client.calls.create(
            twiml=twiml_msg,
            to=to_number,
            from_=from_number
        )
        
        print(f"✅ Appel Twilio lancé: {call.sid}")
        create_audit("Twilio_SENT", sensor=sensor, details=f"Voice call sent to {to_number}")
        return True

    except Exception as e:
        print(f"❌ Erreur Twilio: {e}")
        return False


def send_alert_notification(sensor, measurement):
    """Envoie email + Telegram (+ Appel Twilio si critique)"""
    send_alert_email(sensor, measurement)
    send_alert_telegram(sensor, measurement)