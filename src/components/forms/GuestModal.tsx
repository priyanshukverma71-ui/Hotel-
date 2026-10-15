import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Guest } from '../../types';
import { ApiService } from '../../services/api';
import { useToast } from '../common/Toast';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest | null;
  onSaved: () => void;
}

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  guest,
  onSaved,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    vipStatus: false,
    vipTier: 'Silver' as NonNullable<Guest['vipTier']>,
    totalStays: 1,
    totalDiningVisits: 0,
    totalSpend: 500,
    preferences: {
      roomType: 'Deluxe King',
      highFloor: true,
      pillowType: 'Goose Down',
      diningArea: 'Indoor Main Dining',
      favoriteWineOrBeverage: '',
    },
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        nationality: guest.nationality || '',
        vipStatus: guest.vipStatus,
        vipTier: guest.vipTier || 'Silver',
        totalStays: guest.totalStays,
        totalDiningVisits: guest.totalDiningVisits,
        totalSpend: guest.totalSpend,
        preferences: {
          roomType: guest.preferences?.roomType || 'Deluxe King',
          highFloor: guest.preferences?.highFloor ?? true,
          pillowType: guest.preferences?.pillowType || 'Goose Down',
          diningArea: guest.preferences?.diningArea || 'Indoor Main Dining',
          favoriteWineOrBeverage: guest.preferences?.favoriteWineOrBeverage || '',
        },
        notes: guest.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        nationality: 'United States',
        vipStatus: false,
        vipTier: 'Silver',
        totalStays: 0,
        totalDiningVisits: 0,
        totalSpend: 0,
        preferences: {
          roomType: 'Deluxe King',
          highFloor: true,
          pillowType: 'Goose Down',
          diningArea: 'Indoor Main Dining',
          favoriteWineOrBeverage: '',
        },
        notes: '',
      });
    }
    setErrors({});
  }, [guest, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: Guest = {
        id: guest?.id || 'gst-' + Date.now(),
        createdAt: guest?.createdAt || new Date().toISOString(),
        lastVisit: guest?.lastVisit || new Date().toISOString().split('T')[0],
        ...formData,
      };

      await ApiService.saveGuest(payload);
      showToast(`Guest profile for ${payload.name} saved.`, 'success');
      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save guest.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={guest ? `Edit Guest Profile — ${guest.name}` : 'Create New Guest Profile'}
      subtitle="Comprehensive guest hospitality profile, VIP privileges, and stay preferences"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Guest Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Eleanor Vance"
              className={`w-full px-3 py-2 text-xs rounded-lg border ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
              } focus:outline-none focus:ring-1 focus:ring-sky-500`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. eleanor@azurehotel.com"
              className={`w-full px-3 py-2 text-xs rounded-lg border ${
                errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
              } focus:outline-none focus:ring-1 focus:ring-sky-500`}
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telephone / Mobile *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +1 555 234 5678"
              className={`w-full px-3 py-2 text-xs rounded-lg border ${
                errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
              } focus:outline-none focus:ring-1 focus:ring-sky-500`}
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nationality / Country
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              placeholder="e.g. United Kingdom"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Loyalty & Recognition */}
        <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">
              Hospitality Status & VIP Tier
            </h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.vipStatus}
                onChange={(e) => setFormData({ ...formData, vipStatus: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800">VIP Recognition Flag</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loyalty Tier
              </label>
              <select
                value={formData.vipTier}
                onChange={(e) => setFormData({ ...formData, vipTier: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
              >
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond (Bespoke)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Completed Stays
              </label>
              <input
                type="number"
                min={0}
                value={formData.totalStays}
                onChange={(e) => setFormData({ ...formData, totalStays: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cumulative Spend ($ USD)
              </label>
              <input
                type="number"
                min={0}
                value={formData.totalSpend}
                onChange={(e) => setFormData({ ...formData, totalSpend: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Guest Preferences */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-sky-100">
            Personal Preferences
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Wine / Beverage Amenity
              </label>
              <input
                type="text"
                value={formData.preferences.favoriteWineOrBeverage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, favoriteWineOrBeverage: e.target.value },
                  })
                }
                placeholder="e.g. Château Margaux 2010, Sencha green tea"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Dining Area
              </label>
              <input
                type="text"
                value={formData.preferences.diningArea}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, diningArea: e.target.value },
                  })
                }
                placeholder="e.g. Private Wine Cellar, Skyline Veranda"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Concierge & Front Desk Internal Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Special arrival protocols, privacy requirements, personal preferences..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : guest ? 'Update Guest Profile' : 'Save Guest Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
