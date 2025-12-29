import json
import paho.mqtt.client as mqtt
from django.core.management.base import BaseCommand
from api.models import Dht11, Sensor, Measurement
from django.utils import timezone


class Command(BaseCommand):
    help = 'MQTT Subscriber pour recevoir les données des capteurs IoT'

    def handle(self, *args, **options):
        # Configuration MQTT
        BROKER = "127.0.0.1"
        PORT = 1883
        TOPIC_SENSORS = "sensors/+/dht11"  # Wildcards pour tous les capteurs

        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                self.stdout.write(self.style.SUCCESS("✅ MQTT connecté au broker"))
                client.subscribe(TOPIC_SENSORS)
                self.stdout.write(f"📡 Abonné au topic: {TOPIC_SENSORS}")
            else:
                self.stdout.write(self.style.ERROR(f"❌ Connexion échouée, code: {rc}"))

        def on_message(client, userdata, msg):
            try:
                topic = msg.topic
                payload = msg.payload.decode('utf-8')
                data = json.loads(payload)

                temperature = data.get('temperature')
                humidity = data.get('humidity')

                # Sauvegarder dans Dht11 (table existante)
                Dht11.objects.create(
                    temperature=temperature,
                    humidity=humidity
                )

                # --- NOUVEAU: Sauvegarder dans Measurement (pour le Frontend React) ---
                try:
                    # Extraction ID capteur depuis topic: "sensors/esp8266-001/dht11"
                    # On cherche un chiffre, sinon par défaut 1
                    import re
                    match = re.search(r'(\d+)', topic)
                    sensor_id = int(match.group(1)) if match else 1

                    # Récupérer le capteur
                    sensor_obj = Sensor.objects.filter(sensor_id=sensor_id).first()
                    
                    if sensor_obj:
                        Measurement.objects.create(
                            sensor=sensor_obj,
                            temperature=temperature,
                            humidity=humidity,
                            status="OK"
                        )
                        self.stdout.write(self.style.SUCCESS(f"✅ Saved to Measurement (Sensor {sensor_id})"))
                    else:
                        self.stdout.write(self.style.WARNING(f"⚠️ Capteur ID {sensor_id} non trouvé en base. Créez-le dans l'admin."))

                except Exception as db_err:
                    self.stdout.write(self.style.ERROR(f"❌ Erreur DB Measurement: {db_err}"))

                self.stdout.write(
                    self.style.SUCCESS(
                        f"📊 Données reçues: {temperature}°C / {humidity}% | Topic: {topic}"
                    )
                )

            except json.JSONDecodeError:
                self.stdout.write(self.style.ERROR(f"❌ JSON invalide: {msg.payload}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Erreur: {str(e)}"))

        def on_disconnect(client, userdata, rc):
            if rc != 0:
                self.stdout.write(self.style.WARNING("⚠️ Déconnexion inattendue, reconnexion..."))

        # Création du client MQTT
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message
        client.on_disconnect = on_disconnect

        try:
            self.stdout.write("🔄 Connexion au broker MQTT...")
            client.connect(BROKER, PORT, 60)
            self.stdout.write("🔄 Démarrage de la boucle MQTT...")
            client.loop_forever()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("\n⏹️ Arrêt du subscriber"))
            client.disconnect()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erreur de connexion: {str(e)}"))
