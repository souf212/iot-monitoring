from django.core.management.base import BaseCommand
from api.utils import send_critical_webhook
from api.models import Sensor, Measurement
from django.utils import timezone

class Command(BaseCommand):
    help = 'Test the Critical Webhook integration'

    def handle(self, *args, **options):
        self.stdout.write("🔬 Testing Webhook Integration...")
        
        # Create Dummy Data for the test
        class DummySensor:
            sensor_id = 999
            name = "TEST_SENSOR"
            location = "TEST_LOCATION"

        class DummyMeasurement:
            temperature = 99.9
            humidity = 100.0
            timestamp = timezone.now()

        sensor = DummySensor()
        measurement = DummyMeasurement()
        message = "THIS IS A TEST ALERT TRIGGERED MANUALLY"

        try:
            self.stdout.write(f"📤 Sending payload to Webhook defined in settings...")
            send_critical_webhook(message, sensor, measurement)
            self.stdout.write(self.style.SUCCESS("✅ Webhook request sent (Check your endpoint to confirm receipt)"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error sending webhook: {e}"))
