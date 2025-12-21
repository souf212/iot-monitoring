# Cold Chain Monitoring - Frontend React

Interface utilisateur pour le système de surveillance IoT de la chaîne du froid.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Configuration

Assurez-vous que l'URL de l'API backend est correcte dans `src/api/axios.ts` :

```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Fonctionnalités

### Page de Connexion
- Authentification avec nom d'utilisateur et mot de passe
- Gestion automatique des tokens JWT

### Tableau de Bord
- Affichage des dernières mesures de tous les capteurs
- Graphiques en temps réel (24 dernières heures)
- Rafraîchissement automatique toutes les minutes
- Indicateurs visuels pour les alertes

### Gestion des Tickets
- Création de tickets
- Assignation à des utilisateurs
- Fermeture de tickets
- Filtrage par statut

### Historique & Audit
- Consultation de l'historique des mesures
- Consultation des logs d'audit
- Filtrage par date
- Export CSV et PDF

## Structure du Projet

```
src/
├── api/              # Appels API
│   ├── axios.ts      # Configuration Axios avec intercepteurs
│   ├── auth.ts       # API d'authentification
│   └── monitoring.ts # API de monitoring
├── components/       # Composants réutilisables
│   ├── Layout.tsx    # Layout principal avec navigation
│   └── ProtectedRoute.tsx # Route protégée
├── contexts/         # Contextes React
│   └── AuthContext.tsx # Contexte d'authentification
└── pages/            # Pages de l'application
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── Tickets.tsx
    └── Historique.tsx
```
