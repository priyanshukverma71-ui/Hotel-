import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Clock,
  Phone,
  MessageSquare,
  ShieldAlert,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Mic
} from 'lucide-react';
import { ApiService } from '../services/api';
import { ReceptionistSettingsConfig } from '../types';
import { useToast } from '../components/common/Toast';

interface ReceptionistSettingsPageProps {
  onOpenAiVoiceReceptionist?: () => void;
}

export const ReceptionistSettingsPage: React.FC<ReceptionistSettingsPageProps> = ({
  onOpenAiVoiceReceptionist,
}) => {
  const { showToast } = useToast();
  const [config, setConfig] = useState<ReceptionistSettingsConfig | null>(null);
  const [initialConfig, setInitialConfig] = useState<ReceptionistSettingsConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'greetings' | 'faqs' | 'rules' | 'escalation'>('general');
  const [isSaving, setIsSaving] = useState(false);

  // New FAQ Form State
  const [newFaqCategory, setNewFaqCategory] = useState('Check-In & Stay');
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [showAddFaq, setShowAddFaq] = useState(false);

  const loadConfig = async () => {
    const data = await ApiService.getReceptionistConfig();
    setConfig(JSON.parse(JSON.stringify(data)));
    setInitialConfig(JSON.parse(JSON.stringify(data)));
  };

  useEffect(() => {
    loadConfig();
  }, []);

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-xs text-slate-400 animate-pulse font-semibold">
        Loading Receptionist Configuration...
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await ApiService.saveReceptionistConfig(config);
      setInitialConfig(JSON.parse(JSON.stringify(config)));
      showToast('Receptionist settings and hospitality policies saved.', 'success');
    } catch {
      showToast('Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (initialConfig) {
      setConfig(JSON.parse(JSON.stringify(initialConfig)));
      showToast('Changes discarded.', 'info');
    }
  };

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      showToast('Please provide both question and response.', 'error');
      return;
    }
    const newFaq = {
      id: 'faq-' + Date.now(),
      category: newFaqCategory,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
    };
    setConfig({
      ...config,
      faqs: [...config.faqs, newFaq],
    });
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setShowAddFaq(false);
    showToast('FAQ topic added to approved knowledge base.', 'success');
  };

  const handleDeleteFaq = (id: string) => {
    setConfig({
      ...config,
      faqs: config.faqs.filter((f) => f.id !== id),
    });
    showToast('FAQ removed.', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Receptionist Operational Settings
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              Voice Reception Gateway
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated phone greeting scripts, business hours, approved responses, booking policies, and staff transfer escalations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenAiVoiceReceptionist && (
            <button
              type="button"
              onClick={onOpenAiVoiceReceptionist}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>Test Voice Receptionist</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDiscard}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200">
        {[
          { key: 'general', label: 'General & Status' },
          { key: 'hours', label: 'Operating & Dining Hours' },
          { key: 'greetings', label: 'Greetings & Phrasing' },
          { key: 'faqs', label: 'Approved FAQs & Policies' },
          { key: 'rules', label: 'Reservation & Dining Rules' },
          { key: 'escalation', label: 'Staff Transfers & Escalation' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-sky-500 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-sky-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: General & Status */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Automated Call Handling Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enable or temporarily disable automated front desk telephone receptionist answering.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.callHandlingEnabled}
                onChange={(e) => setConfig({ ...config, callHandlingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hotel Legal / Trade Name
              </label>
              <input
                type="text"
                value={config.hotelName}
                onChange={(e) => setConfig({ ...config, hotelName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Hotline Telephone
              </label>
              <input
                type="text"
                value={config.hotelContactPhone}
                onChange={(e) => setConfig({ ...config, hotelContactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Physical Hotel Address
              </label>
              <input
                type="text"
                value={config.hotelAddress}
                onChange={(e) => setConfig({ ...config, hotelAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Concierge Contact Email
              </label>
              <input
                type="email"
                value={config.hotelContactEmail}
                onChange={(e) => setConfig({ ...config, hotelContactEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Telephony Language
              </label>
              <select
                value={config.primaryLanguage}
                onChange={(e) => setConfig({ ...config, primaryLanguage: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
              >
                <option value="English">English (US / UK International)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Japanese">Japanese (日本語)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hotel Operating Timezone
              </label>
              <input
                type="text"
                value={config.hotelTimezone}
                onChange={(e) => setConfig({ ...config, hotelTimezone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Operating & Dining Hours */}
      {activeTab === 'hours' && (
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Restaurant & Dining Service Windows (Le Miroir)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The phone receptionist will only confirm dining reservations within these active service windows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lunch Service Starts
              </label>
              <input
                type="time"
                value={config.restaurantHours.lunchOpen}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    restaurantHours: { ...config.restaurantHours, lunchOpen: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lunch Last Seating
              </label>
              <input
                type="time"
                value={config.restaurantHours.lunchClose}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    restaurantHours: { ...config.restaurantHours, lunchClose: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dinner Service Starts
              </label>
              <input
                type="time"
                value={config.restaurantHours.dinnerOpen}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    restaurantHours: { ...config.restaurantHours, dinnerOpen: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dinner Last Seating
              </label>
              <input
                type="time"
                value={config.restaurantHours.dinnerClose}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    restaurantHours: { ...config.restaurantHours, dinnerClose: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Holiday & Closure Schedule
            </h4>
            <div className="space-y-2">
              {[
                { date: '2026-11-26', name: 'Thanksgiving Evening Gala', specialHoursNote: 'Special Degustation 16:00 - 23:00', isOpen: true },
                { date: '2026-12-24', name: "Christmas Eve Grand Dinner", specialHoursNote: 'Seating 17:00 - 00:00', isOpen: true },
                { date: '2026-12-31', name: "New Year's Eve Masked Soirée", specialHoursNote: 'Buyout Event (Private Patrons)', isOpen: false },
              ].map((holiday, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-sky-50/40 border border-sky-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500">{holiday.date}</span>
                    <span className="font-semibold text-slate-900">{holiday.name}</span>
                  </div>
                  <span className={`text-[11px] font-medium ${holiday.isOpen ? 'text-amber-800' : 'text-rose-700'}`}>
                    {holiday.isOpen ? holiday.specialHoursNote : 'Fully Closed for Private Gala'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Greetings & Phrasing */}
      {activeTab === 'greetings' && (
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Reception Greeting & Closing Scripts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized luxury hospitality phrasing utilized during live customer voice telephony.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inbound Call Welcome Greeting
              </label>
              <textarea
                rows={3}
                value={config.greetingMessage}
                onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
                className="w-full p-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Call Conclusion & Farewells
              </label>
              <textarea
                rows={3}
                value={config.closingMessage}
                onChange={(e) => setConfig({ ...config, closingMessage: e.target.value })}
                className="w-full p-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Receptionist Spoken Language
              </label>
              <select
                value={config.primaryLanguage}
                onChange={(e) => setConfig({ ...config, primaryLanguage: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
              >
                {config.supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Approved FAQs & Policies */}
      {activeTab === 'faqs' && (
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Approved Answers & Operational FAQs ({config.faqs.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The receptionist speaks only verified hotel facts and policies to callers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddFaq(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ Topic</span>
            </button>
          </div>

          {showAddFaq && (
            <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Create Approved Reception Topic
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Check-In & Stay">Check-In & Stay</option>
                    <option value="Dining & Dress Code">Dining & Dress Code</option>
                    <option value="Transportation & Parking">Transportation & Parking</option>
                    <option value="Spa & Amenities">Spa & Amenities</option>
                    <option value="Pet Policy">Pet Policy</option>
                    <option value="Payment & Deposits">Payment & Deposits</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Caller Question / Inquiry</label>
                  <input
                    type="text"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="e.g. Can we bring small dogs?"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Approved Official Response</label>
                <textarea
                  rows={2}
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Official phrasing the receptionist will state to the caller..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddFaq(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-white rounded-lg border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  Save Question
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {config.faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl border border-sky-100 bg-white hover:border-sky-300 transition-colors flex items-start justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md border border-sky-100">
                      {faq.category}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900">
                      {faq.question}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-1 pt-1">
                    {faq.answer}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors shrink-0"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Reservation & Dining Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Booking Limits & Operational Rules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforced during room reservations and dining table reservations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 pb-1 border-b border-sky-100">
                Hotel Room Booking Rules
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Advance Notice (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={config.roomReservationRules.minNoticeHours}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      roomReservationRules: {
                        ...config.roomReservationRules,
                        minNoticeHours: parseInt(e.target.value, 10) || 2,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Advance Reservation Window (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={config.roomReservationRules.maxAdvanceDays}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      roomReservationRules: {
                        ...config.roomReservationRules,
                        maxAdvanceDays: parseInt(e.target.value, 10) || 365,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cancellation Grace Period (Hours prior)
                </label>
                <input
                  type="number"
                  min={0}
                  max={168}
                  value={config.roomReservationRules.cancellationWindowHours}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      roomReservationRules: {
                        ...config.roomReservationRules,
                        cancellationWindowHours: parseInt(e.target.value, 10) || 48,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-700 font-medium">Require Credit Card Guarantee</span>
                <input
                  type="checkbox"
                  checked={config.roomReservationRules.requireCreditCardGuarantee}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      roomReservationRules: {
                        ...config.roomReservationRules,
                        requireCreditCardGuarantee: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 pb-1 border-b border-emerald-100">
                Restaurant Table Booking Rules
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Party Size (Guests)
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={config.tableBookingRules.maxPartySize}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tableBookingRules: {
                        ...config.tableBookingRules,
                        maxPartySize: parseInt(e.target.value, 10) || 8,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">Parties above this threshold require human manager transfer.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reservation Slot Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={30}
                  max={240}
                  step={15}
                  value={config.tableBookingRules.reservationSlotMinutes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tableBookingRules: {
                        ...config.tableBookingRules,
                        reservationSlotMinutes: parseInt(e.target.value, 10) || 120,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Table Grace Hold Time (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={config.tableBookingRules.tableHoldTimeMinutes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tableBookingRules: {
                        ...config.tableBookingRules,
                        tableHoldTimeMinutes: parseInt(e.target.value, 10) || 15,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-700 font-medium">Require Deposit for Parties &ge; {config.tableBookingRules.depositRequiredPartySize}</span>
                <span className="text-xs font-mono font-semibold text-slate-900">${config.tableBookingRules.depositAmountPerGuest}/guest</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Staff Transfers & Escalation */}
      {activeTab === 'escalation' && (
        <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Human Staff Hot-Transfers & Urgent Routing
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              When a caller requests a human manager, presents an urgent incident, or party size exceeds automated limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duty Manager Hotline Number
              </label>
              <input
                type="text"
                value={config.transferRules.dutyManagerPhone}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    transferRules: {
                      ...config.transferRules,
                      dutyManagerPhone: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security & Concierge Emergency Line
              </label>
              <input
                type="text"
                value={config.transferRules.conciergeLine}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    transferRules: {
                      ...config.transferRules,
                      conciergeLine: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Automatic Escalation Triggers
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.transferRules.vipAutoTransfer}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      transferRules: {
                        ...config.transferRules,
                        vipAutoTransfer: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Instantly route Diamond & Platinum VIP guests to Private Concierge</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.transferRules.escalateUrgentComplaints}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      transferRules: {
                        ...config.transferRules,
                        escalateUrgentComplaints: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Transfer if caller states complaint or inquiry remains unverified after {config.transferRules.transferOnUnresolvedLimit} turns</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
