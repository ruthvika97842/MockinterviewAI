import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Recording, InterviewSession } from '../types/index.ts';
import {
  Video,
  Play,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
} from 'lucide-react';

export const RecordingsPage: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Recording | null>(null);

  const loadData = async () => {
    try {
      const [recRes, intRes] = await Promise.all([
        api.listRecordings(),
        api.listInterviews(),
      ]);
      setRecordings(recRes.recordings);
      setInterviews(intRes.interviews);
    } catch (err) {
      console.error('Error fetching recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this session recording?')) {
      try {
        await api.deleteRecording(id);
        await loadData();
      } catch (err) {
        alert('Failed to delete recording.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Interview Recordings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your camera posture, gaze direction, and speech pacing from recorded mock interviews.
        </p>
      </div>

      {recordings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((rec) => {
            const relatedInterview = interviews.find((i) => i.id === rec.interviewId);
            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Video Thumbnail / Mock Header */}
                  <div
                    onClick={() => setActiveVideo(rec)}
                    className="aspect-video bg-slate-900 flex items-center justify-center cursor-pointer group relative overflow-hidden"
                  >
                    {rec.dataUrl ? (
                      <video
                        src={rec.dataUrl}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <Video className="w-12 h-12 text-slate-600" />
                    )}

                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                      <div className="w-12 h-12 rounded-full bg-[#635BFF] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {Math.round(rec.durationSeconds)}s
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-xs truncate">
                      {relatedInterview?.jobRole || rec.fileName}
                    </h3>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-mono">
                        {(rec.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(rec)}
                    className="text-xs font-semibold text-[#635BFF] hover:underline flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" /> Watch
                  </button>

                  <button
                    onClick={() => handleDelete(rec.id)}
                    title="Delete recording"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <Video className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No recordings saved yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Enable Camera ON in the Interview Setup Wizard to capture and review your practice sessions.
          </p>
        </div>
      )}

      {/* Video Playback Modal */}
      {activeVideo?.dataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-2xl p-6 shadow-2xl space-y-4">
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
              <a
                href={activeVideo.dataUrl}
                download={activeVideo.fileName}
                className="text-[#635BFF] hover:underline flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" /> Download Video
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
