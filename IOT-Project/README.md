# Cold Chain Monitoring - Backend Django

Système de surveillance IoT pour la chaîne du froid dans un laboratoire médical.

## Installation

1. Créer un environnement virtuel Python :
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Effectuer les migrations :
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Créer un superutilisateur :
```bash
python manage.py createsuperuser
```

5. Lancer le serveur :
```bash
python manage.py runserver
```

## Configuration

### Variables d'environnement

Créer un fichier `.env` ou configurer les variables d'environnement suivantes :

- `EMAIL_HOST_USER` : Email pour l'envoi de notifications
- `EMAIL_HOST_PASSWORD` : Mot de passe de l'email
- `DEFAULT_FROM_EMAIL` : Email expéditeur par défaut
- `TELEGRAM_BOT_TOKEN` : Token du bot Telegram
- `TELEGRAM_CHAT_ID` : ID du chat Telegram
- `WHATSAPP_API_TOKEN` : Token WhatsApp Cloud API
- `WHATSAPP_PHONE_NUMBER_ID` : ID du numéro de téléphone WhatsApp
- `NOTIFICATION_LEVEL_1` : Emails niveau 1 (séparés par des virgules)
- `NOTIFICATION_LEVEL_2` : Emails niveau 2 (séparés par des virgules)
- `NOTIFICATION_LEVEL_3` : Emails niveau 3 (séparés par des virgules)
- `NOTIFICATION_LEVEL_4` : Emails niveau 4 (séparés par des virgules)

### Configuration Email (settings.py)

Modifier les paramètres SMTP dans `settings.py` selon votre fournisseur.

## Utilisation

### Endpoint de collecte (ESP8266)

L'ESP8266 peut envoyer des données à l'endpoint suivant :

```
POST http://localhost:8000/api/collecte/
Content-Type: application/json

{
  "sensor_id": "ESP_01",
  "temp": 5.2,
  "hum": 45.0
}
```

### API Endpoints

- `POST /api/token/` : Connexion (obtention du token JWT)
- `POST /api/token/refresh/` : Rafraîchissement du token
- `GET /api/capteurs/` : Liste des capteurs
- `GET /api/mesures/` : Liste des mesures
- `GET /api/mesures/dernieres/` : Dernières mesures de tous les capteurs
- `GET /api/mesures/historique_24h/?capteur_id=X` : Historique 24h d'un capteur
- `GET /api/tickets/` : Liste des tickets
- `GET /api/audit-logs/` : Logs d'audit
- `GET /api/export/mesures/csv/` : Export CSV des mesures
- `GET /api/export/mesures/pdf/` : Export PDF des mesures
- `GET /api/export/audit/csv/` : Export CSV des logs d'audit
- `GET /api/export/audit/pdf/` : Export PDF des logs d'audit

## Logique d'Alerte et d'Escalade

1. **Niveau 1** : Alerte déclenchée automatiquement si température hors plage (2-8°C)
2. **Niveau 2** : Après 3 alertes consécutives
3. **Niveau 3** : Après 6 alertes consécutives
4. **Niveau 4** : Après 9 alertes consécutives

Les notifications sont envoyées via Email, Telegram et WhatsApp.

