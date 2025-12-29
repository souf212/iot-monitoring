# 🚀 Guide de Démarrage Rapide - IoT Climate Monitor

Ce guide vous permettra de lancer le projet en **moins de 10 minutes**.

---

## ⚡ Installation Express

### 1️⃣ Prérequis Vérification

```bash
# Vérifier Python
python --version  # Doit être 3.11+

# Vérifier Node.js
node --version    # Doit être 18+

# Vérifier Mosquitto
mosquitto -h      # Doit être installé
```

### 2️⃣ Setup Backend (3 minutes)

```bash
# 1. Aller dans backend
cd backend

# 2. Environnement virtuel
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

# 3. Installer dépendances
pip install -r requirements.txt

# 4. Base de données
python manage.py migrate

# 5. Créer admin
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: ********

# 6. Créer un capteur
python manage.py shell
```

Dans le shell Python :
```python
from api.models import Sensor
Sensor.objects.create(
    sensor_id=1,
    name="DHT11-ESP8266",
    location="Bureau",
    active=True,
    min_temp=15.0,
    max_temp=30.0
)
exit()
```

### 3️⃣ Setup Frontend (2 minutes)

```bash
# 1. Aller dans frontend
cd ../frontend

# 2. Installer dépendances
npm install --legacy-peer-deps

# 3. C'est tout ! 🎉
```

### 4️⃣ Configuration MQTT (1 minute)

**Windows** :
```bash
# Démarrer Mosquitto
net start mosquitto
```

**Linux/Mac** :
```bash
sudo systemctl start mosquitto
```

---

## ▶️ Lancer l'Application

Ouvrir **3 terminaux** :

### Terminal 1 : Backend Django
```bash
cd backend
python manage.py runserver
```
✅ Backend prêt sur http://localhost:8000

### Terminal 2 : MQTT Subscriber
```bash
cd backend
python manage.py mqtt_subscriber
```
✅ MQTT connecté et écoute les capteurs

### Terminal 3 : Frontend React
```bash
cd frontend
npm start
```
✅ Frontend prêt sur http://localhost:3000

---

## 🎯 Premier Test

### Connexion au Dashboard

1. Ouvrir http://localhost:3000
2. Se connecter avec les identifiants créés
3. Vous verrez le dashboard !

### Simuler des données MQTT (sans ESP8266)

Installer MQTT client :
```bash
# Windows
choco install mosquitto-clients

# Linux
sudo apt install mosquitto-clients
```

Envoyer des données de test :
```bash
# Température 25°C, Humidité 60%
mosquitto_pub -h localhost -t "sensors/1/dht11" -m '{"temperature": 25.0, "humidity": 60.0}'

# Plusieurs mesures
mosquitto_pub -h localhost -t "sensors/1/dht11" -m '{"temperature": 26.5, "humidity": 58.0}'
mosquitto_pub -h localhost -t "sensors/1/dht11" -m '{"temperature": 24.8, "humidity": 62.0}'
```

### Tester le contrôle LED

1. Dans le dashboard, cliquer sur le bouton LED
2. Observer dans le terminal MQTT :
   ```
   Topic: devices/esp8266-001/cmd/led
   Message: ON ou OFF
   ```

---

## 📊 Fonctionnalités Disponibles

### Dashboard Principal
- 🌡️ Température en temps réel
- 💧 Humidité en temps réel
- 💡 Contrôle LED ON/OFF
- 📈 Graphique combiné
- 📋 Log des événements

### Pages Historiques
- 📊 `/temperature/history` - Historique température
- 💧 `/humidity/history` - Historique humidité
- 🔍 Filtres par date
- 📥 Export CSV

### Administration
- 👥 `/users` - Gestion utilisateurs
- 🔧 `/sensors` - Gestion capteurs
- 📝 `/audit` - Logs d'audit

---

## ⚙️ Configuration ESP8266

### Code Arduino Minimal

```cpp
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// WiFi
const char* ssid = "VOTRE_WIFI";
const char* password = "VOTRE_PASSWORD";

// MQTT
const char* mqtt_server = "192.168.1.XXX";  // IP de votre PC
const int mqtt_port = 1883;

// DHT11
#define DHTPIN D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// LED
#define LED_PIN D1

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  
  // WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  // MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  
  dht.begin();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Publier toutes les 5 secondes
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;
    
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    
    String payload = "{\"temperature\":" + String(temp) + 
                    ",\"humidity\":" + String(hum) + "}";
    
    client.publish("sensors/1/dht11", payload.c_str());
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  if (String(topic) == "devices/esp8266-001/cmd/led") {
    if (message == "ON") {
      digitalWrite(LED_PIN, HIGH);
    } else if (message == "OFF") {
      digitalWrite(LED_PIN, LOW);
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP8266Client")) {
      client.subscribe("devices/esp8266-001/cmd/led");
    } else {
      delay(5000);
    }
  }
}
```

### Branchements

```
ESP8266     DHT11
-------     -----
3.3V   -->  VCC
GND    -->  GND
D4     -->  DATA

ESP8266     LED
-------     ---
D1     -->  Anode (+)
GND    -->  Cathode (-) + Résistance 220Ω
```

---

## 🐛 Dépannage Rapide

### Problème : Backend ne démarre pas
```bash
# Vérifier les migrations
python manage.py migrate

# Réinstaller dépendances
pip install -r requirements.txt --upgrade
```

### Problème : Frontend ne compile pas
```bash
# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Problème : MQTT non connecté
```bash
# Redémarrer Mosquitto
# Windows
net stop mosquitto
net start mosquitto

# Linux
sudo systemctl restart mosquitto
```

### Problème : LED ne répond pas
```bash
# Vérifier le topic MQTT
mosquitto_sub -h localhost -t "devices/#" -v

# Tester manuellement
mosquitto_pub -h localhost -t "devices/esp8266-001/cmd/led" -m "ON"
```

---

## 📚 Ressources

- **Documentation complète** : Voir [README.md](README.md)
- **API Documentation** : http://localhost:8000/api/
- **Admin Panel** : http://localhost:8000/admin/

---

## ✅ Checklist de Vérification

- [ ] Python 3.11+ installé
- [ ] Node.js 18+ installé
- [ ] Mosquitto MQTT installé
- [ ] Backend démarré (port 8000)
- [ ] MQTT subscriber actif
- [ ] Frontend démarré (port 3000)
- [ ] Capteur créé (ID=1)
- [ ] Connexion réussie au dashboard
- [ ] Données MQTT reçues (test ou ESP8266)
- [ ] LED contrôlable

---

**🎉 Félicitations ! Votre système IoT est opérationnel !**

Pour aller plus loin, consultez le [README.md](README.md) complet.
