import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { AnalyticsData } from '../types/index.ts';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Cpu,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.getAnalytics();
        setData(res.analytics);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const total = data?.totalCompleted || 0;
  const trend = data?.trend || [];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Title Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance & Readiness Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical scores, skill breakdowns, and prioritized revision topics derived from your mock interview evaluations.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Completed Interviews</span>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {total}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sessions scored by AI</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Average Overall Score</span>
          <div className="text-3xl font-extrabold text-[#635BFF] font-mono tabular-nums">
            {data?.averageScore || 0}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all completed attempts</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Technical Average</span>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {data?.technicalAverage || 0}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Technical engineering depth</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">HR & Behavioral Average</span>
          <div className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
            {data?.hrAverage || 0}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">STAR communication clarity</p>
        </div>
      </div>

      {/* Interactive Trend Chart (SVG) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Placement Score Trajectory</h2>
            <p className="text-xs text-slate-500 mt-0.5">Chronological score progression over completed sessions</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF]" /> Mock Score
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Target: 80%+</span>
          </div>
        </div>

        {trend.length >= 2 ? (
          <div className="pt-6">
            {/* SVG Chart */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal gridlines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = 200 - val * 1.8;
                  return (
                    <g key={val}>
                      <line x1="0" y1={y} x2="600" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                      <text x="5" y={y - 4} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Score line */}
                {(() => {
                  const points = trend.map((item, idx) => {
                    const x = (idx / (trend.length - 1)) * 560 + 20;
                    const y = 200 - (item.score || 0) * 1.8;
                    return `${x},${y}`;
                  });
                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#635BFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points.join(' ')}
                      />
                      {trend.map((item, idx) => {
                        const x = (idx / (trend.length - 1)) * 560 + 20;
                        const y = 200 - (item.score || 0) * 1.8;
                        return (
                          <g key={item.id}>
                            <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#635BFF" strokeWidth="3" />
                            <text
                              x={x}
                              y={y - 12}
                              textAnchor="middle"
                              fill="#1e293b"
                              fontSize="11"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {item.score}%
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
              {trend.map((item) => (
                <div key={item.id} className="text-center">
                  <span>{item.date}</span>
                  <span className="block text-[10px] text-slate-400 max-w-[80px] truncate">{item.role}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-100">
            <TrendingUp className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-xs font-bold text-slate-700">Need at least 2 completed sessions</h3>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Complete another mock interview to unlock your historical trend line and score trajectory chart.
            </p>
          </div>
        )}
      </div>

      {/* Recommended Practice Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-[#635BFF]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Frequently Tested ECE Topics</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">Embedded C: Volatile, Pointer Typecasting & Bitwise Ops</span>
              <p className="text-slate-500 leading-relaxed">
                Crucial for core embedded rounds. Practice manipulating register bits: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">{"PORTB |= (1 << 3);"}</code>
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">RTOS: Priority Inversion & Mutex Ownership</span>
              <p className="text-slate-500 leading-relaxed">
                Understand why FreeRTOS semaphores lack priority inheritance while mutexes provide it.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">VLSI: Setup Slack, Hold Slack & Metastability</span>
              <p className="text-slate-500 leading-relaxed">
                Be ready to calculate maximum operating clock frequency given flip-flop clk-to-q and logic delay.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Placement Strategy Guide</h2>
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-800">Defend Your Resume Projects</span>
              <p className="leading-relaxed">
                If you mention STM32, expect interviewers to ask what clock source you used (HSI vs HSE) and why.
              </p>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
              <span className="font-bold text-[#635BFF]">Communication Discipline</span>
              <p className="leading-relaxed">
                State your main answer in the first 20 seconds before giving secondary explanations.
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
              <span className="font-bold text-amber-800">Handling Unfamiliar Questions</span>
              <p className="leading-relaxed">
                Never guess blindly. State what you know about related fundamentals, then reason step by step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
