import React from 'react';
import { X, Bell, CheckCheck, Clock, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NotificationsDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'assignment',
      title: 'Ticket Assigned',
      desc: 'Your complaint CMP-1001 has been assigned to Officer V. Kumar.',
      time: 'Today, 10:15 AM',
      icon: UserCheck,
      color: 'bg-blue-500 text-white',
    },
    {
      id: 2,
      type: 'status',
      title: 'Status Updated',
      desc: 'Status updated for CMP-1002 to Under Investigation.',
      time: 'Today, 09:32 AM',
      icon: Clock,
      color: 'bg-amber-500 text-white',
    },
    {
      id: 3,
      type: 'critical',
      title: 'Critical SLA Escalation',
      desc: 'Complaint CMP-1005: Water main burst marked Critical urgency.',
      time: 'Yesterday, 12:00 PM',
      icon: AlertTriangle,
      color: 'bg-rose-500 text-white',
    },
    {
      id: 4,
      type: 'resolved',
      title: 'Issue Resolved',
      desc: 'Complaint CMP-1003 has been resolved & verified by citizen feedback.',
      time: '2 days ago',
      icon: CheckCircle2,
      color: 'bg-emerald-500 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Notifications
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action */}
          <div className="px-5 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Recent Alerts ({notifications.length})</span>
            <button className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center space-x-1">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer flex space-x-3"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
