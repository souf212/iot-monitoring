"""
Script pour créer un utilisateur de test actif
Usage: py creer_utilisateur_test.py
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coldchain.settings')
django.setup()

from django.contrib.auth.models import User

# Identifiants de test
username = "testuser"
email = "test@example.com"
password = "test123456"

print("=" * 60)
print("Création d'un utilisateur de test")
print("=" * 60)

# Vérifier si l'utilisateur existe déjà
if User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    print(f"⚠️  L'utilisateur '{username}' existe déjà!")
    print(f"   Email: {user.email}")
    print(f"   Actif: {user.is_active}")
    
    # Réactiver et réinitialiser le mot de passe
    user.is_active = True
    user.set_password(password)
    user.save()
    print(f"✅ Utilisateur '{username}' réactivé et mot de passe réinitialisé!")
else:
    # Créer un nouvel utilisateur
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_active=True
    )
    print(f"✅ Utilisateur '{username}' créé avec succès!")

print("\n" + "=" * 60)
print("IDENTIFIANTS DE CONNEXION:")
print("=" * 60)
print(f"Username: {username}")
print(f"Password: {password}")
print(f"Email: {email}")
print("\nVous pouvez maintenant vous connecter avec ces identifiants!")
print("=" * 60)


