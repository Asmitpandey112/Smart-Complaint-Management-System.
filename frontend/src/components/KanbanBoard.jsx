import React from 'react';
import TicketCard from './TicketCard';
import { Clock, PlayCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';

const COLUMNS = [
  {
    status: 'Pending',
    title: 'Pending Triage',
    icon: Clock,
    headerColor: 'border-amber-400 bg-amber-50/70 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-600',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
  },
  {
    status: 'In Progress',
    title: 'In Progress',
    icon: PlayCircle,
    headerColor: 'border-blue-400 bg-blue-50/70 text-blue-900 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
  },
  {
    status: 'Escalated',
    title: 'Escalated / High SLA',
    icon: AlertOctagon,
    headerColor: 'border-rose-400 bg-rose-50/70 text-rose-900 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-600',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
  },
  {
    status: 'Resolved',
    title: 'Resolved / Closed',
    icon: CheckCircle2,
    headerColor: 'border-emerald-400 bg-emerald-50/70 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
  },
];

export default function KanbanBoard({ tickets, onSelectTicket, onStatusChange }) {
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId && onStatusChange) {
      onStatusChange(ticketId, newStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {COLUMNS.map((col) => {
        const Icon = col.icon;
        const columnTickets = tickets.filter(
          (t) => t.status?.toLowerCase() === col.status.toLowerCase()
        );

        return (
          <div
            key={col.status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.status)}
            className="flex flex-col rounded-2xl bg-gray-50/90 dark:bg-gray-900/40 border border-gray-200/80 dark:border-gray-800 p-4 transition-colors"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${col.headerColor} mb-4 shadow-sm`}>
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wide">
                  {col.title}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${col.badgeColor}`}>
                {columnTickets.length}
              </span>
            </div>

            {/* Droppable Card Container */}
            <div className="flex-1 space-y-3 min-h-[420px] overflow-y-auto pr-1">
              {columnTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 dark:text-gray-600 text-xs text-center p-4">
                  <p>No complaints in {col.status}</p>
                  <p className="text-[10px] mt-1 text-gray-400">Drag tickets here to update status</p>
                </div>
              ) : (
                columnTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onSelect={onSelectTicket}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
