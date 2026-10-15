import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Clock,
  Calendar,
  ChevronDown,
  Building2,
  Check,
  UserCheck,
  PhoneForwarded,
  Sparkles,
  Mic
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HotelSettings, UserProfile } from '../../types';
import { MUMBAI_HOTELS } from '../../services/mumbaiHotelsData';
import { ApiService } from '../../services/api';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onOpenNewReservation: () => void;
  onOpenNewTableBooking: () => void;
  onOpenNewGuest: () => void;
  hotelSettings: HotelSettings;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenUserBookings: () => void;
  onSignOut: () => void;
  onOpenAiVoiceReceptionist?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  onOpenNewReservation,
  onOpenNewTableBooking,
  onOpenNewGuest,
  hotelSettings,
  currentUser,
  onOpenAuthModal,
  onOpenUserBookings,
  onSignOut,
  onOpenAiVoiceReceptionist,
}) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHotelPicker, setShowHotelPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const hotelPickerRef = useRef<HTMLDivElement>(null);

  // Notifications list
  const [notifications, setNotifications] = useState([
    {
      id: 'nt-1',
      title: 'VIP Arrival Expected in 45 Mins',
      desc: 'Sir Arthur Pendelton arriving for Suite 401. Discreet check-in pre-arranged.',
      time: '14:25',
      type: 'vip',
      read: false,
    },
    {
      id: 'nt-2',
      title: 'Sommelier Pairing Request',
      desc: 'Table 12 (Wine Cellar) requested Sommelier Bertrand for 19:30 dinner seating.',
      time: '14:15',
      type: 'dining',
      read: false,
    },
    {
      id: 'nt-3',
      title: 'Missed Call Logged',
      desc: 'Caller +377 93 15 28 00 requested urgent callback regarding suite buyout.',
      time: '09:12',
      type: 'call',
      read: false,
    },
    {
      id: 'nt-4',
      title: 'Housekeeping Release',
      desc: 'Room 202 (Deluxe King) inspected and marked Available.',
      time: '08:40',
      type: 'room',
      read: true,
    },
  ]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setShowQuickMenu(false);
      }
      if (hotelPickerRef.current && !hotelPickerRef.current.contains(e.target as Node)) {
        setShowHotelPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/reservations?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="h-16 bg-white border-b border-sky-100 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Location Indicator */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-sky-50 rounded-lg lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Interactive Mumbai Hotel Property Switcher */}
        <div className="relative" ref={hotelPickerRef}>
          <button
            type="button"
            onClick={() => setShowHotelPicker(!showHotelPicker)}
            className="flex items-center gap-2 p-1.5 hover:bg-sky-50 rounded-lg transition-colors text-left"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block leading-tight truncate max-w-[200px] sm:max-w-[280px]">
                {hotelSettings.name}
              </span>
              <span className="text-[10px] text-slate-500 truncate block">
                {hotelSettings.address.split(',')[1]?.trim() || 'Mumbai'} • {hotelSettings.currencySymbol} INR
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showHotelPicker && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-sky-100 py-2 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                <span>Switch Mumbai Hotel Property</span>
                <span className="text-sky-600 font-mono">5-Star</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {MUMBAI_HOTELS.map((h) => {
                  const isCurrent = h.name === hotelSettings.name;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={async () => {
                        await ApiService.switchActiveHotel(h.id);
                        setShowHotelPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 hover:bg-sky-50 flex items-center justify-between gap-2 transition-colors ${
                        isCurrent ? 'bg-sky-50/70 font-semibold text-sky-900' : 'text-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{h.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{h.neighborhood}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-slate-900 font-bold block">
                          ₹{h.startingPrice.toLocaleString('en-IN')}
                        </span>
                        {isCurrent && <span className="text-[9px] text-emerald-600 font-bold uppercase">Active</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 mt-1 border-t border-slate-100 px-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowHotelPicker(false);
                    navigate('/hotels');
                  }}
                  className="w-full py-1.5 text-center text-xs font-bold text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  View All Mumbai Hotels & Booking Portal →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest, room #, booking code, phone..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Right: AI Receptionist, Operational Clock, Quick Actions, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Direct Book Hotels Link */}
        <button
          type="button"
          onClick={() => navigate('/hotels')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 shadow-2xs transition-colors"
        >
          <Building2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Book Mumbai Hotels</span>
        </button>

        {/* Prominent AI Voice Receptionist Button */}
        {onOpenAiVoiceReceptionist && (
          <button
            type="button"
            onClick={onOpenAiVoiceReceptionist}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-xs transition-all border border-sky-400 hover:shadow-sky-200 hover:shadow-sm"
            title="Open Voice Assistant Booking Receptionist"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">AI Voice Receptionist</span>
            <span className="inline sm:hidden">Voice</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-200 animate-ping" />
          </button>
        )}

        {/* Operational Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-sky-50/70 rounded-lg border border-sky-100 text-xs text-slate-600 font-mono">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>{currentTime}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-sans text-[11px]">{currentDate}</span>
        </div>

        {/* Quick Action Button with Dropdown */}
        <div className="relative" ref={quickRef}>
          <button
            type="button"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New Booking</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-sky-100 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Quick Operations
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewReservation();
                }}
                className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center gap-2.5 text-slate-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Hotel Room Reservation</p>
                  <p className="text-[10px] text-slate-500">Book suite or villa for guest</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewTableBooking();
                }}
                className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center gap-2.5 text-slate-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Restaurant Table</p>
                  <p className="text-[10px] text-slate-500">Reserve table at Le Miroir</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewGuest();
                }}
                className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center gap-2.5 text-slate-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Add New Guest</p>
                  <p className="text-[10px] text-slate-500">Create guest directory profile</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-sky-50 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-sky-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Front Desk Notifications
                  </h4>
                  <p className="text-[10px] text-slate-500">{unreadCount} unread operational alerts</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[10px] text-sky-600 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 hover:bg-sky-50/50 transition-colors ${
                      !notif.read ? 'bg-sky-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                            notif.type === 'vip'
                              ? 'bg-amber-100 text-amber-800'
                              : notif.type === 'dining'
                              ? 'bg-emerald-100 text-emerald-800'
                              : notif.type === 'call'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {notif.type === 'vip' && <Sparkles className="w-3.5 h-3.5" />}
                          {notif.type === 'dining' && <Building2 className="w-3.5 h-3.5" />}
                          {notif.type === 'call' && <PhoneForwarded className="w-3.5 h-3.5" />}
                          {notif.type === 'room' && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-900">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {notif.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-500">
                  Telephony & front desk log synchronized
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Auth Section */}
        {currentUser ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg hover:bg-sky-50 border border-sky-100 text-xs transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-200 text-sky-800 font-bold text-[11px] flex items-center justify-center">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-semibold text-slate-900 block max-w-[120px] truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-sky-100 py-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenUserBookings();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-sky-50 text-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>My Bookings & Stays</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuthModal();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-sky-50 text-slate-800 flex items-center gap-2 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Switch Account / Sign In</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-sky-50 text-slate-900 rounded-lg border border-sky-200 transition-colors shadow-2xs"
          >
            <span>Sign In / Sign Up</span>
          </button>
        )}
      </div>
    </header>
  );
};
