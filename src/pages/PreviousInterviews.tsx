import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { InterviewSession, Recording } from '../types/index.ts';
import {
  Search,
  Filter,
  Trash2,
  Play,
  FileText,
  Calendar,
  Clock,
  Video,
  Award,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PreviousInterviewsProps {
  onViewInterview: (id: string) => void;
  onStartNew: () => void;
}

export const PreviousInterviews: React.FC<PreviousInterviewsProps> = ({
  onViewInterview,
  onStartNew,
}) => {
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'technical' | 'hr'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'chat' | 'voice'>('all');

  // Video playback modal
  const [activeVideo, setActiveVideo] = useState<Recording | null>(null);

  const loadData = async () => {
    try {
      const [intRes, recRes] = await Promise.all([
        api.listInterviews(),
        api.listRecordings(),
      ]);
      setInterviews(intRes.interviews);
      setRecordings(recRes.recordings);
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteInterview = async (id: string) => {
    if (confirm('Are you sure you want to delete this interview session and its evaluation records?')) {
      try {
        await api.deleteInterview(id);
        await loadData();
      } catch (err) {
        alert('Failed to delete interview.');
      }
    }
  };

  const filtered = interviews.filter((item) => {
    const matchesSearch = item.jobRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.interviewType === typeFilter;
    const matchesMode = modeFilter === 'all' || item.interviewMode === modeFilter;
    return matchesSearch && matchesType && matchesMode;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Previous Interview History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review detailed question rubrics, evaluate mistakes, and track your scoring progress across attempts.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-sm transition-all"
        >
          + New Interview
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job role (e.g. Embedded, VLSI)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e: any) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="technical">Technical Only</option>
            <option value="hr">HR Only</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e: any) => setModeFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
          >
            <option value="all">All Modes</option>
            <option value="chat">Chat Mode</option>
            <option value="voice">Voice Mode</option>
          </select>
        </div>
      </div>

      {/* Interviews Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const rec = recordings.find((r) => r.interviewId === item.id);
              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.jobRole}</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.interviewType}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.interviewMode.toUpperCase()}
                      </span>
                      {rec && (
                        <span className="text-[10px] text-[#635BFF] bg-indigo-50 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.round(item.durationSeconds / 60)} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      {item.overallScore !== undefined ? (
                        <div>
                          <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                            {item.overallScore} / 100
                          </span>
                          <span className="block text-[10px] text-emerald-600 font-medium">Completed</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Unfinished</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {rec?.dataUrl && (
                        <button
                          onClick={() => setActiveVideo(rec)}
                          title="Watch Recording"
                          className="p-2 text-slate-500 hover:text-[#635BFF] hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onViewInterview(item.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg transition-all"
                      >
                        View Report
                      </button>

                      <button
                        onClick={() => handleDeleteInterview(item.id)}
                        title="Delete interview"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 space-y-3">
            <p className="text-xs text-slate-500">No interviews found matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo?.dataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Session Recording Playback</h3>
              <button onClick={() => setActiveVideo(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <video src={activeVideo.dataUrl} controls autoPlay className="w-full h-full object-cover" />
            </div>
            <div className="text-xs text-slate-500 flex justify-between">
              <span>{activeVideo.fileName}</span>
              <span>{Math.round(activeVideo.durationSeconds)} seconds recorded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
