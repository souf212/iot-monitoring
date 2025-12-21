import { useState, useEffect } from 'react';
import { monitoringApi } from '../api/monitoring';
import type { Mesure, AuditLog } from '../api/monitoring';
import './Historique.css';

const Historique: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mesures' | 'audit'>('mesures');
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab, dateFrom, dateTo]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      if (activeTab === 'mesures') {
        const data = await monitoringApi.getMesures(params);
        setMesures(data);
      } else {
        const data = await monitoringApi.getAuditLogs(params);
        setAuditLogs(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      let blob: Blob;
      if (activeTab === 'mesures') {
        blob = await monitoringApi.exportMesuresCSV();
      } else {
        blob = await monitoringApi.exportAuditCSV();
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeTab === 'mesures' ? 'mesures_export.csv' : 'audit_logs_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      let blob: Blob;
      if (activeTab === 'mesures') {
        blob = await monitoringApi.exportMesuresPDF();
      } else {
        blob = await monitoringApi.exportAuditPDF();
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeTab === 'mesures' ? 'mesures_export.pdf' : 'audit_logs_export.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  return (
    <div className="historique">
      <div className="historique-header">
        <h1>Historique & Audit</h1>
        <div className="export-buttons">
          <button onClick={handleExportCSV} className="btn-export">
            Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn-export">
            Export PDF
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'mesures' ? 'active' : ''}
          onClick={() => setActiveTab('mesures')}
        >
          Mesures
        </button>
        <button
          className={activeTab === 'audit' ? 'active' : ''}
          onClick={() => setActiveTab('audit')}
        >
          Logs d'Audit
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Date de début:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Date de fin:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="btn-clear">
          Effacer
        </button>
      </div>

      {loading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="table-container">
          {activeTab === 'mesures' ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Capteur</th>
                  <th>Emplacement</th>
                  <th>Température</th>
                  <th>Humidité</th>
                  <th>Date/Heure</th>
                  <th>Alerte</th>
                </tr>
              </thead>
              <tbody>
                {mesures.map((mesure) => (
                  <tr key={mesure.id} className={mesure.alerte_declenchee ? 'alert-row' : ''}>
                    <td>{mesure.id}</td>
                    <td>{mesure.capteur_nom}</td>
                    <td>{mesure.capteur_emplacement}</td>
                    <td>{mesure.temperature.toFixed(2)}°C</td>
                    <td>{mesure.humidite.toFixed(1)}%</td>
                    <td>{new Date(mesure.timestamp).toLocaleString('fr-FR')}</td>
                    <td>{mesure.alerte_declenchee ? '🚨 Oui' : 'Non'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Capteur</th>
                  <th>Date/Heure</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.utilisateur_nom || 'Système'}</td>
                    <td className="action-cell">{log.action}</td>
                    <td>{log.capteur_nom || '-'}</td>
                    <td>{new Date(log.timestamp).toLocaleString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Historique;

