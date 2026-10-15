import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  UtensilsCrossed,
  PhoneCall,
  Percent,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  UserCheck,
  ChevronRight,
  Sparkles,
  Mic,
  Bot,
  Volume2,
  Building2,
  Hotel
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { ApiService } from '../services/api';
import {
  HotelReservation,
  TableBooking,
  Room,
  CallRecord,
  OperationalStats,
} from '../types';
import { TODAY } from '../services/mockData';
import { useToast } from '../components/common/Toast';

interface DashboardPageProps {
  onOpenNewReservation: () => void;
  onOpenNewTableBooking: () => void;
  onOpenNewGuest: () => void;
  onSelectCallRecord: (call: CallRecord) => void;
  onOpenAiVoiceReceptionist?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenNewReservation,
  onOpenNewTableBooking,
  onOpenNewGuest,
  onSelectCallRecord,
  onOpenAiVoiceReceptionist,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState<OperationalStats | null>(null);
  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [s, resList, tblList, callList, roomList] = await Promise.all([
        ApiService.getOperationalStats(),
        ApiService.getReservations(),
        ApiService.getTableBookings(),
        ApiService.getCalls(),
        ApiService.getRooms(),
      ]);
      setStats(s);
      setReservations(resList);
      setTableBookings(tblList);
      setCalls(callList);
      setRooms(roomList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('raceai_data_changed', handleUpdate);
    return () => window.removeEventListener('raceai_data_changed', handleUpdate);
  }, []);

  const handleQuickCheckIn = async (resId: string) => {
    try {
      await ApiService.checkInGuest(resId);
      showToast('Guest marked as Checked In.', 'success');
      loadData();
    } catch {
      showToast('Check-in failed.', 'error');
    }
  };

  const handleQuickCheckOut = async (resId: string) => {
    try {
      await ApiService.checkOutGuest(resId);
      showToast('Guest checked out. Room marked for cleaning.', 'info');
      loadData();
    } catch {
      showToast('Check-out failed.', 'error');
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold animate-pulse">
          Loading Front Desk Operations...
        </div>
      </div>
    );
  }

  // Today's arrivals and departures
  const todayArrivals = reservations.filter((r) => r.checkInDate === TODAY && r.status !== 'Cancelled');
  const todayDepartures = reservations.filter((r) => r.checkOutDate === TODAY && r.status !== 'Cancelled');
  const todayRestaurantBookings = tableBookings.filter((t) => t.date === TODAY && t.status !== 'Cancelled');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Operational Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Hotel Operations Dashboard
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              Live Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time room occupancy, dining seatings, arrivals, and receptionist telephony status.
          </p>
        </div>

        {/* Quick Operations Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/hotels')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-xs"
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>Book Mumbai Hotels</span>
          </button>

          {onOpenAiVoiceReceptionist && (
            <button
              type="button"
              onClick={onOpenAiVoiceReceptionist}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>Voice Receptionist</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNewReservation}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewTableBooking}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-sky-50 text-slate-800 rounded-lg border border-sky-200 transition-colors shadow-2xs"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-sky-600" />
            <span>Book Table</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewGuest}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-sky-50 text-slate-800 rounded-lg border border-sky-200 transition-colors shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase: AI Voice Booking Receptionist */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white shadow-sm border border-sky-400/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-white tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>AI Voice Booking Receptionist • Active 24/7</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Instant Hotel Room & Dining Table Voice Reservations
            </h3>
            <p className="text-xs text-sky-100 leading-relaxed">
              Speak naturally with Aria to confirm luxury suite reservations, book tables at Le Miroir with instant conflict checks, or query hotel amenities, parking, and dress codes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {onOpenAiVoiceReceptionist && (
              <button
                type="button"
                onClick={onOpenAiVoiceReceptionist}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-sky-900 font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Mic className="w-4 h-4 text-sky-600 animate-pulse" />
                <span>Talk to Receptionist</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/receptionist-settings')}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/20"
            >
              <span>Receptionist Rules</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          subtitle={`${stats.activeStaysCount} active stays in-house`}
          icon={Percent}
          trend={{ value: '+4.2%', isPositive: true, label: 'vs last week' }}
        />
        <StatCard
          title="Available Rooms"
          value={stats.availableRoomsCount}
          subtitle={`Out of ${stats.totalRoomsCount} luxury suites`}
          icon={BedDouble}
          onClick={() => navigate('/rooms')}
        />
        <StatCard
          title="Today's Arrivals"
          value={stats.todayCheckInsCount}
          subtitle="Check-ins scheduled"
          icon={ArrowDownLeft}
          onClick={() => navigate('/reservations')}
        />
        <StatCard
          title="Today's Departures"
          value={stats.todayCheckOutsCount}
          subtitle="Check-outs pending"
          icon={ArrowUpRight}
          onClick={() => navigate('/reservations')}
        />
        <StatCard
          title="Today's Tables"
          value={stats.todayTableBookingsCount}
          subtitle="Dining reservations"
          icon={UtensilsCrossed}
          onClick={() => navigate('/table-bookings')}
        />
        <StatCard
          title="Calls Handled"
          value={stats.todayCallsCount.incoming}
          subtitle={`${stats.todayCallsCount.missed} missed • ${stats.todayCallsCount.answered} answered`}
          icon={PhoneCall}
          onClick={() => navigate('/calls')}
        />
      </div>

      {/* Revenue & Telephony Performance Mini-Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-sky-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Today's Revenue Realization
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              ${stats.revenueSummary.totalRevenueToday.toLocaleString()}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
              <span>Room Stays: <strong className="text-slate-900 font-semibold">${stats.revenueSummary.roomRevenueToday.toLocaleString()}</strong></span>
              <span>•</span>
              <span>Restaurant & Dining: <strong className="text-slate-900 font-semibold">${stats.revenueSummary.diningRevenueToday.toLocaleString()}</strong></span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 hover:text-sky-800 border border-sky-200 rounded-lg bg-sky-50/70 hover:bg-sky-100 transition-colors"
          >
            <span>View Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Telephony Status */}
        <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                Receptionist Telephony
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Call Flow • 0 Queue Wait
            </p>
            <div className="text-xs text-slate-300 font-mono pt-1">
              {stats.todayCallsCount.answered} Answered / {stats.todayCallsCount.incoming} Total
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/receptionist-settings')}
            className="text-xs text-sky-400 hover:text-sky-300 underline font-medium"
          >
            Rules & FAQs
          </button>
        </div>
      </div>

      {/* Main Operational Split: Recent Hotel Reservations & Restaurant Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Reservations Table */}
        <div className="lg:col-span-2 bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50/60 to-white">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Recent Hotel Reservations
              </h3>
              <p className="text-xs text-slate-500">Front desk bookings and verified guest stays</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/reservations')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 uppercase tracking-wider inline-flex items-center gap-1"
            >
              <span>All Reservations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-400 bg-sky-50/40">
                  <th className="py-2.5 px-4 font-semibold">Guest</th>
                  <th className="py-2.5 px-4 font-semibold">Dates</th>
                  <th className="py-2.5 px-4 font-semibold">Suite Category</th>
                  <th className="py-2.5 px-4 font-semibold">Amount</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {reservations.slice(0, 6).map((res) => (
                  <tr key={res.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{res.guestName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{res.bookingCode}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{res.checkInDate}</div>
                      <div className="text-[10px] text-slate-400">to {res.checkOutDate} ({res.totalNights}n)</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{res.roomCategory}</div>
                      <div className="text-[11px] text-sky-700">
                        {res.roomNumber ? `Room ${res.roomNumber}` : 'Unassigned'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 font-mono">
                      ${res.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={res.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {res.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleQuickCheckIn(res.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 rounded-md border border-sky-200 transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      {res.status === 'Checked In' && (
                        <button
                          type="button"
                          onClick={() => handleQuickCheckOut(res.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 rounded-md border border-amber-200 transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                      {(res.status === 'Checked Out' || res.status === 'Cancelled') && (
                        <span className="text-[11px] text-slate-400 italic">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Today's Restaurant Dining Schedule */}
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="px-5 py-4 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50/60 to-white">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Today's Dining Schedule
              </h3>
              <p className="text-xs text-slate-500">Wasabi by Morimoto, Shamiana & Fine Dining</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/table-bookings')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 uppercase tracking-wider"
            >
              Floor Plan
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {todayRestaurantBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No table bookings scheduled for today.
              </div>
            ) : (
              todayRestaurantBookings.map((tb) => (
                <div
                  key={tb.id}
                  className="p-3 rounded-lg border border-sky-100 bg-sky-50/30 hover:border-sky-300 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-700">
                      {tb.timeSlot}
                    </span>
                    <Badge status={tb.status} size="sm" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xs font-semibold text-slate-900">
                      {tb.guestName}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {tb.partySize} {tb.partySize === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>{tb.tableNumber}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{tb.diningArea.split(' ')[0]}</span>
                  </div>
                  {tb.dietaryRequirements && tb.dietaryRequirements.length > 0 && (
                    <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Dietary: {tb.dietaryRequirements.join(', ')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-sky-50/50 border-t border-sky-100 text-center">
            <button
              type="button"
              onClick={onOpenNewTableBooking}
              className="w-full py-2 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-sky-500 hover:text-white text-slate-800 rounded-lg border border-sky-200 transition-colors shadow-2xs"
            >
              + Book New Table
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Arrivals/Departures & Recent Receptionist Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arrivals & Departures Today */}
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <h3 className="text-base font-semibold text-slate-900">
              Today's Key Movements
            </h3>
            <span className="text-xs text-slate-400 font-mono">{TODAY}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Arrivals */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Arrivals Today ({todayArrivals.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {todayArrivals.map((res) => (
                  <div key={res.id} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-0.5">
                    <div className="font-semibold text-slate-900">{res.guestName}</div>
                    <div className="text-[11px] text-emerald-800">{res.roomCategory} • {res.roomNumber ? `Room ${res.roomNumber}` : 'Assigning'}</div>
                    <div className="text-[10px] text-slate-500">{res.specialRequests || 'Standard VIP arrival'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departures */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Departures Today ({todayDepartures.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {todayDepartures.map((res) => (
                  <div key={res.id} className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs space-y-0.5">
                    <div className="font-semibold text-slate-900">{res.guestName}</div>
                    <div className="text-[11px] text-amber-900">Room {res.roomNumber || '—'} • {res.roomCategory}</div>
                    <div className="text-[10px] text-slate-500">Bill: ₹{res.totalAmount.toLocaleString('en-IN')} • {res.paymentStatus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Receptionist Voice Telephony Activity */}
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Receptionist Activity
              </h3>
              <p className="text-xs text-slate-500">Latest telephone interactions & bookings</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/calls')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 uppercase tracking-wider"
            >
              Full Call Log
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {calls.slice(0, 4).map((call) => (
              <div
                key={call.id}
                onClick={() => onSelectCallRecord(call)}
                className="p-3 rounded-lg border border-sky-100 bg-sky-50/30 hover:bg-sky-50 cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {call.callerName}
                    </span>
                    <Badge status={call.purpose} size="sm" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{call.dateTime.split(' ')[1]}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">
                  {call.agentSummary}
                </p>
                <div className="flex items-center justify-between text-[10px] text-sky-700">
                  <span>Outcome: {call.outcome}</span>
                  {call.hasRecording && <span className="font-mono text-slate-400">Audio log ({call.recordingDuration})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
