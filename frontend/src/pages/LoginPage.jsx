import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  User, 
  ShieldAlert, 
  Wrench, 
  ArrowRight, 
  Sparkles,
  Lock,
  Mail
} from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('user'); // 'user' | 'admin' | 'staff'
  const [name, setName] = useState('Asmit Kumar');
  const [email, setEmail] = useState('asmit@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'user') {
      setName('Asmit Kumar');
      setEmail('asmit@gmail.com');
    } else if (newRole === 'admin') {
      setName('Chief Officer Admin');
      setEmail('admin.scms@gov.in');
    } else if (newRole === 'staff') {
      setName('Officer Rohit Sharma');
      setEmail('rohit.sharma@pwd.gov.in');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(name, role, email);
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/user');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Background Glowing Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Brand Banner matching prototype Screen 1 */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Smart Municipal Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Smart Complaint Management System
            </h1>
            
            <p className="text-blue-100 text-xs sm:text-sm mt-3 leading-relaxed">
              A smarter way to report civic issues, track real-time resolution timelines, and empower municipal accountability.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="font-bold text-white text-xs">AI-Triage</div>
                <div className="text-blue-200">Instant routing</div>
              </div>
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="font-bold text-white text-xs">Live SLA</div>
                <div className="text-blue-200">Real-time alerts</div>
              </div>
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="font-bold text-white text-xs">Citizen 1st</div>
                <div className="text-blue-200">Feedback driven</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form & Role Selection */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
          
          {/* Header Switcher */}
          <div>
            <div className="flex border-b border-slate-700 pb-2 mb-4 space-x-4">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`text-sm font-bold pb-2 transition relative ${
                  tab === 'login' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`text-sm font-bold pb-2 transition relative ${
                  tab === 'register' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Register Citizen
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-white">
              {tab === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your role to explore the interactive role-based portals.
            </p>
          </div>

          {/* Quick Role Selection Buttons */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Portal / Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'user', label: 'Citizen', icon: User, color: 'hover:border-emerald-500' },
                { id: 'admin', label: 'Admin', icon: ShieldAlert, color: 'hover:border-indigo-500' },
                { id: 'staff', label: 'Field Staff', icon: Wrench, color: 'hover:border-amber-500' },
              ].map(r => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition text-xs font-semibold ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/20 text-white shadow-md shadow-blue-500/20'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 ' + r.color
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Email / User ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Launch {role === 'admin' ? 'Admin Portal' : role === 'staff' ? 'Staff Portal' : 'Citizen Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
