import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.utils import send_alert_email, send_alert_telegram
from django.conf import settings

class MockUser:
    def __init__(self, email):
        self.email = email
        self.username = "TestUser"

class MockSensor:
    def __init__(self):
        self.name = "Sensor Test"
        self.sensor_id = "TEST-001"
        self.location = "Labo Test"

class MockMeasurement:
    def __init__(self):
        self.temperature = 45.5
        self.humidity = 80.0
        self.timestamp = "2025-01-01 12:00:00"

def run_test():
    print("🚀 Démarrage du test de notification...")
    
    # 1. Vérification des configs
    print(f"📧 Email Config: {settings.EMAIL_HOST_USER}")
    print(f"📱 Telegram Config: Bot={settings.TELEGRAM_BOT_TOKEN[:10]}... ChatID={settings.TELEGRAM_CHAT_ID}")
    
    user = MockUser(email=settings.EMAIL_HOST_USER) # Envoie à soi-même pour tester
    sensor = MockSensor()
    measurement = MockMeasurement()
    message = "Ceci est un TEST de vérification."

    # 2. Test Email
    print("\n[1/2] Envoi de l'Email...")
    try:
        send_alert_email(user, sensor, measurement, message)
        print("✅ Email envoyé (vérifiez votre boîte de réception/spam).")
    except Exception as e:
        print(f"❌ Erreur Email: {e}")

    # 3. Test Telegram
    print("\n[2/2] Envoi Telegram...")
    try:
        send_alert_telegram(user, sensor, measurement, message)
        print("✅ Message Telegram envoyé (vérifiez votre conversation avec le bot).")
    except Exception as e:
        print(f"❌ Erreur Telegram: {e}")

if __name__ == "__main__":
    run_test()
