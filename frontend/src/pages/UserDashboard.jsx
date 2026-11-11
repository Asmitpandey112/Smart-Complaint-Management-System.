import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getComplaints } from '../api/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KpiCard from '../components/KpiCard';
import ComplaintTable from '../components/ComplaintTable';
import SubmitComplaintModal from '../components/SubmitComplaintModal';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import FeedbackModal from '../components/FeedbackModal';
import NotificationsDrawer from '../components/NotificationsDrawer';
import { 
  FileText, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  User,
  Mail,
  Building,
  Phone
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [feedbackTicket, setFeedbackTicket] = useState(null);
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

  const handleTicketCreated = (newTicket) => {
    setComplaints(prev => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
  };

  const handleTicketUpdated = (updatedTicket) => {
    setComplaints(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  // Compute citizen statistics
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={2} />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenSubmitModal={() => setIsSubmitOpen(true)} 
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          
          {/* Welcome Banner matching prototype Screen 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Citizen Municipal Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Hello, {user?.name || 'Asmit'}! 👋
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
                Track your active municipal grievances, monitor real-time SLA resolutions, and file new civic reports.
              </p>
            </div>

            <button
              onClick={() => setIsSubmitOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-blue-600 font-extrabold text-sm shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-150 flex-shrink-0"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Submit New Complaint</span>
            </button>
          </div>

          {/* Active Tab: Dashboard or My Complaints */}
          {activeTab !== 'profile' ? (
            <>
              {/* KPI Cards row matching prototype Screen 2 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <KpiCard
                  title="Total Complaints"
                  count={total}
                  subtitle="Registered by you"
                  icon={FileText}
                  color="blue"
                  tooltipText="All grievances registered in municipal database"
                />
                <KpiCard
                  title="Pending"
                  count={pending}
                  subtitle="Under AI triage"
                  icon={Clock}
                  color="amber"
                  tooltipText="Tickets pending officer verification"
                />
                <KpiCard
                  title="In Progress"
                  count={inProgress}
                  subtitle="Technicians deployed"
                  icon={PlayCircle}
                  color="indigo"
                  tooltipText="Active resolution by field team"
                />
                <KpiCard
                  title="Resolved"
                  count={resolved}
                  subtitle="Ready for review"
                  icon={CheckCircle2}
                  color="emerald"
                  tooltipText="Successfully solved and closed"
                />
              </div>

              {/* Complaints Table matching Screen 2 & 6 */}
              <ComplaintTable
                complaints={complaints}
                onSelectComplaint={(t) => setSelectedTicket(t)}
                onOpenFeedback={(t) => setFeedbackTicket(t)}
                title="Recent Complaints & Live Tracking"
                showFilters={true}
              />
            </>
          ) : (
            /* Profile View matching Screen 13 */
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm max-w-2xl space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{user?.roleLabel}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Municipal Citizen ID: #CIT-99214</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Full Name</label>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold">
                    {user?.name}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Registered Email</label>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold">
                    {user?.email || 'asmit@gmail.com'}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Phone Number</label>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold font-mono">
                    +91 9876543210
                  </div>
                </div>
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
        canEdit={false}
      />

      <FeedbackModal
        ticket={feedbackTicket}
        isOpen={!!feedbackTicket}
        onClose={() => setFeedbackTicket(null)}
        onSuccess={handleTicketUpdated}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

    </div>
  );
}
