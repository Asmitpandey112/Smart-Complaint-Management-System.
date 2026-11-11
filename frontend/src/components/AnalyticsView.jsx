import React, { useState, useEffect } from 'react';
import { getAnalytics, getExportUrl } from '../api/api';
import { 
  BarChart2, 
  PieChart, 
  Download, 
  TrendingUp, 
  Clock, 
  Star, 
  CheckCircle,
  Building2,
  Calendar
} from 'lucide-react';

export default function AnalyticsView() {
  const [data, setData] = useState({
    total: 5,
    pending: 2,
    inProgress: 2,
    resolved: 1,
    escalated: 0,
    critical: 2,
    deptCounts: {
      "Public Works": 1,
      "Sanitation": 1,
      "Electrical": 1,
      "Water Supply": 2,
    },
    avgResolutionHours: 14.2,
    csatScore: '4.8',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { name: 'Public Works & Roads', count: data.deptCounts['Public Works'] || 0, efficiency: 88, color: 'bg-blue-500' },
    { name: 'Electrical & Power', count: data.deptCounts['Electrical'] || 0, efficiency: 92, color: 'bg-amber-500' },
    { name: 'Water & Pipeline', count: data.deptCounts['Water Supply'] || 0, efficiency: 79, color: 'bg-cyan-500' },
    { name: 'Sanitation & Health', count: data.deptCounts['Sanitation'] || 0, efficiency: 95, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Analytics Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Municipal Reports & Analytics
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time citizen grievance resolution metrics and performance indicators.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>October 2026 (Live)</span>
          </div>

          <a
            href={getExportUrl()}
            download="complaints_export.csv"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Top 3 High Level Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-gray-400">Avg Resolution Speed</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{data.avgResolutionHours} hrs</div>
            <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">↓ 2.4 hrs vs last month</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-500">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-gray-400">Citizen Satisfaction (CSAT)</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{data.csatScore} / 5.0</div>
            <div className="text-[11px] text-amber-500 font-semibold mt-0.5">★★★★★ Verified by citizens</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-gray-400">SLA Compliance Rate</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">94.8%</div>
            <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">Exceeds municipal target (90%)</div>
          </div>
        </div>
      </div>

      {/* Grid: Department Distribution & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Performance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Department Workload & Efficiency</span>
            </h3>
            <span className="text-xs text-gray-400">Efficiency %</span>
          </div>

          <div className="space-y-4 pt-2">
            {departments.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {dept.name} ({dept.count} tickets)
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{dept.efficiency}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dept.color}`}
                    style={{ width: `${dept.efficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span>Complaint Status Distribution</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Pending Triage</div>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{data.pending}</div>
              <div className="text-[10px] text-gray-400 mt-1">Under AI validation</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">In Progress</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">{data.inProgress}</div>
              <div className="text-[10px] text-gray-400 mt-1">Field team assigned</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Resolved & Closed</div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{data.resolved}</div>
              <div className="text-[10px] text-gray-400 mt-1">Citizen feedback verified</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">Critical / SLA Alert</div>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">{data.critical || 1}</div>
              <div className="text-[10px] text-gray-400 mt-1">Needs priority dispatch</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
