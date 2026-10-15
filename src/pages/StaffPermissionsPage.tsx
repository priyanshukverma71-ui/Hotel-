import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Users,
  Search,
  Check,
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
  Clock,
  UserCheck
} from 'lucide-react';
import { ApiService } from '../services/api';
import { StaffMember } from '../types';
import { StaffModal } from '../components/forms/StaffModal';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';

export const StaffPermissionsPage: React.FC = () => {
  const { showToast } = useToast();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<StaffMember | null>(null);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const loadStaff = async () => {
    const list = await ApiService.getStaff();
    setStaffList(list);
  };

  useEffect(() => {
    loadStaff();
    const handleUpdate = () => loadStaff();
    window.addEventListener('raceai_data_changed', handleUpdate);
    return () => window.removeEventListener('raceai_data_changed', handleUpdate);
  }, []);

  const handleDeleteStaff = async () => {
    if (!deleteTargetId) return;
    try {
      await ApiService.deleteStaff(deleteTargetId);
      showToast('Staff member access revoked.', 'info');
      loadStaff();
    } catch {
      showToast('Failed to remove staff.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filteredStaff = staffList.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q) && !s.department.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    return true;
  });

  const PERMISSIONS_MATRIX = [
    { feature: 'View Dashboard & Live KPIs', admin: true, manager: true, receptionist: true, restaurant: true },
    { feature: 'Create & Modify Hotel Room Reservations', admin: true, manager: true, receptionist: true, restaurant: false },
    { feature: 'Check In & Check Out Hotel Guests', admin: true, manager: true, receptionist: true, restaurant: false },
    { feature: 'Create & Seat Restaurant Table Bookings', admin: true, manager: true, receptionist: true, restaurant: true },
    { feature: 'Modify Room Rates & Maintenance Status', admin: true, manager: true, receptionist: false, restaurant: false },
    { feature: 'Telephony Voice Audio Audit & Transcripts', admin: true, manager: true, receptionist: true, restaurant: false },
    { feature: 'Receptionist Greetings & FAQ Rules Config', admin: true, manager: true, receptionist: false, restaurant: false },
    { feature: 'Revenue Analytics & Export Financial Reports', admin: true, manager: true, receptionist: false, restaurant: false },
    { feature: 'Staff Accounts & Access Provisioning', admin: true, manager: false, receptionist: false, restaurant: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Staff Directory & Role Permissions
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium">
              {staffList.length} Active Personnel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage front office personnel, food & beverage teams, role hierarchies, and role-based permissions matrix.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewStaffModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Staff</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by staff name, email, department..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Restaurant Staff">Restaurant Staff</option>
          </select>
        </div>
      </div>

      {/* Staff Members Table */}
      <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-400 bg-sky-50/40">
                <th className="py-3 px-4 font-semibold">Staff Member</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold">Shift Schedule</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50 text-xs">
              {filteredStaff.map((staff) => {
                const initials = staff.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('');

                return (
                  <tr key={staff.id} className="hover:bg-sky-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{staff.name}</div>
                          <div className="text-[10px] text-slate-400">Active {staff.lastActive}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{staff.role}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{staff.department}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{staff.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{staff.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{staff.shift}</td>
                    <td className="py-3 px-4">
                      <Badge
                        status={staff.status}
                        variant={staff.status === 'Active' ? 'confirmed' : staff.status === 'On Leave' ? 'pending' : 'neutral'}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStaffForEdit(staff)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {staff.role !== 'Administrator' && (
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(staff.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role & Permissions Matrix Overview */}
      <div className="bg-white p-6 rounded-xl border border-sky-100 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Role-Based Access Permissions Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational boundaries defined per hospitality duty role.
          </p>
        </div>

        <div className="overflow-x-auto border border-sky-100 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-sky-50/40 text-[11px] uppercase tracking-wider text-slate-400 border-b border-sky-100">
                <th className="py-2.5 px-4 font-semibold">Capability / Operational Module</th>
                <th className="py-2.5 px-4 text-center font-semibold">Administrator</th>
                <th className="py-2.5 px-4 text-center font-semibold">Manager</th>
                <th className="py-2.5 px-4 text-center font-semibold">Receptionist</th>
                <th className="py-2.5 px-4 text-center font-semibold">Restaurant Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {PERMISSIONS_MATRIX.map((perm) => (
                <tr key={perm.feature} className="hover:bg-sky-50/30 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-800">{perm.feature}</td>
                  <td className="py-2.5 px-4 text-center">
                    {perm.admin ? <Check className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {perm.manager ? <Check className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {perm.receptionist ? <Check className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {perm.restaurant ? <Check className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New / Edit Staff Modal */}
      {(isNewStaffModalOpen || selectedStaffForEdit) && (
        <StaffModal
          isOpen={isNewStaffModalOpen || !!selectedStaffForEdit}
          onClose={() => {
            setIsNewStaffModalOpen(false);
            setSelectedStaffForEdit(null);
          }}
          staff={selectedStaffForEdit}
          onSaved={() => loadStaff()}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteStaff}
        title="Revoke Staff Member Access"
        message="Are you sure you want to deactivate and remove this staff member from active operations? Their system access will be terminated immediately."
        confirmLabel="Revoke Access"
        isDestructive={true}
      />
    </div>
  );
};
