import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Bell, 
  UserCircle, 
  BarChart3, 
  Settings, 
  LogOut,
  Users,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenSubmitModal }) {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'complaints', label: 'Manage Complaints', icon: FileText },
        { id: 'kanban', label: 'Kanban Live Triage', icon: Clock },
        { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'profile', label: 'Admin Profile', icon: UserCircle },
      ];
    }
    if (user?.role === 'staff') {
      return [
        { id: 'dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
        { id: 'assigned', label: 'Assigned Complaints', icon: FileText },
        { id: 'tasks', label: 'My Action Queue', icon: CheckCircle2 },
        { id: 'profile', label: 'My Profile', icon: UserCircle },
      ];
    }
    // Citizen / User
    return [
      { id: 'dashboard', label: 'Citizen Dashboard', icon: LayoutDashboard },
      { id: 'my-complaints', label: 'My Complaints', icon: FileText },
      { id: 'submit', label: 'Submit Complaint', icon: PlusCircle, isAction: true },
      { id: 'profile', label: 'Profile Settings', icon: UserCircle },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col bg-[#0F172A] text-slate-300 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      
      {/* User Mini Profile Header in Sidebar */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/50">
        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
          <div className="text-[11px] text-blue-400 capitalize">{user?.roleLabel || user?.role}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          Navigation
        </div>
        
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onOpenSubmitModal}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">AI Engine Status</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              Online
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Auto-routing & SLA tracking active
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full mt-3 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
