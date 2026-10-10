import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { InterviewSession, AnalyticsData } from '../types/index.ts';
import {
  Sparkles,
  PlayCircle,
  FileText,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  BarChart2,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardProps {
  onStartInterview: () => void;
  onViewInterview: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartInterview,
  onViewInterview,
  onNavigate,
}) => {
  const { user, profile, resume } = useAuth();
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [intRes, anaRes] = await Promise.all([
          api.listInterviews(),
          api.getAnalytics(),
        ]);
        setInterviews(intRes.interviews);
        setAnalytics(anaRes.analytics);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalInterviews = analytics?.totalCompleted || 0;
  const avgScore = analytics?.averageScore || 0;
  const bestScore = analytics?.bestScore || 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-classy-dark rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 dark-circuit-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-indigo-300 text-xs font-medium backdrop-blur-xs">
              <Cpu className="w-3.5 h-3.5" />
              <span>Campus Placement Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.fullName || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Target Track: <span className="font-semibold text-white">{profile?.preferredJobRole || 'Embedded Software Engineer'}</span>.
              Ready to practice for technical and HR placement interviews?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartInterview}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <PlayCircle className="w-4 h-4 text-[#635BFF]" />
              <span>Start New Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Interviews</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalInterviews}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Completed practice sessions</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Average Score</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {avgScore ? `${avgScore}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated from AI rubrics</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Best Score</span>
            <TrendingUp className="w-4 h-4 text-[#635BFF]" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {bestScore ? `${bestScore}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Peak placement readiness</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Resume Status</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {resume ? resume.fileName : 'Not Uploaded'}
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-[11px] text-[#635BFF] hover:underline font-semibold mt-1 inline-block"
          >
            {resume ? 'Manage Resume' : 'Upload Resume →'}
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Interviews & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Interviews */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Interview Sessions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your recorded attempts and evaluated reports</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-[#635BFF] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {interviews.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {interviews.slice(0, 5).map((interview) => (
                <div
                  key={interview.id}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{interview.jobRole}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        {interview.interviewType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {interview.interviewMode.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(interview.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {interview.overallScore !== undefined ? (
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {interview.overallScore} / 100
                        </span>
                        <span className="block text-[10px] text-emerald-600 font-medium">Evaluated</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">In Progress</span>
                    )}

                    <button
                      onClick={() => onViewInterview(interview.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#635BFF] hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-xs font-bold text-slate-700">No interviews completed yet</h3>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Begin your first 10-minute mock interview to receive real evidence-based feedback on your placement readiness.
              </p>
              <button
                onClick={onStartInterview}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg shadow-xs"
              >
                <span>Start First Interview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Recommendations & Fast Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Cpu className="w-4 h-4 text-[#635BFF]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recommended Revision Topics</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {(analytics?.recommendedTopics || [
                'Embedded C: Pointers, Memory Mapping, and Volatile',
                'VLSI: Setup and Hold Time Violations',
                'Microcontrollers: Interrupt Vectors & Low-power',
                'STAR Method for Behavioral Rounds',
              ]).map((topic, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF] mt-1.5 shrink-0" />
                  <span className="leading-snug">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-2xl p-6 border border-indigo-100 text-xs text-slate-700 space-y-2">
            <h3 className="font-bold text-[#635BFF] text-sm">Placement Readiness Tip</h3>
            <p className="leading-relaxed text-[11px] text-slate-600">
              In technical interviews, don't just state the final answer. Explain the trade-offs (e.g. speed vs. memory, hardware overhead vs. software complexity).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
