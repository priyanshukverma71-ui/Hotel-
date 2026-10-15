import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Users,
  BedDouble,
  PhoneCall,
  Headphones,
  BarChart3,
  ShieldCheck,
  Sliders,
  ChevronRight,
  Hotel,
  Mic,
  Sparkles
} from 'lucide-react';
import { OperationalStats } from '../../types';

interface SidebarProps {
  stats: OperationalStats;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  hotelName?: string;
  onOpenAiVoiceReceptionist?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stats,
  isMobileOpen,
  onCloseMobile,
  hotelName = 'The Taj Mahal Palace, Mumbai',
  onOpenAiVoiceReceptionist,
}) => {
  const navItems: NavItem[] = [
    {
      name: 'Book Mumbai Hotels',
      path: '/hotels',
      icon: Hotel,
      badge: '5-Star',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Reservations',
      path: '/reservations',
      icon: CalendarDays,
      badge: stats.todayCheckInsCount > 0 ? `${stats.todayCheckInsCount} today` : undefined,
      badgeColor: 'bg-sky-500/20 text-sky-200 border border-sky-500/30',
    },
    {
      name: 'Table Bookings',
      path: '/table-bookings',
      icon: UtensilsCrossed,
      badge: stats.todayTableBookingsCount > 0 ? stats.todayTableBookingsCount : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30',
    },
    {
      name: 'Guest Directory',
      path: '/guests',
      icon: Users,
    },
    {
      name: 'Rooms & Availability',
      path: '/rooms',
      icon: BedDouble,
      badge: `${stats.availableRoomsCount} free`,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      name: 'Call History',
      path: '/calls',
      icon: PhoneCall,
      badge: stats.todayCallsCount.missed > 0 ? `${stats.todayCallsCount.missed} missed` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-200 border border-rose-500/30',
    },
    {
      name: 'Receptionist Settings',
      path: '/receptionist-settings',
      icon: Headphones,
    },
    {
      name: 'Reports & Analytics',
      path: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'Staff & Permissions',
      path: '/staff',
      icon: ShieldCheck,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Sliders,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a1120] border-r border-[#15233c] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#15233c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
              <Hotel className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] tracking-[0.2em] uppercase text-sky-400 font-bold block">
                MUMBAI LUXURY HOTELS • INDIA
              </span>
              <h1 className="text-sm font-semibold text-white truncate tracking-tight">
                {hotelName}
              </h1>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-[#15233c] flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Voice Reception Online
            </span>
            <span className="font-mono text-[10px] text-sky-400">24/7 Gate</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 dark-scroll">
          {/* Quick Voice Assistant Card in Sidebar */}
          {onOpenAiVoiceReceptionist && (
            <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  AI Voice Receptionist
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 mb-2 leading-tight">
                Ready to take guest bookings & table reservations via voice.
              </p>
              <button
                type="button"
                onClick={() => {
                  onCloseMobile();
                  onOpenAiVoiceReceptionist();
                }}
                className="w-full py-1.5 px-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Mic className="w-3 h-3" />
                <span>Talk to Receptionist</span>
              </button>
            </div>
          )}

          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Front Desk & Operations
          </div>

          {navItems.map((item, index) => {
            const Icon = item.icon;
            const showDivider = index === 6;

            return (
              <React.Fragment key={item.path}>
                {showDivider && (
                  <div className="pt-3 pb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Administration & System
                  </div>
                )}
                <NavLink
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-sky-500/15 text-white border-l-2 border-sky-400 pl-2.5 shadow-xs font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </React.Fragment>
            );
          })}
        </div>

        {/* User & Property Card at Bottom */}
        <div className="p-3 border-t border-[#15233c] bg-[#070c17]">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sky-950 border border-sky-600/40 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                JS
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  Julian de Saint-Germain
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Administrator • Duty Manager
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
