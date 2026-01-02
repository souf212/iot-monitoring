from django.core.management.base import BaseCommand
from api.utils import send_pagerduty_alert
from api.models import Sensor
from django.utils import timezone

class Command(BaseCommand):
    help = 'Test the PagerDuty integration'

    def handle(self, *args, **options):
        self.stdout.write("🔬 Testing PagerDuty Integration...")
        
        # Create Dummy Sensor Data
        class DummySensor:
            sensor_id = 999
            name = "TEST_SENSOR"
            location = "TEST_LOCATION"

        class DummyMeasurement:
            id = 12345
            temperature = 99.9
            humidity = 100.0
            timestamp = timezone.now()

        sensor = DummySensor()
        measurement = DummyMeasurement()
        message = "THIS IS A TEST ALERT TRIGGERED MANUALLY"

        try:
            self.stdout.write(f"📤 Sending mock alert to PagerDuty...")
            send_pagerduty_alert(message, sensor, measurement)
            self.stdout.write(self.style.SUCCESS("✅ Request sent (Check PagerDuty Dashboard)"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error sending alert: {e}"))
