import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { StaffMember } from '../../types';
import { ApiService } from '../../services/api';
import { useToast } from '../common/Toast';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember | null;
  onSaved: () => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSaved,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Receptionist' as StaffMember['role'],
    department: 'Front Office' as StaffMember['department'],
    shift: 'Morning (07:00 - 15:30)' as StaffMember['shift'],
    status: 'Active' as StaffMember['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        department: staff.department,
        shift: staff.shift,
        status: staff.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Receptionist',
        department: 'Front Office',
        shift: 'Morning (07:00 - 15:30)',
        status: 'Active',
      });
    }
    setErrors({});
  }, [staff, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: StaffMember = {
        id: staff?.id || 'stf-' + Date.now(),
        lastActive: staff?.lastActive || 'Just now',
        ...formData,
      };

      await ApiService.saveStaff(payload);
      showToast(`Staff profile for ${payload.name} saved.`, 'success');
      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save staff.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staff ? `Edit Staff Member — ${staff.name}` : 'Register New Staff Member'}
      subtitle="Hotel personnel credentials, role hierarchy, and assigned shift"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Julian Montgomery"
            className={`w-full px-3 py-2 text-xs rounded-lg border ${
              errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
            } focus:outline-none focus:ring-1 focus:ring-sky-500`}
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="julian@azurehotel.com"
              className={`w-full px-3 py-2 text-xs rounded-lg border ${
                errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
              } focus:outline-none focus:ring-1 focus:ring-sky-500`}
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 555 4920"
              className={`w-full px-3 py-2 text-xs rounded-lg border ${
                errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
              } focus:outline-none focus:ring-1 focus:ring-sky-500`}
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
            >
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Restaurant Staff">Restaurant Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
            >
              <option value="Executive Management">Executive Management</option>
              <option value="Front Office">Front Office</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Guest Relations">Guest Relations</option>
              <option value="Housekeeping">Housekeeping</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Shift
            </label>
            <select
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
            >
              <option value="Morning (07:00 - 15:30)">Morning (07:00 - 15:30)</option>
              <option value="Evening (15:00 - 23:30)">Evening (15:00 - 23:30)</option>
              <option value="Night (23:00 - 07:30)">Night (23:00 - 07:30)</option>
              <option value="General (09:00 - 18:00)">General (09:00 - 18:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-sky-100">
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
            {isSubmitting ? 'Saving...' : staff ? 'Update Staff Member' : 'Register Staff'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
