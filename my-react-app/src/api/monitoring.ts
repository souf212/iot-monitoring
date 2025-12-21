import api from './axios';

export interface Capteur {
  id: number;
  nom: string;
  sensor_id: string;
  emplacement: string;
  actif: boolean;
  date_creation: string;
}

export interface Mesure {
  id: number;
  capteur: number;
  capteur_nom: string;
  capteur_emplacement: string;
  temperature: number;
  humidite: number;
  timestamp: string;
  alerte_declenchee: boolean;
}

export interface Ticket {
  id: number;
  titre: string;
  description: string;
  statut: 'Ouvert' | 'Assigné' | 'En cours' | 'Clos';
  assigne_a: number | null;
  assigne_a_nom: string | null;
  cree_par: number;
  cree_par_nom: string;
  mesure_declenchante: number | null;
  mesure_temperature: number | null;
  mesure_timestamp: string | null;
  timestamp_creation: string;
  timestamp_fermeture: string | null;
}

export interface AuditLog {
  id: number;
  utilisateur: number | null;
  utilisateur_nom: string | null;
  action: string;
  timestamp: string;
  capteur: number | null;
  capteur_nom: string | null;
  mesure: number | null;
  ticket: number | null;
}

export const monitoringApi = {
  // Capteurs
  getCapteurs: async (): Promise<Capteur[]> => {
    const response = await api.get('/capteurs/');
    return response.data.results || response.data;
  },

  getCapteur: async (id: number): Promise<Capteur> => {
    const response = await api.get(`/capteurs/${id}/`);
    return response.data;
  },

  // Mesures
  getMesures: async (params?: {
    capteur?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<Mesure[]> => {
    const response = await api.get('/mesures/', { params });
    return response.data.results || response.data;
  },

  getDernieresMesures: async (): Promise<Mesure[]> => {
    const response = await api.get('/mesures/dernieres/');
    return response.data;
  },

  getHistorique24h: async (capteurId: number): Promise<Mesure[]> => {
    const response = await api.get('/mesures/historique_24h/', {
      params: { capteur_id: capteurId },
    });
    return response.data;
  },

  // Tickets
  getTickets: async (): Promise<Ticket[]> => {
    const response = await api.get('/tickets/');
    return response.data.results || response.data;
  },

  createTicket: async (data: {
    titre: string;
    description: string;
  }): Promise<Ticket> => {
    const response = await api.post('/tickets/', data);
    return response.data;
  },

  assignerTicket: async (ticketId: number, userId: number): Promise<void> => {
    await api.post(`/tickets/${ticketId}/assigner/`, { user_id: userId });
  },

  fermerTicket: async (ticketId: number): Promise<void> => {
    await api.post(`/tickets/${ticketId}/fermer/`);
  },

  // Audit Logs
  getAuditLogs: async (params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<AuditLog[]> => {
    const response = await api.get('/audit-logs/', { params });
    return response.data.results || response.data;
  },

  // Users
  getUsers: async (): Promise<any[]> => {
    const response = await api.get('/users/');
    return response.data;
  },

  // Export
  exportMesuresCSV: async (): Promise<Blob> => {
    const response = await api.get('/export/mesures/csv/', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportMesuresPDF: async (): Promise<Blob> => {
    const response = await api.get('/export/mesures/pdf/', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportAuditCSV: async (): Promise<Blob> => {
    const response = await api.get('/export/audit/csv/', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportAuditPDF: async (): Promise<Blob> => {
    const response = await api.get('/export/audit/pdf/', {
      responseType: 'blob',
    });
    return response.data;
  },
};

