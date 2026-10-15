/**
 * RACEAI Hotel Reception & Table Booking Platform — REST API Server
 * Compatible with Node.js / Express & future MongoDB integration.
 */

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

app.use(express.json());

// CORS headers for Vite dev server or standalone frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-Memory Database Store (Compatible with future MongoDB collection schemas)
let rooms = [
  { id: 'rm-101', roomNumber: '101', category: 'Superior King', floor: 1, capacity: 2, nightlyRate: 380, status: 'Occupied', bedType: '1 King Bed' },
  { id: 'rm-102', roomNumber: '102', category: 'Superior King', floor: 1, capacity: 2, nightlyRate: 380, status: 'Available', bedType: '1 King Bed' },
  { id: 'rm-201', roomNumber: '201', category: 'Deluxe King', floor: 2, capacity: 2, nightlyRate: 520, status: 'Occupied', bedType: '1 California King' },
  { id: 'rm-301', roomNumber: '301', category: 'Executive Suite', floor: 3, capacity: 3, nightlyRate: 850, status: 'Occupied', bedType: '1 Super King' },
  { id: 'rm-401', roomNumber: '401', category: 'Presidential Suite', floor: 4, capacity: 4, nightlyRate: 1850, status: 'Occupied', bedType: '2 King Master Suites' },
  { id: 'rm-501', roomNumber: '501', category: 'Garden Villa', floor: 1, capacity: 4, nightlyRate: 1450, status: 'Available', bedType: '2 King Pavilions' }
];

let reservations = [
  {
    id: 'res-8801',
    bookingCode: 'GA-2610-8801',
    guestName: 'Sir Arthur Pendelton',
    guestEmail: 'arthur.pendelton@meridianholdings.co.uk',
    guestPhone: '+44 20 7946 0912',
    checkInDate: '2026-10-14',
    checkOutDate: '2026-10-19',
    roomCategory: 'Presidential Suite',
    roomNumber: '401',
    adults: 2,
    children: 0,
    totalNights: 5,
    nightlyRate: 1850,
    totalAmount: 9250,
    status: 'Checked In',
    paymentStatus: 'Paid',
    source: 'Voice Receptionist'
  }
];

let tableBookings = [
  {
    id: 'tbl-401',
    bookingRef: 'TB-1015-01',
    guestName: 'Sir Arthur Pendelton',
    guestPhone: '+44 20 7946 0912',
    guestEmail: 'arthur.pendelton@meridianholdings.co.uk',
    date: '2026-10-15',
    timeSlot: '19:30',
    partySize: 4,
    tableNumber: 'Table 12 (Wine Cellar)',
    diningArea: 'Private Wine Cellar',
    occasion: 'Business Dinner',
    status: 'Confirmed'
  }
];

// Health Check & System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'RACEAI Backend Service',
    databaseDriver: process.env.MONGODB_URI ? 'MongoDB (Configured)' : 'In-Memory Hospitality Store',
    timestamp: new Date().toISOString()
  });
});

// Rooms Endpoints
app.get('/api/rooms', (req, res) => {
  res.json({ success: true, count: rooms.length, data: rooms });
});

app.put('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const idx = rooms.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });
  rooms[idx] = { ...rooms[idx], ...req.body };
  res.json({ success: true, data: rooms[idx] });
});

// Hotel Reservations Endpoints
app.get('/api/reservations', (req, res) => {
  const { status, search } = req.query;
  let filtered = [...reservations];
  if (status) filtered = filtered.filter(r => r.status.toLowerCase() === String(status).toLowerCase());
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(r => 
      r.guestName.toLowerCase().includes(q) || 
      r.bookingCode.toLowerCase().includes(q) ||
      r.guestEmail.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, count: filtered.length, data: filtered });
});

app.post('/api/reservations', (req, res) => {
  const newRes = {
    id: 'res-' + Math.floor(1000 + Math.random() * 9000),
    bookingCode: 'GA-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    ...req.body
  };
  reservations.unshift(newRes);
  res.status(201).json({ success: true, data: newRes });
});

