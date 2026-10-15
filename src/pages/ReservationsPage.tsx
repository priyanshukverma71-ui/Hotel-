import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { HotelReservation, Room } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';

interface ReservationsPageProps {
  onOpenNewReservation: () => void;
  onEditReservation: (res: HotelReservation) => void;
  availableRooms: Room[];
}

export const ReservationsPage: React.FC<ReservationsPageProps> = ({
  onOpenNewReservation,
  onEditReservation,
}) => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomCategoryFilter, setRoomCategoryFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [selectedReservation, setSelectedReservation] = useState<HotelReservation | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const loadReservations = async () => {
    const list = await ApiService.getReservations();
    setReservations(list);
  };

  useEffect(() => {
    loadReservations();
    const handleUpdate = () => loadReservations();
    window.addEventListener('raceai_data_changed', handleUpdate);
    return () => window.removeEventListener('raceai_data_changed', handleUpdate);
  }, []);

  useEffect(() => {
    const s = searchParams.get('q') || searchParams.get('search');
    if (s) setSearchQuery(s);
  }, [searchParams]);

  // Filtered reservations
  const filtered = useMemo(() => {
    return reservations.filter((res) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = res.guestName.toLowerCase().includes(q);
        const matchesCode = res.bookingCode.toLowerCase().includes(q);
        const matchesEmail = res.guestEmail.toLowerCase().includes(q);
        const matchesPhone = res.guestPhone.toLowerCase().includes(q);
        const matchesRoom = res.roomNumber?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesEmail && !matchesPhone && !matchesRoom) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && res.status !== statusFilter) {
        return false;
      }

      // Room Category
      if (roomCategoryFilter !== 'all' && res.roomCategory !== roomCategoryFilter) {
        return false;
      }

      // Payment
      if (paymentFilter !== 'all' && res.paymentStatus !== paymentFilter) {
        return false;
      }

      // Date
      if (dateFilter) {
        if (res.checkInDate !== dateFilter && res.checkOutDate !== dateFilter) {
          return false;
        }
      }

      return true;
    });
  }, [reservations, searchQuery, statusFilter, roomCategoryFilter, paymentFilter, dateFilter]);

  const handleCheckIn = async (res: HotelReservation) => {
    try {
      await ApiService.checkInGuest(res.id);
      showToast(`Guest ${res.guestName} successfully checked in.`, 'success');
      loadReservations();
    } catch {
      showToast('Check-in failed.', 'error');
    }
  };

  const handleCheckOut = async (res: HotelReservation) => {
    try {
      await ApiService.checkOutGuest(res.id);
      showToast(`Guest ${res.guestName} checked out. Room dispatched for cleaning.`, 'info');
      loadReservations();
    } catch {
      showToast('Check-out failed.', 'error');
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    try {
      await ApiService.cancelReservation(cancelTargetId);
      showToast('Reservation successfully cancelled.', 'info');
      loadReservations();
    } catch {
      showToast('Failed to cancel reservation.', 'error');
    } finally {
      setCancelTargetId(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Booking ID,Guest Name,Email,Phone,Check-In,Check-Out,Room Category,Room #,Adults,Children,Total Amount,Status,Payment'];
    const rows = filtered.map((r) =>
      `"${r.bookingCode}","${r.guestName}","${r.guestEmail}","${r.guestPhone}","${r.checkInDate}","${r.checkOutDate}","${r.roomCategory}","${r.roomNumber || ''}",${r.adults},${r.children},${r.totalAmount},"${r.status}","${r.paymentStatus}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hotel_reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported reservations CSV report.', 'success');
  };

  const statusCounts = useMemo(() => {
    return {
      all: reservations.length,
      Confirmed: reservations.filter((r) => r.status === 'Confirmed').length,
      'Checked In': reservations.filter((r) => r.status === 'Checked In').length,
      'Checked Out': reservations.filter((r) => r.status === 'Checked Out').length,
      Pending: reservations.filter((r) => r.status === 'Pending').length,
      Cancelled: reservations.filter((r) => r.status === 'Cancelled').length,
    };
  }, [reservations]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Room Reservations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage individual and VIP hotel stays, room assignments, billing, check-ins, and cancellations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewReservation}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Status Segment Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200">
        {(['all', 'Confirmed', 'Checked In', 'Checked Out', 'Pending', 'Cancelled'] as const).map((tab) => {
          const count = statusCounts[tab as keyof typeof statusCounts] || 0;
          const isActive = statusFilter === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-slate-900'
              }`}
            >
              <span>{tab === 'all' ? 'All Reservations' : tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Universal Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest, booking code, phone, email, room..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Room Category */}
          <div>
            <select
              value={roomCategoryFilter}
              onChange={(e) => setRoomCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">All Room Types</option>
              <option value="Superior King">Superior King</option>
              <option value="Deluxe King">Deluxe King</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Presidential Suite">Presidential Suite</option>
              <option value="Garden Villa">Garden Villa</option>
              <option value="Terrace Penthouse">Terrace Penthouse</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Specific Date Filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
            />
          </div>
        </div>

        {(searchQuery || statusFilter !== 'all' || roomCategoryFilter !== 'all' || paymentFilter !== 'all' || dateFilter) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Showing {filtered.length} matching reservations</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setRoomCategoryFilter('all');
                setPaymentFilter('all');
                setDateFilter('');
              }}
              className="text-sky-600 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Reservations Table */}
      <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-400 bg-sky-50/40">
                <th className="py-3 px-4 font-semibold">Booking ID</th>
                <th className="py-3 px-4 font-semibold">Guest</th>
                <th className="py-3 px-4 font-semibold">Dates & Nights</th>
                <th className="py-3 px-4 font-semibold">Room & Category</th>
                <th className="py-3 px-4 font-semibold">Guests</th>
                <th className="py-3 px-4 font-semibold">Amount & Billing</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-800">No reservations match your search or filters.</p>
                    <p className="text-xs mt-1">Try clearing filters or create a new reservation.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {res.bookingCode}
                      <span className="block text-[10px] text-slate-400 font-sans">{res.source}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {res.guestName}
                      </div>
                      <div className="text-[11px] text-slate-500">{res.guestPhone}</div>
                      <div className="text-[10px] text-slate-400">{res.guestEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium">{res.checkInDate} → {res.checkOutDate}</div>
                      <div className="text-[10px] text-slate-400">{res.totalNights} night{res.totalNights > 1 ? 's' : ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{res.roomCategory}</div>
                      <div className="text-[11px] text-sky-700 font-mono">
                        {res.roomNumber ? `Room ${res.roomNumber}` : 'Assign at check-in'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {res.adults} Adults{res.children > 0 ? `, ${res.children} Child` : ''}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 font-mono">
                        ₹{res.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <Badge status={res.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={res.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReservation(res)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-sky-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditReservation(res)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-sky-50 rounded"
                          title="Edit Reservation"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {res.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleCheckIn(res)}
                            className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 rounded border border-sky-200 transition-colors"
                          >
                            Check In
                          </button>
                        )}

                        {res.status === 'Checked In' && (
                          <button
                            type="button"
                            onClick={() => handleCheckOut(res)}
                            className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 rounded border border-amber-200 transition-colors"
                          >
                            Check Out
                          </button>
                        )}

                        {res.status !== 'Cancelled' && res.status !== 'Checked Out' && (
                          <button
                            type="button"
                            onClick={() => setCancelTargetId(res.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                            title="Cancel Reservation"
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

      {/* Reservation Details Drawer/Modal */}
      {selectedReservation && (
        <Modal
          isOpen={!!selectedReservation}
          onClose={() => setSelectedReservation(null)}
          title={`Reservation Details — ${selectedReservation.bookingCode}`}
          subtitle={`Created on ${new Date(selectedReservation.createdAt).toLocaleDateString()} via ${selectedReservation.source}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Status & Room
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge status={selectedReservation.status} />
                  <Badge status={selectedReservation.paymentStatus} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Total Balance</span>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  ₹{selectedReservation.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Guest Profile</span>
                <p className="font-semibold text-sm text-slate-900">{selectedReservation.guestName}</p>
                <p className="text-slate-600">{selectedReservation.guestEmail}</p>
                <p className="text-slate-600">{selectedReservation.guestPhone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Stay Timeline</span>
                <p className="font-medium text-slate-800">
                  Check-in: <strong>{selectedReservation.checkInDate}</strong>
                </p>
                <p className="font-medium text-slate-800">
                  Check-out: <strong>{selectedReservation.checkOutDate}</strong>
                </p>
                <p className="text-slate-500">
                  {selectedReservation.totalNights} nights • {selectedReservation.adults} Adults
                  {selectedReservation.children > 0 ? `, ${selectedReservation.children} Children` : ''}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-xs space-y-2">
              <span className="text-slate-400 uppercase tracking-wider font-semibold">Suite Specifications</span>
              <div className="p-3 bg-sky-50/30 rounded-lg border border-sky-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{selectedReservation.roomCategory}</p>
                  <p className="text-slate-500">Assigned Room: {selectedReservation.roomNumber ? `Room ${selectedReservation.roomNumber}` : 'Pending Check-In Assignment'}</p>
                </div>
                <div className="text-right font-mono font-medium text-slate-800">
                  ₹{selectedReservation.nightlyRate.toLocaleString('en-IN')}/night
                </div>
              </div>
            </div>

            {selectedReservation.specialRequests && (
              <div className="border-t border-slate-100 pt-4 text-xs space-y-1">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Special Requests & Notes</span>
                <p className="p-3 bg-sky-50/30 rounded-lg border border-sky-100 text-slate-700 leading-relaxed">
                  {selectedReservation.specialRequests}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const target = selectedReservation;
                  setSelectedReservation(null);
                  onEditReservation(target);
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-sky-50 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                Edit Reservation
              </button>
              <button
                type="button"
                onClick={() => setSelectedReservation(null)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Hotel Reservation"
        message="Are you sure you want to cancel this reservation? The assigned room will be returned to Available inventory and the guest will be marked as Cancelled."
        confirmLabel="Cancel Reservation"
        isDestructive={true}
      />
    </div>
  );
};
