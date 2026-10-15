import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { AuthService } from '../../services/auth';
import { useToast } from '../common/Toast';
import { UserProfile } from '../../types';
import { User, Lock, Mail, Phone, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  bookingIntentContext?: 'room' | 'table' | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookingIntentContext,
}) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'signin') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await AuthService.login(email, password);
        if (!res.success || !res.user) {
          setErrorMsg(res.error || 'Failed to sign in.');
          return;
        }
        showToast(`Welcome back, ${res.user.name}.`, 'success');
        onSuccess(res.user);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Full name is required.');
        return;
      }
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        setErrorMsg('Valid email is required.');
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Phone number is required for booking confirmations.');
        return;
      }
      if (!password.trim() || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await AuthService.register(name, email, password, phone);
        if (!res.success || !res.user) {
          setErrorMsg(res.error || 'Registration failed.');
          return;
        }
        showToast(`Account created successfully. Welcome, ${res.user.name}!`, 'success');
        onSuccess(res.user);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleQuickDemoSignIn = async (demoEmail: string, demoPass: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await AuthService.login(demoEmail, demoPass);
      if (res.success && res.user) {
        showToast(`Signed in as ${res.user.name}.`, 'success');
        onSuccess(res.user);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign In to Your Account' : 'Create Guest Account'}
      subtitle={
        bookingIntentContext
          ? `Please sign in or register before completing your ${
              bookingIntentContext === 'room' ? 'hotel suite' : 'restaurant table'
            } booking.`
          : 'Access personal bookings, stay itineraries, and dining reservations.'
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Tab Switcher */}
        <div className="flex bg-sky-50/70 border border-sky-100 rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'signin' ? 'bg-sky-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'bg-sky-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lady Vivienne Montgomery"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Telephone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 0192"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            {mode === 'signup' && (
              <span className="text-[10px] text-slate-400 mt-0.5 block">Minimum 6 characters</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting
              ? 'Authenticating...'
              : mode === 'signin'
              ? 'Sign In & Continue'
              : 'Create Account & Book'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Quick Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSignIn('e.rostova@genevaventures.ch', 'password123')}
              className="p-2.5 text-left bg-sky-50/50 hover:bg-sky-50 rounded-lg border border-sky-100 transition-colors"
            >
              <div className="text-[11px] font-semibold text-slate-900">Elena Rostova</div>
              <div className="text-[10px] text-sky-700">Patron • Platinum</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSignIn('arthur.pendelton@meridianholdings.co.uk', 'password123')}
              className="p-2.5 text-left bg-sky-50/50 hover:bg-sky-50 rounded-lg border border-sky-100 transition-colors"
            >
              <div className="text-[11px] font-semibold text-slate-900">Sir Arthur Pendelton</div>
              <div className="text-[10px] text-sky-700">Patron • Diamond</div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
