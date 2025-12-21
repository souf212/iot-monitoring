import api from './axios';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    // Note: Cette API nécessite un endpoint dans Django pour récupérer les utilisateurs
    // Pour l'instant, on peut utiliser l'admin Django ou créer un endpoint simple
    const response = await api.get('/users/');
    return response.data;
  },
};

