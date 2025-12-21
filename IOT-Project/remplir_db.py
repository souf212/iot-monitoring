"""
Script Python pour remplir la base de données avec des données de test
Utilisation: python remplir_db.py
"""

import os
import sys
import django
from datetime import datetime, timedelta
import random

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coldchain.settings')
django.setup()

from monitoring.models import Capteur, Mesure, Ticket, AuditLog
from django.contrib.auth.models import User

def supprimer_donnees_existantes():
    """Supprimer toutes les données existantes (mesures, capteurs, tickets, logs)"""
    print("\n🗑️  Suppression des données existantes...")
    
    # Compter avant suppression
    nb_mesures = Mesure.objects.count()
    nb_capteurs = Capteur.objects.count()
    nb_tickets = Ticket.objects.count()
    nb_logs = AuditLog.objects.count()
    
    # Supprimer dans l'ordre (respecter les clés étrangères)
    Mesure.objects.all().delete()
    print(f"   ✅ {nb_mesures} mesures supprimées")
    
    Ticket.objects.all().delete()
    print(f"   ✅ {nb_tickets} tickets supprimés")
    
    AuditLog.objects.all().delete()
    print(f"   ✅ {nb_logs} logs d'audit supprimés")
    
    Capteur.objects.all().delete()
    print(f"   ✅ {nb_capteurs} capteurs supprimés")
    
    print("✅ Toutes les données ont été supprimées\n")

def creer_capteurs():
    """Créer un seul capteur (ESP_01)"""
    # Vous pouvez modifier ces valeurs selon votre configuration
    sensor_id = 'ESP_01'  # Doit correspondre au sensor_id dans votre code ESP8266
    nom = 'Mon Capteur IoT'
    emplacement = 'Mon Emplacement'
    
    capteur, created = Capteur.objects.get_or_create(
        sensor_id=sensor_id,
        defaults={
            'nom': nom,
            'emplacement': emplacement,
            'actif': True
        }
    )
    
    if created:
        print(f"✅ Capteur créé: {capteur.nom} ({capteur.sensor_id})")
    else:
        print(f"ℹ️  Capteur existant: {capteur.nom} ({capteur.sensor_id})")
        # Mettre à jour le nom et l'emplacement si nécessaire
        capteur.nom = nom
        capteur.emplacement = emplacement
        capteur.save()
    
    return [capteur]

def creer_mesures(capteurs):
    """Créer des mesures de test"""
    print("\n📊 Création des mesures...")
    
    # Mesures récentes (normales)
    for capteur in capteurs:
        # Mesures des dernières heures
        for i in range(5):
            temp = round(random.uniform(3.0, 7.0), 1)
            hum = round(random.uniform(55.0, 70.0), 1)
            timestamp = datetime.now() - timedelta(hours=i+1)
            
            Mesure.objects.create(
                capteur=capteur,
                temperature=temp,
                humidite=hum,
                timestamp=timestamp,
                alerte_declenchee=False
            )
        
        # Quelques mesures avec alertes (température hors plage)
        # Température trop élevée
        Mesure.objects.create(
            capteur=capteur,
            temperature=round(random.uniform(9.0, 12.0), 1),
            humidite=round(random.uniform(70.0, 80.0), 1),
            timestamp=datetime.now() - timedelta(minutes=random.randint(10, 30)),
            alerte_declenchee=True
        )
        
        # Température trop basse
        Mesure.objects.create(
            capteur=capteur,
            temperature=round(random.uniform(0.0, 1.5), 1),
            humidite=round(random.uniform(75.0, 85.0), 1),
            timestamp=datetime.now() - timedelta(minutes=random.randint(5, 20)),
            alerte_declenchee=True
        )
    
    # Mesures historiques (7 derniers jours)
    print("📅 Création des mesures historiques (7 derniers jours)...")
    for capteur in capteurs:
        for day in range(7):
            for hour in range(0, 24, 2):  # Une mesure toutes les 2 heures
                temp = round(random.uniform(2.5, 7.5), 1)
                hum = round(random.uniform(50.0, 75.0), 1)
                timestamp = datetime.now() - timedelta(days=day, hours=hour)
                
                # Quelques alertes aléatoires dans l'historique
                alerte = False
                if random.random() < 0.05:  # 5% de chance d'alerte
                    if random.random() < 0.5:
                        temp = round(random.uniform(9.0, 12.0), 1)  # Trop chaud
                    else:
                        temp = round(random.uniform(0.0, 1.5), 1)  # Trop froid
                    alerte = True
                
                Mesure.objects.create(
                    capteur=capteur,
                    temperature=temp,
                    humidite=hum,
                    timestamp=timestamp,
                    alerte_declenchee=alerte
                )
    
    print(f"✅ {Mesure.objects.count()} mesures créées au total")

def main():
    print("=" * 50)
    print("🚀 REMPLISSAGE DE LA BASE DE DONNÉES")
    print("=" * 50)
    
    # Vérifier qu'un utilisateur existe
    if not User.objects.exists():
        print("\n⚠️  Aucun utilisateur trouvé dans la base de données!")
        print("💡 Créez un utilisateur avec: python manage.py createsuperuser")
        response = input("\nContinuer quand même? (o/n): ")
        if response.lower() != 'o':
            return
    
    # Supprimer les données existantes
    supprimer_donnees_existantes()
    
    # Créer les capteurs
    print("📡 Création des capteurs...")
    capteurs = creer_capteurs()
    
    # Créer les mesures
    creer_mesures(capteurs)
    
    # Statistiques
    print("\n" + "=" * 50)
    print("📊 STATISTIQUES")
    print("=" * 50)
    print(f"Capteurs: {Capteur.objects.count()}")
    print(f"Mesures: {Mesure.objects.count()}")
    print(f"Mesures avec alertes: {Mesure.objects.filter(alerte_declenchee=True).count()}")
    
    print("\n✅ Base de données remplie avec succès!")
    print("🌐 Accédez au dashboard: http://localhost:5173")

if __name__ == '__main__':
    main()

