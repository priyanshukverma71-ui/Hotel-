import {
  HotelReservation,
  TableBooking,
  Guest,
  Room,
  CallRecord,
  StaffMember,
  ReceptionistSettingsConfig,
  HotelSettings,
  OperationalStats,
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_GUESTS,
  INITIAL_RESERVATIONS,
  INITIAL_TABLE_BOOKINGS,
  INITIAL_CALLS,
  INITIAL_STAFF,
  INITIAL_RECEPTIONIST_CONFIG,
  INITIAL_HOTEL_SETTINGS,
  TODAY
} from './mockData';

const STORAGE_KEYS = {
  ROOMS: 'raceai_mumbai_rooms_v2',
  RESERVATIONS: 'raceai_mumbai_reservations_v2',
  TABLE_BOOKINGS: 'raceai_mumbai_table_bookings_v2',
  GUESTS: 'raceai_mumbai_guests_v2',
  CALLS: 'raceai_mumbai_calls_v2',
  STAFF: 'raceai_mumbai_staff_v2',
  RECEPTIONIST_CONFIG: 'raceai_mumbai_receptionist_config_v2',
  HOTEL_SETTINGS: 'raceai_mumbai_hotel_settings_v2',
  ACTIVE_HOTEL_ID: 'raceai_mumbai_active_hotel_id_v2',
};

