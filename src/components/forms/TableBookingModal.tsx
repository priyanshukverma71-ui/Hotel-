import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { TableBooking, DiningArea, DiningOccasion, UserProfile } from '../../types';
import { ApiService } from '../../services/api';
import { useToast } from '../common/Toast';
import { AlertTriangle, Clock } from 'lucide-react';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: TableBooking | null;
  onSaved: () => void;
  existingBookings: TableBooking[];
  currentUser?: UserProfile | null;
}

const DINING_AREAS: DiningArea[] = [
  'Indoor Main Dining',
  'Garden Terrace (Outdoor)',
  'Private Wine Cellar',
  "Chef's Counter",
  'Skyline Veranda',
];

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

const OCCASIONS: DiningOccasion[] = [
  'Casual Dining',
  'Birthday',
  'Anniversary',
  'Business Dinner',
  'Celebration',
  'Romantic',
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergy',
  'Shellfish Allergy',
  'Halal Friendly',
  'Kosher Friendly',
];

const TABLE_PRESETS = [
  { number: 'Table 1 (Main Salon)', area: 'Indoor Main Dining', capacity: 2 },
  { number: 'Table 2 (Main Salon)', area: 'Indoor Main Dining', capacity: 4 },
  { number: 'Table 3 (Window Booth)', area: 'Indoor Main Dining', capacity: 4 },
  { number: 'Table 4 (Alcove)', area: 'Indoor Main Dining', capacity: 6 },
  { number: 'Table 5 (Terrace Pergola)', area: 'Garden Terrace (Outdoor)', capacity: 2 },
  { number: 'Table 6 (Terrace Fountain)', area: 'Garden Terrace (Outdoor)', capacity: 4 },
  { number: 'Table 7 (Veranda Skyline)', area: 'Skyline Veranda', capacity: 4 },
  { number: 'Table 8 (Private Vault)', area: 'Private Wine Cellar', capacity: 8 },
  { number: 'Table 9 (Chef Tasting)', area: "Chef's Counter", capacity: 4 },
  { number: 'Table 10 (Grand Salon)', area: 'Indoor Main Dining', capacity: 8 },
];

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSaved,
  existingBookings,
  currentUser,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    date: '2026-10-15',
    timeSlot: '19:30',
    partySize: 2,
    tableNumber: 'Table 2 (Main Salon)',
    diningArea: 'Indoor Main Dining' as DiningArea,
    occasion: 'Casual Dining' as DiningOccasion,
    dietaryRequirements: [] as string[],
    specialRequests: '',
    status: 'Confirmed' as TableBooking['status'],
    source: 'Voice Receptionist' as TableBooking['source'],
  });

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        guestName: booking.guestName,
        guestPhone: booking.guestPhone,
        guestEmail: booking.guestEmail || '',
        date: booking.date,
        timeSlot: booking.timeSlot,
        partySize: booking.partySize,
        tableNumber: booking.tableNumber,
        diningArea: booking.diningArea,
        occasion: booking.occasion || 'Casual Dining',
        dietaryRequirements: booking.dietaryRequirements || [],
        specialRequests: booking.specialRequests || '',
        status: booking.status,
        source: booking.source,
      });
    } else {
      setFormData({
        guestName: currentUser?.name || '',
        guestPhone: currentUser?.phone || '',
        guestEmail: currentUser?.email || '',
        date: '2026-10-15',
        timeSlot: '19:30',
        partySize: 2,
        tableNumber: 'Table 2 (Main Salon)',
        diningArea: 'Indoor Main Dining',
        occasion: 'Casual Dining',
        dietaryRequirements: [],
        specialRequests: '',
        status: 'Confirmed',
        source: 'Host Desk',
      });
    }
    setErrors({});
  }, [booking, currentUser, isOpen]);

  // Real-time conflict prevention
  useEffect(() => {
    if (!formData.date || !formData.timeSlot || !formData.tableNumber) {
      setConflictWarning(null);
      return;
    }

    const hasConflict = existingBookings.some((b) => {
      if (booking && b.id === booking.id) return false;
      return (
        b.date === formData.date &&
        b.timeSlot === formData.timeSlot &&
        b.tableNumber === formData.tableNumber &&
        b.status !== 'Cancelled'
      );
    });

    if (hasConflict) {
      setConflictWarning(
        `${formData.tableNumber} is already booked at ${formData.timeSlot} on ${formData.date}. Please select a different table or time.`
      );
    } else {
      setConflictWarning(null);
    }
  }, [formData.date, formData.timeSlot, formData.tableNumber, existingBookings, booking]);

  const toggleDietary = (item: string) => {
    setFormData((prev) => {
      const exists = prev.dietaryRequirements.includes(item);
      return {
        ...prev,
        dietaryRequirements: exists
          ? prev.dietaryRequirements.filter((i) => i !== item)
          : [...prev.dietaryRequirements, item],
      };
    });
  };

  const handleTableChange = (tableNum: string) => {
    const preset = TABLE_PRESETS.find((t) => t.number === tableNum);
    setFormData((prev) => ({
      ...prev,
      tableNumber: tableNum,
      diningArea: preset ? (preset.area as DiningArea) : prev.diningArea,
    }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.guestName.trim()) err.guestName = 'Guest name is required';
    if (!formData.guestPhone.trim()) err.guestPhone = 'Phone number is required';
    if (!formData.date) err.date = 'Date is required';
    if (formData.partySize < 1) err.partySize = 'At least 1 guest required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (conflictWarning) {
      showToast(conflictWarning, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (booking) {
        await ApiService.updateTableBooking({ ...booking, ...formData });
        showToast(`Table booking for ${formData.guestName} updated.`, 'success');
      } else {
        const res = await ApiService.createTableBooking({
          ...formData,
          userId: currentUser?.id,
        });
        showToast(`Table reserved for ${formData.guestName} (Ref: ${res.data?.bookingRef || 'Confirmed'}).`, 'success');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save table booking.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={booking ? `Edit Table Booking — ${booking.bookingRef}` : 'Reserve Dining Table (Le Miroir)'}
      subtitle="Select table, time slot, dining area, occasion, and dietary notes"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {conflictWarning && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Conflict Detected:</strong> {conflictWarning}
            </div>
          </div>
        )}

        {/* Guest Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-sky-100">
            Guest Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guest Name *
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Lord Alistair Vance"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                  errors.guestName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.guestName && <p className="text-[11px] text-rose-600 mt-1">{errors.guestName}</p>}
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
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                  errors.guestPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.guestPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.guestPhone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="guest@domain.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Seating */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-sky-100">
            Date, Time & Table Assignment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reservation Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Slot *
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t} {Number(t.split(':')[0]) < 16 ? '(Lunch)' : '(Dinner)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Party Size (Guests) *
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={formData.partySize}
                onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              {errors.partySize && <p className="text-[11px] text-rose-600 mt-1">{errors.partySize}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dining Area
              </label>
              <select
                value={formData.diningArea}
                onChange={(e) => setFormData({ ...formData, diningArea: e.target.value as DiningArea })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {DINING_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Table Assignment
              </label>
              <select
                value={formData.tableNumber}
                onChange={(e) => handleTableChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {TABLE_PRESETS.map((t) => (
                  <option key={t.number} value={t.number}>
                    {t.number} (Seats {t.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dining Occasion
              </label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value as DiningOccasion })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending Confirmation</option>
                <option value="Seated">Currently Seated</option>
                <option value="Completed">Dining Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dietary Requirements */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Dietary Requirements & Allergies
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((item) => {
              const selected = formData.dietaryRequirements.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleDietary(item)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                    selected
                      ? 'bg-sky-500 text-white border-sky-500 font-semibold shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Special Requests & Table Notes
          </label>
          <textarea
            rows={2}
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            placeholder="e.g. Window booth preference, champagne pairing, sommelier consultation, birthday cake..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
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
            disabled={isSubmitting || !!conflictWarning}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs disabled:opacity-40"
          >
            {isSubmitting ? 'Saving...' : booking ? 'Update Table Booking' : 'Confirm Table Booking'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
