import React from 'react';
import { Modal } from '../common/Modal';
import { UserProfile, HotelReservation, TableBooking } from '../../types';
import { Badge } from '../common/Badge';
import { Calendar, UtensilsCrossed, BedDouble } from 'lucide-react';

interface UserBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  reservations: HotelReservation[];
  tableBookings: TableBooking[];
  onCancelReservation: (id: string) => void;
  onCancelTableBooking: (id: string) => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  isOpen,
  onClose,
  user,
  reservations,
  tableBookings,
  onCancelReservation,
  onCancelTableBooking,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guest Account & Booking Records"
      subtitle={`Authenticated as ${user.name} (${user.email})`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 text-sky-800 font-bold text-sm flex items-center justify-center">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900">{user.name}</h4>
              <p className="text-xs text-slate-500">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-semibold">
            {user.role} Account
          </span>
        </div>

        {/* Room Reservations Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-sky-100 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-sky-600" />
              <span>Room Reservations ({reservations.length})</span>
            </h4>
          </div>

          {reservations.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No hotel room reservations found under your account.
            </p>
          ) : (
            <div className="space-y-2">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl border border-sky-100 bg-white hover:border-sky-300 transition-colors flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{res.roomCategory}</span>
                      <span className="text-[11px] font-mono text-slate-400">({res.bookingCode})</span>
                      <Badge status={res.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{res.checkInDate} to {res.checkOutDate} ({res.totalNights} nights)</span>
                      <span>•</span>
                      <span>{res.roomNumber ? `Room ${res.roomNumber}` : 'Assigning'}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-900">${res.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {res.status !== 'Cancelled' && res.status !== 'Checked Out' && (
                    <button
                      type="button"
                      onClick={() => onCancelReservation(res.id)}
                      className="px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                    >
                      Cancel Stay
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Bookings Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-sky-100 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dining Reservations (Le Miroir) ({tableBookings.length})</span>
            </h4>
          </div>

          {tableBookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No restaurant dining reservations found under your account.
            </p>
          ) : (
            <div className="space-y-2">
              {tableBookings.map((tb) => (
                <div
                  key={tb.id}
                  className="p-3.5 rounded-xl border border-sky-100 bg-white hover:border-sky-300 transition-colors flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{tb.tableNumber}</span>
                      <span className="text-[11px] text-sky-700">({tb.diningArea})</span>
                      <Badge status={tb.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Date: {tb.date}</span>
                      <span>•</span>
                      <span>Time: {tb.timeSlot}</span>
                      <span>•</span>
                      <span>{tb.partySize} Guests</span>
                      {tb.occasion && <span>• Occasion: {tb.occasion}</span>}
                    </div>
                  </div>

                  {tb.status !== 'Cancelled' && tb.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => onCancelTableBooking(tb.id)}
                      className="px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                    >
                      Cancel Table
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
