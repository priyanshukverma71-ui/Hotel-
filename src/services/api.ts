import { StorageService } from './storage';
import {
  HotelReservation,
  TableBooking,
  Guest,
  Room,
  CallRecord,
  StaffMember,
  ReceptionistSettingsConfig,
  HotelSettings,
  OperationalStats
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

import { MUMBAI_HOTELS } from './mumbaiHotelsData';

// Internal flag checking if remote backend is actively responding
let isBackendReachable = false;

export const ApiService = {
  // Check backend status
  checkConnection: async (): Promise<{ connected: boolean; mode: 'Live REST Service' | 'Local Persistent Store' }> => {
    if (!API_BASE_URL) {
      return { connected: false, mode: 'Local Persistent Store' };
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET', credentials: 'omit' });
      if (res.ok) {
        isBackendReachable = true;
        return { connected: true, mode: 'Live REST Service' };
      }
    } catch {
      isBackendReachable = false;
    }
    return { connected: false, mode: 'Local Persistent Store' };
  },

  // Mumbai Hotels Portal
  getMumbaiHotels: async () => {
    return Promise.resolve(MUMBAI_HOTELS);
  },
  getMumbaiHotelById: async (id: string) => {
    const hotel = MUMBAI_HOTELS.find((h) => h.id === id) || MUMBAI_HOTELS[0];
    return Promise.resolve(hotel);
  },
  getActiveHotel: async () => {
    const activeId = StorageService.getActiveHotelId();
    const hotel = MUMBAI_HOTELS.find((h) => h.id === activeId) || MUMBAI_HOTELS[0];
    return Promise.resolve(hotel);
  },
  switchActiveHotel: async (id: string) => {
    const target = MUMBAI_HOTELS.find((h) => h.id === id);
    if (!target) return Promise.resolve();
    StorageService.setActiveHotelId(id);

    // Sync hotel settings
    const currentSettings = StorageService.getHotelSettings();
    StorageService.saveHotelSettings({
      ...currentSettings,
      name: target.name,
      tagline: target.tagline,
      address: target.address,
      phone: target.phone,
      email: target.email,
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata (IST)',
    });

    // Sync receptionist config
    const currentRec = StorageService.getReceptionistConfig();
    StorageService.saveReceptionistConfig({
      ...currentRec,
      hotelName: target.name,
      hotelAddress: target.address,
      hotelContactPhone: target.phone,
      hotelContactEmail: target.email,
      hotelTimezone: 'Asia/Kolkata (IST)',
      greetingMessage: `Namaste and welcome to ${target.name}. I am Aria, your AI Voice Receptionist. How may I assist your stay or dining in Mumbai today?`,
    });

    return Promise.resolve(target);
  },

  // Rooms
  getRooms: async (): Promise<Room[]> => {
    return Promise.resolve(StorageService.getRooms());
  },
  updateRoom: async (room: Room): Promise<Room> => {
    StorageService.updateRoom(room);
    return Promise.resolve(room);
  },
  setRoomStatus: async (roomId: string, status: Room['status']): Promise<void> => {
    StorageService.setRoomStatus(roomId, status);
    return Promise.resolve();
  },

  // Reservations
  getReservations: async (): Promise<HotelReservation[]> => {
    return Promise.resolve(StorageService.getReservations());
  },
  createReservation: async (reservation: Omit<HotelReservation, 'id' | 'bookingCode' | 'createdAt'>): Promise<HotelReservation> => {
    const newReservation: HotelReservation = {
      ...reservation,
      id: 'res-' + Math.floor(1000 + Math.random() * 9000),
      bookingCode: 'MUM-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };
    StorageService.saveReservation(newReservation);
    return Promise.resolve(newReservation);
  },
  updateReservation: async (reservation: HotelReservation): Promise<HotelReservation> => {
    StorageService.saveReservation(reservation);
    return Promise.resolve(reservation);
  },
  checkInGuest: async (id: string, roomNumber?: string): Promise<void> => {
    StorageService.checkInReservation(id, roomNumber);
    return Promise.resolve();
  },
  checkOutGuest: async (id: string): Promise<void> => {
    StorageService.checkOutReservation(id);
    return Promise.resolve();
  },
  cancelReservation: async (id: string): Promise<void> => {
    StorageService.cancelReservation(id);
    return Promise.resolve();
  },

  // Table Bookings
  getTableBookings: async (): Promise<TableBooking[]> => {
    return Promise.resolve(StorageService.getTableBookings());
  },
  createTableBooking: async (booking: Omit<TableBooking, 'id' | 'bookingRef' | 'createdAt'>): Promise<{ success: boolean; data?: TableBooking; error?: string }> => {
    const newBooking: TableBooking = {
      ...booking,
      id: 'tbl-' + Math.floor(100 + Math.random() * 900),
      bookingRef: 'TB-MUM-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };
    const res = StorageService.saveTableBooking(newBooking);
    if (!res.success) {
      return Promise.resolve({ success: false, error: res.conflictMessage });
    }
    return Promise.resolve({ success: true, data: newBooking });
  },
  updateTableBooking: async (booking: TableBooking): Promise<{ success: boolean; data?: TableBooking; error?: string }> => {
    const res = StorageService.saveTableBooking(booking);
    if (!res.success) {
      return Promise.resolve({ success: false, error: res.conflictMessage });
    }
    return Promise.resolve({ success: true, data: booking });
  },
  updateTableBookingStatus: async (id: string, status: TableBooking['status']): Promise<void> => {
    StorageService.updateTableBookingStatus(id, status);
    return Promise.resolve();
  },

  // Guests
  getGuests: async (): Promise<Guest[]> => {
    return Promise.resolve(StorageService.getGuests());
  },
  saveGuest: async (guest: Guest): Promise<Guest> => {
    StorageService.saveGuest(guest);
    return Promise.resolve(guest);
  },
  deleteGuest: async (id: string): Promise<void> => {
    StorageService.deleteGuest(id);
    return Promise.resolve();
  },

  // Calls
  getCalls: async (): Promise<CallRecord[]> => {
    return Promise.resolve(StorageService.getCalls());
  },
  markCallbackCompleted: async (callId: string): Promise<void> => {
    StorageService.markCallbackCompleted(callId);
    return Promise.resolve();
  },

  // Staff
  getStaff: async (): Promise<StaffMember[]> => {
    return Promise.resolve(StorageService.getStaff());
  },
  saveStaff: async (staff: StaffMember): Promise<StaffMember> => {
    StorageService.saveStaff(staff);
    return Promise.resolve(staff);
  },
  deleteStaff: async (id: string): Promise<void> => {
    StorageService.deleteStaff(id);
    return Promise.resolve();
  },

  // Settings
  getReceptionistConfig: async (): Promise<ReceptionistSettingsConfig> => {
    return Promise.resolve(StorageService.getReceptionistConfig());
  },
  saveReceptionistConfig: async (cfg: ReceptionistSettingsConfig): Promise<ReceptionistSettingsConfig> => {
    StorageService.saveReceptionistConfig(cfg);
    return Promise.resolve(cfg);
  },
  getHotelSettings: async (): Promise<HotelSettings> => {
    return Promise.resolve(StorageService.getHotelSettings());
  },
  saveHotelSettings: async (settings: HotelSettings): Promise<HotelSettings> => {
    StorageService.saveHotelSettings(settings);
    return Promise.resolve(settings);
  },

  // Stats
  getOperationalStats: async (): Promise<OperationalStats> => {
    return Promise.resolve(StorageService.getOperationalStats());
  },

  // Reset
  resetDemoData: async (): Promise<void> => {
    StorageService.resetAll();
    return Promise.resolve();
  }
};
