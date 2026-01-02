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


def send_pagerduty_alert(msg, sensor, measurement):
    """
    Envoie une alerte critique à PagerDuty via Events API v2.
    Cela fera sonner le téléphone de l'astreinte.
    Returns: True if sent, False otherwise.
    """
    routing_key = getattr(settings, 'PAGERDUTY_INTEGRATION_KEY', None)

    if not routing_key or "CHANGE_ME" in routing_key:
        print("⚠️ PagerDuty non configuré (Clé manquante ou 'CHANGE_ME')")
        return False

    url = "https://events.pagerduty.com/v2/enqueue"
    
    payload = {
        "routing_key": routing_key,
        "event_action": "trigger",
        "dedup_key": f"sensor-{sensor.sensor_id}-{measurement.id}", # Evite les doublons
        "payload": {
            "summary": f"ALERTE CRITIQUE: {msg}",
            "source": f"Sensor {sensor.name}",
            "severity": "critical",
            "custom_details": {
                "temperature": measurement.temperature,
                "humidity": measurement.humidity,
                "location": sensor.location,
                "timestamp": str(measurement.timestamp)
            }
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=5)
        if response.status_code == 202:
            create_audit("PAGERDUTY_SENT", sensor=sensor, details="PagerDuty alert sent")
            return True
        else:
            print(f"❌ Erreur PagerDuty: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception PagerDuty: {e}")
        return False


def send_alert_notification(sensor, measurement):
    """Envoie email + Telegram (+ PagerDuty si configuré dans escalation)"""
    send_alert_email(sensor, measurement)
    send_alert_telegram(sensor, measurement)