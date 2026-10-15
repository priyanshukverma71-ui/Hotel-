import { ApiService } from './api';
import { StorageService } from './storage';
import { CallRecord, RoomCategory, DiningArea, DiningOccasion } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTaken?: {
    type: 'room_booked' | 'table_booked' | 'inquiry_answered';
    summary: string;
    refCode?: string;
  };
}

export const AiVoiceReceptionistService = {
  // Speech synthesis
  speak: (text: string, onEnd?: () => void): SpeechSynthesisUtterance | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1.02;
    utterance.lang = 'en-IN';

    const voices = window.speechSynthesis.getVoices();
    // Prefer polite natural English/Indian voice
    const politeVoice = voices.find(
      (v) =>
        (v.lang.includes('IN') || v.lang.startsWith('en')) &&
        (v.name.includes('India') ||
          v.name.includes('Natural') ||
          v.name.includes('Heera') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Victoria'))
    );
    if (politeVoice) utterance.voice = politeVoice;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  stopSpeaking: () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  // Process user message through Gemini backend with local intelligent hospitality fallback
  processInput: async (
    userText: string,
    history: ChatMessage[],
    activeUser?: { name: string; email: string; phone: string; id?: string } | null
  ): Promise<{
    reply: string;
    action?: ChatMessage['actionTaken'];
  }> => {
    const textLower = userText.toLowerCase();

    // 1. Detect Room Booking Intent
    if (
      (textLower.includes('book') || textLower.includes('reserve') || textLower.includes('room')) &&
      (textLower.includes('room') || textLower.includes('suite') || textLower.includes('stay') || textLower.includes('night'))
    ) {
      const guestName = activeUser?.name || 'Guest Caller';
      const guestEmail = activeUser?.email || 'guest@tajhotels.com';
      const guestPhone = activeUser?.phone || '+91 98200 12345';

      let category: RoomCategory = 'Deluxe King';
      if (textLower.includes('superior')) category = 'Superior King';
      if (textLower.includes('executive') || textLower.includes('club')) category = 'Executive Suite';
      if (textLower.includes('presidential') || textLower.includes('tata')) category = 'Presidential Suite';
      if (textLower.includes('garden') || textLower.includes('villa')) category = 'Garden Villa';
      if (textLower.includes('penthouse')) category = 'Terrace Penthouse';

      let adults = 2;
      if (textLower.includes('1 adult') || textLower.includes('one person') || textLower.includes('just me') || textLower.includes('single')) adults = 1;
      if (textLower.includes('3 adult') || textLower.includes('three people')) adults = 3;
      if (textLower.includes('4 adult') || textLower.includes('four people')) adults = 4;

      const checkInDate = '2026-10-17';
      const checkOutDate = '2026-10-20';
      const totalNights = 3;
      const nightlyRates: Record<RoomCategory, number> = {
        'Superior King': 26500,
        'Deluxe King': 38000,
        'Executive Suite': 72000,
        'Presidential Suite': 195000,
        'Garden Villa': 95000,
        'Terrace Penthouse': 240000,
      };
      const nightlyRate = nightlyRates[category] || 38000;
      const totalAmount = totalNights * nightlyRate;

      // Create reservation
      const created = await ApiService.createReservation({
        hotelId: 'taj-mahal-palace',
        hotelName: 'The Taj Mahal Palace, Mumbai',
        guestId: activeUser?.id || 'gst-' + Date.now(),
        userId: activeUser?.id,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        roomCategory: category,
        adults,
        children: 0,
        totalNights,
        nightlyRate,
        totalAmount,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        specialRequests: `Booked via AI Voice Receptionist. Guest request: "${userText}"`,
        source: 'Voice Receptionist',
      });

      const reply = `Namaste ${guestName}. Delighted to assist you. I have confirmed your reservation for a ${category} at The Taj Mahal Palace, Mumbai from October 17th to 20th for ${adults} guests under booking reference ${created.bookingCode}. Your stay is confirmed at ₹${nightlyRate.toLocaleString('en-IN')} per night.`;

      return {
        reply,
        action: {
          type: 'room_booked',
          summary: `${category} reserved for ${guestName} (Oct 17-20)`,
          refCode: created.bookingCode,
        },
      };
    }

    // 2. Detect Restaurant Dining Table Booking Intent
    if (
      textLower.includes('table') ||
      textLower.includes('dinner') ||
      textLower.includes('lunch') ||
      textLower.includes('dining') ||
      textLower.includes('wasabi') ||
      textLower.includes('shamiana') ||
      textLower.includes('golden dragon') ||
      textLower.includes('masala kraft') ||
      textLower.includes('sea lounge') ||
      textLower.includes('restaurant')
    ) {
      const guestName = activeUser?.name || 'Guest Caller';
      const guestPhone = activeUser?.phone || '+91 98200 12345';
      const guestEmail = activeUser?.email || 'guest@tajhotels.com';

      let restaurantName = 'Wasabi by Morimoto';
      if (textLower.includes('shamiana')) restaurantName = 'Shamiana';
      if (textLower.includes('golden dragon')) restaurantName = 'Golden Dragon';
      if (textLower.includes('masala kraft')) restaurantName = 'Masala Kraft';
      if (textLower.includes('sea lounge')) restaurantName = 'Sea Lounge';

      let partySize = 2;
      const partyMatch = userText.match(/(\d+)\s*(people|guests|persons|pax)/i);
      if (partyMatch) {
        partySize = parseInt(partyMatch[1], 10);
      } else if (textLower.includes('for four') || textLower.includes('for 4')) {
        partySize = 4;
      } else if (textLower.includes('for six') || textLower.includes('for 6')) {
        partySize = 6;
      }

      let timeSlot = '19:30';
      if (textLower.includes('12:30')) timeSlot = '12:30';
      if (textLower.includes('13:00') || textLower.includes('1 pm')) timeSlot = '13:00';
      if (textLower.includes('19:00') || textLower.includes('7 pm')) timeSlot = '19:00';
      if (textLower.includes('20:00') || textLower.includes('8 pm')) timeSlot = '20:00';
      if (textLower.includes('20:30') || textLower.includes('8:30')) timeSlot = '20:30';

      const diningArea: DiningArea = 'Indoor Main Dining';
      const tableNumber = `Table 8 (${restaurantName})`;

      let occasion: DiningOccasion = 'Casual Dining';
      if (textLower.includes('anniversary')) occasion = 'Anniversary';
      if (textLower.includes('birthday')) occasion = 'Birthday';
      if (textLower.includes('business')) occasion = 'Business Dinner';
      if (textLower.includes('celebrat')) occasion = 'Celebration';

      const dietary: string[] = [];
      if (textLower.includes('jain')) dietary.push('Jain Vegetarian Options');
      if (textLower.includes('vegetarian') || textLower.includes('veg')) dietary.push('Vegetarian');
      if (textLower.includes('gluten')) dietary.push('Gluten-Free');

      const res = await ApiService.createTableBooking({
        hotelId: 'taj-mahal-palace',
        hotelName: 'The Taj Mahal Palace, Mumbai',
        restaurantName,
        userId: activeUser?.id,
        guestName,
        guestPhone,
        guestEmail,
        date: '2026-10-15',
        timeSlot,
        partySize,
        tableNumber,
        diningArea,
        occasion,
        dietaryRequirements: dietary,
        specialRequests: `Booked via AI Voice Receptionist. Request: "${userText}"`,
        status: 'Confirmed',
        source: 'Voice Receptionist',
      });

      const reply = `Wonderful! I have reserved a table for ${partySize} guests at ${restaurantName} tonight at ${timeSlot} under ${guestName}. Booking reference is ${
        res.data?.bookingRef || 'TB-MUM-CONFIRMED'
      }. Our culinary team looks forward to welcoming you.`;

      return {
        reply,
        action: {
          type: 'table_booked',
          summary: `Table for ${partySize} reserved at ${restaurantName} (${timeSlot})`,
          refCode: res.data?.bookingRef,
        },
      };
    }

    // 3. Try Gemini Backend API if available
    try {
      const res = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, history }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          return { reply: data.text };
        }
      }
    } catch {
      // Continue to local knowledge engine
    }

    // 4. Hotel FAQ & Mumbai Inquiries
    if (textLower.includes('check-in') || textLower.includes('check in') || textLower.includes('check out')) {
      return {
        reply:
          'Standard check-in begins at 2:00 PM (14:00), and check-out is at 12:00 noon. Early check-in or late check-out can be arranged subject to room availability.',
      };
    }

    if (textLower.includes('airport') || textLower.includes('cab') || textLower.includes('transfer')) {
      return {
        reply:
          'We provide 24-hour luxury airport transfers to and from Chhatrapati Shivaji Maharaj International Airport (BOM Terminal 1 & 2) in our Mercedes-Benz and BMW fleet. Travel time via Mumbai Coastal Road is approximately 40 minutes.',
      };
    }

    if (textLower.includes('gateway') || textLower.includes('view') || textLower.includes('sea')) {
      return {
        reply:
          'The Taj Mahal Palace stands directly opposite the iconic Gateway of India on Apollo Bunder. Our Sea Facing Palace rooms and Luxury suites offer direct, panoramic Arabian Sea views.',
      };
    }

    if (textLower.includes('dress code') || textLower.includes('wear')) {
      return {
        reply:
          'Our fine dining venues, including Wasabi by Morimoto and Golden Dragon, observe an elegant smart-casual to formal dress code. Collared shirts or traditional formal attire are encouraged.',
      };
    }

    if (textLower.includes('jain') || textLower.includes('veg') || textLower.includes('food')) {
      return {
        reply:
          'Yes, we cater extensively to pure vegetarian, Jain, and vegan dietary preferences across Shamiana, Wasabi by Morimoto, Golden Dragon, and Masala Kraft.',
      };
    }

    // Default polite hospitality reception
    return {
      reply:
        "Namaste and welcome to The Taj Mahal Palace, Mumbai. I am Aria, your AI Voice Receptionist. I can assist you with hotel room bookings, dining reservations at Wasabi by Morimoto or Shamiana, and general guest assistance across Mumbai. How may I assist you today?",
    };
  },

  // Save the voice call into the Call History roster
  logVoiceCallRecord: async (
    callerName: string,
    callerPhone: string,
    durationSeconds: number,
    purpose: CallRecord['purpose'],
    outcome: CallRecord['outcome'],
    summary: string,
    transcript: { speaker: 'Receptionist' | 'Caller'; text: string; time: string }[],
    linkedBookingId?: string
  ) => {
    const newCall: CallRecord = {
      id: 'call-ai-' + Math.floor(100 + Math.random() * 900),
      callerName,
      callerPhone,
      dateTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      durationSeconds,
      purpose,
      status: 'Answered',
      outcome,
      agentSummary: summary,
      hasRecording: true,
      recordingDuration: `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`,
      transcript,
      linkedBookingId,
    };
    StorageService.saveCall(newCall);
    return newCall;
  },
};
