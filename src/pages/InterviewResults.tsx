import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  InterviewFeedback,
  InterviewSession,
  Recording,
} from '../types/index.ts';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
  LayoutDashboard,
  Video,
  Lightbulb,
  BookOpen,
  Camera,
  Eye,
  Sun,
  ShieldCheck,
} from 'lucide-react';

interface ResultsProps {
  feedback: InterviewFeedback;
  session: InterviewSession;
  recording?: Recording;
  onPracticeAgain: () => void;
  onGoToDashboard: () => void;
}

export const InterviewResults: React.FC<ResultsProps> = ({
  feedback,
  session,
  recording,
  onPracticeAgain,
  onGoToDashboard,
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti if high score
    if (feedback.overallScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Expand first question by default
    if (feedback.questionEvaluations && feedback.questionEvaluations.length > 0) {
      setExpandedQuestions({ [feedback.questionEvaluations[0].questionId]: true });
    }
  }, [feedback]);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-[#635BFF]';
    return 'bg-amber-500';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#635BFF] text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Campus Placement Evaluation Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Interview Results
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Role: <span className="font-semibold text-slate-800">{session.jobRole}</span> ·{' '}
              {session.interviewType === 'technical' ? 'Technical Round' : 'HR & Behavioral Round'} ·{' '}
              {new Date(session.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPracticeAgain}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Score Metrics Trio */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Overall Interview Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                {feedback.overallScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${getProgressColor(feedback.overallScore)}`}
                style={{ width: `${feedback.overallScore}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Technical Precision</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#635BFF] font-mono">
                {feedback.technicalScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#635BFF] h-1.5 rounded-full"
                style={{ width: `${feedback.technicalScore}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Communication & Clarity</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">
                {feedback.communicationScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${feedback.communicationScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Key Strengths Demonstrated</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {feedback.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Priority Growth Areas</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {feedback.improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Optional Presentation Feedback (When camera enabled) */}
      {feedback.presentationAnalysis && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#635BFF]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Camera Presentation Insights</h2>
            </div>
            {recording && (
              <button
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:underline"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play Recorded Video</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">Face Visibility & Framing</span>
              <p className="text-slate-800 leading-relaxed">{feedback.presentationAnalysis.faceVisibility}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">Screen / Camera Engagement</span>
              <p className="text-slate-800 leading-relaxed">{feedback.presentationAnalysis.cameraEngagement}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">Lighting & Background</span>
              <p className="text-slate-800 leading-relaxed">{feedback.presentationAnalysis.lightingQuality}</p>
            </div>
          </div>

          {feedback.presentationAnalysis.practicalTips && (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-slate-700">
              <span className="font-semibold text-[#635BFF] block mb-1">Presentation Tips:</span>
              <ul className="list-disc pl-4 space-y-1">
                {feedback.presentationAnalysis.practicalTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Question-By-Question Detailed Analysis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Question-by-Question Diagnostic</h2>
          <span className="text-xs text-slate-500">
            {feedback.questionEvaluations.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {feedback.questionEvaluations.map((q, idx) => {
            const isExpanded = Boolean(expandedQuestions[q.questionId]);
            return (
              <div
                key={q.questionId || idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleQuestion(q.questionId)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#635BFF]">Question {idx + 1}</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border font-mono ${getScoreColor(
                          q.score * 10
                        )}`}
                      >
                        Score: {q.score} / 10
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{q.questionText}</h3>
                  </div>
                  <div className="p-1 rounded-lg text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Diagnostic Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs">
                    {/* Candidate's submitted answer */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Your Submitted Answer:</span>
                      <p className="text-slate-800 leading-relaxed font-sans">{q.answerText}</p>
                    </div>

                    {/* What went well & Specific Mistakes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <span className="font-bold text-emerald-800 block mb-1">What You Did Well:</span>
                        <p className="text-slate-700 leading-relaxed">{q.whatWentWell}</p>
                      </div>

                      <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
                        <span className="font-bold text-amber-800 block mb-1">Specific Inaccuracies / Mistakes:</span>
                        <p className="text-slate-700 leading-relaxed">{q.specificMistakes}</p>
                      </div>
                    </div>

                    {/* Missing points */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">Important Missing Concepts:</span>
                      <p className="text-slate-600 leading-relaxed">{q.missingPoints}</p>
                    </div>

                    {/* Model Placement Answer */}
                    <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-[#635BFF] font-bold">
                        <Lightbulb className="w-4 h-4" />
                        <span>Recommended Placement-Standard Answer:</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-indigo-100 font-normal">
                        {q.betterSampleAnswer}
                      </p>
                      {q.practicalTips && (
                        <p className="text-[11px] text-slate-500 italic pt-1">
                          Tip: {q.practicalTips}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Placement Revision Topics */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-[#635BFF]" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recommended Revision Topics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {feedback.recommendedTopics.map((topic, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#635BFF]" />
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal if recording exists */}
      {showVideoModal && recording?.dataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Session Recording Playback</h3>
              <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <video src={recording.dataUrl} controls autoPlay className="w-full h-full object-cover" />
            </div>
            <div className="text-xs text-slate-500 flex justify-between">
              <span>{recording.fileName}</span>
              <span>{Math.round(recording.durationSeconds)} seconds recorded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
