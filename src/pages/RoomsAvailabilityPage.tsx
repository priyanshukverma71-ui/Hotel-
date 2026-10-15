import React, { useState, useEffect, useMemo } from 'react';
import {
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Edit
} from 'lucide-react';
import { ApiService } from '../services/api';
import { Room, RoomCategory, RoomStatus, HotelReservation } from '../types';
import { Badge } from '../components/common/Badge';
import { RoomModal } from '../components/forms/RoomModal';
import { TODAY } from '../services/mockData';
import { useToast } from '../components/common/Toast';

export const RoomsAvailabilityPage: React.FC = () => {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'inventory' | 'calendar'>('inventory');
  const [selectedRoomForEdit, setSelectedRoomForEdit] = useState<Room | null>(null);

  // Calendar date span: 7 days starting from today
  const [calendarStartDate, setCalendarStartDate] = useState<string>(TODAY);

  const loadData = async () => {
    const [rList, resList] = await Promise.all([
      ApiService.getRooms(),
      ApiService.getReservations(),
    ]);
    setRooms(rList);
    setReservations(resList);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('raceai_data_changed', handleUpdate);
    return () => window.removeEventListener('raceai_data_changed', handleUpdate);
  }, []);

  const handleQuickStatusChange = async (roomId: string, newStatus: RoomStatus) => {
    try {
      await ApiService.setRoomStatus(roomId, newStatus);
      showToast(`Room marked as ${newStatus}.`, 'success');
      loadData();
    } catch {
      showToast('Failed to update room status.', 'error');
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((rm) => {
      if (categoryFilter !== 'all' && rm.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && rm.status !== statusFilter) return false;
      return true;
    });
  }, [rooms, categoryFilter, statusFilter]);

  // Generate 7 consecutive days for availability calendar
  const calendarDays = useMemo(() => {
    const start = new Date(calendarStartDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      return { dateStr, weekday, dayNum, isToday: dateStr === TODAY };
    });
  }, [calendarStartDate]);

  const changeCalendarBy = (days: number) => {
    const d = new Date(calendarStartDate);
    d.setDate(d.getDate() + days);
    setCalendarStartDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Rooms Inventory & Availability
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              {rooms.length} Suites
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time room status, housekeeping turnover, nightly rate configuration, and occupancy calendar.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('inventory')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              viewMode === 'inventory' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inventory Cards & List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7-Day Availability Matrix
          </button>
        </div>
      </div>

      {/* Category Rate Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { cat: 'Superior King', rate: '$380', count: 4 },
          { cat: 'Deluxe King', rate: '$520', count: 4 },
          { cat: 'Executive Suite', rate: '$850', count: 3 },
          { cat: 'Presidential Suite', rate: '$1,850', count: 2 },
          { cat: 'Garden Villa', rate: '$1,450', count: 3 },
          { cat: 'Terrace Penthouse', rate: '$2,400', count: 1 },
        ].map((item) => (
          <div
            key={item.cat}
            onClick={() => setCategoryFilter(categoryFilter === item.cat ? 'all' : item.cat)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              categoryFilter === item.cat
                ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                : 'bg-white border-sky-100 hover:border-sky-300'
            }`}
          >
            <p className={`text-[10px] uppercase tracking-wider font-semibold truncate ${categoryFilter === item.cat ? 'text-sky-100' : 'text-slate-400'}`}>
              {item.cat}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-bold text-base font-mono">{item.rate}</span>
              <span className={`text-[10px] ${categoryFilter === item.cat ? 'text-sky-100' : 'text-slate-500'}`}>
                {item.count} rooms
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
          >
            <option value="all">All Room Categories</option>
            <option value="Superior King">Superior King</option>
            <option value="Deluxe King">Deluxe King</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Presidential Suite">Presidential Suite</option>
            <option value="Garden Villa">Garden Villa</option>
            <option value="Terrace Penthouse">Terrace Penthouse</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </div>
      </div>

      {viewMode === 'inventory' ? (
        /* Inventory Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRooms.map((rm) => (
            <div
              key={rm.id}
              className="bg-white rounded-xl border border-sky-100 p-4 space-y-3 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      Room {rm.roomNumber}
                    </span>
                    <p className="text-xs font-semibold text-sky-700 mt-0.5">{rm.category}</p>
                  </div>
                  <Badge status={rm.status} size="sm" />
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Floor:</span>
                    <span className="font-semibold text-slate-700">Floor {rm.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Capacity:</span>
                    <span className="font-semibold text-slate-700">{rm.capacity} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nightly Rate:</span>
                    <span className="font-mono font-semibold text-slate-900">₹{rm.nightlyRate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Housekeeping:</span>
                    <span className="font-semibold text-slate-700">
                      {rm.status === 'Cleaning' ? 'In Progress' : 'Inspected'}
                    </span>
                  </div>
                </div>

                {rm.amenities && rm.amenities.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {rm.amenities.slice(0, 3).map((f) => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-100">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Action Switcher */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={rm.status}
                  onChange={(e) => handleQuickStatusChange(rm.id, e.target.value as RoomStatus)}
                  className="flex-1 py-1 px-2 text-[11px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSelectedRoomForEdit(rm)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-sky-50 rounded"
                  title="Configure Room & Rate"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 7-Day Matrix Calendar */
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeCalendarBy(-7)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-sky-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-800">
                7-Day Matrix ({calendarDays[0].dateStr} to {calendarDays[6].dateStr})
              </span>
              <button
                type="button"
                onClick={() => changeCalendarBy(7)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-sky-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sky-100 bg-sky-50/40 text-slate-500">
                  <th className="p-3 w-44 font-semibold">Room & Type</th>
                  {calendarDays.map((cd) => (
                    <th key={cd.dateStr} className={`p-3 text-center ${cd.isToday ? 'bg-sky-100/60 font-bold text-sky-900' : ''}`}>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">{cd.weekday}</div>
                      <div className="text-sm font-semibold">{cd.dayNum}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((rm) => (
                  <tr key={rm.id} className="hover:bg-sky-50/20">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">Room {rm.roomNumber}</div>
                      <div className="text-[10px] text-sky-700">{rm.category}</div>
                    </td>
                    {calendarDays.map((cd) => {
                      // Check if room has reservation covering this date
                      const res = reservations.find(
                        (r) =>
                          r.roomNumber === rm.roomNumber &&
                          r.status !== 'Cancelled' &&
                          r.checkInDate <= cd.dateStr &&
                          r.checkOutDate > cd.dateStr
                      );

                      return (
                        <td key={cd.dateStr} className="p-2 text-center">
                          {res ? (
                            <div className="p-1.5 rounded-lg bg-sky-100 border border-sky-200 text-sky-900 text-[10px] font-semibold truncate">
                              {res.guestName.split(' ')[0]}
                            </div>
                          ) : (
                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 text-[10px]">
                              Free
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRoomForEdit && (
        <RoomModal
          isOpen={!!selectedRoomForEdit}
          onClose={() => setSelectedRoomForEdit(null)}
          room={selectedRoomForEdit}
          onSaved={() => loadData()}
        />
      )}
    </div>
  );
};
