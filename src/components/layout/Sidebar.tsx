import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  PlayCircle,
  History,
  Video,
  BarChart3,
  User,
  Settings,
  LogOut,
  Cpu,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen = false,
  onClose,
}) => {
  const { user, profile, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup', label: 'Start Interview', icon: PlayCircle, highlight: true },
    { id: 'history', label: 'Previous Interviews', icon: History },
    { id: 'recordings', label: 'My Recordings', icon: Video },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="font-bold text-slate-900">MockWise AI</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-semibold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Platform Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#635BFF] text-white shadow-sm shadow-[#635BFF]/30 font-semibold'
                      : item.highlight
                      ? 'text-[#635BFF] bg-indigo-50/70 hover:bg-indigo-100/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Placement Focus Card with Classy Styling */}
          <div className="p-3.5 rounded-xl bg-classy-dark text-white relative overflow-hidden">
            <div className="absolute inset-0 dark-circuit-grid opacity-25 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-bold tracking-wide uppercase text-indigo-200">ECE & Tech Track</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                Practice Embedded C, RTOS, VLSI timing, and campus behavioral interviews.
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/60 font-mono">
              <span>{profile?.degree ? 'ECE Specialization' : 'College Track'}</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={() => {
              logout();
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