const notifySubscribers = () => {
  window.dispatchEvent(new CustomEvent('raceai_data_changed'));
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading key ${key} from storage:`, err);
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifySubscribers();
  } catch (err) {
    console.error(`Error writing key ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Init
  initDefaults: () => {
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) setToStorage(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) setToStorage(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    if (!localStorage.getItem(STORAGE_KEYS.TABLE_BOOKINGS)) setToStorage(STORAGE_KEYS.TABLE_BOOKINGS, INITIAL_TABLE_BOOKINGS);
    if (!localStorage.getItem(STORAGE_KEYS.GUESTS)) setToStorage(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
    if (!localStorage.getItem(STORAGE_KEYS.CALLS)) setToStorage(STORAGE_KEYS.CALLS, INITIAL_CALLS);
    if (!localStorage.getItem(STORAGE_KEYS.STAFF)) setToStorage(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    if (!localStorage.getItem(STORAGE_KEYS.RECEPTIONIST_CONFIG)) setToStorage(STORAGE_KEYS.RECEPTIONIST_CONFIG, INITIAL_RECEPTIONIST_CONFIG);
    if (!localStorage.getItem(STORAGE_KEYS.HOTEL_SETTINGS)) setToStorage(STORAGE_KEYS.HOTEL_SETTINGS, INITIAL_HOTEL_SETTINGS);
  },

  resetAll: () => {
    setToStorage(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    setToStorage(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    setToStorage(STORAGE_KEYS.TABLE_BOOKINGS, INITIAL_TABLE_BOOKINGS);
    setToStorage(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
    setToStorage(STORAGE_KEYS.CALLS, INITIAL_CALLS);
    setToStorage(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    setToStorage(STORAGE_KEYS.RECEPTIONIST_CONFIG, INITIAL_RECEPTIONIST_CONFIG);
    setToStorage(STORAGE_KEYS.HOTEL_SETTINGS, INITIAL_HOTEL_SETTINGS);
    setToStorage(STORAGE_KEYS.ACTIVE_HOTEL_ID, 'taj-mahal-palace');
  },

  // Active Hotel Selection
  getActiveHotelId: (): string => getFromStorage(STORAGE_KEYS.ACTIVE_HOTEL_ID, 'taj-mahal-palace'),
  setActiveHotelId: (id: string): void => {
    setToStorage(STORAGE_KEYS.ACTIVE_HOTEL_ID, id);
  },

  // Rooms
  getRooms: (): Room[] => getFromStorage(STORAGE_KEYS.ROOMS, INITIAL_ROOMS),
  updateRoom: (room: Room): void => {
    const list = StorageService.getRooms();
    const idx = list.findIndex(r => r.id === room.id);
    if (idx >= 0) list[idx] = room;
    else list.push(room);
    setToStorage(STORAGE_KEYS.ROOMS, list);
  },
  setRoomStatus: (roomId: string, status: Room['status']): void => {
    const list = StorageService.getRooms();
    const r = list.find(x => x.id === roomId);
    if (r) {
      r.status = status;
      setToStorage(STORAGE_KEYS.ROOMS, list);
    }
  },

  // Reservations
  getReservations: (): HotelReservation[] => getFromStorage(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS),
  saveReservation: (res: HotelReservation): void => {
    const list = StorageService.getReservations();
    const idx = list.findIndex(r => r.id === res.id);
    if (idx >= 0) list[idx] = res;
    else list.unshift(res);
    setToStorage(STORAGE_KEYS.RESERVATIONS, list);

    // Auto update room status if assigned and checked in/out
    if (res.roomNumber) {
      const rooms = StorageService.getRooms();
      const matched = rooms.find(rm => rm.roomNumber === res.roomNumber);
      if (matched) {
        if (res.status === 'Checked In') matched.status = 'Occupied';
        else if (res.status === 'Checked Out') matched.status = 'Cleaning';
        else if (res.status === 'Confirmed') matched.status = 'Reserved';
        else if (res.status === 'Cancelled' && matched.status === 'Reserved') matched.status = 'Available';
        setToStorage(STORAGE_KEYS.ROOMS, rooms);
      }
    }

    // Auto link or create guest
    const guests = StorageService.getGuests();
    const existingGuest = guests.find(g => g.email.toLowerCase() === res.guestEmail.toLowerCase());
    if (existingGuest) {
      existingGuest.totalStays += 1;
      existingGuest.totalSpend += res.totalAmount;
      existingGuest.lastVisit = res.checkInDate;
      setToStorage(STORAGE_KEYS.GUESTS, guests);
    } else {
      const newGuest: Guest = {
        id: 'gst-' + Date.now(),
        name: res.guestName,
        email: res.guestEmail,
        phone: res.guestPhone,
        vipStatus: false,
        totalStays: 1,
        totalDiningVisits: 0,
        totalSpend: res.totalAmount,
        lastVisit: res.checkInDate,
        preferences: { roomType: res.roomCategory },
        createdAt: new Date().toISOString().split('T')[0]
      };
      guests.push(newGuest);
      setToStorage(STORAGE_KEYS.GUESTS, guests);
    }
  },
  cancelReservation: (id: string): void => {
    const list = StorageService.getReservations();
    const item = list.find(r => r.id === id);
    if (item) {
      item.status = 'Cancelled';
      setToStorage(STORAGE_KEYS.RESERVATIONS, list);

      if (item.roomNumber) {
        const rooms = StorageService.getRooms();
        const r = rooms.find(rm => rm.roomNumber === item.roomNumber);
        if (r && r.status === 'Reserved') {
          r.status = 'Available';
          setToStorage(STORAGE_KEYS.ROOMS, rooms);
        }
      }
    }
  },
  checkInReservation: (id: string, roomNumber?: string): void => {
    const list = StorageService.getReservations();
    const item = list.find(r => r.id === id);
    if (item) {
      item.status = 'Checked In';
      item.checkedInAt = new Date().toISOString();
      if (roomNumber) item.roomNumber = roomNumber;
      setToStorage(STORAGE_KEYS.RESERVATIONS, list);

      if (item.roomNumber) {
        const rooms = StorageService.getRooms();
        const r = rooms.find(rm => rm.roomNumber === item.roomNumber);
        if (r) {
          r.status = 'Occupied';
          setToStorage(STORAGE_KEYS.ROOMS, rooms);
        }
      }
    }
  },
  checkOutReservation: (id: string): void => {
    const list = StorageService.getReservations();
    const item = list.find(r => r.id === id);
    if (item) {
      item.status = 'Checked Out';
      item.checkedOutAt = new Date().toISOString();
      setToStorage(STORAGE_KEYS.RESERVATIONS, list);

      if (item.roomNumber) {
        const rooms = StorageService.getRooms();
        const r = rooms.find(rm => rm.roomNumber === item.roomNumber);
        if (r) {
          r.status = 'Cleaning';
          setToStorage(STORAGE_KEYS.ROOMS, rooms);
        }
      }
    }
  },

  // Table Bookings
  getTableBookings: (): TableBooking[] => getFromStorage(STORAGE_KEYS.TABLE_BOOKINGS, INITIAL_TABLE_BOOKINGS),
  saveTableBooking: (booking: TableBooking): { success: boolean; conflictMessage?: string } => {
    const list = StorageService.getTableBookings();
    
    // Check conflicts: same date, same tableNumber, within 90 mins of timeSlot, not cancelled
    const conflicts = list.filter(tb => {
      if (tb.id === booking.id) return false;
      if (tb.status === 'Cancelled') return false;
      if (tb.date !== booking.date) return false;
      if (tb.tableNumber !== booking.tableNumber) return false;

      // Time compare (e.g. "19:00" vs "19:30")
      const [h1, m1] = tb.timeSlot.split(':').map(Number);
      const [h2, m2] = booking.timeSlot.split(':').map(Number);
      const diffMins = Math.abs((h1 * 60 + m1) - (h2 * 60 + m2));
      return diffMins < 90;
    });

    if (conflicts.length > 0) {
      return {
        success: false,
        conflictMessage: `Conflict detected: ${booking.tableNumber} is already reserved by ${conflicts[0].guestName} at ${conflicts[0].timeSlot} (${conflicts[0].diningArea}).`
      };
    }

    const idx = list.findIndex(tb => tb.id === booking.id);
    if (idx >= 0) list[idx] = booking;
    else list.unshift(booking);
    setToStorage(STORAGE_KEYS.TABLE_BOOKINGS, list);

    // Update guest profile dining visits count if guest exists
    const guests = StorageService.getGuests();
    const guest = guests.find(g => g.email.toLowerCase() === booking.guestEmail.toLowerCase());
    if (guest) {
      guest.totalDiningVisits += 1;
      guest.lastVisit = booking.date;
      setToStorage(STORAGE_KEYS.GUESTS, guests);
    }

    return { success: true };
  },
  updateTableBookingStatus: (id: string, status: TableBooking['status']): void => {
    const list = StorageService.getTableBookings();
    const item = list.find(tb => tb.id === id);
    if (item) {
      item.status = status;
      setToStorage(STORAGE_KEYS.TABLE_BOOKINGS, list);
    }
  },

  // Guests
  getGuests: (): Guest[] => getFromStorage(STORAGE_KEYS.GUESTS, INITIAL_GUESTS),
  saveGuest: (guest: Guest): void => {
    const list = StorageService.getGuests();
    const idx = list.findIndex(g => g.id === guest.id);
    if (idx >= 0) list[idx] = guest;
    else list.unshift(guest);
    setToStorage(STORAGE_KEYS.GUESTS, list);
  },
  deleteGuest: (id: string): void => {
    const list = StorageService.getGuests().filter(g => g.id !== id);
    setToStorage(STORAGE_KEYS.GUESTS, list);
  },

  // Calls
  getCalls: (): CallRecord[] => getFromStorage(STORAGE_KEYS.CALLS, INITIAL_CALLS),
  saveCall: (call: CallRecord): void => {
    const list = StorageService.getCalls();
    const idx = list.findIndex(c => c.id === call.id);
    if (idx >= 0) list[idx] = call;
    else list.unshift(call);
    setToStorage(STORAGE_KEYS.CALLS, list);
  },
  markCallbackCompleted: (callId: string): void => {
    const list = StorageService.getCalls();
    const item = list.find(c => c.id === callId);
    if (item) {
      item.callbackCompleted = true;
      setToStorage(STORAGE_KEYS.CALLS, list);
    }
  },

  // Staff
  getStaff: (): StaffMember[] => getFromStorage(STORAGE_KEYS.STAFF, INITIAL_STAFF),
  saveStaff: (staff: StaffMember): void => {
    const list = StorageService.getStaff();
    const idx = list.findIndex(s => s.id === staff.id);
    if (idx >= 0) list[idx] = staff;
    else list.push(staff);
    setToStorage(STORAGE_KEYS.STAFF, list);
  },
  deleteStaff: (id: string): void => {
    const list = StorageService.getStaff().filter(s => s.id !== id);
    setToStorage(STORAGE_KEYS.STAFF, list);
  },

  // Receptionist config
  getReceptionistConfig: (): ReceptionistSettingsConfig => getFromStorage(STORAGE_KEYS.RECEPTIONIST_CONFIG, INITIAL_RECEPTIONIST_CONFIG),
  saveReceptionistConfig: (cfg: ReceptionistSettingsConfig): void => {
    setToStorage(STORAGE_KEYS.RECEPTIONIST_CONFIG, cfg);
  },

  // Hotel settings
  getHotelSettings: (): HotelSettings => getFromStorage(STORAGE_KEYS.HOTEL_SETTINGS, INITIAL_HOTEL_SETTINGS),
  saveHotelSettings: (settings: HotelSettings): void => {
    setToStorage(STORAGE_KEYS.HOTEL_SETTINGS, settings);
  },

  // Operational metrics
  getOperationalStats: (): OperationalStats => {
    const rooms = StorageService.getRooms();
    const reservations = StorageService.getReservations();
    const tables = StorageService.getTableBookings();
    const calls = StorageService.getCalls();

    const activeStays = reservations.filter(r => r.status === 'Checked In');
    const availableRooms = rooms.filter(r => r.status === 'Available');
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied');
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms.length / rooms.length) * 100) : 0;

    const todayCheckIns = reservations.filter(r => r.checkInDate === TODAY && r.status !== 'Cancelled');
    const todayCheckOuts = reservations.filter(r => r.checkOutDate === TODAY && r.status !== 'Cancelled');
    const todayTables = tables.filter(t => t.date === TODAY && t.status !== 'Cancelled');

    // Calls today
    const todayCalls = calls.filter(c => c.dateTime.startsWith(TODAY));
    const incomingCount = todayCalls.length;
    const answeredCount = todayCalls.filter(c => c.status === 'Answered').length;
    const missedCount = todayCalls.filter(c => c.status === 'Missed').length;
    const transferredCount = todayCalls.filter(c => c.status === 'Transferred').length;

    // Revenue
    const roomRevToday = reservations
      .filter(r => r.checkInDate === TODAY && r.status !== 'Cancelled')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    // Avg dining ticket estimate $95 per guest
    const diningRevToday = todayTables.reduce((sum, t) => sum + (t.partySize * 95), 0);

    const roomRevMonth = reservations
      .filter(r => r.status !== 'Cancelled')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const diningRevMonth = tables
      .filter(t => t.status !== 'Cancelled')
      .reduce((sum, t) => sum + (t.partySize * 95), 0);

    return {
      totalReservationsCount: reservations.length,
      activeStaysCount: activeStays.length,
      availableRoomsCount: availableRooms.length,
      totalRoomsCount: rooms.length,
      occupancyRate,
      todayCheckInsCount: todayCheckIns.length,
      todayCheckOutsCount: todayCheckOuts.length,
      todayTableBookingsCount: todayTables.length,
      todayCallsCount: {
        incoming: incomingCount || 8,
        answered: answeredCount || 6,
        missed: missedCount || 1,
        transferred: transferredCount || 1,
      },
      revenueSummary: {
        roomRevenueToday: roomRevToday,
        diningRevenueToday: diningRevToday,
        totalRevenueToday: roomRevToday + diningRevToday,
        roomRevenueMonth: roomRevMonth,
        diningRevenueMonth: diningRevMonth,
      }
    };
  }
};
