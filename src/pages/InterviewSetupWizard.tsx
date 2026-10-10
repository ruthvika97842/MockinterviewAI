import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { InterviewSession, InterviewQuestion } from '../types/index.ts';
import {
  Cpu,
  UserCheck,
  MessageSquare,
  Mic,
  Camera,
  CameraOff,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Code2,
  FileCheck,
} from 'lucide-react';

interface SetupWizardProps {
  onInterviewStarted: (session: InterviewSession, questions: InterviewQuestion[]) => void;
  onCancel: () => void;
}

export const InterviewSetupWizard: React.FC<SetupWizardProps> = ({
  onInterviewStarted,
  onCancel,
}) => {
  const { profile, resume } = useAuth();

  const [step, setStep] = useState<number>(1);

  // Configuration state
  const [jobRole, setJobRole] = useState(profile?.preferredJobRole || 'Embedded Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [interviewType, setInterviewType] = useState<'technical' | 'hr'>('technical');
  const [interviewMode, setInterviewMode] = useState<'chat' | 'voice'>('chat'); // Prioritized Chat
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [cameraPreviewActive, setCameraPreviewActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize with profile defaults
  useEffect(() => {
    if (profile?.preferredJobRole) {
      setJobRole(profile.preferredJobRole);
    }
  }, [profile]);

  // Clean up camera stream if wizard is unmounted or step changes
  useEffect(() => {
    return () => {
      stopCameraPreview();
    };
  }, []);

  const stopCameraPreview = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraPreviewActive(false);
  };

  const handleToggleCamera = async (enable: boolean) => {
    setCameraEnabled(enable);
    setCameraPermissionError(null);

    if (enable) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: true,
        });
        mediaStreamRef.current = stream;
        setCameraPreviewActive(true);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error('Camera permission denied or unavailable:', err);
        setCameraPermissionError('Camera or microphone permission was denied. You can proceed with Camera OFF.');
        setCameraEnabled(false);
        stopCameraPreview();
      }
    } else {
      stopCameraPreview();
    }
  };

  const handleStartInterview = async () => {
    stopCameraPreview(); // LiveInterview will re-request / manage its own session
    setLoading(true);
    setErrorMsg(null);

    try {
      const finalRole = jobRole === 'Other' ? customRole : jobRole;
      const res = await api.createInterview({
        jobRole: finalRole,
        interviewType,
        interviewMode,
        cameraEnabled,
        durationSeconds: 600, // 10 minutes
      });

      onInterviewStarted(res.interview, res.questions);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize interview session.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-xs font-bold">
              {step}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
              Step {step} of 5 · Interview Setup Wizard
            </span>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-[#635BFF]' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: JOB ROLE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 1: Select Target Job Role</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the role you are targeting for campus placements. The AI questions will evaluate domain-specific standards.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">ECE & Core Hardware Placement Roles</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Embedded Software Engineer', desc: 'STM32, FreeRTOS, Embedded C, Drivers' },
                { title: 'VLSI Design Engineer', desc: 'Verilog, STA, Setup/Hold, Digital Logic' },
                { title: 'Firmware Development Engineer', desc: 'Bare-metal C, Microcontrollers, SPI/I2C' },
                { title: 'IoT & Hardware Systems Engineer', desc: 'Sensors, ESP32, Low-power, MQTT' },
              ].map((role) => (
                <button
                  key={role.title}
                  type="button"
                  onClick={() => setJobRole(role.title)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    jobRole === role.title
                      ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">{role.title}</span>
                    {jobRole === role.title && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{role.desc}</p>
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">Software & Analytics Roles</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Software Developer', desc: 'Data structures, algorithms, system design' },
                { title: 'Frontend Developer', desc: 'React, TypeScript, browser rendering' },
                { title: 'Backend Developer', desc: 'Node.js, APIs, relational databases' },
                { title: 'Data Analyst', desc: 'SQL, Python, statistics & pipelines' },
              ].map((role) => (
                <button
                  key={role.title}
                  type="button"
                  onClick={() => setJobRole(role.title)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    jobRole === role.title
                      ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">{role.title}</span>
                    {jobRole === role.title && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-sm transition-all"
            >
              <span>Next: Interview Type</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INTERVIEW TYPE */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 2: Select Interview Round</h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose the interview format for this practice session.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setInterviewType('technical')}
              className={`text-left p-6 rounded-2xl border transition-all ${
                interviewType === 'technical'
                  ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#635BFF] flex items-center justify-center mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-sm">Technical Interview</h3>
                {interviewType === 'technical' && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Deep dive into technical concepts, code syntax, architectural trade-offs, circuit/hardware fundamentals, and projects listed on your resume.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setInterviewType('hr')}
              className={`text-left p-6 rounded-2xl border transition-all ${
                interviewType === 'hr'
                  ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-sm">HR & Behavioral Round</h3>
                {interviewType === 'hr' && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Covers your personal introduction, team conflict resolution using the STAR method, motivation, placement goals, and cultural alignment.
              </p>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-sm transition-all"
            >
              <span>Next: Interview Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INTERVIEW MODE */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 3: Select Interaction Mode</h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose how you will respond to the interviewer's questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setInterviewMode('chat')}
              className={`text-left p-6 rounded-2xl border transition-all ${
                interviewMode === 'chat'
                  ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#635BFF] flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Chat Interview (Prioritized)</h3>
                  <span className="text-[10px] text-[#635BFF] font-semibold uppercase">Recommended for Focused Practice</span>
                </div>
                {interviewMode === 'chat' && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Questions appear in crisp text cards. Type your structured answers with full keyboard navigation and review before submitting.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setInterviewMode('voice')}
              className={`text-left p-6 rounded-2xl border transition-all ${
                interviewMode === 'voice'
                  ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-sm">Voice Interview</h3>
                {interviewMode === 'voice' && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                The AI reads questions aloud via natural speech synthesis. Speak your answers into your microphone with live speech-to-text recognition.
              </p>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-sm transition-all"
            >
              <span>Next: Camera Preference</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CAMERA PREFERENCE */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 4: Camera & Video Recording Preference</h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose whether to enable video recording for self-review and presentation framing feedback.
            </p>
          </div>

          {cameraPermissionError && (
            <div className="flex items-start gap-2 p-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{cameraPermissionError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleToggleCamera(false)}
              className={`text-left p-6 rounded-2xl border transition-all ${
                !cameraEnabled
                  ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <CameraOff className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-sm">Camera OFF</h3>
                {!cameraEnabled && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                No video recording will be captured. Zero camera access required. Audio or text only.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleToggleCamera(true)}
              className={`text-left p-6 rounded-2xl border transition-all ${
                cameraEnabled
                  ? 'border-[#635BFF] bg-indigo-50/50 ring-2 ring-[#635BFF]/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#635BFF] flex items-center justify-center mb-3">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-sm">Camera ON</h3>
                {cameraEnabled && <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Simulates real campus video interviews. Records your video feed locally so you can review your posture, framing, and eye contact.
              </p>
            </button>
          </div>

          {/* Live Camera Preview */}
          {cameraEnabled && cameraPreviewActive && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400">● Live Camera Test Preview</span>
                <span className="text-slate-400">Recording starts ONLY when interview begins</span>
              </div>
              <div className="aspect-video w-full max-w-md mx-auto bg-black rounded-xl overflow-hidden relative">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              </div>
              <p className="text-[11px] text-center text-slate-400">
                Ensure your face is centered and adequate light is shining on your face.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                stopCameraPreview();
                setStep(3);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                stopCameraPreview();
                setStep(5);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-sm transition-all"
            >
              <span>Next: Final Confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 5: Review & Confirm Session</h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your interview parameters before generating placement questions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Target Job Role:</span>
                <span className="font-bold text-slate-900">{jobRole}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Interview Round:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {interviewType === 'technical' ? 'Technical Engineering Round' : 'HR & Behavioral Round'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Interaction Mode:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {interviewMode === 'chat' ? 'Chat (Text Responses)' : 'Voice (Speech & Audio)'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Camera Preference:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {cameraEnabled ? 'Camera ON (Video Recorded)' : 'Camera OFF (No Video)'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Duration:</span>
                <span className="font-bold text-slate-900 font-mono">10 Minutes Maximum</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Question Count:</span>
                <span className="font-bold text-slate-900 font-mono">6 Questions</span>
              </div>
            </div>

            {resume && (
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-emerald-700">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Resume grounded: Questions will incorporate projects from "{resume.fileName}"</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-700 space-y-1 leading-relaxed">
            <span className="font-bold text-[#635BFF]">Interviewer Behavior Note:</span>
            <p>
              The AI interviewer will ask strictly one question at a time. It will not reveal answers, offer premature hints, or show scores until the interview concludes.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-md shadow-[#635BFF]/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generating Placement Questions...</span>
                </>
              ) : (
                <>
                  <span>Begin Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
