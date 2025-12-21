from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CapteurViewSet, MesureViewSet, TicketViewSet, AuditLogViewSet,
    collecte_mesure, export_mesures_csv, export_mesures_pdf,
    export_audit_csv, export_audit_pdf, get_users, register_user
)

router = DefaultRouter()
router.register(r'capteurs', CapteurViewSet)
router.register(r'mesures', MesureViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('collecte/', collecte_mesure, name='collecte_mesure'),
    path('users/', get_users, name='get_users'),
    path('register/', register_user, name='register_user'),
    path('export/mesures/csv/', export_mesures_csv, name='export_mesures_csv'),
    path('export/mesures/pdf/', export_mesures_pdf, name='export_mesures_pdf'),
    path('export/audit/csv/', export_audit_csv, name='export_audit_csv'),
    path('export/audit/pdf/', export_audit_pdf, name='export_audit_pdf'),
]

