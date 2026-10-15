import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, ShieldCheck, Link as LinkIcon, Phone, Calendar } from 'lucide-react';
import { Modal } from './Modal';
import { CallRecord } from '../../types';
import { Badge } from './Badge';

interface AudioPlayerModalProps {
  call: CallRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onViewLinkedBooking?: (bookingId: string) => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  call,
  isOpen,
  onClose,
  onViewLinkedBooking,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1.2 * playbackSpeed;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, playbackSpeed]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isOpen]);

  // Update transcript highlight based on progress
  useEffect(() => {
    if (call?.transcript && call.transcript.length > 0) {
      const idx = Math.min(
        Math.floor((progress / 100) * call.transcript.length),
        call.transcript.length - 1
      );
      setActiveSpeakerIndex(idx);
    }
  }, [progress, call?.transcript]);

  if (!call) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Telephony Audio Audit & Call Transcript"
      subtitle={`Session ID: ${call.id} • ${call.dateTime}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Call Summary Banner */}
        <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900">
                {call.callerName}
              </span>
              <Badge status={call.purpose} />
              <Badge status={call.status} />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {call.callerPhone}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {call.dateTime}</span>
              <span>•</span>
              <span>Duration: {call.recordingDuration || `${call.durationSeconds}s`}</span>
            </div>
          </div>

          {call.linkedBookingId && onViewLinkedBooking && (
            <button
              type="button"
              onClick={() => onViewLinkedBooking(call.linkedBookingId!)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 bg-white hover:bg-sky-50 rounded-lg border border-sky-200 transition-colors shadow-2xs"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Linked Booking ({call.linkedBookingId})</span>
            </button>
          )}
        </div>

        {/* Audio Player Controls */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Internal Authorized Recording
            </span>
            <span className="font-mono text-xs text-sky-400">
              {Math.floor((progress / 100) * call.durationSeconds)}s / {call.durationSeconds}s
            </span>
          </div>

          {/* Interactive Waveform / Progress */}
          <div className="space-y-1.5">
            <div
              className="h-10 flex items-center gap-1 cursor-pointer bg-slate-950/80 p-2 rounded-lg border border-slate-800"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                setProgress(ratio * 100);
              }}
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const isPassed = (i / 48) * 100 <= progress;
                const heights = [30, 60, 90, 40, 70, 100, 50, 80, 45, 95, 65, 35, 75, 85, 40, 60, 90, 50, 70, 85, 60, 45, 100, 75];
                const h = heights[i % heights.length];
                return (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-xs transition-colors duration-150 ${
                      isPassed ? 'bg-sky-400' : 'bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-400 transition-colors shadow-xs"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => setProgress(0)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Restart playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback speed toggle */}
              <div className="flex items-center gap-1 text-xs font-mono">
                {[1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-sky-500 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        {call.transcript && call.transcript.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Synchronized Call Transcript
            </h4>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {call.transcript.map((item, idx) => {
                const isCurrent = idx === activeSpeakerIndex && isPlaying;
                const isReceptionist = item.speaker === 'Receptionist';

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs transition-colors duration-200 ${
                      isCurrent
                        ? 'bg-sky-50 border-sky-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${isReceptionist ? 'text-sky-700' : 'text-slate-800'}`}>
                        {item.speaker === 'Receptionist' ? 'Hotel Receptionist' : call.callerName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-sky-50/50 p-4 rounded-lg border border-sky-100 text-xs text-slate-600">
            <p className="font-medium text-slate-900 mb-1">Agent Telephony Note:</p>
            <p>{call.agentSummary}</p>
          </div>
        )}

        {/* Policy disclaimer */}
        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>Demonstration telephony audit log. Audio is generated for training and quality evaluation.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
