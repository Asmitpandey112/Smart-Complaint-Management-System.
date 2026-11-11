import React, { useState, useEffect } from 'react';
import { createComplaint, analyzeComplaintAI } from '../api/api';
import { X, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function SubmitComplaintModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('+91 9876543210');
  const [categoryOverride, setCategoryOverride] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Real-time AI preview state
  const [aiPreview, setAiPreview] = useState({
    category: 'Public Works',
    urgency: 'Medium',
    score: 50,
    keywords: ['#general_report'],
    isAnalyzing: false,
  });

  useEffect(() => {
    if (!title && !description) {
      setAiPreview({
        category: 'Public Works',
        urgency: 'Medium',
        score: 50,
        keywords: ['#general_report'],
        isAnalyzing: false,
      });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setAiPreview(prev => ({ ...prev, isAnalyzing: true }));
        const res = await analyzeComplaintAI(title, description);
        if (res.success && res.data) {
          setAiPreview({
            category: res.data.category,
            urgency: res.data.urgency,
            score: res.data.score,
            keywords: res.data.keywords || [],
            isAnalyzing: false,
          });
          if (!categoryOverride) {
            setCategoryOverride(res.data.category);
          }
        }
      } catch (err) {
        setAiPreview(prev => ({ ...prev, isAnalyzing: false }));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [title, description]);

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setLocation('');
      setPhone('+91 9876543210');
      setCategoryOverride('');
      setError('');
      setAiPreview({ category: 'Public Works', urgency: 'Medium', score: 50, keywords: ['#general_report'], isAnalyzing: false });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setError('Please fill in title, description, and location.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const payload = {
        title,
        description,
        location,
        phone,
        categoryOverride: categoryOverride || aiPreview.category,
      };

      const res = await createComplaint(payload);
      if (res.success) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please check your backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'text-rose-500 dark:text-rose-400 font-bold';
      case 'high': return 'text-amber-500 dark:text-amber-400 font-bold';
      default: return 'text-blue-500 dark:text-blue-400 font-bold';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Submit New Complaint
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              AI will auto-analyze your description to route & assign priority.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-rose-600 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Title / Brief Subject *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Severe water pipeline leakage near Park Street"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, exact landmark, and any hazard..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
              required
            />
          </div>

          {/* Real-time AI Preview Card matching prototype screen 10/11 */}
          <div className="rounded-2xl p-4 bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-blue-50/80 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Auto-Classification & Urgency Score</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm flex items-center space-x-1">
                {aiPreview.isAnalyzing ? (
                  <>
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Active</span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mt-3">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Suggested Category:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{aiPreview.category}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Calculated Urgency:</span>
                <span className={getUrgencyColor(aiPreview.urgency)}>
                  {aiPreview.urgency} (Score: {aiPreview.score}/100)
                </span>
              </div>
            </div>

            {aiPreview.keywords && aiPreview.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {aiPreview.keywords.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/70 dark:bg-gray-800/80 text-purple-600 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Form Row: Category Override & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Category Override
              </label>
              <select
                value={categoryOverride || aiPreview.category}
                onChange={(e) => setCategoryOverride(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Public Works">Public Works & Roads</option>
                <option value="Electrical">Electrical & Streetlights</option>
                <option value="Water Supply">Water Supply & Pipeline</option>
                <option value="Sanitation">Sanitation & Waste</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Location / Address *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Sector 4, Block B, Main Road"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Citizen Contact */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Citizen Contact Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Ticket</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
