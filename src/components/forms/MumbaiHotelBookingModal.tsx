import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
  CreditCard,
  Printer,
  ChevronRight,
  Sparkles,
  MapPin,
  Utensils,
  Receipt
} from 'lucide-react';
import { MumbaiHotel, RoomCategory } from '../../types';
import { ApiService } from '../../services/api';
import { useToast } from '../common/Toast';

interface MumbaiHotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: MumbaiHotel;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  onBookingComplete?: (bookingCode: string) => void;
}

export const MumbaiHotelBookingModal: React.FC<MumbaiHotelBookingModalProps> = ({
  isOpen,
  onClose,
  hotel,
  initialCheckIn = '2026-10-18',
  initialCheckOut = '2026-10-20',
  initialAdults = 2,
  onBookingComplete,
}) => {
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(hotel.roomTypes[0]?.id || '');
  const [mealPlan, setMealPlan] = useState<'EP' | 'CP' | 'MAP'>('CP'); // CP = breakfast included
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(0);

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('+91 ');
  const [guestEmail, setGuestEmail] = useState('');
  const [cityState, setCityState] = useState('Mumbai, Maharashtra');
  const [specialRequests, setSpecialRequests] = useState('');
  const [hasGstin, setHasGstin] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'pay_at_hotel' | 'upi' | 'card' | 'netbanking'>('pay_at_hotel');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  if (!isOpen) return null;

  // Selected Room
  const selectedRoom = hotel.roomTypes.find((r) => r.id === selectedRoomId) || hotel.roomTypes[0];

  // Calculate nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  const totalNights = isNaN(diffTime) || diffTime < 1 ? 1 : diffTime;

  // Meal Plan Add-on Per Night
  const mealPlanCostPerNight = mealPlan === 'EP' ? 0 : mealPlan === 'CP' ? 1500 : 3800;
  const nightlyBaseRate = selectedRoom.basePrice + mealPlanCostPerNight;
  const subtotal = nightlyBaseRate * totalNights;
  const gstRate = 0.18; // 18% GST for luxury hotel rooms in India
  const gstAmount = Math.round(subtotal * gstRate);
  const grandTotal = subtotal + gstAmount;

  const handleNextToStep2 = () => {
    if (!checkInDate || !checkOutDate) {
      showToast('Please select valid check-in and check-out dates.', 'error');
      return;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      showToast('Check-out date must be after check-in date.', 'error');
      return;
    }
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!guestName.trim()) {
      showToast('Please enter primary guest name.', 'error');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const mealPlanLabel =
        mealPlan === 'EP'
          ? 'Room Only (EP)'
          : mealPlan === 'CP'
          ? 'Buffet Breakfast Included (CP)'
          : 'Breakfast & Dinner Included (MAP)';

      const notes = [
        specialRequests ? `Special requests: ${specialRequests}` : '',
        `Meal Plan: ${mealPlanLabel}`,
        hasGstin && gstin ? `GSTIN: ${gstin} (${companyName})` : '',
        `Payment: ${paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel' : paymentMethod.toUpperCase()}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await ApiService.createReservation({
        hotelId: hotel.id,
        hotelName: hotel.name,
        guestId: 'gst-' + Date.now(),
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        roomCategory: selectedRoom.category,
        adults,
        children,
        totalNights,
        nightlyRate: nightlyBaseRate,
        totalAmount: grandTotal,
        mealPlan: mealPlanLabel,
        gstin: hasGstin ? gstin : undefined,
        status: 'Confirmed',
        paymentStatus: paymentMethod === 'pay_at_hotel' ? 'Pending' : 'Paid',
        specialRequests: notes,
        source: 'Direct Website',
      });

      setConfirmedBooking(res);
      setStep(4);
      showToast(`Reservation confirmed at ${hotel.name}! Reference: ${res.bookingCode}`, 'success');
      if (onBookingComplete) {
        onBookingComplete(res.bookingCode);
      }
    } catch {
      showToast('Booking failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-sky-100 max-w-3xl w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-sky-400 font-semibold block">
              MUMBAI HOTEL RESERVATION
            </span>
            <h2 className="text-base font-bold text-white truncate max-w-lg">
              {hotel.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="bg-sky-50 px-6 py-2.5 border-b border-sky-100 flex items-center justify-between text-xs font-medium text-slate-600">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-sky-700 font-bold' : step > 1 ? 'text-emerald-700 font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-sky-600 text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>
                1
              </span>
              <span>Select Room & Dates</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-sky-700 font-bold' : step > 2 ? 'text-emerald-700 font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-sky-600 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>
                2
              </span>
              <span>Guest & GST Details</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-sky-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>
                3
              </span>
              <span>Review & Payment</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Select Room, Meal Plan & Dates */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Dates & Guests Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Adults (12+ yrs)
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Children (0-11 yrs)
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Child' : 'Children'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Select Room Category
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hotel.roomTypes.map((rm) => {
                    const isSelected = rm.id === selectedRoomId;
                    return (
                      <div
                        key={rm.id}
                        onClick={() => setSelectedRoomId(rm.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {rm.name}
                            </h4>
                            <p className="text-xs text-slate-500 font-mono">
                              {rm.bedType} • {rm.sizeSqFt} sq.ft
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-slate-900 font-mono">
                              ₹{rm.basePrice.toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[10px] text-slate-500">/ night</span>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {rm.features.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meal Plan Options */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Choose Meal Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setMealPlan('EP')}
                    className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                      mealPlan === 'EP'
                        ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900">Room Only (EP)</span>
                      <span className="text-[10px] text-slate-500">Base</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Accommodation only</p>
                  </div>

                  <div
                    onClick={() => setMealPlan('CP')}
                    className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                      mealPlan === 'CP'
                        ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-sky-900">With Breakfast (CP)</span>
                      <span className="text-[10px] font-bold text-sky-600">+₹1,500/nt</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Grand buffet breakfast daily</p>
                  </div>

                  <div
                    onClick={() => setMealPlan('MAP')}
                    className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                      mealPlan === 'MAP'
                        ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900">Breakfast + Dinner (MAP)</span>
                      <span className="text-[10px] font-bold text-sky-600">+₹3,800/nt</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Daily breakfast & multi-course dinner</p>
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary Strip */}
              <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {totalNights} Night{totalNights > 1 ? 's' : ''} Stay ({checkInDate} to {checkOutDate})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Base: ₹{nightlyBaseRate.toLocaleString('en-IN')}/night • Taxes & GST 18%: ₹{gstAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-slate-900 font-mono">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">Includes 18% GST</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details & GST Billing */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Mehta"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (India) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 XXXXX"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh@bharatenterprises.in"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City & State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. High floor, quiet room, late check-in at 20:00, airport pick-up"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Optional GSTIN for corporate invoice */}
              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasGstin}
                    onChange={(e) => setHasGstin(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>I need an official GST Tax Invoice for my Company</span>
                </label>

                {hasGstin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Registered Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Reliance Industries Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        15-digit GSTIN Number
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="e.g. 27AAAAA0000A1Z5"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Review & Payment Selection */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Booking Summary Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-slate-900 pb-2 border-b border-slate-200">
                  <span>{hotel.name}</span>
                  <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Room Type</span>
                    <span className="font-medium text-slate-800">{selectedRoom.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Dates & Duration</span>
                    <span className="font-medium text-slate-800">
                      {checkInDate} to {checkOutDate} ({totalNights} Night{totalNights > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Primary Guest</span>
                    <span className="font-medium text-slate-800">{guestName} ({guestPhone})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Meal Plan</span>
                    <span className="font-medium text-slate-800">
                      {mealPlan === 'EP' ? 'Room Only' : mealPlan === 'CP' ? 'Buffet Breakfast' : 'Breakfast & Dinner'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Select Payment Option
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod('pay_at_hotel')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'pay_at_hotel'
                        ? 'border-sky-500 bg-sky-50/60 ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-sky-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Pay at Hotel upon Check-in
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Zero advance required. Pay with cash, UPI, or card at the front desk.
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Recommended
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-sky-500 bg-sky-50/60 ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-violet-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Instant UPI (Google Pay, PhonePe, Paytm, BHIM)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Instant payment confirmation with zero convenience fees.
                        </span>
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-sky-500 bg-sky-50/60 ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-700" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Credit / Debit Card (RuPay, Visa, Mastercard, Amex)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Secured with 128-bit RBI compliant 2FA encryption.
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Free cancellation allowed up to 24 hours prior to 14:00 check-in time.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Official Confirmed Voucher */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Booking Confirmed!
                </h3>
                <p className="text-xs text-slate-500">
                  Your reservation at {hotel.name} is guaranteed.
                </p>
              </div>

              {/* Printable Official Indian Hotel Voucher */}
              <div
                id="booking-voucher"
                className="p-5 bg-white border-2 border-slate-900 rounded-xl space-y-4 text-xs font-sans shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-sky-700 block">
                      OFFICIAL HOTEL BOOKING VOUCHER
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{hotel.name}</h4>
                    <p className="text-[11px] text-slate-500">{hotel.address}</p>
                    <p className="text-[11px] text-slate-500">Phone: {hotel.phone} | PIN: {hotel.pinCode}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Booking Reference</span>
                    <span className="text-sm font-extrabold text-sky-900 font-mono">
                      {confirmedBooking.bookingCode}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Status: <span className="font-bold text-emerald-600">CONFIRMED</span>
                    </span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Check-in</span>
                    <span className="font-bold text-slate-900">{checkInDate}</span>
                    <span className="block text-[10px] text-slate-500">From 14:00</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Check-out</span>
                    <span className="font-bold text-slate-900">{checkOutDate}</span>
                    <span className="block text-[10px] text-slate-500">Until 12:00</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Room Category</span>
                    <span className="font-bold text-slate-900">{selectedRoom.name}</span>
                    <span className="block text-[10px] text-slate-500">{totalNights} Night(s)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Guests</span>
                    <span className="font-bold text-slate-900">
                      {adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child` : ''}
                    </span>
                  </div>
                </div>

                {/* Guest & Billing */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2 border-t border-slate-200">
                  <div className="text-xs space-y-1">
                    <p><span className="font-semibold text-slate-700">Guest Name:</span> {guestName}</p>
                    <p><span className="font-semibold text-slate-700">Contact:</span> {guestPhone} • {guestEmail}</p>
                    <p><span className="font-semibold text-slate-700">Meal Plan:</span> {confirmedBooking.mealPlan || 'Complimentary Breakfast'}</p>
                    {hasGstin && gstin && (
                      <p><span className="font-semibold text-slate-700">GSTIN:</span> {gstin} ({companyName})</p>
                    )}
                  </div>
                  <div className="text-right sm:min-w-[180px] bg-sky-50/60 p-3 rounded-lg border border-sky-100">
                    <div className="text-[11px] text-slate-600 flex justify-between">
                      <span>Room & Meal Total:</span>
                      <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex justify-between">
                      <span>GST @ 18%:</span>
                      <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 flex justify-between pt-1 border-t border-slate-200 mt-1">
                      <span>Grand Total:</span>
                      <span className="font-mono text-sm text-sky-950 font-extrabold">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Payment: {paymentMethod === 'pay_at_hotel' ? 'Pay at Hotel (Cash/Card/UPI)' : 'Prepaid'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
                  <span>Present this voucher or booking SMS at reception upon arrival. Government photo ID required.</span>
                  <span className="font-mono">Issued: {new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 && step < 4 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Back
            </button>
          )}

          {step === 1 && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500">
                Prices shown in INR (₹) including all service charges
              </span>
              <button
                type="button"
                onClick={handleNextToStep2}
                className="px-5 py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue to Guest Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleNextToStep3}
              className="ml-auto px-5 py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="ml-auto px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming with Hotel...' : `Confirm Booking • ₹${grandTotal.toLocaleString('en-IN')}`}</span>
            </button>
          )}

          {step === 4 && (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Voucher</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
