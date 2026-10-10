import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Sparkles, Video, UserCheck, LogOut, ArrowRight, Menu } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onToggleSidebar,
}) => {
  const { user, profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#635BFF] to-[#10152B] flex items-center justify-center text-white shadow-sm shadow-[#635BFF]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-lg">MockWise</span>
              <span className="text-[#635BFF] font-semibold text-xs tracking-wider uppercase">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">Campus Placement Engine</p>
          </div>
        </button>

        {user && (
          <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-slate-200 text-xs text-slate-500">
            <span>Target Role:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
              {profile?.preferredJobRole || 'Embedded Software Engineer'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={() => onNavigate('setup')}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg shadow-sm shadow-[#635BFF]/25 transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98]"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Start Interview</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-xs font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-[#635BFF] flex items-center justify-center font-bold text-xs">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate">{user.fullName || user.email}</span>
              </button>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg shadow-sm shadow-[#635BFF]/25 transition-all hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
