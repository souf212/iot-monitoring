from django.contrib import admin
from .models import Capteur, Mesure, Ticket, AuditLog


@admin.register(Capteur)
class CapteurAdmin(admin.ModelAdmin):
    list_display = ['nom', 'sensor_id', 'emplacement', 'actif', 'date_creation']
    list_filter = ['actif', 'date_creation']
    search_fields = ['nom', 'sensor_id', 'emplacement']


@admin.register(Mesure)
class MesureAdmin(admin.ModelAdmin):
    list_display = ['capteur', 'temperature', 'humidite', 'timestamp', 'alerte_declenchee']
    list_filter = ['alerte_declenchee', 'timestamp', 'capteur']
    search_fields = ['capteur__nom', 'capteur__sensor_id']
    date_hierarchy = 'timestamp'
    readonly_fields = ['timestamp']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['titre', 'statut', 'cree_par', 'assigne_a', 'timestamp_creation']
    list_filter = ['statut', 'timestamp_creation']
    search_fields = ['titre', 'description']
    date_hierarchy = 'timestamp_creation'


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['utilisateur', 'action', 'timestamp', 'capteur']
    list_filter = ['timestamp', 'capteur']
    search_fields = ['action', 'utilisateur__username']
    date_hierarchy = 'timestamp'
    readonly_fields = ['timestamp']

