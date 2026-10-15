import {
  HotelReservation,
  TableBooking,
  Guest,
  Room,
  CallRecord,
  StaffMember,
  ReceptionistSettingsConfig,
  HotelSettings,
} from '../types';

// Today's date reference helper: 2026-10-15
export const TODAY = '2026-10-15';
export const YESTERDAY = '2026-10-14';
export const TOMORROW = '2026-10-16';

export const INITIAL_ROOMS: Room[] = [
  { id: 'rm-101', roomNumber: '101', category: 'Superior King', floor: 1, capacity: 2, nightlyRate: 26500, status: 'Occupied', bedType: '1 King Bed', amenities: ['Gateway View', 'Italian Marble Bath', 'Heritage Teak Furnishing'] },
  { id: 'rm-102', roomNumber: '102', category: 'Superior King', floor: 1, capacity: 2, nightlyRate: 26500, status: 'Available', bedType: '1 King Bed', amenities: ['Courtyard View', 'Rain Shower', 'Work Desk'] },
  { id: 'rm-103', roomNumber: '103', category: 'Superior King', floor: 1, capacity: 2, nightlyRate: 26500, status: 'Cleaning', bedType: '1 King Bed', amenities: ['Courtyard View', 'Soaking Tub'] },
  { id: 'rm-104', roomNumber: '104', category: 'Superior King', floor: 1, capacity: 2, nightlyRate: 26500, status: 'Reserved', bedType: '1 King Bed', amenities: ['Courtyard View', 'Rain Shower'] },
  { id: 'rm-201', roomNumber: '201', category: 'Deluxe King', floor: 2, capacity: 2, nightlyRate: 38000, status: 'Occupied', bedType: '1 California King', amenities: ['Arabian Sea Vista', 'Private Balcony', 'Marble Bath'] },
  { id: 'rm-202', roomNumber: '202', category: 'Deluxe King', floor: 2, capacity: 2, nightlyRate: 38000, status: 'Available', bedType: '1 California King', amenities: ['Arabian Sea Vista', 'Deep Soaking Tub', 'Pillow Menu'] },
  { id: 'rm-203', roomNumber: '203', category: 'Deluxe King', floor: 2, capacity: 2, nightlyRate: 38000, status: 'Occupied', bedType: '1 California King', amenities: ['Arabian Sea Vista', 'Private Balcony', 'Nespresso Bar'] },
  { id: 'rm-204', roomNumber: '204', category: 'Deluxe King', floor: 2, capacity: 2, nightlyRate: 38000, status: 'Reserved', bedType: '1 California King', amenities: ['Heritage Garden View', 'Terrace'] },
  { id: 'rm-301', roomNumber: '301', category: 'Executive Suite', floor: 3, capacity: 3, nightlyRate: 72000, status: 'Occupied', bedType: '1 Super King + Daybed', amenities: ['Gateway & Sea Panorama', 'Taj Club Lounge Access', '24/7 Butler Service', 'Walk-in Wardrobe'] },
  { id: 'rm-302', roomNumber: '302', category: 'Executive Suite', floor: 3, capacity: 3, nightlyRate: 72000, status: 'Available', bedType: '1 Super King + Daybed', amenities: ['Harbour View', 'Private Dining Nook', 'Freestanding Bath'] },
  { id: 'rm-303', roomNumber: '303', category: 'Executive Suite', floor: 3, capacity: 3, nightlyRate: 72000, status: 'Reserved', bedType: '1 Super King + Daybed', amenities: ['Harbour View', 'Curated Wine Cabinet'] },
  { id: 'rm-401', roomNumber: '401', category: 'Presidential Suite', floor: 4, capacity: 4, nightlyRate: 195000, status: 'Occupied', bedType: '2 King Master Suites', amenities: ['Private Elevator Access', '360° Arabian Sea View', 'Mercedes-Maybach Chauffeur', 'Full Kitchen & Dining Salon'] },
  { id: 'rm-402', roomNumber: '402', category: 'Presidential Suite', floor: 4, capacity: 4, nightlyRate: 195000, status: 'Reserved', bedType: '2 King Master Suites', amenities: ['Skyline & Harbour Panorama', 'Private Sauna', 'Steinway Piano'] },
  { id: 'rm-501', roomNumber: '501', category: 'Garden Villa', floor: 1, capacity: 4, nightlyRate: 95000, status: 'Available', bedType: '2 King Pavilions', amenities: ['Private Plunge Pool', 'Walled Landscaped Garden', 'Outdoor Shower'] },
  { id: 'rm-502', roomNumber: '502', category: 'Garden Villa', floor: 1, capacity: 4, nightlyRate: 95000, status: 'Occupied', bedType: '2 King Pavilions', amenities: ['Private Plunge Pool', 'Sun Cabana', 'Private Butler'] },
  { id: 'rm-503', roomNumber: '503', category: 'Garden Villa', floor: 1, capacity: 4, nightlyRate: 95000, status: 'Maintenance', bedType: '2 King Pavilions', amenities: ['Plunge Pool', 'Patio'], notes: 'Scheduled pool filtration maintenance until Oct 17' },
  { id: 'rm-601', roomNumber: '601', category: 'Terrace Penthouse', floor: 5, capacity: 4, nightlyRate: 240000, status: 'Available', bedType: '2 Grand Kings', amenities: ['Private Rooftop Deck', 'Jacuzzi', 'Dedicated Sommelier', 'Helipad Access'] }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'gst-101',
    name: 'Rajesh & Sangeeta Mehta',
    email: 'rajesh.mehta@bharatenterprises.in',
    phone: '+91 98200 44120',
    nationality: 'India',
    vipStatus: true,
    vipTier: 'Diamond',
    totalStays: 16,
    totalDiningVisits: 28,
    totalSpend: 1420000,
    lastVisit: '2026-10-14',
    preferences: {
      roomType: 'Presidential Suite',
      highFloor: true,
      pillowType: 'Goose Down Firm',
      diningArea: 'Wasabi by Morimoto',
      favoriteWineOrBeverage: 'Darjeeling First Flush tea, Sparkling San Pellegrino',
      dietaryRestrictions: ['Jain Vegetarian Options']
    },
    notes: 'Chairman of Bharat Group. Prefers discreet check-in via Private Taj Club salon. Never disturb before 08:30 AM.',
    createdAt: '2023-04-12'
  },
  {
    id: 'gst-102',
    name: 'Ananya Singhania',
    email: 'ananya@singhaniaventures.com',
    phone: '+91 98110 55902',
    nationality: 'India',
    vipStatus: true,
    vipTier: 'Platinum',
    totalStays: 9,
    totalDiningVisits: 18,
    totalSpend: 780000,
    lastVisit: '2026-10-15',
    preferences: {
      roomType: 'Executive Suite',
      highFloor: true,
      diningArea: 'Shamiana',
      favoriteWineOrBeverage: 'Coconut water fresh, Masala Chai with ginger',
      dietaryRestrictions: ['Gluten-Free']
    },
    notes: 'Requires quiet sea-facing corner suite with dual monitor workstation.',
    createdAt: '2024-01-20'
  },
  {
    id: 'gst-103',
    name: 'Vikramaditya & Radhika Birla',
    email: 'vikram.birla@adityaholdings.com',
    phone: '+91 98201 88344',
    nationality: 'India',
    vipStatus: true,
    vipTier: 'Diamond',
    totalStays: 12,
    totalDiningVisits: 22,
    totalSpend: 1120000,
    lastVisit: '2026-09-28',
    preferences: {
      roomType: 'Deluxe King',
      highFloor: true,
      pillowType: 'Hypoallergenic Silk',
      diningArea: 'Sea Lounge (High Tea)',
      favoriteWineOrBeverage: 'Vintage Dom Pérignon upon arrival'
    },
    notes: 'Celebrating wedding anniversary. Chilled floral arrangement in suite on arrival.',
    createdAt: '2024-06-15'
  },
  {
    id: 'gst-104',
    name: 'Dr. Sunita Rao',
    email: 'dr.sunita@apollohealth.org',
    phone: '+91 98450 12890',
    nationality: 'India',
    vipStatus: false,
    vipTier: 'Silver',
    totalStays: 4,
    totalDiningVisits: 6,
    totalSpend: 198000,
    lastVisit: '2026-08-11',
    preferences: {
      roomType: 'Superior King',
      favoriteWineOrBeverage: 'Green tea with honey, fresh lime soda'
    },
    notes: 'Senior medical director visiting Bombay Hospital conferences. Prefers late check-out.',
    createdAt: '2024-09-02'
  },
  {
    id: 'gst-105',
    name: 'Sir Arthur Pendelton',
    email: 'arthur.pendelton@meridianholdings.co.uk',
    phone: '+44 20 7946 0912',
    nationality: 'United Kingdom',
    vipStatus: true,
    vipTier: 'Diamond',
    totalStays: 8,
    totalDiningVisits: 14,
    totalSpend: 840000,
    lastVisit: '2026-10-15',
    preferences: {
      roomType: 'Deluxe King',
      diningArea: 'Wasabi by Morimoto',
      favoriteWineOrBeverage: 'Single malt scotch, Earl Grey tea',
      dietaryRestrictions: ['Shellfish Allergy']
    },
    notes: 'Regular UK business traveler. Airport pick-up from BOM Terminal 2 pre-arranged.',
    createdAt: '2024-03-10'
  }
];

