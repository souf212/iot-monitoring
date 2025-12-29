from django.core.management.base import BaseCommand
from api.models import Sensor, Measurement
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Initialize data: creates a default Sensor and a dummy Measurement'

    def handle(self, *args, **options):
        # 1. Ensure a user exists (for the sensor FK)
        user, created = User.objects.get_or_create(username="admin", defaults={'email': 'admin@example.com'})
        if created:
            user.set_password("admin")
            user.save()
            self.stdout.write(self.style.SUCCESS("Created default user 'admin'"))

        # 2. Create the Sensor (ID 1 is required by frontend default)
        sensor, created = Sensor.objects.get_or_create(
            sensor_id=1,
            defaults={
                'name': 'DHT11 Salon',
                'location': 'Living Room',
                'user': user,
                'min_temp': 18.0,
                'max_temp': 28.0
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS("✅ Created Sensor ID 1"))
        else:
            self.stdout.write(self.style.SUCCESS("ℹ️ Sensor ID 1 already exists"))

        # 3. Create a dummy Measurement to fix 404 immediately
        Measurement.objects.create(
            sensor=sensor,
            temperature=20.0,
            humidity=50.0,
            status="OK"
        )
        self.stdout.write(self.style.SUCCESS("✅ Created dummy Measurement. Frontend should now work (no 404)."))
