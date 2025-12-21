from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
import csv
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from django.contrib.auth.models import User

from .models import Capteur, Mesure, Ticket, AuditLog
from .serializers import (
    CapteurSerializer, MesureSerializer, TicketSerializer,
    AuditLogSerializer, MesureCreateSerializer, UserSerializer,
    UserRegistrationSerializer
)
from .services import check_alert_and_escalate


class CapteurViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des capteurs"""
    queryset = Capteur.objects.all()
    serializer_class = CapteurSerializer
    permission_classes = [IsAuthenticated]


class MesureViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des mesures"""
    queryset = Mesure.objects.select_related('capteur').all()
    serializer_class = MesureSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        capteur_id = self.request.query_params.get('capteur', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        
        if capteur_id:
            queryset = queryset.filter(capteur_id=capteur_id)
        if date_from:
            queryset = queryset.filter(timestamp__gte=date_from)
        if date_to:
            queryset = queryset.filter(timestamp__lte=date_to)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def dernieres(self, request):
        """Récupère les dernières mesures de tous les capteurs"""
        capteurs = Capteur.objects.filter(actif=True)
        result = []
        
        for capteur in capteurs:
            derniere_mesure = Mesure.objects.filter(capteur=capteur).order_by('-timestamp').first()
            if derniere_mesure:
                result.append(MesureSerializer(derniere_mesure).data)
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def historique_24h(self, request):
        """Récupère l'historique des 24 dernières heures pour un capteur"""
        capteur_id = request.query_params.get('capteur_id')
        if not capteur_id:
            return Response(
                {'error': 'capteur_id requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        depuis = timezone.now() - timedelta(hours=24)
        mesures = Mesure.objects.filter(
            capteur_id=capteur_id,
            timestamp__gte=depuis
        ).order_by('timestamp')
        
        serializer = MesureSerializer(mesures, many=True)
        return Response(serializer.data)


class TicketViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des tickets"""
    queryset = Ticket.objects.select_related('cree_par', 'assigne_a', 'mesure_declenchante').all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(cree_par=self.request.user)
    
    @action(detail=True, methods=['post'])
    def assigner(self, request, pk=None):
        """Assigner un ticket à un utilisateur"""
        ticket = self.get_object()
        user_id = request.data.get('user_id')
        
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                ticket.assigne_a = user
                ticket.statut = 'Assigné'
                ticket.save()
                
                AuditLog.objects.create(
                    utilisateur=request.user,
                    action=f"Ticket {ticket.titre} assigné à {user.username}",
                    ticket=ticket
                )
                
                return Response({'status': 'Ticket assigné'})
            except User.DoesNotExist:
                return Response(
                    {'error': 'Utilisateur non trouvé'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(
            {'error': 'user_id requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def fermer(self, request, pk=None):
        """Fermer un ticket"""
        ticket = self.get_object()
        ticket.statut = 'Clos'
        ticket.timestamp_fermeture = timezone.now()
        ticket.save()
        
        AuditLog.objects.create(
            utilisateur=request.user,
            action=f"Ticket {ticket.titre} fermé",
            ticket=ticket
        )
        
        return Response({'status': 'Ticket fermé'})


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour la consultation des logs d'audit"""
    queryset = AuditLog.objects.select_related('utilisateur', 'capteur').all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        
        if date_from:
            queryset = queryset.filter(timestamp__gte=date_from)
        if date_to:
            queryset = queryset.filter(timestamp__lte=date_to)
        
        return queryset


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    """Récupérer la liste des utilisateurs pour l'assignation de tickets"""
    users = User.objects.filter(is_active=True)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Inscription d'un nouvel utilisateur"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        # S'assurer que l'utilisateur est actif et sauvegarder
        user.is_active = True
        user.save()
        
        # Enregistrer dans AuditLog
        AuditLog.objects.create(
            action=f"Nouvel utilisateur créé: {user.username}",
            utilisateur=user
        )
        return Response({
            'message': 'Utilisateur créé avec succès',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def collecte_mesure(request):
    """
    Endpoint de collecte des données depuis l'ESP8266
    Accessible sans authentification
    """
    serializer = MesureCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    sensor_id = serializer.validated_data['sensor_id']
    temp = serializer.validated_data['temp']
    hum = serializer.validated_data['hum']
    
    try:
        capteur = Capteur.objects.get(sensor_id=sensor_id)
    except Capteur.DoesNotExist:
        AuditLog.objects.create(
            action=f"Tentative de collecte depuis un capteur inconnu: {sensor_id}"
        )
        return Response(
            {'error': f'Capteur {sensor_id} non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Créer la mesure
    mesure = Mesure.objects.create(
        capteur=capteur,
        temperature=temp,
        humidite=hum
    )
    
    # Enregistrer dans AuditLog
    AuditLog.objects.create(
        action=f"Mesure reçue de {sensor_id}: {temp}°C, {hum}%",
        capteur=capteur,
        mesure=mesure
    )
    
    # Vérifier les alertes
    check_alert_and_escalate(mesure)
    
    return Response({
        'status': 'Mesure enregistrée',
        'mesure_id': mesure.id
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_mesures_csv(request):
    """Export des mesures en CSV"""
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="mesures_export.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['ID', 'Capteur', 'Emplacement', 'Température (°C)', 'Humidité (%)', 'Timestamp', 'Alerte'])
    
    mesures = Mesure.objects.select_related('capteur').all().order_by('-timestamp')
    for mesure in mesures:
        writer.writerow([
            mesure.id,
            mesure.capteur.nom,
            mesure.capteur.emplacement,
            mesure.temperature,
            mesure.humidite,
            mesure.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'Oui' if mesure.alerte_declenchee else 'Non'
        ])
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_mesures_pdf(request):
    """Export des mesures en PDF"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Titre
    title = Paragraph("Export des Mesures - Cold Chain Monitoring", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 0.2*inch))
    
    # Récupérer les mesures
    mesures = Mesure.objects.select_related('capteur').all().order_by('-timestamp')[:1000]
    
    # Préparer les données du tableau
    data = [['Capteur', 'Emplacement', 'Temp (°C)', 'Hum (%)', 'Timestamp', 'Alerte']]
    for mesure in mesures:
        data.append([
            mesure.capteur.nom,
            mesure.capteur.emplacement,
            f"{mesure.temperature:.2f}",
            f"{mesure.humidite:.2f}",
            mesure.timestamp.strftime('%Y-%m-%d %H:%M'),
            'Oui' if mesure.alerte_declenchee else 'Non'
        ])
    
    # Créer le tableau
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="mesures_export.pdf"'
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_audit_csv(request):
    """Export des logs d'audit en CSV"""
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="audit_logs_export.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['ID', 'Utilisateur', 'Action', 'Capteur', 'Timestamp'])
    
    logs = AuditLog.objects.select_related('utilisateur', 'capteur').all().order_by('-timestamp')
    for log in logs:
        writer.writerow([
            log.id,
            log.utilisateur.username if log.utilisateur else 'Système',
            log.action,
            log.capteur.nom if log.capteur else '',
            log.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        ])
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_audit_pdf(request):
    """Export des logs d'audit en PDF"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Titre
    title = Paragraph("Export des Logs d'Audit - Cold Chain Monitoring", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 0.2*inch))
    
    # Récupérer les logs
    logs = AuditLog.objects.select_related('utilisateur', 'capteur').all().order_by('-timestamp')[:1000]
    
    # Préparer les données du tableau
    data = [['Utilisateur', 'Action', 'Capteur', 'Timestamp']]
    for log in logs:
        data.append([
            log.utilisateur.username if log.utilisateur else 'Système',
            log.action[:50] + '...' if len(log.action) > 50 else log.action,
            log.capteur.nom if log.capteur else '',
            log.timestamp.strftime('%Y-%m-%d %H:%M')
        ])
    
    # Créer le tableau
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="audit_logs_export.pdf"'
    return response
