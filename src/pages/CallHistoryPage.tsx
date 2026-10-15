import React, { useState, useEffect, useMemo } from 'react';
import {
  PhoneCall,
  Search,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  Mic,
  Link as LinkIcon
} from 'lucide-react';
import { ApiService } from '../services/api';
import { CallRecord } from '../types';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

interface CallHistoryPageProps {
  onSelectCallRecord: (call: CallRecord) => void;
  onViewBooking: (bookingId: string) => void;
  onOpenAiVoiceReceptionist?: () => void;
}

export const CallHistoryPage: React.FC<CallHistoryPageProps> = ({
  onSelectCallRecord,
  onViewBooking,
  onOpenAiVoiceReceptionist,
}) => {
  const { showToast } = useToast();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadCalls = async () => {
    const list = await ApiService.getCalls();
    setCalls(list);
  };

  useEffect(() => {
    loadCalls();
    const handleUpdate = () => loadCalls();
    window.addEventListener('raceai_data_changed', handleUpdate);
    return () => window.removeEventListener('raceai_data_changed', handleUpdate);
  }, []);

  const handleCallBack = async (callId: string, callerName: string) => {
    try {
      await ApiService.markCallbackCompleted(callId);
      showToast(`Callback initiated for ${callerName}. Front desk agent connected.`, 'success');
      loadCalls();
    } catch {
      showToast('Failed to initiate callback.', 'error');
    }
  };

  const filteredCalls = useMemo(() => {
    return calls.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.callerName.toLowerCase().includes(q);
        const matchPhone = c.callerPhone.toLowerCase().includes(q);
        const matchOutcome = c.outcome.toLowerCase().includes(q);
        const matchSummary = c.agentSummary.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchOutcome && !matchSummary) return false;
      }

      if (purposeFilter !== 'all' && c.purpose !== purposeFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;

      return true;
    });
  }, [calls, searchQuery, purposeFilter, statusFilter]);

  const metrics = useMemo(() => {
    const answered = calls.filter((c) => c.status === 'Answered').length;
    const missed = calls.filter((c) => c.status === 'Missed').length;
    const transferred = calls.filter((c) => c.status === 'Transferred').length;
    const totalSecs = calls.reduce((sum, c) => sum + c.durationSeconds, 0);
    const avgSecs = calls.length > 0 ? Math.round(totalSecs / calls.length) : 0;
    return { answered, missed, transferred, avgSecs };
  }, [calls]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Receptionist Call History & Telephony
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              VoIP Gateway Online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit front-desk receptionist calls, guest booking inquiries, missed calls, and synchronized audio recordings.
          </p>
        </div>

        {onOpenAiVoiceReceptionist && (
          <button
            type="button"
            onClick={onOpenAiVoiceReceptionist}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors shadow-xs"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span>Launch AI Voice Receptionist</span>
          </button>
        )}
      </div>

      {/* Telephony Transparency Notice */}
      <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900 font-semibold">Telephony Operational Log:</strong> Displaying verified receptionist call logs. Audio recording playback and transcripts are available for internal quality training and audit verification in accordance with hotel guest privacy standards.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Total Calls Today</p>
          <div className="text-2xl font-bold text-slate-900 mt-1">{calls.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Front desk hotline & voice receptionist</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700">Answered Calls</p>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.answered}</div>
          <p className="text-[11px] text-emerald-600 mt-0.5">Resolved without human escalation</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-rose-700">Missed Calls</p>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.missed}</div>
          <p className="text-[11px] text-rose-600 mt-0.5">Callback action queued</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Avg Call Duration</p>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.avgSecs}s</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Optimal hospitality resolution speed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caller, phone number, outcome, note..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
          >
            <option value="all">All Call Purposes</option>
            <option value="Room Reservation">Room Reservation</option>
            <option value="Table Booking">Table Booking</option>
            <option value="General Enquiry">General Enquiry</option>
            <option value="Modification">Modification</option>
            <option value="Cancellation">Cancellation</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="Answered">Answered</option>
            <option value="Missed">Missed</option>
            <option value="Transferred">Transferred</option>
          </select>
        </div>
      </div>

      {/* Call History Table */}
      <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-400 bg-sky-50/40">
                <th className="py-3 px-4 font-semibold">Caller & Contact</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Purpose</th>
                <th className="py-3 px-4 font-semibold">Duration</th>
                <th className="py-3 px-4 font-semibold">Status & Outcome</th>
                <th className="py-3 px-4 font-semibold">Receptionist Summary</th>
                <th className="py-3 px-4 font-semibold text-right">Telephony Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No telephone records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{call.callerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{call.callerPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {call.dateTime}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={call.purpose} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {call.recordingDuration || `${call.durationSeconds}s`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge status={call.status} size="sm" />
                        <span className="text-[10px] text-slate-500">{call.outcome}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="text-slate-700 line-clamp-2 leading-relaxed">
                        {call.agentSummary}
                      </p>
                      {call.linkedBookingId && (
                        <button
                          type="button"
                          onClick={() => onViewBooking(call.linkedBookingId!)}
                          className="inline-flex items-center gap-1 text-[10px] text-sky-700 hover:underline font-semibold mt-0.5"
                        >
                          <LinkIcon className="w-3 h-3" /> Linked Booking: {call.linkedBookingId}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {call.hasRecording ? (
                          <button
                            type="button"
                            onClick={() => onSelectCallRecord(call)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-white hover:bg-sky-50 text-sky-700 rounded-md border border-sky-200 transition-colors shadow-2xs"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Audio & Log</span>
                          </button>
                        ) : call.status === 'Missed' ? (
                          call.callbackCompleted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Callback Done
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCallBack(call.id, call.callerName)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors shadow-2xs"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Call Back</span>
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectCallRecord(call)}
                            className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                          >
                            View Note
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
    </div>
  );
};
