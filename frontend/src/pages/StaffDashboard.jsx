import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getComplaints, updateComplaint } from '../api/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KpiCard from '../components/KpiCard';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import NotificationsDrawer from '../components/NotificationsDrawer';
import { 
  FileText, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  Wrench, 
  MapPin, 
  Calendar, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  Check
} from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned'); // assigned, tasks, profile
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Quick Inline Status Update State
  const [updatingId, setUpdatingId] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [remarks, setRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [quickUpdateSuccess, setQuickUpdateSuccess] = useState('');

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketUpdated = (updatedTicket) => {
    setComplaints(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  const handleQuickStatusSubmit = async (ticket) => {
    try {
      setIsSaving(true);
      const res = await updateComplaint(ticket.id, {
        status: newStatus,
        assignedStaff: user?.name || 'Officer Rohit Sharma',
        note: remarks || `Field technician updated status to ${newStatus}.`
      });

      if (res.success) {
        setComplaints(prev => prev.map(t => t.id === ticket.id ? res.data : t));
        setQuickUpdateSuccess(`Updated ${ticket.id} to ${newStatus}!`);
        setUpdatingId(null);
        setRemarks('');
        setTimeout(() => setQuickUpdateSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Staff KPIs
  const totalAssigned = complaints.length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const completed = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={1} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenSubmitModal={() => {}} 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                <Wrench className="w-4 h-4" />
                <span>Field Operations & Maintenance Division</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Staff Action Queue
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                On-ground task resolution, field telemetry updates, and citizen closure verification.
              </p>
            </div>

            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-bold text-amber-700 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1"></span>
              <span>Field Unit: On Duty</span>
            </div>
          </div>

          {quickUpdateSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2 shadow-sm animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{quickUpdateSuccess}</span>
            </div>
          )}

          {/* KPI Row matching Screen 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <KpiCard
              title="Assigned Tasks"
              count={totalAssigned}
              subtitle="Allocated to your division"
              icon={FileText}
              color="blue"
              tooltipText="Total tasks scheduled for your route"
            />
            <KpiCard
              title="In Progress"
              count={inProgress}
              subtitle="Currently being fixed"
              icon={PlayCircle}
              color="amber"
              tooltipText="Active repairs in progress"
            />
            <KpiCard
              title="Completed / Solved"
              count={completed}
              subtitle="Resolved today"
              icon={CheckCircle2}
              color="emerald"
              tooltipText="Tasks verified and closed"
            />
          </div>

          {/* Action Queue Cards (Matches Screen 8 & 9) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>My Assigned Complaints & Field Dispatch</span>
              </h3>
              <span className="text-xs text-gray-400">Total: {complaints.length} tickets</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {complaints.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: ID, Urgency, Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                        {ticket.id}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ticket.urgency === 'Critical' ? 'bg-red-500 text-white' :
                          ticket.urgency === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {ticket.urgency}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                      {ticket.title}
                    </h4>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {ticket.description}
                    </p>

                    <div className="mt-3 flex items-center space-x-3 text-[11px] text-gray-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span className="truncate">{ticket.location}</span>
                      </span>
                      <span>•</span>
                      <span>{ticket.category}</span>
                    </div>

                    {/* Progress Stepper matching Screen 9 */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mb-1">
                        <span className={ticket.status !== 'Pending' ? 'text-blue-600 font-extrabold' : ''}>Assigned</span>
                        <span className={ticket.status === 'In Progress' || ticket.status === 'Resolved' ? 'text-blue-600 font-extrabold' : ''}>In Progress</span>
                        <span className={ticket.status === 'Resolved' ? 'text-emerald-500 font-extrabold' : ''}>Resolved</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            ticket.status === 'Resolved' ? 'w-full bg-emerald-500' :
                            ticket.status === 'In Progress' ? 'w-2/3 bg-blue-500' : 'w-1/3 bg-amber-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Update Form Toggle / Actions */}
                  <div className="pt-2">
                    {updatingId === ticket.id ? (
                      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2.5 animate-in fade-in">
                        <div className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300">
                          Update Field Status
                        </div>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-xs"
                        >
                          <option value="In Progress">In Progress (Work Underway)</option>
                          <option value="Resolved">Resolved (Fixed & Verified)</option>
                          <option value="Escalated">Escalated (Requires Specialized Team)</option>
                        </select>
                        <input
                          type="text"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="e.g., Replacement cable installed, tested safe."
                          className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-xs"
                        />
                        <div className="flex items-center justify-end space-x-2 pt-1">
                          <button
                            onClick={() => setUpdatingId(null)}
                            className="px-3 py-1 rounded-lg text-xs text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleQuickStatusSubmit(ticket)}
                            disabled={isSaving}
                            className="px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                          >
                            {isSaving ? 'Saving...' : 'Save Status'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Full Details →
                        </button>
                        <button
                          onClick={() => {
                            setUpdatingId(ticket.id);
                            setNewStatus(ticket.status === 'Pending' ? 'In Progress' : 'Resolved');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
                        >
                          Update Status
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

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
