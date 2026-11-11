import React from 'react';
import { useTooltip } from '../context/TooltipContext';

export default function KpiCard({ title, count, subtitle, icon: Icon, color = 'blue', tooltipText }) {
  const { showTooltip, hideTooltip } = useTooltip();

  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/50',
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500 text-white',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/50',
      text: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500 text-white',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      border: 'border-indigo-100 dark:border-indigo-900/50',
      text: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-500 text-white',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500 text-white',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-100 dark:border-rose-900/50',
      text: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500 text-white',
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      onMouseEnter={() => tooltipText && showTooltip(tooltipText, `${title}: ${count}`)}
      onMouseLeave={hideTooltip}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-default ${style.bg} ${style.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold tracking-tight ${style.text}`}>
              {count}
            </span>
            {subtitle && (
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${style.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {/* Subtle bottom indicator line */}
      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
        <div className={`h-full ${style.iconBg} w-3/4 rounded-full opacity-80`}></div>
      </div>
    </div>
  );
}
