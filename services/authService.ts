
import { GameState } from '../types';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password?: string; // Dodano pole hasła
  avatar?: string;
}

const USERS_KEY = 'foodidle_db_users';
const SESSION_KEY = 'foodidle_current_session';

export const authService = {
  getUsers: (): UserProfile[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  register: (username: string, email: string, password: string): UserProfile => {
    const users = authService.getUsers();
    const newUser = { 
      id: Math.random().toString(36).substr(2, 9), 
      username, 
      email,
      password // Przechowywanie hasła
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  login: (email: string, password: string): UserProfile | null => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): UserProfile | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUserData: (userId: string, state: GameState) => {
    localStorage.setItem(`foodidle_save_${userId}`, JSON.stringify(state));
  },

  getUserData: (userId: string): GameState | null => {
    const data = localStorage.getItem(`foodidle_save_${userId}`);
    return data ? JSON.parse(data) : null;
  }
};
