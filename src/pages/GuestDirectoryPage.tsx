import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Sparkles,
  Eye,
  Edit,
  Copy
} from 'lucide-react';
import { ApiService } from '../services/api';
import { Guest, HotelReservation, TableBooking } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

interface GuestDirectoryPageProps {
  onOpenNewGuest: () => void;
  onEditGuest: (guest: Guest) => void;
}

export const GuestDirectoryPage: React.FC<GuestDirectoryPageProps> = ({
  onOpenNewGuest,
  onEditGuest,
}) => {
  const { showToast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [vipOnlyFilter, setVipOnlyFilter] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const loadGuests = async () => {
    const [gList, resList, tblList] = await Promise.all([
      ApiService.getGuests(),
      ApiService.getReservations(),
      ApiService.getTableBookings(),
    ]);
    setGuests(gList);
    setReservations(resList);
    setTableBookings(tblList);
  };

  useEffect(() => {
    loadGuests();
    const handleUpdate = () => loadGuests();
    window.addEventListener('raceai_data_changed', handleUpdate);
    return () => window.removeEventListener('raceai_data_changed', handleUpdate);
  }, []);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = g.name.toLowerCase().includes(q);
        const matchEmail = g.email.toLowerCase().includes(q);
        const matchPhone = g.phone.toLowerCase().includes(q);
        const matchNat = g.nationality?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchNat) return false;
      }

      if (vipOnlyFilter && !g.vipStatus) return false;

      if (tierFilter !== 'all' && g.vipTier !== tierFilter) return false;

      return true;
    });
  }, [guests, searchQuery, tierFilter, vipOnlyFilter]);

  const copyContact = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard: ${text}`, 'info');
  };

  const simulateCall = (guest: Guest) => {
    showToast(`Connecting front desk voice terminal to ${guest.name} (${guest.phone})...`, 'info');
  };

  // Find guest history
  const guestStays = useMemo(() => {
    if (!selectedGuest) return [];
    return reservations.filter(
      (r) => r.guestEmail.toLowerCase() === selectedGuest.email.toLowerCase() || r.guestName.toLowerCase() === selectedGuest.name.toLowerCase()
    );
  }, [selectedGuest, reservations]);

  const guestDinings = useMemo(() => {
    if (!selectedGuest) return [];
    return tableBookings.filter(
      (t) => t.guestEmail?.toLowerCase() === selectedGuest.email.toLowerCase() || t.guestName.toLowerCase() === selectedGuest.name.toLowerCase()
    );
  }, [selectedGuest, tableBookings]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Guest Directory & Loyalty Profiles
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              {guests.length} Patrons
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete guest hospitality profiles, stay histories, dietary preferences, VIP recognitions, and personal notes.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewGuest}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Guest</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patron name, email, phone, nationality..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={vipOnlyFilter}
              onChange={(e) => setVipOnlyFilter(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
            />
            <span>VIP Patrons Only</span>
          </label>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
          >
            <option value="all">All Loyalty Tiers</option>
            <option value="Diamond">Diamond (Bespoke)</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </select>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-400 bg-sky-50/40">
                <th className="py-3 px-4 font-semibold">Guest Profile</th>
                <th className="py-3 px-4 font-semibold">Tier & Recognition</th>
                <th className="py-3 px-4 font-semibold">Telephone</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Stays / Dining</th>
                <th className="py-3 px-4 font-semibold">Total Spend</th>
                <th className="py-3 px-4 font-semibold">Last Visit</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No patrons match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const initials = guest.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('');

                  return (
                    <tr key={guest.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {guest.name}
                              {guest.vipStatus && <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />}
                            </div>
                            <div className="text-[10px] text-slate-400">{guest.nationality || 'International'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {guest.vipTier && <Badge status={guest.vipTier} size="sm" />}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {guest.phone}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[160px] truncate">
                        {guest.email}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-semibold text-slate-900">{guest.totalStays}</span> stays • <span className="font-semibold text-slate-900">{guest.totalDiningVisits}</span> dining
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        ₹{guest.totalSpend.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {guest.lastVisit}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => simulateCall(guest)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Call Guest"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyContact(guest.email, 'Email')}
                            className="p-1.5 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded"
                            title="Copy Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedGuest(guest)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-sky-50 rounded"
                            title="View Full Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditGuest(guest)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-sky-50 rounded"
                            title="Edit Profile"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Profile Modal */}
      {selectedGuest && (
        <Modal
          isOpen={!!selectedGuest}
          onClose={() => setSelectedGuest(null)}
          title={`Guest Profile — ${selectedGuest.name}`}
          subtitle={`Patron ID: ${selectedGuest.id} • Registered since ${selectedGuest.createdAt}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Top Identity Banner */}
            <div className="bg-sky-50/70 p-5 rounded-xl border border-sky-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 border border-sky-200 text-sky-800 font-bold text-lg flex items-center justify-center">
                  {selectedGuest.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {selectedGuest.name}
                    </h3>
                    {selectedGuest.vipTier && <Badge status={selectedGuest.vipTier} />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{selectedGuest.nationality || 'International'}</span>
                    <span>•</span>
                    <span>{selectedGuest.phone}</span>
                    <span>•</span>
                    <span>{selectedGuest.email}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Lifetime Value</span>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  ₹{selectedGuest.totalSpend.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => simulateCall(selectedGuest)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-sky-500 text-white rounded-lg hover:bg-sky-600 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Phone ({selectedGuest.phone})</span>
              </button>
              <button
                type="button"
                onClick={() => copyContact(selectedGuest.email, 'Email')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-sky-50"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </button>
            </div>

            {/* Preferences & Dietary Section */}
            <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-500">
                Hospitality & Stay Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block">Room Preference:</span>
                  <span className="font-semibold text-slate-800">{selectedGuest.preferences?.roomType || 'Deluxe King (High Floor)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Favorite Beverage Amenity:</span>
                  <span className="font-semibold text-slate-800">{selectedGuest.preferences?.favoriteWineOrBeverage || 'Grand Vintage Champagne'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Dining Area Preference:</span>
                  <span className="font-semibold text-slate-800">{selectedGuest.preferences?.diningArea || 'Indoor Main Dining / Wine Cellar'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Dietary Restrictions:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedGuest.preferences?.dietaryRestrictions?.join(', ') || 'None recorded'}
                  </span>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            {selectedGuest.notes && (
              <div className="space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500">
                  Front Desk & Concierge Protocols
                </span>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedGuest.notes}
                </p>
              </div>
            )}

            {/* Stay & Dining History Tables */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-500">
                Verified Stay & Dining History ({guestStays.length} Stays, {guestDinings.length} Dining Visits)
              </h4>
              {guestStays.length > 0 && (
                <div className="border border-sky-100 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sky-50/50 text-[10px] text-slate-500 uppercase border-b border-sky-100">
                      <tr>
                        <th className="p-2.5">Booking Code</th>
                        <th className="p-2.5">Dates</th>
                        <th className="p-2.5">Room</th>
                        <th className="p-2.5">Total</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {guestStays.map((st) => (
                        <tr key={st.id} className="hover:bg-sky-50/30">
                          <td className="p-2.5 font-mono font-semibold text-slate-900">{st.bookingCode}</td>
                          <td className="p-2.5 text-slate-600">{st.checkInDate} → {st.checkOutDate}</td>
                          <td className="p-2.5 text-slate-700">{st.roomCategory} {st.roomNumber ? `(${st.roomNumber})` : ''}</td>
                          <td className="p-2.5 font-mono font-semibold text-slate-900">₹{st.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="p-2.5"><Badge status={st.status} size="sm" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const target = selectedGuest;
                  setSelectedGuest(null);
                  onEditGuest(target);
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-sky-50 text-slate-700 rounded-lg border border-slate-200"
              >
                Edit Guest Profile
              </button>
              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
