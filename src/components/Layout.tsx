import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, BarChart2, User, ChevronLeft, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Layout({ children, title, showBack = false }: { children: React.ReactNode; title?: string; showBack?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shrink-0 z-10">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          <h1 className={cn("text-lg font-bold text-gray-900", !showBack && "text-xl")}>
            {title || "Akademi"}
          </h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-20">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/library" icon={BookOpen} label="Library" />
        <NavItem to="/sessions" icon={MessageSquare} label="Sessions" />
        <NavItem to="/progress" icon={BarChart2} label="Progress" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center gap-1 transition-colors",
          isActive ? "text-[#00D632]" : "text-gray-400 hover:text-gray-600"
        )
      }
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
