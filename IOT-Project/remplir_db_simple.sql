-- ============================================
-- Script SQL SIMPLE pour remplir la base de données
-- Utilisez DB Browser for SQLite pour exécuter ces requêtes
-- ============================================

-- ============================================
-- ÉTAPE 1: CRÉER DES CAPTEURS
-- ============================================

INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Réfrigérateur Principal', 'ESP_01', 'Entrepôt A - Zone 1', 1, datetime('now'));

INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Congélateur Médicaments', 'ESP_02', 'Entrepôt A - Zone 2', 1, datetime('now'));

INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Chambre Froide', 'ESP_03', 'Entrepôt B - Zone 1', 1, datetime('now'));

INSERT INTO monitoring_capteur (nom, sensor_id, emplacement, actif, date_creation)
VALUES ('Transport Véhicule 1', 'ESP_04', 'Véhicule de livraison', 1, datetime('now'));

-- ============================================
-- ÉTAPE 2: VÉRIFIER LES IDs DES CAPTEURS
-- ============================================
-- Exécutez cette requête pour voir les IDs des capteurs créés:
-- SELECT id, nom, sensor_id FROM monitoring_capteur;

-- ============================================
-- ÉTAPE 3: CRÉER DES MESURES
-- Remplacez les IDs (1, 2, 3, 4) par les vrais IDs de vos capteurs
-- ============================================

-- Mesures récentes pour le capteur ID 1 (ESP_01)
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

-- Mesures pour le capteur ID 2 (ESP_02)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (2, 3.8, 70.0, datetime('now', '-3 hours'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (2, 4.2, 68.0, datetime('now', '-2 hours'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (2, 4.5, 65.0, datetime('now', '-1 hour'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (2, 3.9, 67.0, datetime('now', '-30 minutes'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (2, 4.1, 66.0, datetime('now', '-10 minutes'), 0);

-- Mesures pour le capteur ID 3 (ESP_03)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (3, 5.5, 55.0, datetime('now', '-4 hours'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (3, 6.2, 58.0, datetime('now', '-2 hours'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (3, 7.0, 60.0, datetime('now', '-1 hour'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (3, 6.5, 59.0, datetime('now', '-45 minutes'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (3, 6.8, 61.0, datetime('now', '-20 minutes'), 0);

-- Mesures pour le capteur ID 4 (ESP_04)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (4, 5.0, 62.0, datetime('now', '-3 hours'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (4, 5.3, 63.0, datetime('now', '-2 hours'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (4, 4.9, 61.0, datetime('now', '-1 hour'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (4, 5.1, 62.5, datetime('now', '-30 minutes'), 0);

INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (4, 5.2, 63.0, datetime('now', '-5 minutes'), 0);

-- ============================================
-- ÉTAPE 4: CRÉER DES MESURES AVEC ALERTES
-- (Température hors plage 2-8°C)
-- ============================================

-- Alerte: Température trop élevée (capteur 1)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 10.5, 75.0, datetime('now', '-25 minutes'), 1);

-- Alerte: Température trop basse (capteur 1)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (1, 1.5, 80.0, datetime('now', '-20 minutes'), 1);

-- Alerte: Température trop élevée (capteur 2)
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee)
VALUES (2, 9.8, 72.0, datetime('now', '-40 minutes'), 1);

-- ============================================
-- ÉTAPE 5: CRÉER DES MESURES HISTORIQUES
-- (Pour avoir des données sur plusieurs jours)
-- ============================================

-- Mesures d'hier pour capteur 1
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.2, 64.0, datetime('now', '-24 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.8, 63.0, datetime('now', '-23 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.1, 62.0, datetime('now', '-22 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.5, 61.0, datetime('now', '-21 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.8, 60.0, datetime('now', '-20 hours'), 0);

-- Mesures d'hier pour capteur 2
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (2, 3.5, 69.0, datetime('now', '-24 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (2, 3.8, 68.0, datetime('now', '-23 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (2, 4.0, 67.0, datetime('now', '-22 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (2, 4.3, 66.0, datetime('now', '-21 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (2, 4.6, 65.0, datetime('now', '-20 hours'), 0);

-- Mesures d'il y a 2 jours pour capteur 1
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.0, 65.0, datetime('now', '-48 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 4.5, 64.0, datetime('now', '-47 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (1, 5.0, 63.0, datetime('now', '-46 hours'), 0);

-- Mesures d'il y a 3 jours pour capteur 3
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (3, 6.0, 58.0, datetime('now', '-72 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (3, 6.5, 59.0, datetime('now', '-71 hours'), 0);
INSERT INTO monitoring_mesure (capteur_id, temperature, humidite, timestamp, alerte_declenchee) VALUES (3, 7.0, 60.0, datetime('now', '-70 hours'), 0);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Voir tous les capteurs
SELECT '=== CAPTEURS ===' as Info;
SELECT id, nom, sensor_id, emplacement, actif FROM monitoring_capteur;

-- Compter les mesures par capteur
SELECT '=== NOMBRE DE MESURES PAR CAPTEUR ===' as Info;
SELECT 
    c.nom as Capteur,
    c.sensor_id,
    COUNT(m.id) as Nombre_Mesures
FROM monitoring_capteur c
LEFT JOIN monitoring_mesure m ON c.id = m.capteur_id
GROUP BY c.id, c.nom, c.sensor_id;

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

