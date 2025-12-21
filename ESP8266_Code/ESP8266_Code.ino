/*
 * Code ESP8266 pour Cold Chain Monitoring
 * Capteur DHT11 - Envoi des données toutes les 20 minutes
 * 
 * Matériel requis:
 * - ESP8266 (NodeMCU ou Wemos D1 Mini)
 * - Capteur DHT11
 * - Connexions: DHT11 DATA -> GPIO 2 (D4 sur NodeMCU)
 */

#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <DHT.h>

// Configuration WiFi
const char* ssid = "VOTRE_NOM_WIFI";           // Remplacez par votre SSID WiFi
const char* password = "VOTRE_MOT_DE_PASSE";   // Remplacez par votre mot de passe WiFi

// Configuration du serveur Django
const char* server = "192.168.1.100";          // Adresse IP de votre serveur Django
const int port = 8000;                          // Port du serveur Django

// Configuration du capteur DHT11
#define DHT_PIN 2                               // GPIO 2 (D4 sur NodeMCU)
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

// Configuration du capteur
const char* sensor_id = "ESP_01";               // ID unique du capteur (à changer pour chaque ESP)

// Intervalle d'envoi (20 minutes = 1200000 millisecondes)
const unsigned long interval = 1200000;        // 20 minutes
unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n=== Cold Chain Monitoring - ESP8266 ===");
  
  // Initialisation du capteur DHT11
  dht.begin();
  Serial.println("Capteur DHT11 initialise");
  
  // Connexion WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  Serial.print("Connexion au WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connecte!");
    Serial.print("Adresse IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ Echec de connexion WiFi");
    Serial.println("Verifiez vos identifiants WiFi");
  }
  
  Serial.println("Pret a envoyer des donnees...");
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Vérifier si l'intervalle est écoulé
  if (currentMillis - previousMillis >= interval || previousMillis == 0) {
    previousMillis = currentMillis;
    
    // Lire les données du capteur
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    
    // Vérifier si la lecture a réussi
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("❌ Erreur de lecture du capteur DHT11");
      return;
    }
    
    Serial.println("\n--- Nouvelle mesure ---");
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
    Serial.print("Humidite: ");
    Serial.print(humidity);
    Serial.println(" %");
    
    // Envoyer les données au serveur
    sendDataToServer(temperature, humidity);
  }
  
  // Petite pause pour éviter de surcharger le processeur
  delay(1000);
}

void sendDataToServer(float temp, float hum) {
  // Vérifier la connexion WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi deconnecte, tentative de reconnexion...");
    WiFi.begin(ssid, password);
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 10) {
      delay(500);
      attempts++;
    }
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("❌ Impossible de reconnecter WiFi");
      return;
    }
  }
  
  // Créer le client WiFi
  WiFiClient client;
  
  // Connexion au serveur
  if (!client.connect(server, port)) {
    Serial.println("❌ Echec de connexion au serveur");
    return;
  }
  
  Serial.println("✅ Connecte au serveur");
  
  // Créer le JSON
  StaticJsonDocument<200> doc;
  doc["sensor_id"] = sensor_id;
  doc["temp"] = temp;
  doc["hum"] = hum;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Envoyer la requête HTTP POST
  client.println("POST /api/collecte/ HTTP/1.1");
  client.println("Host: " + String(server) + ":" + String(port));
  client.println("Content-Type: application/json");
  client.println("Content-Length: " + String(jsonString.length()));
  client.println("Connection: close");
  client.println();
  client.println(jsonString);
  
  Serial.println("Requete envoyee:");
  Serial.println(jsonString);
  
  // Attendre la réponse
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println("❌ Timeout - Pas de reponse du serveur");
      client.stop();
      return;
    }
  }
  
  // Lire la réponse
  Serial.println("Reponse du serveur:");
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println("\n--- Envoi termine ---");
  client.stop();
}

