import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  highlightColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-sky-100 rounded-xl p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
            {title}
          </p>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold shrink-0 ${
                trend.isPositive ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              <span>{trend.value}</span>
              {trend.label && <span className="text-slate-400 font-normal">{trend.label}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
