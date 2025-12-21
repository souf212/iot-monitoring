from django.db import models
from django.contrib.auth.models import User


class Capteur(models.Model):
    """Modèle pour représenter un capteur IoT"""
    nom = models.CharField(max_length=100)
    sensor_id = models.CharField(max_length=50, unique=True)
    emplacement = models.CharField(max_length=200)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} ({self.sensor_id})"

    class Meta:
        verbose_name = "Capteur"
        verbose_name_plural = "Capteurs"
        ordering = ['nom']


class Mesure(models.Model):
    """Modèle pour stocker les mesures de température et d'humidité"""
    capteur = models.ForeignKey(Capteur, on_delete=models.CASCADE, related_name='mesures')
    temperature = models.FloatField()
    humidite = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    alerte_declenchee = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.capteur.nom} - {self.temperature}°C - {self.timestamp}"

    class Meta:
        verbose_name = "Mesure"
        verbose_name_plural = "Mesures"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['capteur', '-timestamp']),
        ]


class Ticket(models.Model):
    """Modèle pour la gestion des incidents"""
    STATUT_CHOICES = [
        ('Ouvert', 'Ouvert'),
        ('Assigné', 'Assigné'),
        ('En cours', 'En cours'),
        ('Clos', 'Clos'),
    ]

    titre = models.CharField(max_length=200)
    description = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='Ouvert')
    assigne_a = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets_assignes'
    )
    cree_par = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tickets_crees'
    )
    mesure_declenchante = models.ForeignKey(
        Mesure,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets'
    )
    timestamp_creation = models.DateTimeField(auto_now_add=True)
    timestamp_fermeture = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.titre} - {self.statut}"

    class Meta:
        verbose_name = "Ticket"
        verbose_name_plural = "Tickets"
        ordering = ['-timestamp_creation']


class AuditLog(models.Model):
    """Modèle pour la traçabilité complète des actions"""
    utilisateur = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    action = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    capteur = models.ForeignKey(
        Capteur,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    mesure = models.ForeignKey(
        Mesure,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )

    def __str__(self):
        user_str = self.utilisateur.username if self.utilisateur else "Système"
        return f"{user_str} - {self.action} - {self.timestamp}"

    class Meta:
        verbose_name = "Journal d'Audit"
        verbose_name_plural = "Journaux d'Audit"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
        ]

