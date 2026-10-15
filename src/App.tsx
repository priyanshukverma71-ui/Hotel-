/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Mic, Sparkles } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastProvider, useToast } from './components/common/Toast';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import { AuthService } from './services/auth';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { TableBookingsPage } from './pages/TableBookingsPage';
import { GuestDirectoryPage } from './pages/GuestDirectoryPage';
import { RoomsAvailabilityPage } from './pages/RoomsAvailabilityPage';
import { CallHistoryPage } from './pages/CallHistoryPage';
import { ReceptionistSettingsPage } from './pages/ReceptionistSettingsPage';
import { ReportsAnalyticsPage } from './pages/ReportsAnalyticsPage';
import { StaffPermissionsPage } from './pages/StaffPermissionsPage';
import { GeneralSettingsPage } from './pages/GeneralSettingsPage';
import { MumbaiHotelBookingPage } from './pages/MumbaiHotelBookingPage';

// Modals
import { ReservationModal } from './components/forms/ReservationModal';
import { TableBookingModal } from './components/forms/TableBookingModal';
import { GuestModal } from './components/forms/GuestModal';
import { AudioPlayerModal } from './components/common/AudioPlayerModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserBookingsModal } from './components/auth/UserBookingsModal';
import { AiVoiceAssistantModal } from './components/voice/AiVoiceAssistantModal';

// Types
import {
  HotelReservation,
  TableBooking,
  Guest,
  CallRecord,
  Room,
  OperationalStats,
  HotelSettings,
  UserProfile,
  MumbaiHotel,
} from './types';
import { INITIAL_HOTEL_SETTINGS } from './services/mockData';

