import os
import json
import time
import requests
import paho.mqtt.client as mqtt
import ssl
import threading
import getpass

# --- CONFIGURATION LOCALE (vers ESP8266) ---
LOCAL_BROKER = "127.0.0.1"
LOCAL_PORT = 1883
LOCAL_TOPIC_DATA = "sensors/+/dht11"
LOCAL_TOPIC_CMD = "devices/esp8266-001/cmd/led"

# --- CONFIGURATION CLOUD (HiveMQ) ---
HIVEMQ_BROKER = "ebd48b34f0024d7da700e7542962d530.s1.eu.hivemq.cloud"
HIVEMQ_PORT = 8883
HIVEMQ_USER = "soufiane"
HIVEMQ_PASSWORD = "Souf0000"
HIVEMQ_TOPIC_CMD = "devices/esp8266-001/cmd/led"

# --- CONFIGURATION API ---
API_LOGIN_URL = "https://souf.pythonanywhere.com/api/auth/login/"
API_MEASUREMENT_URL = "https://souf.pythonanywhere.com/api/mesures/"
USERNAME = "souf"
PASSWORD = None  # Sera demandé au lancement
TOKEN = None

# --- CLIENTS MQTT ---
local_client = mqtt.Client(client_id="Bridge_Local")
hivemq_client = mqtt.Client(client_id="Bridge_HiveMQ", protocol=mqtt.MQTTv5)

# --- FONCTIONS AUTHENTIFICATION ---

def get_jwt_token():
    global TOKEN, PASSWORD
    print(f"🔑 Authentification sur {API_LOGIN_URL}")
    
    if not PASSWORD:
         PASSWORD = getpass.getpass(prompt=f"Entrez le mot de passe pour l'utilisateur '{USERNAME}': ")

    try:
        response = requests.post(API_LOGIN_URL, data={"username": USERNAME, "password": PASSWORD})
        if response.status_code == 200:
            TOKEN = response.json().get("access")
            print("✅ Token JWT récupéré avec succès !")
            return True
        else:
            print(f"❌ Échec auth : {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur connexion API : {e}")
        return False

def send_data_to_api(payload):
    global TOKEN
    if not TOKEN:
        if not get_jwt_token():
            return

    headers = {"Authorization": f"Bearer {TOKEN}"}
    try:
        response = requests.post(API_MEASUREMENT_URL, json=payload, headers=headers)
        
        if response.status_code == 201:
            print("🚀 Envoyé vers PythonAnywhere (Code 201)")
        elif response.status_code == 401:
            print("🔄 Token expiré, renouvellement...")
            if get_jwt_token():
                send_data_to_api(payload) # Retry
        else:
            print(f"⚠️ Erreur API ({response.status_code}): {response.text}")

    except Exception as e:
        print(f"❌ Erreur Envoi API : {e}")

# --- CALLBACKS LOCAL (ESP -> API) ---
def on_local_connect(client, userdata, flags, rc):
    print("✅ Connecté au Broker Local (Mosquitto)")
    client.subscribe(LOCAL_TOPIC_DATA)

def on_local_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        print(f"📥 Reçu de {msg.topic}: {data}")

        try:
            sensor_id = int(msg.topic.split("/")[1])
        except:
            sensor_id = 1

        api_payload = {
            "sensor": sensor_id,
            "sensor_id": sensor_id,
            "temperature": data.get("temperature"),
            "humidity": data.get("humidity"),
            "status": "OK"
        }

        print(f"📤 Envoi payload : {json.dumps(api_payload)}")
        send_data_to_api(api_payload)

    except Exception as e:
        print(f"❌ Erreur traitement message : {e}")

# --- CALLBACKS HIVEMQ (Cloud -> Local) ---
def on_hivemq_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"✅ Connecté à HiveMQ Cloud !")
        client.subscribe(HIVEMQ_TOPIC_CMD)
        print(f"👂 Écoute des commandes sur {HIVEMQ_TOPIC_CMD}")
    else:
        print(f"❌ Échec connexion HiveMQ (Code: {rc})")

def on_hivemq_message(client, userdata, msg):
    try:
        decoded_cmd = msg.payload.decode()
        print(f"⚡ COMMANDE REÇUE DU CLOUD : {decoded_cmd}")
        
        # Relai vers le broker local (pour que l'ESP l'entende)
        print(f"🔄 Redirection vers Broker Local...")
        local_client.publish(LOCAL_TOPIC_CMD, decoded_cmd)
    except Exception as e:
         print(f"❌ Erreur relais commande : {e}")

def start_hivemq_bridge():
    """Démarre la connexion HiveMQ dans un thread séparé"""
    try:
        hivemq_client.on_connect = on_hivemq_connect
        hivemq_client.on_message = on_hivemq_message
        
        # Configuration TLS obligatoire pour HiveMQ Cloud
        hivemq_client.tls_set(tls_version=ssl.PROTOCOL_TLS)
        hivemq_client.username_pw_set(HIVEMQ_USER, HIVEMQ_PASSWORD)
        
        print(f"🔄 Connexion à HiveMQ ({HIVEMQ_BROKER})...")
        hivemq_client.connect(HIVEMQ_BROKER, HIVEMQ_PORT, 60)
        hivemq_client.loop_forever()
    except Exception as e:
        print(f"❌ Erreur critique HiveMQ Bridge : {e}")

# --- MAIN ---
if __name__ == "__main__":
    print("--- IOT BRIDGE (LOCAL <-> CLOUD) ---")
    
    # Authentification initiale
    get_jwt_token()

    # Démarrage du Bridge HiveMQ (Cloud -> Local) en arrière-plan
    t = threading.Thread(target=start_hivemq_bridge)
    t.daemon = True
    t.start()

    # Démarrage du Bridge Local (Local -> API)
    local_client.on_connect = on_local_connect
    local_client.on_message = on_local_message

    try:
        print(f"🔄 Connexion au Broker Local ({LOCAL_BROKER})...")
        local_client.connect(LOCAL_BROKER, LOCAL_PORT, 60)
        local_client.loop_forever()
    except KeyboardInterrupt:
        print("\nArrêt.")
    except Exception as e:
        print(f"\n❌ Erreur connexion locale : {e}")
