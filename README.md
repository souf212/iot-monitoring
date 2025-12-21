Projet IoT — Cold Chain Monitoring

Résumé
- Projet de surveillance de la chaîne du froid (IoT) : capteurs ESP8266 envoient des mesures à un backend Django; l'interface utilisateur est une application React (Vite + TypeScript).

Structure principale
- `IOT-Project/` : backend Django (modèles, API, scripts de remplissage de base de données).
- `my-react-app/` : frontend React (Vite + TypeScript) pour visualiser les données et gérer l'authentification.
- `ESP8266_Code/` : code Arduino pour l'ESP8266 utilisé sur les capteurs.

Démarrage rapide
- Installer les dépendances Python : voir `IOT-Project/requirements.txt`.
- Lancer le backend : utiliser `start_backend.bat` ou `python IOT-Project\manage.py runserver` depuis `IOT-Project`.
- Lancer le frontend : utiliser `start_frontend.bat` ou `npm install` puis `npm run dev` dans `my-react-app`.
- Démarrer tout (backend + frontend) : `start_all.bat`.

Notes utiles
- Scripts pour remplir la base : `IOT-Project/remplir_db.py` et fichiers SQL présents.
- Tests backend : `IOT-Project/test_login.py`.

Contact
- Voir les fichiers de code dans les dossiers racine pour plus de détails.

Ce fichier remplace les documents `.md` du projet pour donner un aperçu succinct.