app.put('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const idx = reservations.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Reservation not found' });
  reservations[idx] = { ...reservations[idx], ...req.body };
  res.json({ success: true, data: reservations[idx] });
});

app.post('/api/reservations/:id/checkin', (req, res) => {
  const { id } = req.params;
  const item = reservations.find(r => r.id === id);
  if (!item) return res.status(404).json({ error: 'Reservation not found' });
  item.status = 'Checked In';
  item.checkedInAt = new Date().toISOString();
  if (req.body.roomNumber) item.roomNumber = req.body.roomNumber;
  res.json({ success: true, data: item });
});

app.post('/api/reservations/:id/checkout', (req, res) => {
  const { id } = req.params;
  const item = reservations.find(r => r.id === id);
  if (!item) return res.status(404).json({ error: 'Reservation not found' });
  item.status = 'Checked Out';
  item.checkedOutAt = new Date().toISOString();
  res.json({ success: true, data: item });
});

// Table Bookings Endpoints
app.get('/api/table-bookings', (req, res) => {
  const { date } = req.query;
  let filtered = [...tableBookings];
  if (date) filtered = filtered.filter(t => t.date === date);
  res.json({ success: true, count: filtered.length, data: filtered });
});

app.post('/api/table-bookings', (req, res) => {
  const { date, timeSlot, tableNumber } = req.body;
  // Conflict verification
  const conflict = tableBookings.find(t => 
    t.date === date && 
    t.tableNumber === tableNumber && 
    t.timeSlot === timeSlot && 
    t.status !== 'Cancelled'
  );
  if (conflict) {
    return res.status(409).json({ 
      error: 'Conflict detected', 
      message: `${tableNumber} is already reserved at ${timeSlot} on ${date}.` 
    });
  }

  const newBooking = {
    id: 'tbl-' + Math.floor(100 + Math.random() * 900),
    bookingRef: 'TB-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    ...req.body
  };
  tableBookings.unshift(newBooking);
  res.status(201).json({ success: true, data: newBooking });
});

// AI Voice Assistant Receptionist Endpoint
app.post('/api/ai/voice-assistant', async (req, res) => {
  const { prompt, history, context } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      success: true,
      text: "Welcome to The Grand Azure Hotel & Spa. I am your AI Booking Receptionist. How may I assist your room suite or dining reservation today?",
      isFallback: true
    });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `You are Aria, the luxury voice receptionist and booking assistant for The Grand Azure Hotel & Spa and Le Miroir Restaurant.
You speak with professional, warm, concise luxury hospitality etiquette.
You can help guests with:
1. Room reservations: Superior King ($380), Deluxe King ($520), Executive Suite ($850), Presidential Suite ($1850), Garden Villa ($1450).
2. Restaurant table reservations: Le Miroir has Indoor Main Dining, Garden Terrace (Outdoor), Private Wine Cellar, Chef's Counter, Skyline Veranda. Hours: Lunch 12:00-15:00, Dinner 18:00-23:00.
3. Hotel information: Check-in 15:00, Check-out 12:00 noon, Smart-casual/formal dress code at Le Miroir, 24-hour valet parking ($45), Azure Spa open 06:30-21:30, pet-friendly Garden Villas.
Always keep responses under 2-3 spoken sentences so they sound natural when read aloud over phone.
When a user wants to book, confirm the details (dates, guest count, room or table preference) and invite them to confirm.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      success: true,
      text: response.text || "Thank you for contacting The Grand Azure. How may I assist your booking today?",
    });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.json({
      success: true,
      text: "Thank you for calling The Grand Azure Hotel & Spa. I would be delighted to assist you with booking a room suite or reserving a table at Le Miroir.",
      isFallback: true
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[RACEAI Backend Service] running on port ${PORT}`);
  });
}

export default app;
