from django.core.management.base import BaseCommand
from api.utils import send_twilio_alert
from api.models import Sensor
from django.utils import timezone

class Command(BaseCommand):
    help = 'Test the Twilio Voice Call integration'

    def handle(self, *args, **options):
        self.stdout.write("🔬 Testing Twilio Integration...")
        
        # Get Real Sensor Data
        sensor = Sensor.objects.first()
        if not sensor:
             self.stdout.write(self.style.ERROR("❌ No sensors found in database. Please add a sensor first."))
             return

        class DummyMeasurement:
            id = 12345
            temperature = 99.9
            humidity = 100.0
            timestamp = timezone.now()

        measurement = DummyMeasurement()
        message = "THIS IS A TEST ALERT TRIGGERED MANUALLY"

        try:
            self.stdout.write(f"📤 Sending mock call to Twilio...")
            success = send_twilio_alert(message, sensor, measurement)
            
            if success:
                self.stdout.write(self.style.SUCCESS("✅ Request sent (Check Twilio Console/Phone)"))
            else:
                self.stdout.write(self.style.WARNING("⚠️ Request NOT sent. Check your Twilio settings in settings.py"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error sending alert: {e}"))
