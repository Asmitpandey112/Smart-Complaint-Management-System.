import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  Bell, 
  LogOut, 
  User, 
  ShieldAlert, 
  Wrench,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ onOpenNotifications, unreadCount = 3 }) {
  const { user, switchRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleConfigs = {
    user: { label: 'Citizen Portal', icon: User, color: 'bg-emerald-500' },
    admin: { label: 'Municipal Admin', icon: ShieldAlert, color: 'bg-indigo-600' },
    staff: { label: 'Field Staff', icon: Wrench, color: 'bg-amber-500' },
  };

  const currentRoleConfig = roleConfigs[user?.role] || roleConfigs.user;
  const CurrentIcon = currentRoleConfig.icon;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Smart Complaint
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                SCMS 2.0
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Efficient • Transparent • Accountable
            </p>
          </div>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Role Switcher for presentations */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 transition-all shadow-sm"
              title="Switch demo role (User, Admin, Staff)"
            >
              <span className={`w-2 h-2 rounded-full ${currentRoleConfig.color}`}></span>
              <CurrentIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="hidden md:inline font-semibold">{currentRoleConfig.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700 mb-1">
                  Switch Active Role
                </div>
                <button
                  onClick={() => switchRole('user')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/60 ${
                    user?.role === 'user' ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/30' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-medium">Citizen / User</div>
                    <div className="text-[10px] text-gray-400">File & track complaints</div>
                  </div>
                </button>
                <button
                  onClick={() => switchRole('admin')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/60 ${
                    user?.role === 'admin' ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/30' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-indigo-500" />
                  <div>
                    <div className="font-medium">Admin Dashboard</div>
                    <div className="text-[10px] text-gray-400">Kanban, triage & analytics</div>
                  </div>
                </button>
                <button
                  onClick={() => switchRole('staff')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/60 ${
                    user?.role === 'staff' ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/30' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-medium">Staff / Field Worker</div>
                    <div className="text-[10px] text-gray-400">Task updates & resolution</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Activity Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-gray-200 dark:border-gray-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left text-xs leading-tight hidden lg:block">
              <div className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || 'User'}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
