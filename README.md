# 🌡️ IoT Climate Monitor

> **Système de monitoring environnemental Intelligent** avec ESP8266, DHT11, Django (PythonAnywhere) et React (Vercel).

Un projet IoT complet permettant de surveiller la température et l'humidité en temps réel, avec une architecture hybride Cloud/Local résiliente et un système d'alertes intelligent (Email, Telegram, Appel Vocal).

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![React](https://img.shields.io/badge/React-18-cyan)
![Deployment](https://img.shields.io/badge/Deploy-PythonAnywhere%20%2B%20Vercel-purple)

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Architecture](#-architecture)
- [Fonctionnalités Clés](#-fonctionnalités-clés)
- [Système d'Alertes & Escalade](#-système-dalertes--escalade)
- [Installation Locale](#-installation-locale)
- [Déploiement](#-déploiement)
- [Utilisation](#-utilisation)
- [Auteur](#-auteur)

---

## 🎯 Aperçu

Ce projet connecte des capteurs physiques à un dashboard cloud accessible de partout, offrant une supervision proactive des conditions environnementales.

- 📡 **IoT** : ESP8266 + DHT11 (Local)
- 🌉 **Bridge** : Script Python local assurant la liaison IoT <-> Cloud
- ☁️ **Backend** : Django REST API hébergé sur **PythonAnywhere**
- 💻 **Frontend** : Dashboard React hébergé sur **Vercel**

---

## 🏗️ Architecture

L'architecture utilise un **Bridge MQTT/HTTP** pour connecter le réseau local (IoT) au Cloud, permettant une communication bidirectionnelle robuste même derrière des pare-feux stricts (ex: PythonAnywhere Free Tier).

```mermaid
graph TD
    subgraph Local [Réseau Local]
        ESP[ESP8266 + DHT11] -- MQTT --> Mosquitto[Mosquitto Broker]
        Bridge[mqtt_bridge.py] -- Sub/Pub --> Mosquitto
    end

    subgraph Cloud [Internet]
        PA["PythonAnywhere (Django API)"]
        Vercel["Vercel (React App)"]
        User[Utilisateur]
    end

    %% Upload Data (Push)
    Bridge -- "HTTP POST (Data)" --> PA
    
    %% Control LED (Polling)
    Bridge -- "HTTP GET (Polling)" --> PA
    
    %% Frontend
    Vercel -- "API REST" --> PA
    User -- HTTPS --> Vercel
```

### Points Clés
1. **Upload de Données** : Le Bridge écoute le broker MQTT local et pousse les mesures vers l'API Django via HTTPS.
2. **Contrôle LED (Polling)** : Pour contourner le blocage des ports sortants (8883) sur PythonAnywhere Free Tier, le Bridge **polle** l'API toutes les 2 secondes pour récupérer les commandes ("ON"/"OFF") et les transmettre à l'ESP8266.

---

## ✨ Fonctionnalités Clés

### 📊 Dashboard Monitoring
- **Temps Réel** : Rafraîchissement automatique des données toutes les 3s.
- **Graphiques Interactifs** : Historique température/humidité via Recharts.
- **Indicateurs Visuels** : Codes couleurs dynamiques (Vert/Orange/Rouge) selon les seuils.

### 🎛️ Contrôle à Distance
- **Actionneur** : Allumage/Extinction de LED à distance (latence < 2s).
- **Audit Logs** : Traçabilité complète des actions (qui a cliqué, quand).

### 👥 Gestion RBAC (Role-Based Access Control)
- **User** : Consultation simple.
- **Manager** : Gestion des utilisateurs et tickets de son équipe.
- **Supervisor** : Vue globale sur tous les capteurs et utilisateurs.

---

## 🚨 Système d'Alertes & Escalade

Le projet intègre un puissant moteur de notification multicanal pour garantir qu'aucune anomalie ne passe inaperçue.

### Canaux de Notification
1. **📧 Email (SMTP)** : Envoi de rapports détaillés via Gmail SMTP.
2. **📱 Telegram** : Notifications instantanées via Bot API.
3. **🌐 Webhook Critique** : Intégration générique (n8n, Zapier, Slack) pour les alertes majeures. Remplace le CallMeBot déprécié.

### Processus d'Escalade Automatique
Le système surveille le nombre d'alertes consécutives par capteur :

- **Niveau 1 (1-3 alertes)** : Notification **USER** (Responsable direct). Création Ticket "Low".
- **Niveau 2 (4-6 alertes)** : Escalade **MANAGER**. Notification Email + Telegram. Création Ticket "Medium".
- **Niveau 3 (> 6 alertes)** : Escalade **SUPERVISOR**. Webhook Critique + Email + Telegram. Création Ticket "High".

---

## 📥 Installation Locale

### Prérequis
- Python 3.10+
- Node.js 18+
- Mosquitto MQTT Broker (installé localement)

### 1. Backend (Django)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```

### 3. Bridge IoT
```bash
# Dans un nouveau terminal
cd backend
# Modifiez mqtt_bridge.py pour pointer vers localhost si test local
python mqtt_bridge.py
```

---

## 🚀 Déploiement

### Backend : PythonAnywhere
1. Cloner le repo dans une Bash Console.
2. Créer un virtualenv et installer `requirements.txt`.
3. Configurer **Web App** pour pointer vers `backend/wsgi.py`.
4. Remplir les variables d'environnement (SMTP, Telegram Token) dans `settings.py`.

### Frontend : Vercel
1. Importer le projet GitHub sur Vercel.
2. Override Build Command : `cd frontend && npm install && npm run build`
3. Output Directory : `frontend/build` (ou `dist`).
4. Environment Variable : `REACT_APP_API_URL` = `https://votre-user.pythonanywhere.com`

---

## 💡 Utilisation

1. **Allumer l'IoT** : Branchez l'ESP8266.
2. **Lancer le Bridge** : Sur votre PC/Raspberry Pi : `python backend/mqtt_bridge.py`.
   - Vous devriez voir : `✅ Connecté au Broker Local` et `👂 Démarrage du Polling`.
3. **Ouvrir le Dashboard** : Accédez à votre URL Vercel.
4. **Action** :
   - Les données du DHT11 remonteront automatiquement.
   - En cas de dépassement de seuil, vérifiez votre Telegram/Email.

---

## 👤 Auteur

**Soufiane EL OTMANI**
- *Ingénieur Logiciel Full Stack & IoT*
- Projet développé avec passion pour le monitoring industriel.