export const INITIAL_RESERVATIONS: HotelReservation[] = [
  {
    id: 'res-8801',
    bookingCode: 'MUM-2610-8801',
    hotelId: 'taj-mahal-palace',
    hotelName: 'The Taj Mahal Palace, Mumbai',
    guestId: 'gst-101',
    guestName: 'Rajesh & Sangeeta Mehta',
    guestEmail: 'rajesh.mehta@bharatenterprises.in',
    guestPhone: '+91 98200 44120',
    checkInDate: '2026-10-14',
    checkOutDate: '2026-10-19',
    roomCategory: 'Presidential Suite',
    roomNumber: '401',
    adults: 2,
    children: 0,
    totalNights: 5,
    nightlyRate: 195000,
    totalAmount: 975000,
    status: 'Checked In',
    paymentStatus: 'Paid',
    specialRequests: 'Discreet suite access, fresh Mogra flowers in salon at 17:00, Economic Times daily.',
    source: 'Voice Receptionist',
    createdAt: '2026-10-02T10:14:00Z',
    checkedInAt: '2026-10-14T14:45:00Z'
  },
  {
    id: 'res-8802',
    bookingCode: 'MUM-2610-8802',
    hotelId: 'taj-mahal-palace',
    hotelName: 'The Taj Mahal Palace, Mumbai',
    guestId: 'gst-102',
    guestName: 'Ananya Singhania',
    guestEmail: 'ananya@singhaniaventures.com',
    guestPhone: '+91 98110 55902',
    checkInDate: '2026-10-15',
    checkOutDate: '2026-10-18',
    roomCategory: 'Executive Suite',
    roomNumber: '301',
    adults: 1,
    children: 0,
    totalNights: 3,
    nightlyRate: 72000,
    totalAmount: 216000,
    status: 'Checked In',
    paymentStatus: 'Paid',
    specialRequests: 'High speed fiber dock, quiet suite overlooking Gateway of India.',
    source: 'Direct Website',
    createdAt: '2026-10-08T16:20:00Z',
    checkedInAt: '2026-10-15T13:10:00Z'
  },
  {
    id: 'res-8803',
    bookingCode: 'MUM-2610-8803',
    hotelId: 'taj-mahal-palace',
    hotelName: 'The Taj Mahal Palace, Mumbai',
    guestId: 'gst-105',
    guestName: 'Sir Arthur Pendelton',
    guestEmail: 'arthur.pendelton@meridianholdings.co.uk',
    guestPhone: '+44 20 7946 0912',
    checkInDate: '2026-10-15',
    checkOutDate: '2026-10-17',
    roomCategory: 'Deluxe King',
    roomNumber: '201',
    adults: 2,
    children: 0,
    totalNights: 2,
    nightlyRate: 38000,
    totalAmount: 76000,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'Arriving at 17:30 from Heathrow via BOM T2. Airport transfer booked.',
    source: 'Voice Receptionist',
    createdAt: '2026-10-10T11:00:00Z'
  },
  {
    id: 'res-8804',
    bookingCode: 'MUM-2610-8804',
    hotelId: 'oberoi-mumbai',
    hotelName: 'The Oberoi, Mumbai',
    guestId: 'gst-103',
    guestName: 'Vikramaditya Birla',
    guestEmail: 'vikram.birla@adityaholdings.com',
    guestPhone: '+91 98201 88344',
    checkInDate: '2026-10-16',
    checkOutDate: '2026-10-19',
    roomCategory: 'Deluxe King',
    adults: 2,
    children: 0,
    totalNights: 3,
    nightlyRate: 32000,
    totalAmount: 96000,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'Anniversary stay. High floor Marine Drive sunset view requested.',
    source: 'Direct Website',
    createdAt: '2026-10-11T14:30:00Z'
  },
  {
    id: 'res-8805',
    bookingCode: 'MUM-2610-8805',
    hotelId: 'st-regis-mumbai',
    hotelName: 'The St. Regis Mumbai',
    guestId: 'gst-104',
    guestName: 'Dr. Sunita Rao',
    guestEmail: 'dr.sunita@apollohealth.org',
    guestPhone: '+91 98450 12890',
    checkInDate: '2026-10-16',
    checkOutDate: '2026-10-18',
    roomCategory: 'Superior King',
    adults: 1,
    children: 0,
    totalNights: 2,
    nightlyRate: 19500,
    totalAmount: 39000,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'Non-smoking room. Quiet floor for medical writing.',
    source: 'Corporate',
    createdAt: '2026-10-12T09:15:00Z'
  }
];

