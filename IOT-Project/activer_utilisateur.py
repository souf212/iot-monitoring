"""
Script pour activer un utilisateur existant
Usage: py activer_utilisateur.py
"""
import os
import sys
import django

# Fix encoding pour Windows
if sys.stdout.encoding != 'utf-8':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coldchain.settings')
django.setup()

from django.contrib.auth.models import User

print("=" * 60)
print("Liste des utilisateurs:")
print("=" * 60)

users = User.objects.all()

for user in users:
    status = "ACTIF" if user.is_active else "INACTIF"
    print(f"\nUsername: {user.username}")
    print(f"  Email: {user.email}")
    print(f"  Status: {status}")
    
    if not user.is_active:
        print(f"  AVERTISSEMENT: Cet utilisateur est INACTIF!")
        user.is_active = True
        user.save()
        print(f"  -> Utilisateur active avec succes!")

print("\n" + "=" * 60)
print("Tous les utilisateurs sont maintenant actifs!")
print("=" * 60)

# Créer aussi un utilisateur de test
username = "testuser"
password = "test123456"

if not User.objects.filter(username=username).exists():
    User.objects.create_user(
        username=username,
        email="test@example.com",
        password=password,
        is_active=True
    )
    print(f"\nUtilisateur de test cree:")
    print(f"  Username: {username}")
    print(f"  Password: {password}")
else:
    user = User.objects.get(username=username)
    user.is_active = True
    user.set_password(password)
    user.save()
    print(f"\nUtilisateur de test reactive:")
    print(f"  Username: {username}")
    print(f"  Password: {password}")

print("\n" + "=" * 60)


