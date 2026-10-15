export type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance' | 'Cleaning';

export type RoomCategory = 
  | 'Superior King'
  | 'Deluxe King'
  | 'Executive Suite'
  | 'Presidential Suite'
  | 'Garden Villa'
  | 'Terrace Penthouse';

export interface Room {
  id: string;
  roomNumber: string;
  category: RoomCategory;
  floor: number;
  capacity: number;
  nightlyRate: number;
  status: RoomStatus;
  amenities: string[];
  bedType: string;
  lastCleaned?: string;
  notes?: string;
}

export type ReservationStatus = 'Confirmed' | 'Pending' | 'Checked In' | 'Checked Out' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Refunded';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Guest' | 'Patron' | 'Staff' | 'Administrator';
  createdAt: string;
}

export interface MumbaiHotel {
  id: string;
  name: string;
  chain: string;
  neighborhood: string;
  zone: 'South Mumbai' | 'Bandra & Juhu Coast' | 'Lower Parel & Worli' | 'BKC Financial District' | 'Airport & North Mumbai';
  address: string;
  pinCode: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  starRating: number;
  tagline: string;
  startingPrice: number;
  featuredTag?: string;
  heroImage: string;
  galleryImages: string[];
  amenities: string[];
  diningVenues: {
    name: string;
    cuisine: string;
    specialty: string;
    timing: string;
  }[];
  roomTypes: {
    id: string;
    name: string;
    category: RoomCategory;
    bedType: string;
    capacity: number;
    sizeSqFt: number;
    basePrice: number;
    taxRate: number;
    features: string[];
    availableCount: number;
    image: string;
  }[];
  distanceHighlights: {
    label: string;
    distance: string;
  }[];
}

export interface HotelReservation {
  id: string;
  bookingCode: string;
  hotelId?: string;
  hotelName?: string;
  guestId: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  roomCategory: RoomCategory;
  roomNumber?: string;
  adults: number;
  children: number;
  totalNights: number;
  nightlyRate: number;
  totalAmount: number;
  mealPlan?: string;
  gstin?: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  source: 'Voice Receptionist' | 'Front Desk' | 'Direct Website' | 'Corporate' | 'Concierge';
  createdAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export type TableBookingStatus = 'Confirmed' | 'Pending' | 'Seated' | 'Completed' | 'Cancelled';
export type DiningArea = 'Indoor Main Dining' | 'Garden Terrace (Outdoor)' | 'Private Wine Cellar' | 'Chef\'s Counter' | 'Skyline Veranda';
export type DiningOccasion = 'Casual Dining' | 'Anniversary' | 'Birthday' | 'Business Dinner' | 'Romantic' | 'Celebration';

export interface TableBooking {
  id: string;
  bookingRef: string;
  hotelId?: string;
  hotelName?: string;
  restaurantName?: string;
  guestId?: string;
  userId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string; // e.g. "19:00"
  partySize: number;
  tableNumber: string;
  diningArea: DiningArea;
  occasion: DiningOccasion;
  dietaryRequirements: string[];
  specialRequests?: string;
  status: TableBookingStatus;
  source: 'Voice Receptionist' | 'Host Desk' | 'Online Reservation' | 'In-House Guest';
  createdAt: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality?: string;
  vipStatus: boolean;
  vipTier?: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  totalStays: number;
  totalDiningVisits: number;
  totalSpend: number;
  lastVisit: string;
  preferences: {
    roomType?: string;
    highFloor?: boolean;
    pillowType?: string;
    diningArea?: string;
    favoriteWineOrBeverage?: string;
    dietaryRestrictions?: string[];
  };
  notes?: string;
  createdAt: string;
}

export type CallPurpose = 'Room Reservation' | 'Table Booking' | 'General Enquiry' | 'Modification' | 'Cancellation' | 'Concierge';
export type CallStatus = 'Answered' | 'Missed' | 'Transferred';

export interface CallRecord {
  id: string;
  callerName: string;
  callerPhone: string;
  dateTime: string;
  durationSeconds: number;
  purpose: CallPurpose;
  status: CallStatus;
  outcome: 'Booked Room' | 'Booked Table' | 'Inquiry Resolved' | 'Transferred to Duty Manager' | 'Callback Requested' | 'Cancelled Booking' | 'No Action';
  agentSummary: string;
  hasRecording: boolean;
  recordingDuration?: string;
  audioUrl?: string;
  transcript?: { speaker: 'Receptionist' | 'Caller'; text: string; time: string }[];
  linkedBookingId?: string;
  callbackCompleted?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Administrator' | 'Manager' | 'Receptionist' | 'Restaurant Staff';
  department: 'Front Office' | 'Food & Beverage' | 'Guest Relations' | 'Executive Management';
  shift: 'Morning (07:00 - 15:30)' | 'Evening (15:00 - 23:30)' | 'Night (23:00 - 07:30)' | 'General (09:00 - 18:00)';
  status: 'Active' | 'On Leave' | 'Inactive';
  lastActive: string;
  avatar?: string;
}

export interface ReceptionistSettingsConfig {
  callHandlingEnabled: boolean;
  hotelName: string;
  hotelAddress: string;
  hotelContactPhone: string;
  hotelContactEmail: string;
  hotelTimezone: string;
  restaurantHours: {
    lunchOpen: string;
    lunchClose: string;
    dinnerOpen: string;
    dinnerClose: string;
    lastSeatingNoticeMinutes: number;
  };
  supportedLanguages: string[];
  primaryLanguage: string;
  greetingMessage: string;
  closingMessage: string;
  faqs: { id: string; question: string; answer: string; category: string }[];
  roomReservationRules: {
    minNoticeHours: number;
    maxAdvanceDays: number;
    cancellationWindowHours: number;
    requireCreditCardGuarantee: boolean;
  };
  tableBookingRules: {
    maxPartySize: number;
    reservationSlotMinutes: number;
    tableHoldTimeMinutes: number;
    depositRequiredPartySize: number;
    depositAmountPerGuest: number;
  };
  confirmationPreferences: {
    sendSms: boolean;
    sendEmail: boolean;
    sendWhatsapp: boolean;
  };
  transferRules: {
    dutyManagerPhone: string;
    frontDeskDirectLine: string;
    conciergeLine: string;
    transferOnUnresolvedLimit: number;
    vipAutoTransfer: boolean;
    escalateUrgentComplaints: boolean;
  };
}

export interface HotelSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  timeFormat: '12-hour' | '24-hour';
  notifications: {
    newRoomBooking: boolean;
    newTableBooking: boolean;
    missedCallAlert: boolean;
    dailyExecutiveSummary: boolean;
    lowInventoryThreshold: number;
  };
  security: {
    sessionTimeoutMinutes: number;
    twoFactorEnforced: boolean;
    auditLogging: boolean;
  };
}

export interface OperationalStats {
  totalReservationsCount: number;
  activeStaysCount: number;
  availableRoomsCount: number;
  totalRoomsCount: number;
  occupancyRate: number;
  todayCheckInsCount: number;
  todayCheckOutsCount: number;
  todayTableBookingsCount: number;
  todayCallsCount: {
    incoming: number;
    answered: number;
    missed: number;
    transferred: number;
  };
  revenueSummary: {
    roomRevenueToday: number;
    diningRevenueToday: number;
    totalRevenueToday: number;
    roomRevenueMonth: number;
    diningRevenueMonth: number;
  };
}
