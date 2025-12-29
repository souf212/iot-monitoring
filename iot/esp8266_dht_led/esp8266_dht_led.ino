#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

/* ================= CONFIGURATION ================= PC et Arduino sur le même réseau WIFI*/

// WiFi
const char* ssid = "TP-LINK-X";
const char* password = "xoxoxoxo";

// MQTT (Broker Mosquitto sur PC)
const char* mqtt_server = "10.101.218.244";  // Adresse IP de votre PC WiFi
const int mqtt_port = 1883;

// Topics
const char* topic_pub = "sensors/1/dht11";
const char* topic_led = "devices/esp8266-001/cmd/led";

// DHT11
#define DHTPIN D1        // NodeMCU D1 = GPIO5 vérifier bien le fil data du capteur DHT11 sur le GPIO5/D1
#define DHTTYPE DHT11

// LED intégrée (NodeMCU)
#define LED_PIN LED_BUILTIN   // équivalent à D4 (GPIO2)

/* ================================================= */

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastSend = 0;
const unsigned long SEND_INTERVAL_MS = 5000; // 5 secondes

/* =============== WiFi ================= */

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connexion WiFi: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int tries = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    tries++;
    if (tries > 60) { // ~30s
      Serial.println("\nWiFi timeout -> reboot");
      ESP.restart();
    }
  }

  Serial.println("\nWiFi connecté");
  Serial.print("IP ESP8266 : ");
  Serial.println(WiFi.localIP());

  // Test TCP vers broker (diagnostic)
  Serial.print("Test TCP 1883 vers broker... ");
  WiFiClient testClient;
  if (testClient.connect(mqtt_server, mqtt_port)) {
    Serial.println("OK");
    testClient.stop();
  } else {
    Serial.println("ECHEC (port 1883 inaccessible)");
  }
}

/* =============== Callback MQTT ================= */

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  message.reserve(length);

  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("MQTT reçu | Topic: ");
  Serial.print(topic);
  Serial.print(" | Msg: ");
  Serial.println(message);

  // commande LED
  if (String(topic) == topic_led) {
    message.trim();
    message.toUpperCase();

    if (message == "ON") {
      digitalWrite(LED_PIN, LOW);    // LED ON (active LOW)
      Serial.println("=> LED ALLUMÉE");
    } else if (message == "OFF") {
      digitalWrite(LED_PIN, HIGH);   // LED OFF
      Serial.println("=> LED ÉTEINTE");
    } else {
      Serial.println("=> Commande inconnue (utiliser ON/OFF)");
    }
  }
}

/* =============== Reconnexion MQTT ================= */

void reconnect_mqtt() {
  while (!client.connected()) {
    Serial.print("Connexion MQTT... ");

    // client_id unique
    String clientId = "ESP8266-DHT-";
    clientId += String(ESP.getChipId(), HEX);

    if (client.connect(clientId.c_str())) {
      Serial.println("OK");

      // Subscribe topic LED
      if (client.subscribe(topic_led)) {
        Serial.print("Abonné au topic LED: ");
        Serial.println(topic_led);
      } else {
        Serial.println("ERREUR subscribe !");
      }

    } else {
      Serial.print("ECHEC rc=");
      Serial.print(client.state());
      Serial.println(" -> retry 2s");
      delay(2000);
    }
  }
}

/* ================= SETUP ================= */

void setup() {
  Serial.begin(115200);
  delay(200);

  // LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); // OFF par défaut

  dht.begin();

  setup_wifi();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Connexion MQTT initiale
  reconnect_mqtt();
}

/* ================= LOOP ================= */

void loop() {
  // WiFi reconnect si besoin
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi perdu -> reconnexion...");
    setup_wifi();
  }

  // MQTT reconnect si besoin
  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop();

  // Envoi DHT toutes les 5s
  unsigned long now = millis();
  if (now - lastSend >= SEND_INTERVAL_MS) {
    lastSend = now;

    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
      Serial.println("Erreur lecture DHT11");
      return;
    }

    char payload[80];
    snprintf(payload, sizeof(payload),
             "{\"temperature\":%.1f,\"humidity\":%.1f}", t, h);

    bool ok = client.publish(topic_pub, payload);
    Serial.print("Publié vers ");
    Serial.print(topic_pub);
    Serial.print(" : ");
    Serial.print(payload);
    Serial.print(" | ");
    Serial.println(ok ? "OK" : "ECHEC");
  }

  yield(); // anti-watchdog
}
