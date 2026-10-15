import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { HotelReservation, RoomCategory, PaymentStatus, Room, UserProfile } from '../../types';
import { ApiService } from '../../services/api';
import { useToast } from '../common/Toast';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: HotelReservation | null;
  onSaved: () => void;
  availableRooms: Room[];
  currentUser?: UserProfile | null;
}

const CATEGORY_RATES: Record<RoomCategory, number> = {
  'Superior King': 26500,
  'Deluxe King': 38000,
  'Executive Suite': 72000,
  'Presidential Suite': 195000,
  'Garden Villa': 95000,
  'Terrace Penthouse': 240000,
};

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onSaved,
  availableRooms,
  currentUser,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '2026-10-16',
    checkOutDate: '2026-10-19',
    roomCategory: 'Deluxe King' as RoomCategory,
    roomNumber: '',
    adults: 2,
    children: 0,
    specialRequests: '',
    paymentStatus: 'Paid' as PaymentStatus,
    status: 'Confirmed' as HotelReservation['status'],
    source: 'Voice Receptionist' as HotelReservation['source'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        guestName: reservation.guestName,
        guestEmail: reservation.guestEmail,
        guestPhone: reservation.guestPhone,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        roomCategory: reservation.roomCategory,
        roomNumber: reservation.roomNumber || '',
        adults: reservation.adults,
        children: reservation.children,
        specialRequests: reservation.specialRequests || '',
        paymentStatus: reservation.paymentStatus,
        status: reservation.status,
        source: reservation.source,
      });
    } else {
      setFormData({
        guestName: currentUser?.name || '',
        guestEmail: currentUser?.email || '',
        guestPhone: currentUser?.phone || '',
        checkInDate: '2026-10-16',
        checkOutDate: '2026-10-19',
        roomCategory: 'Deluxe King',
        roomNumber: '',
        adults: 2,
        children: 0,
        specialRequests: '',
        paymentStatus: 'Paid',
        status: 'Confirmed',
        source: 'Front Desk',
      });
    }
    setErrors({});
  }, [reservation, currentUser, isOpen]);

  // Calculate nights and amount
  const calculateStay = () => {
    try {
      const d1 = new Date(formData.checkInDate);
      const d2 = new Date(formData.checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const nights = diffDays > 0 ? diffDays : 1;
      const rate = CATEGORY_RATES[formData.roomCategory] || 500;
      return {
        totalNights: nights,
        nightlyRate: rate,
        totalAmount: nights * rate,
      };
    } catch {
      return { totalNights: 1, nightlyRate: 500, totalAmount: 500 };
    }
  };

  const { totalNights, nightlyRate, totalAmount } = calculateStay();

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.guestName.trim()) err.guestName = 'Guest name is required';
    if (!formData.guestEmail.trim()) err.guestEmail = 'Email is required';
    if (!formData.guestPhone.trim()) err.guestPhone = 'Phone number is required';
    if (!formData.checkInDate) err.checkInDate = 'Check-in date is required';
    if (!formData.checkOutDate) err.checkOutDate = 'Check-out date is required';
    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      err.checkOutDate = 'Check-out date must be after check-in date';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Filter available rooms matching the category
  const matchingRooms = availableRooms.filter(
    (r) => r.category === formData.roomCategory
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (reservation) {
        await ApiService.updateReservation({
          ...reservation,
          ...formData,
          totalNights,
          nightlyRate,
          totalAmount,
        });
        showToast(`Reservation for ${formData.guestName} updated successfully.`, 'success');
      } else {
        const created = await ApiService.createReservation({
          ...formData,
          guestId: currentUser?.id || 'gst-' + Date.now(),
          userId: currentUser?.id,
          totalNights,
          nightlyRate,
          totalAmount,
        });
        showToast(`New reservation ${created.bookingCode} confirmed for ${formData.guestName}.`, 'success');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save reservation.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reservation ? `Edit Reservation — ${reservation.bookingCode}` : 'New Hotel Reservation'}
      subtitle="Complete room booking specifications and guest details"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guest Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-sky-100">
            Guest Contact & Profile
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guest Full Name *
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Lady Vivienne Montgomery"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.guestName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.guestName && <p className="text-[11px] text-rose-600 mt-1">{errors.guestName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="guest@domain.com"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.guestEmail ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.guestEmail && <p className="text-[11px] text-rose-600 mt-1">{errors.guestEmail}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telephone *
              </label>
              <input
                type="text"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                placeholder="+1 555 0192"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.guestPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.guestPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.guestPhone}</p>}
            </div>
          </div>
        </div>

        {/* Dates & Occupancy */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-sky-100">
            Stay Dates & Occupancy
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Check-in Date *
              </label>
              <input
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              {errors.checkInDate && <p className="text-[11px] text-rose-600 mt-1">{errors.checkInDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Check-out Date *
              </label>
              <input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              {errors.checkOutDate && <p className="text-[11px] text-rose-600 mt-1">{errors.checkOutDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adults
              </label>
              <select
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Adult{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Children
              </label>
              <select
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Children
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Room Category, Assignment & Payment */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-sky-100">
            Suite Selection & Rate Plan
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suite / Room Category *
              </label>
              <select
                value={formData.roomCategory}
                onChange={(e) => {
                  const cat = e.target.value as RoomCategory;
                  setFormData({ ...formData, roomCategory: cat, roomNumber: '' });
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {Object.keys(CATEGORY_RATES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} (${CATEGORY_RATES[cat as RoomCategory]}/night)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Room Number
              </label>
              <select
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Unassigned (Assign upon check-in)</option>
                {matchingRooms.map((rm) => (
                  <option key={rm.id} value={rm.roomNumber}>
                    Room {rm.roomNumber} (Floor {rm.floor} • {rm.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Paid">Paid in Full</option>
                <option value="Partial">Partial Deposit Paid</option>
                <option value="Pending">Payment Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Calculated Stay Rate
            </span>
            <div className="text-xs text-slate-600">
              <span>{totalNights} night{totalNights > 1 ? 's' : ''} × ₹{nightlyRate.toLocaleString('en-IN')}/night ({formData.roomCategory})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Estimated Total</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Special Requests & Source */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Requests & Hospitality Notes
            </label>
            <textarea
              rows={3}
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="e.g. Late flight arrival, high floor, hypoallergenic pillows, anniversary wine amenity..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Booking Channel / Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="Voice Receptionist">Voice Receptionist</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Direct Website">Direct Website</option>
              <option value="Corporate">Corporate Account</option>
              <option value="Concierge">Concierge VIP</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : reservation ? 'Update Reservation' : 'Confirm Reservation'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
