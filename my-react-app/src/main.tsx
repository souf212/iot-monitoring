import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/colors.css'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'

console.log('🚀 Démarrage de l\'application React...')

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('❌ Élément root non trouvé!')
  throw new Error('Root element not found')
}

console.log('✅ Élément root trouvé')

try {
  console.log('📦 Chargement des composants...')
  const root = createRoot(rootElement)
  
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  )
  console.log('✅ Application rendue avec succès!')
} catch (error) {
  console.error('❌ Erreur lors du rendu de l\'application:', error)
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: Arial, sans-serif;">
        <h1>Erreur de chargement</h1>
        <p>Une erreur s'est produite lors du chargement de l'application.</p>
        <p style="color: red;">${error instanceof Error ? error.message : 'Erreur inconnue'}</p>
        <p style="color: gray; font-size: 0.9em;">Vérifiez la console du navigateur (F12) pour plus de détails.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; background: #667eea; color: white; border: none; border-radius: 5px;">
          Recharger la page
        </button>
      </div>
    `
  }
}
