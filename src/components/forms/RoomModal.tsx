import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Room, RoomStatus } from '../../types';
import { ApiService } from '../../services/api';
import { useToast } from '../common/Toast';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onSaved: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  room,
  onSaved,
}) => {
  const { showToast } = useToast();
  const [status, setStatus] = useState<RoomStatus>('Available');
  const [nightlyRate, setNightlyRate] = useState<number>(380);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (room) {
      setStatus(room.status);
      setNightlyRate(room.nightlyRate);
      setNotes(room.notes || '');
    }
  }, [room, isOpen]);

  if (!room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await ApiService.updateRoom({
        ...room,
        status,
        nightlyRate,
        notes,
      });
      showToast(`Room ${room.roomNumber} updated successfully.`, 'success');
      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to update room.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Room Inventory Management — Room ${room.roomNumber}`}
      subtitle={`${room.category} • Floor ${room.floor} • Capacity ${room.capacity} Guests`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Operational Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RoomStatus)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="Available">Available (Ready for Check-In)</option>
            <option value="Reserved">Reserved (Arrival Expected)</option>
            <option value="Occupied">Occupied (Guest in Residence)</option>
            <option value="Cleaning">Housekeeping / Cleaning in Progress</option>
            <option value="Maintenance">Out of Order / Under Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nightly Base Rate ($ USD)
          </label>
          <input
            type="number"
            value={nightlyRate}
            onChange={(e) => setNightlyRate(Number(e.target.value))}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Maintenance Notes / Housekeeping Instructions
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Scheduled pool pump servicing, balcony touch-up paint completed..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
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
            {isSubmitting ? 'Updating...' : 'Save Room Settings'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
