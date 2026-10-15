import React, { useState, useEffect, useMemo } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { ApiService } from '../services/api';
import { TableBooking } from '../types';
import { Badge } from '../components/common/Badge';
import { TODAY } from '../services/mockData';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';

interface TableBookingsPageProps {
  onOpenNewBooking: () => void;
  onEditBooking: (booking: TableBooking) => void;
}

const TABLE_INVENTORY = [
  { number: 'Table 1 (Terrace)', area: 'Garden Terrace (Outdoor)', capacity: 2 },
  { number: 'Table 2 (Terrace)', area: 'Garden Terrace (Outdoor)', capacity: 4 },
  { number: 'Table 3 (Terrace)', area: 'Garden Terrace (Outdoor)', capacity: 2 },
  { number: 'Table 4 (Skyline)', area: 'Skyline Veranda', capacity: 2 },
  { number: 'Table 5 (Skyline)', area: 'Skyline Veranda', capacity: 4 },
  { number: 'Table 6 (Chef Counter)', area: "Chef's Counter", capacity: 2 },
  { number: 'Table 7 (Chef Counter)', area: "Chef's Counter", capacity: 4 },
  { number: 'Table 8 (Main Salon)', area: 'Indoor Main Dining', capacity: 4 },
  { number: 'Table 9 (Main Salon)', area: 'Indoor Main Dining', capacity: 6 },
  { number: 'Table 10 (Main Salon)', area: 'Indoor Main Dining', capacity: 4 },
  { number: 'Table 11 (Main Salon)', area: 'Indoor Main Dining', capacity: 8 },
  { number: 'Table 12 (Wine Cellar)', area: 'Private Wine Cellar', capacity: 6 },
  { number: 'Table 14 (Wine Cellar Alcove)', area: 'Private Wine Cellar', capacity: 4 },
];