export const INITIAL_TABLE_BOOKINGS: TableBooking[] = [
  {
    id: 'tbl-401',
    bookingRef: 'TB-1015-01',
    hotelId: 'taj-mahal-palace',
    hotelName: 'The Taj Mahal Palace, Mumbai',
    restaurantName: 'Wasabi by Morimoto',
    guestName: 'Rajesh & Sangeeta Mehta',
    guestPhone: '+91 98200 44120',
    guestEmail: 'rajesh.mehta@bharatenterprises.in',
    date: TODAY,
    timeSlot: '19:30',
    partySize: 4,
    tableNumber: 'Table 8 (Morimoto Chef Counter)',
    diningArea: 'Indoor Main Dining',
    occasion: 'Business Dinner',
    dietaryRequirements: ['Jain Vegetarian Options'],
    specialRequests: 'Chef tasting menu for 4. Quiet corner table.',
    status: 'Confirmed',
    source: 'Voice Receptionist',
    createdAt: '2026-10-15T14:15:00Z'
  },
  {
    id: 'tbl-402',
    bookingRef: 'TB-1015-02',
    hotelId: 'taj-mahal-palace',
    hotelName: 'The Taj Mahal Palace, Mumbai',
    restaurantName: 'Shamiana',
    guestName: 'Ananya Singhania',
    guestPhone: '+91 98110 55902',
    guestEmail: 'ananya@singhaniaventures.com',
    date: TODAY,
    timeSlot: '20:00',
    partySize: 2,
    tableNumber: 'Table 4 (Courtyard View)',
    diningArea: 'Indoor Main Dining',
    occasion: 'Casual Dining',
    dietaryRequirements: ['Gluten-Free'],
    specialRequests: 'Courtyard window table.',
    status: 'Confirmed',
    source: 'Online Reservation',
    createdAt: '2026-10-15T11:30:00Z'
  },
  {
    id: 'tbl-403',
    bookingRef: 'TB-1015-03',
    hotelId: 'taj-mahal-palace',
    hotelName: 'The Taj Mahal Palace, Mumbai',
    restaurantName: 'Golden Dragon',
    guestName: 'Sir Arthur Pendelton',
    guestPhone: '+44 20 7946 0912',
    guestEmail: 'arthur.pendelton@meridianholdings.co.uk',
    date: TODAY,
    timeSlot: '20:30',
    partySize: 3,
    tableNumber: 'Table 12 (Salon)',
    diningArea: 'Indoor Main Dining',
    occasion: 'Celebration',
    dietaryRequirements: ['Shellfish Allergy'],
    specialRequests: 'Peking Duck pre-ordered. Reminder of shellfish allergy.',
    status: 'Confirmed',
    source: 'Voice Receptionist',
    createdAt: '2026-10-15T09:40:00Z'
  },
  {
    id: 'tbl-404',
    bookingRef: 'TB-1015-04',
    hotelId: 'taj-mahal-palace',
    hotelName: 'The Taj Mahal Palace, Mumbai',
    restaurantName: 'Sea Lounge',
    guestName: 'Kavita Chidambaram',
    guestPhone: '+91 98202 77119',
    guestEmail: 'kavita@orchidcapital.in',
    date: TODAY,
    timeSlot: '16:00',
    partySize: 4,
    tableNumber: 'Table 2 (Sea View)',
    diningArea: 'Indoor Main Dining',
    occasion: 'Casual Dining',
    dietaryRequirements: ['Vegetarian'],
    specialRequests: 'Traditional high tea service with Arabian Sea views.',
    status: 'Completed',
    source: 'Voice Receptionist',
    createdAt: '2026-10-14T10:00:00Z'
  }
];

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call-901',
    callerName: 'Rajesh Mehta',
    callerPhone: '+91 98200 44120',
    dateTime: '2026-10-15 14:15',
    durationSeconds: 142,
    purpose: 'Table Booking',
    status: 'Answered',
    outcome: 'Booked Table',
    agentSummary: 'Caller confirmed dinner reservation for 4 guests tonight at 19:30 in Wasabi by Morimoto. Requested Jain options.',
    hasRecording: true,
    recordingDuration: '2m 22s',
    audioUrl: '/demo-audio/call-901.mp3',
    transcript: [
      { speaker: 'Receptionist', text: 'Namaste and good afternoon. You have reached The Taj Mahal Palace, Mumbai. How may I assist your stay or dining today?', time: '0:02' },
      { speaker: 'Caller', text: 'Namaste. This is Rajesh Mehta staying in Suite 401. I would like to reserve Wasabi by Morimoto for four guests this evening at 19:30.', time: '0:14' },
      { speaker: 'Receptionist', text: 'Certainly, Mr. Mehta. It is a pleasure. I have reserved Table 8 at the Chef Counter for four guests at 19:30. Would you like our kitchen to prepare our signature vegetarian and Jain omakase selections?', time: '0:35' },
      { speaker: 'Caller', text: 'Yes, please ensure Jain options are ready. Thank you.', time: '0:48' },
      { speaker: 'Receptionist', text: 'Understood, Mr. Mehta. Your table at Wasabi is confirmed. We look forward to welcoming you.', time: '1:08' },
      { speaker: 'Caller', text: 'Thank you very much. Good day.', time: '1:18' }
    ],
    linkedBookingId: 'tbl-401'
  },
  {
    id: 'call-902',
    callerName: 'Dr. Sunita Rao',
    callerPhone: '+91 98450 12890',
    dateTime: '2026-10-15 11:20',
    durationSeconds: 215,
    purpose: 'Room Reservation',
    status: 'Answered',
    outcome: 'Booked Room',
    agentSummary: 'Inquired about Heritage Superior Room for Oct 16-18 (2 nights) for medical conference. Confirmed booking at ₹19,500/night.',
    hasRecording: true,
    recordingDuration: '3m 35s',
    transcript: [
      { speaker: 'Receptionist', text: 'Namaste! Welcome to The Taj Mahal Palace, Mumbai reservations. How may I assist your stay?', time: '0:03' },
      { speaker: 'Caller', text: 'Hello, I am looking for a quiet room for two nights starting October 16th for a hospital seminar.', time: '0:18' },
      { speaker: 'Receptionist', text: 'We have our Superior Heritage Room available at ₹26,500 per night, including high-speed fiber WiFi and complimentary breakfast at Shamiana.', time: '0:42' },
      { speaker: 'Caller', text: 'That sounds perfect. Please book under Dr. Sunita Rao.', time: '1:05' }
    ],
    linkedBookingId: 'res-8805'
  },
  {
    id: 'call-903',
    callerName: 'Vikramaditya Birla',
    callerPhone: '+91 98201 88344',
    dateTime: '2026-10-15 10:45',
    durationSeconds: 88,
    purpose: 'Modification',
    status: 'Answered',
    outcome: 'Inquiry Resolved',
    agentSummary: 'Guest confirmed arrival time update to 16:30 for anniversary check-in. Taj luxury chauffeur dispatch noted from Marine Drive.',
    hasRecording: true,
    recordingDuration: '1m 28s'
  },
  {
    id: 'call-904',
    callerName: 'Unknown Caller (Mumbai)',
    callerPhone: '+91 22 2289 1200',
    dateTime: '2026-10-15 09:12',
    durationSeconds: 0,
    purpose: 'General Enquiry',
    status: 'Missed',
    outcome: 'Callback Requested',
    agentSummary: 'Caller disconnected after 4 rings during morning checkout rush. Flagged for priority callback.',
    hasRecording: false,
    callbackCompleted: false
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-01',
    name: 'Aditi Sharma',
    email: 'aditi.sharma@tajhotels.com',
    phone: '+91 98200 11001',
    role: 'Administrator',
    department: 'Executive Management',
    shift: 'General (09:00 - 18:00)',
    status: 'Active',
    lastActive: '2 mins ago'
  },
  {
    id: 'stf-02',
    name: 'Rohan Varma',
    email: 'rohan.varma@tajhotels.com',
    phone: '+91 98200 11002',
    role: 'Manager',
    department: 'Front Office',
    shift: 'Morning (07:00 - 15:30)',
    status: 'Active',
    lastActive: '10 mins ago'
  },
  {
    id: 'stf-03',
    name: 'Priya Nair',
    email: 'priya.nair@tajhotels.com',
    phone: '+91 98200 11003',
    role: 'Receptionist',
    department: 'Guest Relations',
    shift: 'Evening (15:00 - 23:30)',
    status: 'Active',
    lastActive: '1 hour ago'
  },
  {
    id: 'stf-04',
    name: 'Chef Hemant Oberoi',
    email: 'h.oberoi@tajhotels.com',
    phone: '+91 98200 11004',
    role: 'Restaurant Staff',
    department: 'Food & Beverage',
    shift: 'Evening (15:00 - 23:30)',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'stf-05',
    name: 'Arjun Kulkarni',
    email: 'arjun.k@tajhotels.com',
    phone: '+91 98200 11005',
    role: 'Receptionist',
    department: 'Front Office',
    shift: 'Morning (07:00 - 15:30)',
    status: 'Active',
    lastActive: '25 mins ago'
  }
];

