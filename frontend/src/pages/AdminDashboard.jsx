import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getComplaints, updateComplaint, getExportUrl } from '../api/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KpiCard from '../components/KpiCard';
import KanbanBoard from '../components/KanbanBoard';
import ComplaintTable from '../components/ComplaintTable';
import SubmitComplaintModal from '../components/SubmitComplaintModal';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import NotificationsDrawer from '../components/NotificationsDrawer';
import AnalyticsView from '../components/AnalyticsView';
import { 
  FileText, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Plus, 
  Columns3, 
  ListFilter,
  BarChart3,
  Building2,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kanban'); // kanban, complaints, analytics, departments, profile
  
  // Modals
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getComplaints();
      if (res.success && res.data) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      // Optimistic UI update
      setComplaints(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      
      const res = await updateComplaint(ticketId, {
        status: newStatus,
        note: `Status updated to ${newStatus} via Kanban board triage.`
      });
      if (res.success && res.data) {
        setComplaints(prev => prev.map(t => t.id === ticketId ? res.data : t));
      }
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      fetchComplaints(); // rollback
    }
  };

  const handleTicketCreated = (newTicket) => {
    setComplaints(prev => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
  };

  const handleTicketUpdated = (updatedTicket) => {
    setComplaints(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  // KPIs
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const critical = complaints.filter(c => c.urgency === 'Critical' || c.urgency === 'High').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={4} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenSubmitModal={() => setIsSubmitOpen(true)} 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          
          {/* Admin Header with Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Central Municipal Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Admin Control Dashboard
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Multi-department ticket orchestration, SLA enforcement, and staff dispatch.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={getExportUrl()}
                download="complaints_export.csv"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </a>

              <button
                onClick={() => setIsSubmitOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Ticket</span>
              </button>
            </div>
          </div>

          {/* KPI Stats Row matching Screen 5 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KpiCard
              title="Total Complaints"
              count={total}
              subtitle="All registered"
              icon={FileText}
              color="blue"
              tooltipText="Total grievances logged across all sectors"
            />
            <KpiCard
              title="Pending Triage"
              count={pending}
              subtitle="Requires action"
              icon={Clock}
              color="amber"
              tooltipText="Awaiting technician assignment"
            />
            <KpiCard
              title="In Progress"
              count={inProgress}
              subtitle="Under active work"
              icon={PlayCircle}
              color="indigo"
              tooltipText="Dispatched field teams at work"
            />
            <KpiCard
              title="Resolved"
              count={resolved}
              subtitle="Verified & closed"
              icon={CheckCircle2}
              color="emerald"
              tooltipText="Successfully concluded tickets"
            />
            <KpiCard
              title="High / Critical SLA"
              count={critical}
              subtitle="Urgent hazard"
              icon={AlertTriangle}
              color="rose"
              tooltipText="Requires 2h-12h immediate response"
            />
          </div>

          {/* View Mode Switcher Pills (Kanban vs Table vs Analytics) */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <div className="flex items-center space-x-1.5 p-1 bg-gray-200/60 dark:bg-gray-800/80 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'kanban' || activeTab === 'dashboard'
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm font-black'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Kanban Live Board</span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'complaints'
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm font-black'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Table Register</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'analytics'
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm font-black'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Reports & Analytics</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Kanban Board */}
          {(activeTab === 'kanban' || activeTab === 'dashboard') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>💡 Drag and drop cards between columns to update status in real time.</span>
                <span className="font-mono text-[11px] text-blue-500">Auto-sync enabled</span>
              </div>
              <KanbanBoard
                tickets={complaints}
                onSelectTicket={(t) => setSelectedTicket(t)}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}

          {/* Tab 2: Table Register */}
          {activeTab === 'complaints' && (
            <ComplaintTable
              complaints={complaints}
              onSelectComplaint={(t) => setSelectedTicket(t)}
              title="All Municipal Complaints"
              showFilters={true}
            />
          )}

          {/* Tab 3: Reports & Analytics */}
          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {/* Tab 4: Departments View */}
          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Public Works & Roads', head: 'Chief Eng. K. R. Sharma', staff: '24 Workers', open: 2, resolved: 8 },
                { name: 'Electrical & Street Lighting', head: 'Exec. Eng. S. Mehta', staff: '18 Technicians', open: 1, resolved: 12 },
                { name: 'Water Supply & Sewage', head: 'Divisional Head P. Joshi', staff: '30 Technicians', open: 2, resolved: 14 },
                { name: 'Sanitation & Health', head: 'Health Officer Dr. Anjali Roy', staff: '45 Crew members', open: 0, resolved: 28 },
              ].map((d, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span>{d.name}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>Head: <span className="font-semibold text-gray-800 dark:text-gray-200">{d.head}</span></div>
                    <div>Deployment: <span className="font-semibold text-gray-800 dark:text-gray-200">{d.staff}</span></div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold">
                    <span className="text-amber-600 dark:text-amber-400">Open Tickets: {d.open}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Resolved: {d.resolved}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 5: Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm max-w-xl space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  A
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                  <p className="text-xs text-indigo-500 font-bold">{user?.roleLabel}</p>
                  <p className="text-xs text-gray-400">{user?.department}</p>
                </div>
              </div>
              <div className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                <div>Email: <span className="font-semibold text-gray-900 dark:text-white">{user?.email}</span></div>
                <div>Access Level: <span className="font-semibold text-emerald-500">Full SuperAdmin / Dispatcher</span></div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <SubmitComplaintModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={handleTicketCreated}
      />

      <ComplaintDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdated={handleTicketUpdated}
        canEdit={true}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

    </div>
  );
}
