import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  PhoneCall,
  PhoneOff,
  BedDouble,
  UtensilsCrossed,
  CheckCircle2,
  ExternalLink,
  Bot,
  User,
  Radio
} from 'lucide-react';
import { AiVoiceReceptionistService, ChatMessage } from '../../services/aiVoiceReceptionist';
import { UserProfile } from '../../types';
import { useToast } from '../common/Toast';

interface AiVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onNavigateToBooking?: (refCode: string, type: 'room' | 'table') => void;
}

export const AiVoiceAssistantModal: React.FC<AiVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateToBooking,
}) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceAudioEnabled, setVoiceAudioEnabled] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Call timer
  useEffect(() => {
    let timer: any;
    if (isOpen) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      AiVoiceReceptionistService.stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  // Initial welcome message from Aria
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Namaste. You have reached The Taj Mahal Palace, Mumbai. I am Aria, your AI Voice Receptionist. Would you like to reserve a luxury room suite, book a table at Wasabi by Morimoto, or enquire about our amenities in Mumbai?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcome]);
      if (voiceAudioEnabled) {
        setIsSpeaking(true);
        AiVoiceReceptionistService.speak(welcome.text, () => setIsSpeaking(false));
      }
    }
  }, [isOpen, voiceAudioEnabled]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initialize Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser. Please type below.', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const result = await AiVoiceReceptionistService.processInput(trimmed, messages, currentUser);
      setIsThinking(false);

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: result.action,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Speak reply if audio enabled
      if (voiceAudioEnabled) {
        setIsSpeaking(true);
        AiVoiceReceptionistService.speak(result.reply, () => setIsSpeaking(false));
      }
    } catch {
      setIsThinking(false);
      const fallbackMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'assistant',
        text: 'I would be delighted to assist you with booking a room or restaurant table. Could you please specify your preferred date or suite type?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleEndCall = () => {
    // Log the call into CallHistory
    const transcript = messages.map((m) => ({
      speaker: (m.sender === 'assistant' ? 'Receptionist' : 'Caller') as 'Receptionist' | 'Caller',
      text: m.text,
      time: m.timestamp,
    }));

    const lastAction = messages.find((m) => m.actionTaken)?.actionTaken;
    const purpose =
      lastAction?.type === 'room_booked'
        ? 'Room Reservation'
        : lastAction?.type === 'table_booked'
        ? 'Table Booking'
        : 'General Enquiry';

    const outcome =
      lastAction?.type === 'room_booked'
        ? 'Booked Room'
        : lastAction?.type === 'table_booked'
        ? 'Booked Table'
        : 'Inquiry Resolved';

    AiVoiceReceptionistService.logVoiceCallRecord(
      currentUser?.name || 'Guest Caller',
      currentUser?.phone || '+1 (800) 555-AZURE',
      callDuration || 35,
      purpose,
      outcome,
      `AI Voice Receptionist Aria completed call with ${currentUser?.name || 'guest'}. Outcome: ${outcome}.`,
      transcript,
      lastAction?.refCode
    );

    showToast('Call logged to Front Desk Call History.', 'success');
    onClose();
  };

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleEndCall}
      title="AI Voice Booking Receptionist — Aria"
      subtitle="Interactive Voice Assistant for Hotel Rooms & Le Miroir Restaurant"
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Top Active Telephony Bar */}
        <div className="p-3.5 bg-gradient-to-r from-sky-50 to-blue-50/60 border border-sky-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white border border-sky-200 shadow-2xs flex items-center justify-center text-sky-600">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-xs text-slate-900">Aria (AI Voice Concierge)</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-medium">
                  Live Voice Channel
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Duration: {formatTimer(callDuration)} • HD Audio Stream
              </p>
            </div>
          </div>

          {/* Audio & End Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (voiceAudioEnabled) {
                  AiVoiceReceptionistService.stopSpeaking();
                  setIsSpeaking(false);
                }
                setVoiceAudioEnabled(!voiceAudioEnabled);
              }}
              className={`p-2 rounded-md border text-xs font-medium transition-colors ${
                voiceAudioEnabled
                  ? 'bg-white text-sky-700 border-sky-200 shadow-2xs'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={voiceAudioEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
            >
              {voiceAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Call</span>
            </button>
          </div>
        </div>

        {/* Dynamic Voice Visualizer Waveform */}
        <div className="h-12 bg-white rounded-lg border border-sky-100 flex items-center justify-center gap-1.5 px-4 shadow-2xs">
          {Array.from({ length: 36 }).map((_, i) => {
            const active = isSpeaking || isListening;
            const heights = [10, 16, 24, 18, 30, 22, 14, 28, 20, 12, 26, 16];
            const h = active ? heights[i % heights.length] : 4;
            return (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-sky-500'
                    : isListening
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
          <span className="text-[10px] text-slate-400 font-mono ml-3 shrink-0">
            {isSpeaking ? 'Aria Speaking...' : isListening ? 'Listening to you...' : 'Voice Ready'}
          </span>
        </div>

        {/* Conversation Stream */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-[#f8fbff] rounded-lg border border-sky-100/80">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-medium text-slate-400 font-mono">{msg.timestamp}</span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {isUser ? currentUser?.name || 'You' : 'Aria'}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-sky-100 shadow-2xs'
                  }`}
                >
                  {msg.text}

                  {/* If an action was taken (e.g. room or table booked) */}
                  {msg.actionTaken && (
                    <div className="mt-2.5 pt-2 border-t border-sky-100 bg-sky-50/60 p-2 rounded text-[11px] text-sky-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-sky-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instant Confirmation</span>
                      </div>
                      <p className="font-medium text-slate-800">{msg.actionTaken.summary}</p>
                      {msg.actionTaken.refCode && (
                        <div className="flex items-center justify-between pt-1 font-mono text-[10px]">
                          <span className="text-slate-500">Code: {msg.actionTaken.refCode}</span>
                          {onNavigateToBooking && (
                            <button
                              type="button"
                              onClick={() => {
                                handleEndCall();
                                onNavigateToBooking(
                                  msg.actionTaken!.refCode!,
                                  msg.actionTaken!.type === 'room_booked' ? 'room' : 'table'
                                );
                              }}
                              className="text-sky-700 underline font-semibold flex items-center gap-0.5"
                            >
                              <span>View Booking</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-sky-100 max-w-xs text-xs text-slate-500">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Aria checking hotel inventory...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5">
          {[
            'Book a Deluxe King room for Oct 17-20',
            'Reserve a table for 4 tonight at 8 PM at Le Miroir',
            'What is the evening dining dress code?',
            'Are pets allowed in Garden Villas?',
          ].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-sky-100 transition-colors shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="flex items-center gap-2 pt-2 border-t border-sky-100">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-md border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'bg-white hover:bg-sky-50 text-sky-600 border-sky-200 shadow-2xs'
            }`}
            title={isListening ? 'Stop microphone' : 'Speak via microphone'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Listening to speech...' : 'Speak or type your request (e.g. "Reserve a table for 2 tonight")...'}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-sky-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
