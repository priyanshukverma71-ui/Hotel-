import React from 'react';

type BadgeVariant = 
  | 'confirmed'
  | 'pending'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled'
  | 'seated'
  | 'completed'
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'maintenance'
  | 'cleaning'
  | 'answered'
  | 'missed'
  | 'transferred'
  | 'paid'
  | 'partial'
  | 'diamond'
  | 'platinum'
  | 'gold'
  | 'silver'
  | 'neutral';

interface BadgeProps {
  status: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, size = 'md' }) => {
  const getAutoVariant = (s: string): BadgeVariant => {
    const lower = s.toLowerCase();
    if (lower.includes('confirmed')) return 'confirmed';
    if (lower.includes('check') && lower.includes('in')) return 'checked-in';
    if (lower.includes('check') && lower.includes('out')) return 'checked-out';
    if (lower.includes('seated')) return 'seated';
    if (lower.includes('completed')) return 'completed';
    if (lower.includes('cancelled') || lower.includes('canceled')) return 'cancelled';
    if (lower.includes('pending')) return 'pending';
    if (lower.includes('available')) return 'available';
    if (lower.includes('occupied')) return 'occupied';
    if (lower.includes('reserved')) return 'reserved';
    if (lower.includes('maintenance')) return 'maintenance';
    if (lower.includes('cleaning')) return 'cleaning';
    if (lower.includes('answered')) return 'answered';
    if (lower.includes('missed')) return 'missed';
    if (lower.includes('transferred')) return 'transferred';
    if (lower.includes('paid')) return 'paid';
    if (lower.includes('partial')) return 'partial';
    if (lower.includes('diamond')) return 'diamond';
    if (lower.includes('platinum')) return 'platinum';
    if (lower.includes('gold')) return 'gold';
    if (lower.includes('silver')) return 'silver';
    return 'neutral';
  };

  const v = variant || getAutoVariant(status);

  const styleMap: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
    'confirmed': { bg: 'bg-[#edf7ed]', text: 'text-[#1e4620]', dot: 'bg-[#2e7d32]', border: 'border-[#c8e6c9]' },
    'seated': { bg: 'bg-[#f0f4ff]', text: 'text-[#1a365d]', dot: 'bg-[#2b6cb0]', border: 'border-[#c3dafe]' },
    'checked-in': { bg: 'bg-[#f0f9ff]', text: 'text-[#0c4a6e]', dot: 'bg-[#0284c7]', border: 'border-[#bae6fd]' },
    'completed': { bg: 'bg-[#f4f4f5]', text: 'text-[#3f3f46]', dot: 'bg-[#71717a]', border: 'border-[#e4e4e7]' },
    'checked-out': { bg: 'bg-[#fafafa]', text: 'text-[#52525b]', dot: 'bg-[#a1a1aa]', border: 'border-[#e4e4e7]' },
    'pending': { bg: 'bg-[#fef9ec]', text: 'text-[#78350f]', dot: 'bg-[#d97706]', border: 'border-[#fde68a]' },
    'cancelled': { bg: 'bg-[#fef2f2]', text: 'text-[#991b1b]', dot: 'bg-[#dc2626]', border: 'border-[#fecaca]' },
    'available': { bg: 'bg-[#f2f9f3]', text: 'text-[#166534]', dot: 'bg-[#16a34a]', border: 'border-[#bbf7d0]' },
    'occupied': { bg: 'bg-[#eff6ff]', text: 'text-[#1e40af]', dot: 'bg-[#3b82f6]', border: 'border-[#bfdbfe]' },
    'reserved': { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]', dot: 'bg-[#f59e0b]', border: 'border-[#fde68a]' },
    'maintenance': { bg: 'bg-[#fff1f2]', text: 'text-[#9f1239]', dot: 'bg-[#e11d48]', border: 'border-[#fecdd3]' },
    'cleaning': { bg: 'bg-[#faf5ff]', text: 'text-[#6b21a8]', dot: 'bg-[#9333ea]', border: 'border-[#f3e8ff]' },
    'answered': { bg: 'bg-[#f0fdf4]', text: 'text-[#14532d]', dot: 'bg-[#22c55e]', border: 'border-[#bbf7d0]' },
    'missed': { bg: 'bg-[#fef2f2]', text: 'text-[#991b1b]', dot: 'bg-[#ef4444]', border: 'border-[#fee2e2]' },
    'transferred': { bg: 'bg-[#fff7ed]', text: 'text-[#9a3412]', dot: 'bg-[#ea580c]', border: 'border-[#ffedd5]' },
    'paid': { bg: 'bg-[#f0fdf4]', text: 'text-[#166534]', dot: 'bg-[#15803d]', border: 'border-[#bbf7d0]' },
    'partial': { bg: 'bg-[#fffbeb]', text: 'text-[#854d0e]', dot: 'bg-[#d97706]', border: 'border-[#fde68a]' },
    'diamond': { bg: 'bg-[#f1f5f9]', text: 'text-[#0f172a]', dot: 'bg-[#475569]', border: 'border-[#cbd5e1]' },
    'platinum': { bg: 'bg-[#f8fafc]', text: 'text-[#334155]', dot: 'bg-[#64748b]', border: 'border-[#e2e8f0]' },
    'gold': { bg: 'bg-[#fffbeb]', text: 'text-[#78350f]', dot: 'bg-[#b45309]', border: 'border-[#fcd34d]' },
    'silver': { bg: 'bg-[#f4f4f5]', text: 'text-[#3f3f46]', dot: 'bg-[#a1a1aa]', border: 'border-[#e4e4e7]' },
    'neutral': { bg: 'bg-[#f8f7f4]', text: 'text-[#44403c]', dot: 'bg-[#78716c]', border: 'border-[#e7e5e4]' },
  };

  const current = styleMap[v] || styleMap.neutral;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${current.bg} ${current.text} ${current.border} ${sizeClasses} tracking-normal`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0`} />
      <span>{status}</span>
    </span>
  );
};
