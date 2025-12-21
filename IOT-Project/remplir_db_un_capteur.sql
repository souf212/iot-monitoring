-- ============================================
-- Script SQL pour UN SEUL CAPTEUR (ESP_01)
-- SUPPRIME les données existantes puis INSÈRE les nouvelles
-- Utilisez DB Browser for SQLite pour exécuter ces requêtes
-- ============================================

-- ============================================
-- ÉTAPE 0: SUPPRIMER LES DONNÉES EXISTANTES
-- ============================================

-- Supprimer toutes les mesures (doit être fait en premier à cause des clés étrangères)
DELETE FROM monitoring_mesure;

-- Supprimer tous les tickets
DELETE FROM monitoring_ticket;

-- Supprimer tous les logs d'audit
DELETE FROM monitoring_auditlog;

-- Supprimer tous les capteurs
DELETE FROM monitoring_capteur;

-- Réinitialiser les séquences d'auto-increment (optionnel, mais recommandé)
DELETE FROM sqlite_sequence WHERE name IN ('monitoring_capteur', 'monitoring_mesure', 'monitoring_ticket', 'monitoring_auditlog');

-- ============================================
-- ÉTAPE 1: CRÉER UN CAPTEUR
-- ============================================

INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Mon Capteur IoT', 'ESP_01', 'Mon Emplacement', 1, datetime('now'));

-- ============================================
-- ÉTAPE 2: VÉRIFIER L'ID DU CAPTEUR
-- ============================================
-- Exécutez cette requête pour voir l'ID du capteur créé:
-- SELECT id, nom, sensor_id FROM monitoring_capteur;

-- ============================================
-- ÉTAPE 3: CRÉER DES MESURES
-- Remplacez l'ID (1) par le vrai ID de votre capteur si différent
-- ============================================

-- Mesures récentes (normales - température entre 2-8°C)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 4.5, 65.0, datetime('now', '-2 hours'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 5.2, 63.0, datetime('now', '-1 hour'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 6.0, 60.0, datetime('now', '-30 minutes'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 4.8, 62.0, datetime('now', '-15 minutes'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 5.5, 64.0, datetime('now', '-5 minutes'), 0);

-- Mesure actuelle (la plus récente)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 5.0, 63.0, datetime('now'), 0);

-- ============================================
-- ÉTAPE 4: CRÉER DES MESURES AVEC ALERTES
-- (Température hors plage 2-8°C)
-- ============================================

-- Alerte: Température trop élevée
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 10.5, 75.0, datetime('now', '-25 minutes'), 1);

-- Alerte: Température trop basse
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 1.5, 80.0, datetime('now', '-20 minutes'), 1);

-- ============================================
-- ÉTAPE 5: CRÉER DES MESURES HISTORIQUES
-- (Pour avoir des données sur plusieurs jours)
-- ============================================

-- Mesures d'hier
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.2, 64.0, datetime('now', '-24 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.8, 63.0, datetime('now', '-23 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.1, 62.0, datetime('now', '-22 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.5, 61.0, datetime('now', '-21 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.8, 60.0, datetime('now', '-20 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 6.0, 59.0, datetime('now', '-19 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.5, 60.0, datetime('now', '-18 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.0, 61.0, datetime('now', '-17 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.5, 62.0, datetime('now', '-16 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.0, 63.0, datetime('now', '-15 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.2, 64.0, datetime('now', '-14 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.8, 65.0, datetime('now', '-13 hours'), 0);

-- Mesures d'il y a 2 jours
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.0, 65.0, datetime('now', '-48 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.5, 64.0, datetime('now', '-47 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.0, 63.0, datetime('now', '-46 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.5, 62.0, datetime('now', '-45 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 6.0, 61.0, datetime('now', '-44 hours'), 0);

-- Mesures d'il y a 3 jours
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 3.8, 66.0, datetime('now', '-72 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.2, 65.0, datetime('now', '-71 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.8, 64.0, datetime('now', '-70 hours'), 0);

-- Mesures d'il y a 4 jours
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.0, 63.0, datetime('now', '-96 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.5, 62.0, datetime('now', '-95 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 6.0, 61.0, datetime('now', '-94 hours'), 0);

-- Mesures d'il y a 5 jours
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.5, 64.0, datetime('now', '-120 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.0, 63.0, datetime('now', '-119 hours'), 0);

-- Mesures d'il y a 6 jours
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.8, 65.0, datetime('now', '-144 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.2, 64.0, datetime('now', '-143 hours'), 0);

-- Mesures d'il y a 7 jours
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.0, 66.0, datetime('now', '-168 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.5, 65.0, datetime('now', '-167 hours'), 0);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Voir le capteur créé
SELECT '=== CAPTEUR ===' as Info;
SELECT id, nom, sensor_id, emplacement, actif FROM monitoring_capteur;

-- Compter les mesures
SELECT '=== NOMBRE DE MESURES ===' as Info;
SELECT COUNT(*) as Nombre_Mesures FROM monitoring_mesure;

-- Voir les 20 dernières mesures
SELECT '=== 20 DERNIÈRES MESURES ===' as Info;
SELECT 
    c.nom as Capteur,
    c.sensor_id,
    m.temperature || '°C' as Temperature,
    m.humidite || '%' as Humidite,
    m.timestamp,
    CASE WHEN m.alerte_declenchee = 1 THEN '⚠️ OUI' ELSE '✅ NON' END as Alerte
FROM monitoring_mesure m
JOIN monitoring_capteur c ON m.capteur_id = c.id
ORDER BY m.timestamp DESC
LIMIT 20;