const TIME_WINDOWS = ['12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export const TableBookingsPage: React.FC<TableBookingsPageProps> = ({
  onOpenNewBooking,
  onEditBooking,
}) => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<TableBooking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(TODAY);
  const [activeService, setActiveService] = useState<'All' | 'Lunch' | 'Dinner'>('All');
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [searchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'floorplan'>('list');
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const loadBookings = async () => {
    const list = await ApiService.getTableBookings();
    setBookings(list);
  };

  useEffect(() => {
    loadBookings();
    const handleUpdate = () => loadBookings();
    window.addEventListener('raceai_data_changed', handleUpdate);
    return () => window.removeEventListener('raceai_data_changed', handleUpdate);
  }, []);

  const changeDateBy = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Filtered for active list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (b.date !== selectedDate) return false;

      if (activeService === 'Lunch') {
        const hour = Number(b.timeSlot.split(':')[0]);
        if (hour >= 16) return false;
      } else if (activeService === 'Dinner') {
        const hour = Number(b.timeSlot.split(':')[0]);
        if (hour < 16) return false;
      }

      if (areaFilter !== 'All' && b.diningArea !== areaFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = b.guestName.toLowerCase().includes(q);
        const m2 = b.tableNumber.toLowerCase().includes(q);
        const m3 = b.bookingRef?.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3) return false;
      }

      return true;
    });
  }, [bookings, selectedDate, activeService, areaFilter, searchQuery]);

  const handleSeatParty = async (booking: TableBooking) => {
    try {
      await ApiService.updateTableBookingStatus(booking.id, 'Seated');
      showToast(`Party ${booking.guestName} seated at ${booking.tableNumber}.`, 'success');
      loadBookings();
    } catch {
      showToast('Failed to seat guests.', 'error');
    }
  };

  const handleCompleteDining = async (booking: TableBooking) => {
    try {
      await ApiService.updateTableBookingStatus(booking.id, 'Completed');
      showToast(`Dining completed for ${booking.guestName}. Table ${booking.tableNumber} released.`, 'info');
      loadBookings();
    } catch {
      showToast('Failed to complete dining.', 'error');
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    try {
      await ApiService.updateTableBookingStatus(cancelTargetId, 'Cancelled');
      showToast('Table booking cancelled.', 'info');
      loadBookings();
    } catch {
      showToast('Failed to cancel booking.', 'error');
    } finally {
      setCancelTargetId(null);
    }
  };

  // Table status map for floorplan view
  const tableStatusMap = useMemo(() => {
    const map: Record<string, { status: 'Available' | 'Reserved' | 'Occupied'; currentBooking?: TableBooking }> = {};
    TABLE_INVENTORY.forEach((t) => {
      const matched = bookings.find(
        (b) => b.date === selectedDate && b.tableNumber === t.number && b.status !== 'Cancelled' && b.status !== 'Completed'
      );
      if (matched) {
        map[t.number] = {
          status: matched.status === 'Seated' ? 'Occupied' : 'Reserved',
          currentBooking: matched,
        };
      } else {
        map[t.number] = { status: 'Available' };
      }
    });
    return map;
  }, [bookings, selectedDate]);

  const exportCSV = () => {
    const headers = ['Booking Ref,Guest Name,Phone,Email,Date,Time Slot,Party Size,Table Number,Dining Area,Occasion,Dietary,Status'];
    const rows = filteredBookings.map((b) =>
      `"${b.bookingRef}","${b.guestName}","${b.guestPhone}","${b.guestEmail}","${b.date}","${b.timeSlot}",${b.partySize},"${b.tableNumber}","${b.diningArea}","${b.occasion}","${b.dietaryRequirements.join('; ')}","${b.status}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `restaurant_bookings_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported dining schedule CSV.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Operational Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Table Bookings & Restaurant Host Desk
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              Le Miroir
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage restaurant seatings, daily timelines, dining preferences, and table conflict prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List & Timeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode('floorplan')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                viewMode === 'floorplan' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Floor & Table Matrix
            </button>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-sky-50 rounded-lg border border-slate-200 shadow-2xs"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenNewBooking}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book a Table</span>
          </button>
        </div>
      </div>

      {/* Date Navigation & Service Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Date Stepper */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeDateBy(-1)}
            className="p-1.5 text-slate-600 hover:bg-sky-50 rounded-lg border border-slate-200"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={() => changeDateBy(1)}
            className="p-1.5 text-slate-600 hover:bg-sky-50 rounded-lg border border-slate-200"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedDate(TODAY)}
            className="px-2.5 py-1 text-xs text-sky-600 font-semibold hover:underline"
          >
            Today
          </button>
        </div>

        {/* Service Window Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Service:</span>
          {(['All', 'Lunch', 'Dinner'] as const).map((svc) => (
            <button
              key={svc}
              type="button"
              onClick={() => setActiveService(svc)}
              className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                activeService === svc
                  ? 'bg-sky-500 text-white border-sky-500 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50'
              }`}
            >
              {svc}
            </button>
          ))}
        </div>

        {/* Area Filter */}
        <div className="flex items-center gap-2">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
          >
            <option value="All">All Dining Areas</option>
            <option value="Indoor Main Dining">Indoor Main Dining</option>
            <option value="Garden Terrace (Outdoor)">Garden Terrace (Outdoor)</option>
            <option value="Private Wine Cellar">Private Wine Cellar</option>
            <option value="Chef's Counter">Chef's Counter</option>
            <option value="Skyline Veranda">Skyline Veranda</option>
          </select>
        </div>
      </div>

      {/* Hourly Timeline Bar for Selected Date */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <span>Daily Restaurant Booking Timeline</span>
          <span className="font-mono text-slate-400">{filteredBookings.length} bookings scheduled on {selectedDate}</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-1">
          {TIME_WINDOWS.map((slot) => {
            const bookingsInSlot = bookings.filter(
              (b) => b.date === selectedDate && b.timeSlot === slot && b.status !== 'Cancelled'
            );
            const count = bookingsInSlot.length;

            return (
              <div
                key={slot}
                className={`p-2 rounded-lg text-center border transition-all ${
                  count > 0
                    ? 'bg-sky-50 border-sky-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-mono text-[11px] font-semibold text-slate-900">{slot}</div>
                <div
                  className={`text-[10px] mt-1 font-medium ${
                    count > 0 ? 'text-sky-700 font-bold' : 'text-slate-400'
                  }`}
                >
                  {count > 0 ? `${count} Table${count > 1 ? 's' : ''}` : 'Available'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {viewMode === 'floorplan' ? (
        /* Floorplan / Table Availability Matrix */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Table Availability Overview & Floor Assignment
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Occupied / Seated</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TABLE_INVENTORY.map((tbl) => {
              const state = tableStatusMap[tbl.number];
              const isOccupied = state?.status === 'Occupied';
              const isReserved = state?.status === 'Reserved';

              return (
                <div
                  key={tbl.number}
                  className={`p-4 rounded-xl border transition-all ${
                    isOccupied
                      ? 'bg-sky-50/70 border-sky-300 shadow-xs'
                      : isReserved
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-white border-sky-100 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {tbl.number}
                    </span>
                    <Badge status={state?.status || 'Available'} size="sm" />
                  </div>

                  <p className="text-[11px] text-slate-500">{tbl.area}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Capacity: {tbl.capacity} Guests</p>

                  {state?.currentBooking && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs space-y-1">
                      <div className="font-semibold text-slate-900 truncate">
                        {state.currentBooking.guestName}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Time: {state.currentBooking.timeSlot}</span>
                        <span>{state.currentBooking.partySize} guests</span>
                      </div>
                      <div className="pt-2 flex items-center gap-1.5">
                        {state.currentBooking.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleSeatParty(state.currentBooking!)}
                            className="w-full py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-sky-500 text-white rounded-lg hover:bg-sky-600 shadow-xs"
                          >
                            Seat Guests
                          </button>
                        )}
                        {state.currentBooking.status === 'Seated' && (
                          <button
                            type="button"
                            onClick={() => handleCompleteDining(state.currentBooking!)}
                            className="w-full py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-slate-800 text-white rounded-lg hover:bg-slate-900"
                          >
                            Release Table
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {!state?.currentBooking && (
                    <div className="mt-4 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={onOpenNewBooking}
                        className="w-full py-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                      >
                        Reserve Table
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table Bookings List View */
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-400 bg-sky-50/40">
                  <th className="py-3 px-4 font-semibold">Time & Ref</th>
                  <th className="py-3 px-4 font-semibold">Guest</th>
                  <th className="py-3 px-4 font-semibold">Party</th>
                  <th className="py-3 px-4 font-semibold">Table & Area</th>
                  <th className="py-3 px-4 font-semibold">Occasion</th>
                  <th className="py-3 px-4 font-semibold">Dietary & Notes</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <p className="text-sm font-semibold text-slate-800">No restaurant bookings on {selectedDate}.</p>
                      <p className="text-xs mt-1">Book a new dining party using the button above.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-bold text-sky-700">{b.timeSlot}</span>
                        <span className="block font-mono text-[10px] text-slate-400">{b.bookingRef}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{b.guestName}</div>
                        <div className="text-[11px] text-slate-500">{b.guestPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {b.partySize} {b.partySize === 1 ? 'Guest' : 'Guests'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{b.tableNumber}</div>
                        <div className="text-[11px] text-slate-500">{b.diningArea}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {b.occasion}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {b.dietaryRequirements && b.dietaryRequirements.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {b.dietaryRequirements.map((d) => (
                              <span key={d} className="px-1.5 py-0.2 rounded-md bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-medium">
                                {d}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        {b.specialRequests && (
                          <p className="text-[10px] text-slate-500 italic truncate">{b.specialRequests}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge status={b.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleSeatParty(b)}
                              className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 rounded-md border border-sky-200 transition-colors"
                            >
                              Seat
                            </button>
                          )}
                          {b.status === 'Seated' && (
                            <button
                              type="button"
                              onClick={() => handleCompleteDining(b)}
                              className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 rounded-md border border-amber-200 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onEditBooking(b)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-sky-50 rounded"
                            title="Edit / Reschedule"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() => setCancelTargetId(b.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                              title="Cancel Table Booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Restaurant Table Booking"
        message="Are you sure you want to cancel this dining reservation? The table slot will immediately be made available for other diners."
        confirmLabel="Cancel Booking"
        isDestructive={true}
      />
    </div>
  );
};
