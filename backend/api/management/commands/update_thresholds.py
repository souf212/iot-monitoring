from django.core.management.base import BaseCommand
from api.models import Sensor

class Command(BaseCommand):
    help = 'Updates all sensors to the new default thresholds (15-25°C)'

    def handle(self, *args, **options):
        count = Sensor.objects.update(min_temp=15.0, max_temp=25.0)
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {count} sensors to Min: 15°C, Max: 25°C'))
