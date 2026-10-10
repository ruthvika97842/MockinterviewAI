import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import {
  Settings,
  Sparkles,
  Database,
  Camera,
  Mic,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Key,
  ShieldCheck,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [hasGemini, setHasGemini] = useState<boolean | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  // Device test state
  const [deviceTestStatus, setDeviceTestStatus] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await api.checkHealth();
        setHasGemini(res.hasGeminiKey);
      } catch {
        setHasGemini(false);
      }
    }
    checkHealth();

    const savedUrl = localStorage.getItem('mockwise_supabase_url') || '';
    const savedKey = localStorage.getItem('mockwise_supabase_key') || '';
    setSupabaseUrl(savedUrl);
    setSupabaseAnonKey(savedKey);
  }, []);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mockwise_supabase_url', supabaseUrl.trim());
    localStorage.setItem('mockwise_supabase_key', supabaseAnonKey.trim());
    setSupabaseSaved(true);
    setTimeout(() => setSupabaseSaved(false), 3000);
  };

  const handleTestDevices = async () => {
    setDeviceTestStatus('Testing camera and microphone permissions...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      setDeviceTestStatus(
        `Success! Detected ${videoTracks.length} Camera track (${videoTracks[0]?.label || 'Active'}) and ${audioTracks.length} Microphone track.`
      );
      stream.getTracks().forEach((t) => t.stop());
    } catch (err: any) {
      setDeviceTestStatus(`Device access error: ${err.message || 'Permission denied'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure external database connections, inspect AI models, and verify browser multimedia permissions.
        </p>
      </div>

      {/* AI Engine Status */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#635BFF]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Google Gemini AI Engine</h2>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
              hasGemini
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-50 text-[#635BFF] border border-indigo-200'
            }`}
          >
            {hasGemini ? 'Gemini 3.8 Flash Active' : 'Curated Placement Bank Active'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          MockWise AI uses <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">gemini-3.8-flash</code> via the official <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">@google/genai</code> SDK for dynamic placement question generation and evidence-based post-interview rubric evaluation.
        </p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Security Protocol:</span>
          <span className="font-semibold text-slate-700">Server-Side Proxy (API Keys Never Exposed to Frontend)</span>
        </div>
      </div>

      {/* Supabase Database Settings */}
      <form onSubmit={handleSaveSupabase} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Optional Supabase Sync</h2>
          </div>
          <span className="text-xs text-slate-400">PostgreSQL / Cloud DB</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The built-in Express server automatically persists all profiles, interviews, resumes, and recordings locally in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">./data/db.json</code>. You can optionally configure an external Supabase project for remote PostgreSQL replication.
        </p>

        {supabaseSaved && (
          <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Supabase credentials saved successfully.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Supabase Anon Public Key</label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg transition-colors"
        >
          Save Supabase Configuration
        </button>
      </form>

      {/* Multimedia Hardware Diagnostics */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Camera & Microphone Hardware Check</h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Verify that your browser grants WebRTC camera and microphone permissions so your practice recordings and voice recognition function smoothly.
        </p>

        {deviceTestStatus && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
            {deviceTestStatus}
          </div>
        )}

        <button
          type="button"
          onClick={handleTestDevices}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Test Devices & Permissions</span>
        </button>
      </div>
    </div>
  );
};