function AppContent() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Navigation & Drawer
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App Data & Stats
  const [stats, setStats] = useState<OperationalStats | null>(null);
  const [hotelSettings, setHotelSettings] = useState<HotelSettings>(INITIAL_HOTEL_SETTINGS);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);
  const [allReservations, setAllReservations] = useState<HotelReservation[]>([]);
  const [activeHotelId, setActiveHotelId] = useState<string>(StorageService.getActiveHotelId());

  // Auth & Current User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authBookingIntent, setAuthBookingIntent] = useState<'room' | 'table' | null>(null);
  const [userBookingsModalOpen, setUserBookingsModalOpen] = useState(false);

  // Active Modals
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<HotelReservation | null>(null);

  const [tableBookingModalOpen, setTableBookingModalOpen] = useState(false);
  const [editingTableBooking, setEditingTableBooking] = useState<TableBooking | null>(null);

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [audioPlayerCall, setAudioPlayerCall] = useState<CallRecord | null>(null);

  // Voice Assistant Receptionist Modal
  const [aiVoiceModalOpen, setAiVoiceModalOpen] = useState(false);

  // Initialize data on mount
  const refreshAppData = async () => {
    const [s, settingsData, rList, tbList, resList] = await Promise.all([
      ApiService.getOperationalStats(),
      ApiService.getHotelSettings(),
      ApiService.getRooms(),
      ApiService.getTableBookings(),
      ApiService.getReservations(),
    ]);
    setStats(s);
    setHotelSettings(settingsData);
    setRooms(rList);
    setTableBookings(tbList);
    setAllReservations(resList);
  };

  useEffect(() => {
    StorageService.initDefaults();
    AuthService.init();
    setCurrentUser(AuthService.getCurrentUser());
    refreshAppData();

    const handleDataChanged = () => {
      refreshAppData();
    };

    const handleAuthChanged = () => {
      setCurrentUser(AuthService.getCurrentUser());
      refreshAppData();
    };

    window.addEventListener('raceai_data_changed', handleDataChanged);
    window.addEventListener('raceai_auth_changed', handleAuthChanged);
    return () => {
      window.removeEventListener('raceai_data_changed', handleDataChanged);
      window.removeEventListener('raceai_auth_changed', handleAuthChanged);
    };
  }, []);

  // Handlers for booking workflows with authentication check
  const handleOpenNewReservation = () => {
    if (!currentUser) {
      setAuthBookingIntent('room');
      setAuthModalOpen(true);
      return;
    }
    setEditingReservation(null);
    setReservationModalOpen(true);
  };

  const handleEditReservation = (res: HotelReservation) => {
    setEditingReservation(res);
    setReservationModalOpen(true);
  };

  const handleOpenNewTableBooking = () => {
    if (!currentUser) {
      setAuthBookingIntent('table');
      setAuthModalOpen(true);
      return;
    }
    setEditingTableBooking(null);
    setTableBookingModalOpen(true);
  };

  const handleEditTableBooking = (tb: TableBooking) => {
    setEditingTableBooking(tb);
    setTableBookingModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (authBookingIntent === 'room') {
      setEditingReservation(null);
      setReservationModalOpen(true);
    } else if (authBookingIntent === 'table') {
      setEditingTableBooking(null);
      setTableBookingModalOpen(true);
    }
    setAuthBookingIntent(null);
  };

  const handleSignOut = () => {
    AuthService.logout();
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const handleOpenNewGuest = () => {
    setEditingGuest(null);
    setGuestModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setGuestModalOpen(true);
  };

  const handleSelectCallRecord = (call: CallRecord) => {
    setAudioPlayerCall(call);
  };

  const handleViewBookingFromCall = (bookingId: string) => {
    setAudioPlayerCall(null);
    if (bookingId.startsWith('tbl-') || bookingId.startsWith('TB-')) {
      navigate('/table-bookings');
    } else {
      navigate('/reservations');
    }
  };

  // User personal bookings
  const userBookings = currentUser
    ? AuthService.getUserBookings(currentUser)
    : { reservations: [], tableBookings: [] };

  const handleCancelUserReservation = async (id: string) => {
    await ApiService.cancelReservation(id);
    showToast('Reservation cancelled.', 'info');
    refreshAppData();
  };

  const handleCancelUserTableBooking = async (id: string) => {
    await ApiService.updateTableBookingStatus(id, 'Cancelled');
    showToast('Table booking cancelled.', 'info');
    refreshAppData();
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f7ff]">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
            Initializing RACEAI Hotel Platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col text-slate-900 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        stats={stats}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        hotelName={hotelSettings.name}
        onOpenAiVoiceReceptionist={() => setAiVoiceModalOpen(true)}
      />

      {/* Main Content Area with Top Navbar */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-200">
        <Navbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenNewReservation={handleOpenNewReservation}
          onOpenNewTableBooking={handleOpenNewTableBooking}
          onOpenNewGuest={handleOpenNewGuest}
          hotelSettings={hotelSettings}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setAuthBookingIntent(null);
            setAuthModalOpen(true);
          }}
          onOpenUserBookings={() => setUserBookingsModalOpen(true)}
          onSignOut={handleSignOut}
          onOpenAiVoiceReceptionist={() => setAiVoiceModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route
              path="/hotels"
              element={
                <MumbaiHotelBookingPage
                  onOpenTableBookingForHotel={(hotel) => {
                    handleOpenNewTableBooking();
                  }}
                  onOpenAiVoiceReceptionist={() => setAiVoiceModalOpen(true)}
                  activeHotelId={activeHotelId}
                  onSelectActiveHotel={(hId) => {
                    setActiveHotelId(hId);
                    refreshAppData();
                  }}
                />
              }
            />
            <Route path="/book" element={<Navigate to="/hotels" replace />} />
            <Route
              path="/"
              element={
                <DashboardPage
                  onOpenNewReservation={handleOpenNewReservation}
                  onOpenNewTableBooking={handleOpenNewTableBooking}
                  onOpenNewGuest={handleOpenNewGuest}
                  onSelectCallRecord={handleSelectCallRecord}
                  onOpenAiVoiceReceptionist={() => setAiVoiceModalOpen(true)}
                />
              }
            />
            <Route
              path="/reservations"
              element={
                <ReservationsPage
                  onOpenNewReservation={handleOpenNewReservation}
                  onEditReservation={handleEditReservation}
                  availableRooms={rooms}
                />
              }
            />
            <Route
              path="/table-bookings"
              element={
                <TableBookingsPage
                  onOpenNewBooking={handleOpenNewTableBooking}
                  onEditBooking={handleEditTableBooking}
                />
              }
            />
            <Route
              path="/guests"
              element={
                <GuestDirectoryPage
                  onOpenNewGuest={handleOpenNewGuest}
                  onEditGuest={handleEditGuest}
                />
              }
            />
            <Route path="/rooms" element={<RoomsAvailabilityPage />} />
            <Route
              path="/calls"
              element={
                <CallHistoryPage
                  onSelectCallRecord={handleSelectCallRecord}
                  onViewBooking={handleViewBookingFromCall}
                  onOpenAiVoiceReceptionist={() => setAiVoiceModalOpen(true)}
                />
              }
            />
            <Route
              path="/receptionist-settings"
              element={
                <ReceptionistSettingsPage
                  onOpenAiVoiceReceptionist={() => setAiVoiceModalOpen(true)}
                />
              }
            />
            <Route path="/analytics" element={<ReportsAnalyticsPage />} />
            <Route path="/staff" element={<StaffPermissionsPage />} />
            <Route path="/settings" element={<GeneralSettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating AI Voice Receptionist Button (Light Blue & White Theme) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setAiVoiceModalOpen(true)}
          className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-full shadow-lg shadow-sky-500/30 border border-sky-400 transition-all transform hover:scale-105 active:scale-95"
          title="Open AI Voice Booking Receptionist"
        >
          <div className="relative">
            <Mic className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-tight tracking-wide flex items-center gap-1">
              <span>Voice Receptionist</span>
              <Sparkles className="w-3 h-3 text-sky-200" />
            </p>
            <p className="text-[10px] text-sky-100 leading-tight">Instant Voice Booking</p>
          </div>
        </button>
      </div>

      {/* Global Interactive Modals */}
      {aiVoiceModalOpen && (
        <AiVoiceAssistantModal
          isOpen={aiVoiceModalOpen}
          onClose={() => setAiVoiceModalOpen(false)}
          currentUser={currentUser}
          onNavigateToBooking={(refCode, type) => {
            if (type === 'room') {
              navigate('/reservations');
            } else {
              navigate('/table-bookings');
            }
          }}
        />
      )}

      {reservationModalOpen && (
        <ReservationModal
          isOpen={reservationModalOpen}
          onClose={() => {
            setReservationModalOpen(false);
            setEditingReservation(null);
          }}
          reservation={editingReservation}
          onSaved={() => refreshAppData()}
          availableRooms={rooms}
          currentUser={currentUser}
        />
      )}

      {tableBookingModalOpen && (
        <TableBookingModal
          isOpen={tableBookingModalOpen}
          onClose={() => {
            setTableBookingModalOpen(false);
            setEditingTableBooking(null);
          }}
          booking={editingTableBooking}
          onSaved={() => refreshAppData()}
          existingBookings={tableBookings}
          currentUser={currentUser}
        />
      )}

      {guestModalOpen && (
        <GuestModal
          isOpen={guestModalOpen}
          onClose={() => {
            setGuestModalOpen(false);
            setEditingGuest(null);
          }}
          guest={editingGuest}
          onSaved={() => refreshAppData()}
        />
      )}

      {audioPlayerCall && (
        <AudioPlayerModal
          isOpen={!!audioPlayerCall}
          onClose={() => setAudioPlayerCall(null)}
          call={audioPlayerCall}
          onViewLinkedBooking={handleViewBookingFromCall}
        />
      )}

      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setAuthBookingIntent(null);
          }}
          onSuccess={handleAuthSuccess}
          bookingIntentContext={authBookingIntent}
        />
      )}

      {userBookingsModalOpen && currentUser && (
        <UserBookingsModal
          isOpen={userBookingsModalOpen}
          onClose={() => setUserBookingsModalOpen(false)}
          user={currentUser}
          reservations={userBookings.reservations}
          tableBookings={userBookings.tableBookings}
          onCancelReservation={handleCancelUserReservation}
          onCancelTableBooking={handleCancelUserTableBooking}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}
