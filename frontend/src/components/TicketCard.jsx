import React from 'react';
import { useTooltip } from '../context/TooltipContext';
import { 
  MapPin, 
  Clock, 
  UserCheck, 
  Sparkles, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function TicketCard({ ticket, onSelect, onDragStart }) {
  const { showTooltip, hideTooltip } = useTooltip();

  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return { text: 'Critical', bg: 'bg-red-500 text-white', ring: 'ring-red-400/40' };
      case 'high':
        return { text: 'High Priority', bg: 'bg-amber-500 text-white', ring: 'ring-amber-400/40' };
      case 'medium':
        return { text: 'Medium', bg: 'bg-blue-500 text-white', ring: 'ring-blue-400/40' };
      default:
        return { text: 'Low', bg: 'bg-emerald-500 text-white', ring: 'ring-emerald-400/40' };
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Electrical':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
      case 'Water Supply':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300';
      case 'Sanitation':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      default:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300';
    }
  };

  const urgency = getUrgencyBadge(ticket.urgency);
  const categoryStyle = getCategoryColor(ticket.category);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, ticket.id)}
      onClick={() => onSelect(ticket)}
      onMouseEnter={() => {
        const latestUpdate = ticket.timeline?.[ticket.timeline.length - 1]?.note || 'Ticket in progress';
        showTooltip(latestUpdate, `${ticket.id} • ${ticket.status}`);
      }}
      onMouseLeave={hideTooltip}
      className="group relative bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-200/80 dark:border-gray-700/70 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-1"
    >
      {/* Top Header: ID & Urgency */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wide">
          {ticket.id}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${urgency.bg} shadow-sm`}>
          {urgency.text}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {ticket.title}
      </h4>

      {/* Description Snippet */}
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
        {ticket.description}
      </p>

      {/* AI Keywords tags */}
      {ticket.keywords && ticket.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {ticket.keywords.slice(0, 3).map((kw, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-medium"
            >
              <Sparkles className="w-2.5 h-2.5 mr-0.5 text-purple-500" />
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Meta Footer */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1 truncate max-w-[140px]">
          <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
          <span className="truncate">{ticket.location}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${categoryStyle}`}>
          {ticket.category}
        </span>
      </div>

      {/* Assigned Staff Pill */}
      {ticket.assignedStaff && ticket.assignedStaff !== 'Unassigned' && (
        <div className="mt-2 flex items-center space-x-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-700/40 px-2 py-1 rounded-md">
          <UserCheck className="w-3 h-3 text-emerald-500" />
          <span className="truncate">Assigned: {ticket.assignedStaff}</span>
        </div>
      )}
    </div>
  );
}
