"""
Script de test pour vérifier la connexion
Usage: py test_login.py
"""
import requests
import json

# Test de connexion
url = "http://localhost:8000/api/token/"
data = {
    "username": "admin",  # Remplacez par votre nom d'utilisateur
    "password": "admin123456"  # Remplacez par votre mot de passe
}

print("Test de connexion à:", url)
print("Avec les identifiants:", data["username"])
print("-" * 50)

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        token_data = response.json()
        print("\n✅ SUCCÈS! Token obtenu:")
        print(f"Access Token: {token_data.get('access', 'N/A')[:50]}...")
        print(f"Refresh Token: {token_data.get('refresh', 'N/A')[:50]}...")
    else:
        print(f"\n❌ ERREUR: {response.status_code}")
        print(f"Détails: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ ERREUR: Impossible de se connecter au serveur Django")
    print("Vérifiez que Django est démarré sur http://localhost:8000")
except Exception as e:
    print(f"❌ ERREUR: {e}")


