"""
Services pour la gestion des alertes et notifications
"""
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import requests
from .models import Capteur, Mesure, Ticket, AuditLog

logger = logging.getLogger(__name__)


def send_email_notification(subject, message, recipients):
    """Envoie une notification par email"""
    try:
        if not recipients:
            return False
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
        return True
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi d'email: {e}")
        return False


def send_telegram_notification(message):
    """Envoie une notification via Telegram Bot"""
    try:
        if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
            logger.warning("Configuration Telegram manquante")
            return False
        
        url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            'chat_id': settings.TELEGRAM_CHAT_ID,
            'text': message,
            'parse_mode': 'HTML'
        }
        response = requests.post(url, json=data, timeout=10)
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi Telegram: {e}")
        return False


def send_whatsapp_notification(message):
    """Envoie une notification via WhatsApp Cloud API"""
    try:
        if not settings.WHATSAPP_API_TOKEN or not settings.WHATSAPP_PHONE_NUMBER_ID:
            logger.warning("Configuration WhatsApp manquante")
            return False
        
        url = f"https://graph.facebook.com/v18.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
        headers = {
            'Authorization': f'Bearer {settings.WHATSAPP_API_TOKEN}',
            'Content-Type': 'application/json'
        }
        data = {
            'messaging_product': 'whatsapp',
            'to': settings.TELEGRAM_CHAT_ID,  # Utiliser le même ID pour simplifier
            'type': 'text',
            'text': {'body': message}
        }
        response = requests.post(url, json=data, headers=headers, timeout=10)
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi WhatsApp: {e}")
        return False


def get_consecutive_alert_count(capteur):
    """Compte le nombre d'alertes consécutives pour un capteur"""
    # Compter les alertes des 24 dernières heures
    depuis = timezone.now() - timedelta(hours=24)
    alertes = Mesure.objects.filter(
        capteur=capteur,
        timestamp__gte=depuis,
        alerte_declenchee=True
    ).order_by('-timestamp')
    
    return alertes.count()


def check_alert_and_escalate(mesure):
    """
    Vérifie si une mesure déclenche une alerte et gère l'escalade
    """
    temp = mesure.temperature
    temp_min = settings.TEMP_MIN
    temp_max = settings.TEMP_MAX
    
    # Vérifier si la température est hors plage
    if temp < temp_min or temp > temp_max:
        mesure.alerte_declenchee = True
        mesure.save()
        
        # Enregistrer dans AuditLog
        AuditLog.objects.create(
            action=f"Alerte déclenchée: Température {temp}°C hors plage [{temp_min}-{temp_max}°C] pour {mesure.capteur.nom}",
            capteur=mesure.capteur,
            mesure=mesure
        )
        
        # Compter les alertes consécutives
        count = get_consecutive_alert_count(mesure.capteur)
        
        # Créer un ticket automatiquement
        # Récupérer ou créer un utilisateur système
        from django.contrib.auth.models import User
        system_user, created = User.objects.get_or_create(
            username='system',
            defaults={
                'email': 'system@coldchain.local',
                'first_name': 'Système',
                'last_name': 'Automatique',
                'is_staff': False,
                'is_active': True,
            }
        )
        
        ticket = Ticket.objects.create(
            titre=f"Alerte température: {mesure.capteur.nom}",
            description=f"Température critique détectée: {temp}°C (Plage: {temp_min}-{temp_max}°C). "
                       f"Capteur: {mesure.capteur.nom} à {mesure.capteur.emplacement}. "
                       f"Alertes consécutives: {count}",
            statut='Ouvert',
            mesure_declenchante=mesure,
            cree_par=system_user
        )
        
        AuditLog.objects.create(
            action=f"Ticket créé automatiquement: {ticket.titre}",
            ticket=ticket,
            capteur=mesure.capteur
        )
        
        # Préparer le message de notification
        message = f"🚨 ALERTE TEMPÉRATURE\n\n"
        message += f"Capteur: {mesure.capteur.nom}\n"
        message += f"Emplacement: {mesure.capteur.emplacement}\n"
        message += f"Température: {temp}°C\n"
        message += f"Humidité: {mesure.humidite}%\n"
        message += f"Plage acceptable: {temp_min}-{temp_max}°C\n"
        message += f"Timestamp: {mesure.timestamp.strftime('%Y-%m-%d %H:%M:%S')}\n"
        message += f"Alertes consécutives: {count}"
        
        subject = f"[ALERTE] Température critique - {mesure.capteur.nom}"
        
        # Niveau 1: Toujours notifier
        level_1_emails = settings.NOTIFICATION_LEVELS.get(1, [])
        send_email_notification(subject, message, level_1_emails)
        send_telegram_notification(message)
        send_whatsapp_notification(message)
        
        # Escalade selon le nombre d'alertes
        if count >= 3:
            level_2_emails = settings.NOTIFICATION_LEVELS.get(2, [])
            if level_2_emails:
                send_email_notification(
                    f"[ESCALADE N2] {subject}",
                    f"⚠️ ESCALADE Niveau 2\n\n{message}",
                    level_2_emails
                )
        
        if count >= 6:
            level_3_emails = settings.NOTIFICATION_LEVELS.get(3, [])
            if level_3_emails:
                send_email_notification(
                    f"[ESCALADE N3] {subject}",
                    f"⚠️ ESCALADE Niveau 3\n\n{message}",
                    level_3_emails
                )
        
        if count >= 9:
            level_4_emails = settings.NOTIFICATION_LEVELS.get(4, [])
            if level_4_emails:
                send_email_notification(
                    f"[ESCALADE N4] {subject}",
                    f"🚨 ESCALADE Niveau 4 - URGENCE\n\n{message}",
                    level_4_emails
                )
        
        return True
    else:
        mesure.alerte_declenchee = False
        mesure.save()
        return False

