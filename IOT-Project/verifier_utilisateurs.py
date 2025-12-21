"""
Script pour vérifier et activer les utilisateurs
Usage: py verifier_utilisateurs.py
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coldchain.settings')
django.setup()

from django.contrib.auth.models import User

print("=" * 60)
print("Liste des utilisateurs dans la base de données:")
print("=" * 60)

users = User.objects.all()

if not users.exists():
    print("❌ Aucun utilisateur trouvé dans la base de données!")
    print("\nCréez un utilisateur via:")
    print("1. Le formulaire d'inscription sur http://localhost:5173/register")
    print("2. Ou via: py manage.py createsuperuser")
else:
    for user in users:
        status = "✅ ACTIF" if user.is_active else "❌ INACTIF"
        print(f"\nUsername: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  Status: {status}")
        print(f"  Date de création: {user.date_joined}")
        print(f"  Dernière connexion: {user.last_login or 'Jamais'}")
        
        if not user.is_active:
            print(f"  ⚠️  Cet utilisateur est INACTIF - il ne peut pas se connecter!")
            response = input(f"  Voulez-vous activer {user.username}? (o/n): ")
            if response.lower() == 'o':
                user.is_active = True
                user.save()
                print(f"  ✅ {user.username} a été activé!")

print("\n" + "=" * 60)
print("Pour activer manuellement un utilisateur:")
print("=" * 60)
print("""
from django.contrib.auth.models import User
user = User.objects.get(username='votre_username')
user.is_active = True
user.save()
""")


