# 🔍 Guide de Débogage - Page Blanche

## Vérifications à faire :

### 1. Ouvrir la Console du Navigateur (F12)
- Appuyez sur **F12** dans votre navigateur
- Allez dans l'onglet **Console**
- Regardez s'il y a des erreurs en rouge
- Copiez les messages d'erreur

### 2. Vérifier que le serveur tourne
- Le serveur React devrait être accessible sur http://localhost:5173
- Vérifiez dans le terminal si Vite est en cours d'exécution

### 3. Vérifier les logs dans la console
Dans la console du navigateur, vous devriez voir :
```
🚀 Démarrage de l'application React...
✅ Élément root trouvé
📦 Chargement des composants...
✅ Application rendue avec succès!
```

### 4. Si vous voyez des erreurs dans la console :

**Erreur "Cannot find module"** :
- Les dépendances ne sont pas installées : `npm install`

**Erreur "Network Error" ou "CORS"** :
- Le backend Django n'est pas démarré (normal pour l'instant)
- Vous pouvez toujours voir la page de login même sans backend

**Erreur avec React Router** :
- Vérifiez que `react-router-dom` est installé : `npm list react-router-dom`

**Erreur avec Recharts** :
- Vérifiez que `recharts` est installé : `npm list recharts`

### 5. Redémarrer le serveur
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer :
cd my-react-app
npm run dev
```

### 6. Vider le cache du navigateur
- Appuyez sur **Ctrl+Shift+R** (ou **Cmd+Shift+R** sur Mac) pour forcer le rechargement
- Ou vider le cache du navigateur

### 7. Tester avec une page simple
Si rien ne fonctionne, testez en modifiant temporairement `App.tsx` :

```tsx
function App() {
  return <div><h1>Test - L'application fonctionne!</h1></div>
}
```

Si cette page simple s'affiche, le problème vient d'un composant spécifique.

## 📞 Informations à me donner :

1. **Messages d'erreur dans la console** (copier-coller)
2. **URL exacte** que vous utilisez (http://localhost:5173 ou autre)
3. **Navigateur utilisé** (Chrome, Firefox, Edge, etc.)
4. **Ce qui apparaît** (page blanche, erreur, rien du tout)