export const INITIAL_RECEPTIONIST_CONFIG: ReceptionistSettingsConfig = {
  callHandlingEnabled: true,
  hotelName: 'The Taj Mahal Palace, Mumbai',
  hotelAddress: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India',
  hotelContactPhone: '+91 22 6665 3366',
  hotelContactEmail: 'reservations.tajmumbai@ihcltata.com',
  hotelTimezone: 'Asia/Kolkata (IST)',
  restaurantHours: {
    lunchOpen: '12:30',
    lunchClose: '15:00',
    dinnerOpen: '19:00',
    dinnerClose: '23:45',
    lastSeatingNoticeMinutes: 45
  },
  supportedLanguages: ['English', 'Hindi', 'Marathi', 'Gujarati', 'French'],
  primaryLanguage: 'English',
  greetingMessage: 'Namaste and welcome to The Taj Mahal Palace, Mumbai. I can assist you with hotel room bookings, dining reservations at Wasabi by Morimoto, Shamiana, or Golden Dragon, or general guest enquiries across Mumbai. How may I assist you today?',
  closingMessage: 'Dhanyawad and thank you for choosing The Taj Mahal Palace, Mumbai. Our hospitality team looks forward to welcoming you.',
  faqs: [
    {
      id: 'faq-1',
      category: 'Check-In & Check-Out',
      question: 'What are your standard check-in and check-out times?',
      answer: 'Standard check-in begins at 14:00 (2:00 PM). Check-out is at 12:00 noon. Early check-in and late check-out can be requested subject to suite availability.'
    },
    {
      id: 'faq-2',
      category: 'Dining & Dress Code',
      question: 'What is the dress code for dining at Wasabi by Morimoto and Golden Dragon?',
      answer: 'Wasabi by Morimoto and Golden Dragon observe an elegant smart-casual dress code. Collared shirts or formal Indian ethnic wear are encouraged; athletic shorts and flip-flops are not permitted.'
    },
    {
      id: 'faq-3',
      category: 'Airport Transfers & Location',
      question: 'Do you provide airport transfers from Chhatrapati Shivaji Maharaj Airport (BOM)?',
      answer: 'Yes, 24-hour secured airport transfers in our luxury fleet (Mercedes-Benz E/S Class & BMW 7 Series) are available. Distance from Terminal 2 is approximately 24 km (45 mins via the Mumbai Coastal Road).'
    },
    {
      id: 'faq-4',
      category: 'Spa & Wellness',
      question: 'What are the operating hours of Jiva Spa and the pool?',
      answer: 'Our award-winning Jiva Spa is open daily from 07:00 to 22:00. The outdoor swimming pool overlooking the heritage courtyard is open from 06:30 to 20:00.'
    },
    {
      id: 'faq-5',
      category: 'Gateway of India Views',
      question: 'Which rooms offer views of the Gateway of India and the Arabian Sea?',
      answer: 'Our Palace Sea View Rooms, Taj Club Luxury Suites, and the Tata Presidential Suite in the Heritage Palace Wing offer unobstructed views of the Gateway of India and Mumbai harbour.'
    }
  ],
  roomReservationRules: {
    minNoticeHours: 2,
    maxAdvanceDays: 365,
    cancellationWindowHours: 24,
    requireCreditCardGuarantee: true
  },
  tableBookingRules: {
    maxPartySize: 12,
    reservationSlotMinutes: 120,
    tableHoldTimeMinutes: 15,
    depositRequiredPartySize: 6,
    depositAmountPerGuest: 1000
  },
  confirmationPreferences: {
    sendSms: true,
    sendEmail: true,
    sendWhatsapp: true
  },
  transferRules: {
    dutyManagerPhone: '+91 22 6665 3100',
    frontDeskDirectLine: '+91 22 6665 3366',
    conciergeLine: '+91 22 6665 3200',
    transferOnUnresolvedLimit: 2,
    vipAutoTransfer: true,
    escalateUrgentComplaints: true
  }
};

export const INITIAL_HOTEL_SETTINGS: HotelSettings = {
  name: 'The Taj Mahal Palace, Mumbai',
  tagline: 'Iconic Heritage Luxury overlooking the Gateway of India & Arabian Sea',
  address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India',
  phone: '+91 22 6665 3366',
  email: 'reservations.tajmumbai@ihcltata.com',
  website: 'https://tajhotels.com/taj-mahal-palace-mumbai',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata (IST)',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24-hour',
  notifications: {
    newRoomBooking: true,
    newTableBooking: true,
    missedCallAlert: true,
    dailyExecutiveSummary: true,
    lowInventoryThreshold: 3
  },
  security: {
    sessionTimeoutMinutes: 60,
    twoFactorEnforced: true,
    auditLogging: true
  }
};
