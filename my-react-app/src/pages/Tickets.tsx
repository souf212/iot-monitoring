import { useState, useEffect } from 'react';
import { monitoringApi } from '../api/monitoring';
import type { Ticket } from '../api/monitoring';
import './Tickets.css';

interface User {
  id: number;
  username: string;
  email: string;
}

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadTickets();
    loadUsers();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await monitoringApi.getTickets();
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await monitoringApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await monitoringApi.createTicket({ titre, description });
      setTitre('');
      setDescription('');
      setShowModal(false);
      loadTickets();
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      alert('Erreur lors de la création du ticket');
    }
  };

  const handleOpenAssignModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSelectedUserId(ticket.assigne_a || null);
    setShowAssignModal(true);
  };

  const handleAssigner = async () => {
    if (!selectedTicket || !selectedUserId) {
      alert('Veuillez sélectionner un utilisateur');
      return;
    }

    try {
      await monitoringApi.assignerTicket(selectedTicket.id, selectedUserId);
      setShowAssignModal(false);
      setSelectedTicket(null);
      setSelectedUserId(null);
      loadTickets();
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      alert('Erreur lors de l\'assignation');
    }
  };

  const handleFermer = async (ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir fermer le ticket "${ticket.titre}" ?`)) {
      try {
        await monitoringApi.fermerTicket(ticketId);
        await loadTickets(); // Recharger la liste après fermeture
      } catch (error: any) {
        console.error('Erreur lors de la fermeture:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Erreur lors de la fermeture';
        alert(errorMsg);
      }
    }
  };

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case 'Ouvert':
        return 'statut-ouvert';
      case 'Assigné':
        return 'statut-assigne';
      case 'En cours':
        return 'statut-encours';
      case 'Clos':
        return 'statut-clos';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="tickets">
      <div className="tickets-header">
        <div className="header-content">
          <h1>Gestion des Tickets</h1>
          <p className="header-subtitle">Gérez les incidents et les alertes du système</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary btn-create">
          <span className="btn-icon">+</span>
          Créer un ticket
        </button>
      </div>

      {/* Modal de création */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Créer un nouveau ticket</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="form-group">
                <label>Titre *</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: Problème de température"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le problème en détail..."
                  required
                  rows={5}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'assignation */}
      {showAssignModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assigner le ticket</h2>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            <div className="assign-form">
              <div className="ticket-info">
                <p><strong>Ticket:</strong> {selectedTicket.titre}</p>
                <p><strong>Statut actuel:</strong> {selectedTicket.statut}</p>
              </div>
              <div className="form-group">
                <label>Assigner à *</label>
                <select
                  value={selectedUserId || ''}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  className="select-assign"
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  onClick={handleAssigner}
                  className="btn-primary"
                  disabled={!selectedUserId}
                >
                  Assigner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTicket(null);
                    setSelectedUserId(null);
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des tickets */}
      <div className="tickets-container">
        {tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Aucun ticket</h3>
            <p>Créez votre premier ticket pour commencer</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Créer un ticket
            </button>
          </div>
        ) : (
          <div className="tickets-table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Créé par</th>
                  <th>Assigné à</th>
                  <th>Date création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className={`ticket-row ${getStatutClass(ticket.statut)}`}>
                    <td className="ticket-id">#{ticket.id}</td>
                    <td className="ticket-title">{ticket.titre}</td>
                    <td className="ticket-description">
                      {ticket.description.length > 80
                        ? `${ticket.description.substring(0, 80)}...`
                        : ticket.description}
                    </td>
                    <td>
                      <span className={`statut-badge ${getStatutClass(ticket.statut)}`}>
                        {ticket.statut}
                      </span>
                    </td>
                    <td className="ticket-creator">{ticket.cree_par_nom}</td>
                    <td className="ticket-assignee">
                      {ticket.assigne_a_nom || <span className="not-assigned">Non assigné</span>}
                    </td>
                    <td className="ticket-date">
                      {new Date(ticket.timestamp_creation).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <div className="actions">
                        {ticket.statut !== 'Clos' && (
                          <>
                            <button
                              onClick={() => handleOpenAssignModal(ticket)}
                              className="btn-action btn-assign"
                              title="Assigner"
                            >
                              👤 Assigner
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFermer(ticket.id);
                              }}
                              className="btn-action btn-close"
                              title="Fermer"
                              type="button"
                            >
                              ✓ Fermer
                            </button>
                          </>
                        )}
                        {ticket.statut === 'Clos' && (
                          <span className="ticket-closed">Fermé</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
