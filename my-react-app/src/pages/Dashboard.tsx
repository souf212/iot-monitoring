import { useState, useEffect } from 'react';
import { monitoringApi } from '../api/monitoring';
import type { Mesure, Capteur } from '../api/monitoring';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [dernieresMesures, setDernieresMesures] = useState<Mesure[]>([]);
  const [capteurs, setCapteurs] = useState<Capteur[]>([]);
  const [selectedCapteur, setSelectedCapteur] = useState<number | null>(null);
  const [historique, setHistorique] = useState<Mesure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Rafraîchir toutes les minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCapteur) {
      loadHistorique();
    }
  }, [selectedCapteur]);

  const loadData = async () => {
    try {
      const [mesures, capteursData] = await Promise.all([
        monitoringApi.getDernieresMesures(),
        monitoringApi.getCapteurs(),
      ]);
      setDernieresMesures(mesures);
      setCapteurs(capteursData);
      if (capteursData.length > 0 && !selectedCapteur) {
        setSelectedCapteur(capteursData[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  };

  const loadHistorique = async () => {
    if (!selectedCapteur) return;
    try {
      const data = await monitoringApi.getHistorique24h(selectedCapteur);
      setHistorique(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusClass = (mesure: Mesure) => {
    if (mesure.alerte_declenchee) return 'alert';
    if (mesure.temperature < 2 || mesure.temperature > 8) return 'warning';
    return 'normal';
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const chartData = historique.map((m) => ({
    time: formatDate(m.timestamp),
    temperature: m.temperature,
    humidite: m.humidite,
  }));

  return (
    <div className="dashboard">
      <h1>Tableau de Bord</h1>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Dernières Mesures</h2>
          <div className="mesures-table">
            <table>
              <thead>
                <tr>
                  <th>Capteur</th>
                  <th>Emplacement</th>
                  <th>Température</th>
                  <th>Humidité</th>
                  <th>Heure</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {dernieresMesures.map((mesure) => (
                  <tr key={mesure.id} className={getStatusClass(mesure)}>
                    <td>{mesure.capteur_nom}</td>
                    <td>{mesure.capteur_emplacement}</td>
                    <td>{mesure.temperature.toFixed(2)}°C</td>
                    <td>{mesure.humidite.toFixed(1)}%</td>
                    <td>{formatDate(mesure.timestamp)}</td>
                    <td>
                      {mesure.alerte_declenchee ? (
                        <span className="badge alert">🚨 Alerte</span>
                      ) : (
                        <span className="badge normal">✓ Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Historique des 24 dernières heures</h2>
          <div className="chart-controls">
            <label>
              Sélectionner un capteur:{' '}
              <select
                value={selectedCapteur || ''}
                onChange={(e) => setSelectedCapteur(Number(e.target.value))}
              >
                {capteurs.map((capteur) => (
                  <option key={capteur.id} value={capteur.id}>
                    {capteur.nom} - {capteur.emplacement}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {historique.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="temp" orientation="left" label={{ value: 'Température (°C)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="hum" orientation="right" label={{ value: 'Humidité (%)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Température (°C)"
                  />
                  <Line
                    yAxisId="hum"
                    type="monotone"
                    dataKey="humidite"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Humidité (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-data">Aucune donnée disponible pour ce capteur</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

