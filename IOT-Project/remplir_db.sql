-- ============================================
-- Script SQL pour remplir la base de données
-- Utilisez DB Browser for SQLite pour exécuter ces requêtes
-- ============================================

-- IMPORTANT: Vérifiez d'abord qu'un utilisateur existe dans auth_user
-- Si vous n'avez pas d'utilisateur, créez-en un via Django admin ou:
-- INSERT INTO auth_user (username, password, email, is_superuser, is_staff, is_active, date_joined)
-- VALUES ('admin', 'pbkdf2_sha256$...', 'admin@example.com', 1, 1, 1, datetime('now'));

-- ============================================
-- 1. CRÉER DES CAPTEURS
-- ============================================

-- Capteur 1 - Réfrigérateur Principal
INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Réfrigérateur Principal', 'ESP_01', 'Entrepôt A - Zone 1', 1, datetime('now'));

-- Capteur 2 - Congélateur Médicaments
INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Congélateur Médicaments', 'ESP_02', 'Entrepôt A - Zone 2', 1, datetime('now'));

-- Capteur 3 - Chambre Froide
INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Chambre Froide', 'ESP_03', 'Entrepôt B - Zone 1', 1, datetime('now'));

-- Capteur 4 - Transport Véhicule 1
INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Transport Véhicule 1', 'ESP_04', 'Véhicule de livraison', 1, datetime('now'));

-- ============================================
-- 2. CRÉER DES MESURES (Données de test)
-- ============================================

-- Récupérer l'ID du premier capteur (ESP_01)
-- Remplacez 1 par l'ID réel du capteur si différent

-- Mesures normales pour ESP_01 (température entre 2-8°C)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    4.5,
    65.0,
    datetime('now', '-2 hours'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_01';

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    5.2,
    63.0,
    datetime('now', '-1 hour'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_01';

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    6.0,
    60.0,
    datetime('now', '-30 minutes'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_01';

-- Mesures pour ESP_02
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    3.8,
    70.0,
    datetime('now', '-3 hours'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_02';

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    4.2,
    68.0,
    datetime('now', '-2 hours'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_02';

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    4.5,
    65.0,
    datetime('now', '-1 hour'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_02';

-- Mesures pour ESP_03
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    5.5,
    55.0,
    datetime('now', '-4 hours'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_03';

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    6.2,
    58.0,
    datetime('now', '-2 hours'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_03';

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    7.0,
    60.0,
    datetime('now', '-30 minutes'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_03';

-- Mesures avec ALERTE (température hors plage 2-8°C) pour ESP_01
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    10.5,  -- Température trop élevée
    75.0,
    datetime('now', '-15 minutes'),
    1
FROM monitoring_capteur WHERE sensor_id = 'ESP_01';

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    1.5,  -- Température trop basse
    80.0,
    datetime('now', '-10 minutes'),
    1
FROM monitoring_capteur WHERE sensor_id = 'ESP_01';

-- Mesure récente pour ESP_04
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    5.0,
    62.0,
    datetime('now', '-5 minutes'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_04';

-- ============================================
-- 3. CRÉER DES MESURES HISTORIQUES (7 derniers jours)
-- ============================================

-- Générer des mesures pour les 7 derniers jours (une mesure toutes les heures)
-- Pour ESP_01
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    ABS(RANDOM() % 600) / 100.0 + 2.0,  -- Température entre 2.0 et 8.0°C
    ABS(RANDOM() % 300) / 10.0 + 50.0,  -- Humidité entre 50% et 80%
    datetime('now', '-' || (ABS(RANDOM() % 168)) || ' hours'),  -- Dernières 168 heures (7 jours)
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_01'
LIMIT 50;

-- Pour ESP_02
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    ABS(RANDOM() % 600) / 100.0 + 2.0,
    ABS(RANDOM() % 300) / 10.0 + 50.0,
    datetime('now', '-' || (ABS(RANDOM() % 168)) || ' hours'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_02'
LIMIT 50;

-- Pour ESP_03
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
SELECT 
    id,
    ABS(RANDOM() % 600) / 100.0 + 2.0,
    ABS(RANDOM() % 300) / 10.0 + 50.0,
    datetime('now', '-' || (ABS(RANDOM() % 168)) || ' hours'),
    0
FROM monitoring_capteur WHERE sensor_id = 'ESP_03'
LIMIT 50;

-- ============================================
-- 4. VÉRIFICATION DES DONNÉES
-- ============================================

-- Compter les capteurs
SELECT 'Capteurs créés:' as Info, COUNT(*) as Nombre FROM monitoring_capteur;

-- Compter les mesures
SELECT 'Mesures créées:' as Info, COUNT(*) as Nombre FROM monitoring_mesure;

-- Voir les dernières mesures
SELECT 
    c.nom as Capteur,
    c.sensor_id,
    m.temperature || '°C' as Temperature,
    m.humidite || '%' as Humidite,
    m.timestamp,
    CASE WHEN m.alerte_declenchee = 1 THEN 'OUI' ELSE 'NON' END as Alerte
FROM monitoring_mesure m
JOIN monitoring_capteur c ON m.capteur_id = c.id
ORDER BY m.timestamp DESC
LIMIT 20;

-- ============================================
-- NOTES IMPORTANTES:
-- ============================================
-- 1. Les timestamps sont générés automatiquement avec datetime('now')
-- 2. Les IDs des capteurs sont récupérés automatiquement via SELECT
-- 3. Si vous avez déjà des capteurs, les requêtes utilisent les IDs existants
-- 4. Pour créer un utilisateur si nécessaire, utilisez Django admin ou:
--    python manage.py createsuperuser
-- ============================================

