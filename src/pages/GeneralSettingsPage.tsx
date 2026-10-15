import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Building2,
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';
import { ApiService } from '../services/api';
import { HotelSettings } from '../types';
import { useToast } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const GeneralSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; mode: string }>({
    connected: false,
    mode: 'Checking...',
  });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = async () => {
    const [data, conn] = await Promise.all([
      ApiService.getHotelSettings(),
      ApiService.checkConnection(),
    ]);
    setSettings(data);
    setBackendStatus(conn);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-xs text-slate-400 animate-pulse">
        Loading General Settings...
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ApiService.saveHotelSettings(settings);
      showToast('Hotel profile and general settings saved successfully.', 'success');
    } catch {
      showToast('Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    try {
      await ApiService.resetDemoData();
      showToast('Demonstration data restored to default pristine state.', 'info');
      loadSettings();
    } catch {
      showToast('Failed to reset demo data.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Property & General Settings
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              System Config
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure hotel identity, regional currencies, notification channels, security policies, and database connection.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hotel Profile */}
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
            <Building2 className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Hotel Property Profile & Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hotel Trade Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reservations Direct Telephone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Reservations Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Booking Website URL
              </label>
              <input
                type="url"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Regional & Currency Formats */}
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
            <Globe className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Regional Formats & Currency
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operating Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => {
                  const curr = e.target.value;
                  const sym = curr === 'INR' ? '₹' : curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '₹';
                  setSettings({ ...settings, currency: curr, currencySymbol: sym });
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ) - UAE Dirham</option>
                <option value="SGD">SGD (S$)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operating Timezone
              </label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Format
              </label>
              <select
                value={settings.timeFormat}
                onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="24-hour">24-Hour (19:30)</option>
                <option value="12-hour">12-Hour AM/PM (7:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational Notifications */}
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
            <Bell className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Front Desk Alert & Notification Rules
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.newRoomBooking}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, newRoomBooking: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span>Trigger instant dashboard alert when voice receptionist logs a new room reservation</span>
            </label>

            <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.newTableBooking}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, newTableBooking: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span>Notify restaurant host desk when a dining reservation is placed</span>
            </label>

            <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.missedCallAlert}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, missedCallAlert: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span>Urgent notification badge when an incoming caller disconnects prior to answering</span>
            </label>
          </div>
        </div>

        {/* Database & REST Backend Service Status Panel */}
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Database & REST Backend Service Status
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              MongoDB Compatible
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">API Data Storage Layer</span>
                <span className="inline-flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {backendStatus.mode}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Persistent local schema store with live event reactivity. When <code>raceai-backend.js</code> is started on port 5000 with <code>MONGODB_URI</code>, frontend seamlessly syncs with live REST endpoints.
              </p>
            </div>

            <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 space-y-1.5">
              <span className="font-semibold text-slate-900">Demonstration Dataset</span>
              <p className="text-slate-600 leading-relaxed">
                Reset all room states, bookings, guest histories, and telephone records back to initial luxury demo values anytime.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                >
                  Reset Demo Dataset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Demonstration Data"
        message="Are you sure you want to reset all hotel rooms, reservations, table bookings, guests, and call records? Any newly created test records will be restored to default luxury demonstration presets."
        confirmLabel="Reset Data"
        isDestructive={true}
      />
    </div>
  );
};
