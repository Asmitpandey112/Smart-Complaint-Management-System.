import React, { useState } from 'react';
import { useTooltip } from '../context/TooltipContext';
import { 
  Search, 
  Filter, 
  Eye, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ComplaintTable({ 
  complaints, 
  onSelectComplaint, 
  onOpenFeedback, 
  title = "Complaints Register",
  showFilters = true 
}) {
  const { showTooltip, hideTooltip } = useTooltip();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = complaints.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'escalated':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
    }
  };

  const getPriorityBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-500 text-white';
      case 'high':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
      
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Showing {filtered.length} of {complaints.length} tickets
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket, location..."
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Public Works">Public Works</option>
              <option value="Electrical">Electrical</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Sanitation">Sanitation</option>
            </select>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              <th className="py-3.5 px-6">ID</th>
              <th className="py-3.5 px-4">Title & Description</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Assigned To</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs text-gray-700 dark:text-gray-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400 text-xs">
                  No complaints found matching the criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  onMouseEnter={() => {
                    const note = item.timeline?.[item.timeline.length - 1]?.note || item.location;
                    showTooltip(note, `${item.id} • ${item.status}`);
                  }}
                  onMouseLeave={hideTooltip}
                  className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group cursor-pointer"
                  onClick={() => onSelectComplaint(item)}
                >
                  <td className="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {item.id}
                  </td>
                  <td className="py-4 px-4 max-w-xs sm:max-w-md">
                    <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(item.urgency)}`}>
                      {item.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {item.assignedStaff || 'Unassigned'}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectComplaint(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="View Details & Timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {item.status === 'Resolved' && onOpenFeedback && (
                        <button
                          onClick={() => onOpenFeedback(item)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-[11px] font-bold flex items-center space-x-1 transition"
                          title="Submit Citizen Review"
                        >
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.rating ? `${item.rating}★` : 'Feedback'}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
