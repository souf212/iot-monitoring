# 🌡️ IoT Climate Monitor

> **Système de monitoring environnemental en temps réel** avec ESP8266, DHT11, Django et React

Un projet IoT complet permettant de surveiller la température et l'humidité en temps réel via capteur DHT11, avec contrôle d'actionneur (LED) et visualisation des données dans une interface web moderne.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![Django](https://img.shields.io/badge/Django-5.2-green)
![React](https://img.shields.io/badge/React-19.2-cyan)
![MQTT](https://img.shields.io/badge/MQTT-Mosquitto-orange)

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Endpoints](#-api-endpoints)
- [Captures d'écran](#-captures-décran)
- [Contribution](#-contribution)

---

## 🎯 Aperçu

Ce projet combine **hardware IoT** (ESP8266 + DHT11) et **software full-stack** pour créer une solution complète de monitoring climatique :

- 📡 **Capteur DHT11** : Mesure température et humidité
- 🔌 **ESP8266** : Module WiFi pour transmission MQTT
- 🖥️ **Backend Django** : API REST + MQTT subscriber
- ⚛️ **Frontend React** : Dashboard temps réel moderne
- 💡 **Contrôle LED** : Actionneur contrôlable via l'interface

---

## ✨ Fonctionnalités

### 📊 Dashboard en temps réel
- ✅ Affichage température et humidité en temps réel (refresh 3s)
- ✅ Indicateurs de tendance (↑ hausse, ↓ baisse, → stable)
- ✅ Alertes visuelles si seuils dépassés
- ✅ Statut de connexion MQTT avec indicateur animé
- ✅ Design moderne dark mode avec glassmorphism

### 📈 Visualisation des données
- ✅ Graphiques historiques (température & humidité)
- ✅ Filtrage par plage de dates
- ✅ Statistiques (moyenne, min, max)
- ✅ Export CSV des données

### 🎛️ Contrôle & Gestion
- ✅ Contrôle LED ON/OFF via MQTT
- ✅ Gestion multi-utilisateurs avec rôles (User, Manager, Supervisor)
- ✅ Gestion des capteurs
- ✅ Logs d'audit avec export

### 🔐 Sécurité
- ✅ Authentification JWT
- ✅ Gestion des permissions par rôle
- ✅ Endpoints API sécurisés

---

## 🏗️ Architecture

```
┌─────────────────┐
│   ESP8266       │
│   + DHT11       │──────┐
│   + LED         │      │
└─────────────────┘      │
                         │ MQTT
                         ↓
                  ┌──────────────┐
                  │  Mosquitto   │
                  │    Broker    │
                  └──────────────┘
                         ↓
         ┌───────────────────────────┐
         │    Django Backend         │
         │  - REST API               │
         │  - MQTT Subscriber        │
         │  - SQLite (PostgreSQL)    │
         └───────────────────────────┘
                         ↓
         ┌───────────────────────────┐
         │    React Frontend         │
         │  - Dashboard temps réel   │
         │  - Recharts               │
         │  - Tailwind + Framer      │
         └───────────────────────────┘
```

---

## 🛠️ Technologies

### Backend
- **Django 5.2** - Framework web Python
- **Django REST Framework** - API REST
- **Paho MQTT** - Client MQTT Python
- **SQLite** - Base de données (PostgreSQL supporté)
- **JWT** - Authentification

### Frontend
- **React 19** - Library UI
- **Tailwind CSS 3** - Framework CSS
- **Framer Motion** - Animations
- **Recharts** - Graphiques
- **Lucide React** - Icônes
- **Axios** - Client HTTP

### IoT
- **ESP8266** - Microcontrôleur WiFi
- **DHT11** - Capteur température/humidité
- **Mosquitto** - Broker MQTT

---

## 📥 Installation

### Prérequis

- Python 3.11+
- Node.js 18+
- Mosquitto MQTT Broker
- **SQLite** (inclus avec Python, aucune installation requise)
- PostgreSQL (optionnel pour production)

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/IoT-Climate-Monitor.git
cd IoT-Climate-Monitor
```

### 2. Backend Django

```bash
cd backend

# Créer environnement virtuel
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Installer dépendances
pip install -r requirements.txt

# Migrations base de données
python manage.py makemigrations
python manage.py migrate

# Créer superuser
python manage.py createsuperuser

# Créer un capteur (ID=1)
python manage.py shell
>>> from api.models import Sensor
>>> Sensor.objects.create(sensor_id=1, name="DHT11-ESP8266", location="Bureau", active=True)
>>> exit()
```

### 3. Frontend React

```bash
cd frontend
npm install --legacy-peer-deps
```

### 4. Mosquitto MQTT

**Windows** :
```bash
# Installer via https://mosquitto.org/download/
# Ou avec Chocolatey
choco install mosquitto

# Démarrer le service
net start mosquitto
```

**Linux** :
```bash
sudo apt install mosquitto mosquitto-clients
sudo systemctl start mosquitto
sudo systemctl enable mosquitto
```

---

## ⚙️ Configuration

### Backend `.env`

Créer `backend/.env` :

```env
SECRET_KEY=votre-secret-key-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de données
# SQLite est utilisé par défaut (db.sqlite3)
# Pour PostgreSQL, décommenter la ligne suivante :
# DATABASE_URL=postgresql://user:password@localhost:5432/iot_db

# MQTT
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_TOPIC_SENSOR=sensors/+/dht11
MQTT_TOPIC_LED=devices/esp8266-001/cmd/led
```

### Frontend `.env`

Créer `frontend/.env` :

```env
REACT_APP_API_URL=http://localhost:8000
```

### ESP8266 Configuration

Configurer dans votre code Arduino :

```cpp
const char* mqtt_server = "192.168.1.XXX";  // IP de votre PC
const char* topic_publish = "sensors/1/dht11";
const char* topic_subscribe = "devices/esp8266-001/cmd/led";
```

---

## 🚀 Utilisation

### Démarrer les services

**Terminal 1 - Backend Django** :
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - MQTT Subscriber** :
```bash
cd backend
python manage.py mqtt_subscriber
```

**Terminal 3 - Frontend React** :
```bash
cd frontend
npm start
```

### Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend Admin** : http://localhost:8000/admin
- **API** : http://localhost:8000/api/

### Identifiants par défaut

Utiliser les identifiants créés avec `createsuperuser`.

---

## 📡 API Endpoints

### Authentification
```
POST   /api/auth/login/                  # Connexion
POST   /api/auth/refresh/                # Refresh token
GET    /api/auth/me/                     # Profil utilisateur
```

### Mesures
```
GET    /api/measurements/                # Liste des mesures
GET    /api/measurements/latest/         # Dernière mesure
GET    /api/measurements/?sensor=1       # Mesures d'un capteur
```

### Contrôle
```
POST   /api/led/control/                 # Contrôle LED
       Body: {"command": "ON"} ou {"command": "OFF"}
```

### Capteurs
```
GET    /api/sensors/                     # Liste capteurs
GET    /api/sensors/{id}/                # Détails capteur
PUT    /api/sensors/{id}/                # Modifier capteur
```

### Utilisateurs
```
GET    /api/users/                       # Liste utilisateurs
POST   /api/users/                       # Créer utilisateur
PUT    /api/users/{id}/                  # Modifier utilisateur
```

### Audit
```
GET    /api/audit/                       # Logs d'audit
GET    /api/audit/export/                # Export CSV
```

---

## 📸 Captures d'écran

### Dashboard Principal
Interface moderne avec glassmorphism et animations temps réel.

### Graphiques Historiques
Visualisation des tendances avec filtrage par date et statistiques.

### Gestion des Utilisateurs
Interface d'administration avec gestion des rôles.

---

## 🎨 Design System

Le projet utilise un design system moderne :

- **Palette** : Dark mode avec accents cyan/blue/green
- **Typographie** : Inter (Google Fonts)
- **Composants** : Glassmorphism cards
- **Animations** : Framer Motion (slide, fade, pulse)
- **Icons** : Lucide React

---

## 📝 Structure du projet

```
IoT-Climate-Monitor/
├── backend/
│   ├── api/                    # Application Django
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── mqtt_subscriber.py
│   │   ├── models.py           # Sensor, Measurement, Profile
│   │   ├── views.py            # API endpoints
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── backend/                # Configuration Django
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                # Services API
│   │   ├── components/
│   │   │   ├── ui/             # Composants réutilisables
│   │   │   └── dashboard/      # Composants métier
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Pages
│   │   ├── utils/              # Utilitaires
│   │   ├── charts/             # Graphiques Recharts
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── README.md
└── QUICKSTART.md
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👤 Auteur

**Votre Nom**
- GitHub: [@votre-username](https://github.com/votre-username)
- LinkedIn: [Votre Profil](https://linkedin.com/in/votre-profil)

---

## 🙏 Remerciements

- Django & Django REST Framework
- React & Tailwind CSS
- Mosquitto MQTT
- ESP8266 Community

---

## 📞 Support

Pour toute question ou problème, ouvrir une [issue](https://github.com/votre-username/IoT-Climate-Monitor/issues).

---

**⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !**
