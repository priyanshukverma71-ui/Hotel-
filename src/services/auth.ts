import { UserProfile, HotelReservation, TableBooking } from '../types';
import { StorageService } from './storage';

const USERS_STORAGE_KEY = 'raceai_users_v1';
const CURRENT_USER_KEY = 'raceai_current_user_v1';

interface StoredUser extends UserProfile {
  passwordHash: string;
}

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'usr-101',
    name: 'Elena Rostova',
    email: 'e.rostova@genevaventures.ch',
    phone: '+41 22 819 4430',
    role: 'Patron',
    createdAt: '2026-01-20',
    passwordHash: 'password123',
  },
  {
    id: 'usr-102',
    name: 'Sir Arthur Pendelton',
    email: 'arthur.pendelton@meridianholdings.co.uk',
    phone: '+44 20 7946 0912',
    role: 'Patron',
    createdAt: '2025-04-12',
    passwordHash: 'password123',
  },
  {
    id: 'usr-001',
    name: 'Julian de Saint-Germain',
    email: 'j.saintgermain@grandazure.com',
    phone: '+1 415 555 0101',
    role: 'Administrator',
    createdAt: '2025-01-01',
    passwordHash: 'admin123',
  },
];

const notifyAuthSubscribers = () => {
  window.dispatchEvent(new CustomEvent('raceai_auth_changed'));
};

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

export const AuthService = {
  init: () => {
    getStoredUsers();
    // Default logged-in user if none set
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEFAULT_USERS[0]));
    }
  },

  getCurrentUser: (): UserProfile | null => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  register: async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    const newUser: StoredUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'Guest',
      createdAt: new Date().toISOString().split('T')[0],
      passwordHash: password,
    };

    users.push(newUser);
    saveStoredUsers(users);

    const userProfile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
    notifyAuthSubscribers();
    return { success: true, user: userProfile };
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    const users = getStoredUsers();
    const matched = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matched) {
      return { success: false, error: 'No account found with this email. Please sign up.' };
    }

    if (matched.passwordHash !== password) {
      return { success: false, error: 'Incorrect password entered. Please try again.' };
    }

    const userProfile: UserProfile = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: matched.role,
      createdAt: matched.createdAt,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
    notifyAuthSubscribers();
    return { success: true, user: userProfile };
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyAuthSubscribers();
  },

  getUserBookings: (user: UserProfile) => {
    const allReservations = StorageService.getReservations();
    const allTables = StorageService.getTableBookings();

    const userEmail = user.email.toLowerCase();
    const userReservations = allReservations.filter(
      (r) => (r.userId && r.userId === user.id) || r.guestEmail.toLowerCase() === userEmail
    );
    const userTableBookings = allTables.filter(
      (t) => (t.userId && t.userId === user.id) || t.guestEmail.toLowerCase() === userEmail
    );

    return {
      reservations: userReservations,
      tableBookings: userTableBookings,
    };
  },
};
