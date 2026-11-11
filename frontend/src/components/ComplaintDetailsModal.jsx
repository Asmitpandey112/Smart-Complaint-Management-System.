import React, { useState, useEffect } from 'react';
import { updateComplaint } from '../api/api';
import { 
  X, 
  MapPin, 
  Building, 
  Calendar, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  Send,
  Loader2,
  AlertTriangle
} from 'lucide-react';

export default function ComplaintDetailsModal({ ticket, onClose, onUpdated, canEdit = true }) {
  if (!ticket) return null;

  const [status, setStatus] = useState(ticket.status || 'Pending');
  const [assignedStaff, setAssignedStaff] = useState(ticket.assignedStaff || 'Unassigned');
  const [internalNote, setInternalNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Sync local state when ticket prop changes (e.g. after external update)
  useEffect(() => {
    setStatus(ticket.status || 'Pending');
    setAssignedStaff(ticket.assignedStaff || 'Unassigned');
    setInternalNote('');
    setSuccessMsg('');
  }, [ticket]);

  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-amber-500 text-white';
      case 'medium':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const res = await updateComplaint(ticket.id, {
        status,
        assignedStaff,
        note: internalNote || `Status updated to ${status} with assignment to ${assignedStaff}.`
      });

      if (res.success) {
        setSuccessMsg('Complaint status updated successfully!');
        setInternalNote('');
        if (onUpdated) onUpdated(res.data);
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header matching prototype */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {ticket.id}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getUrgencyBadge(ticket.urgency)}`}>
              {ticket.urgency} PRIORITY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Title & Metadata */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              {ticket.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{ticket.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                <span>{ticket.category}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Submitted: {ticket.createdAt}</span>
              </span>
            </div>
          </div>

          {/* Citizen Description Card */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {ticket.description}
          </div>

          {/* AI Categorization & Keyword Extraction */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI Categorization & Keyword Extraction</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ticket.keywords && ticket.keywords.length > 0 ? (
                ticket.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/80 dark:bg-gray-800 text-purple-600 dark:text-purple-300 font-semibold border border-purple-200/50 dark:border-purple-800/50"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">#public_service #automated</span>
              )}
            </div>
          </div>

          {/* Resolution Audit Log & Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Resolution Audit Log & Timeline</span>
            </h4>
            <div className="space-y-3 pl-3 border-l-2 border-blue-500/30 dark:border-blue-500/20 ml-2">
              {ticket.timeline && ticket.timeline.map((entry, idx) => (
                <div key={idx} className="relative pl-4 group">
                  <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-900"></span>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-900 dark:text-gray-100">
                    <span>{entry.status}</span>
                    <span className="text-[10px] text-gray-400">{entry.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Feedback / Rating Preview if available */}
          {ticket.rating && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold mb-1">
                <span>Citizen Rating: {'★'.repeat(ticket.rating)}{'☆'.repeat(5 - ticket.rating)} ({ticket.rating}/5)</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                "{ticket.feedback || 'No remarks provided.'}"
              </p>
            </div>
          )}

          {/* Update Ticket Status & Staff Notes (Admin & Staff) */}
          {canEdit && (
            <form onSubmit={handleUpdate} className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Update Ticket Status & Staff Notes
              </h4>

              {successMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                    Update Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                    Assign Technician / Staff
                  </label>
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    placeholder="e.g. Officer V. Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                  Internal Note / Response to Citizen
                </label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add update or resolution details..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
