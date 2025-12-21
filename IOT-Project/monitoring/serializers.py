from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Capteur, Mesure, Ticket, AuditLog


class CapteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capteur
        fields = ['id', 'nom', 'sensor_id', 'emplacement', 'actif', 'date_creation']


class MesureSerializer(serializers.ModelSerializer):
    capteur_nom = serializers.CharField(source='capteur.nom', read_only=True)
    capteur_emplacement = serializers.CharField(source='capteur.emplacement', read_only=True)

    class Meta:
        model = Mesure
        fields = [
            'id', 'capteur', 'capteur_nom', 'capteur_emplacement',
            'temperature', 'humidite', 'timestamp', 'alerte_declenchee'
        ]
        read_only_fields = ['timestamp', 'alerte_declenchee']


class MesureCreateSerializer(serializers.Serializer):
    """Serializer pour l'endpoint de collecte"""
    sensor_id = serializers.CharField(max_length=50)
    temp = serializers.FloatField()
    hum = serializers.FloatField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription d'un nouvel utilisateur"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        # Créer l'utilisateur avec create_user qui gère le mot de passe correctement
        # create_user() hash automatiquement le mot de passe et crée un utilisateur actif par défaut
        user = User.objects.create_user(
            password=password,
            is_active=True,  # S'assurer explicitement que l'utilisateur est actif
            **validated_data
        )
        # Double vérification et sauvegarde
        user.is_active = True
        user.save()
        return user


class TicketSerializer(serializers.ModelSerializer):
    cree_par_nom = serializers.CharField(source='cree_par.username', read_only=True)
    assigne_a_nom = serializers.CharField(source='assigne_a.username', read_only=True, allow_null=True)
    mesure_temperature = serializers.FloatField(source='mesure_declenchante.temperature', read_only=True, allow_null=True)
    mesure_timestamp = serializers.DateTimeField(source='mesure_declenchante.timestamp', read_only=True, allow_null=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'titre', 'description', 'statut', 'assigne_a', 'assigne_a_nom',
            'cree_par', 'cree_par_nom', 'mesure_declenchante', 'mesure_temperature',
            'mesure_timestamp', 'timestamp_creation', 'timestamp_fermeture'
        ]
        read_only_fields = ['cree_par', 'timestamp_creation']


class AuditLogSerializer(serializers.ModelSerializer):
    utilisateur_nom = serializers.CharField(source='utilisateur.username', read_only=True, allow_null=True)
    capteur_nom = serializers.CharField(source='capteur.nom', read_only=True, allow_null=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'utilisateur', 'utilisateur_nom', 'action', 'timestamp',
            'capteur', 'capteur_nom', 'mesure', 'ticket'
        ]
        read_only_fields = ['timestamp']

