import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.ts';
import {
  InterviewSession,
  InterviewQuestion,
  InterviewFeedback,
} from '../types/index.ts';
import {
  Clock,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  StopCircle,
} from 'lucide-react';

interface LiveInterviewProps {
  session: InterviewSession;
  questions: InterviewQuestion[];
  onComplete: (feedback: InterviewFeedback, session: InterviewSession) => void;
  onExit: () => void;
}

export const LiveInterview: React.FC<LiveInterviewProps> = ({
  session,
  questions,
  onComplete,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState<string | null>(null);

  // 10-Minute Timer (600s)
  const [timeLeft, setTimeLeft] = useState(session.durationSeconds || 600);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Voice Mode & Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Camera & MediaRecorder
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);

  // End early confirm modal
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // 1. Initialize Browser Media (Camera + Mic) if enabled
  useEffect(() => {
    let isMounted = true;

    async function initMedia() {
      if (session.cameraEnabled) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: true,
          });

          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          mediaStreamRef.current = stream;
          setCameraActive(true);
          setMicActive(true);

          if (videoElementRef.current) {
            videoElementRef.current.srcObject = stream;
          }

          // Start MediaRecorder
          if (typeof MediaRecorder !== 'undefined') {
            try {
              const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
              mediaRecorderRef.current = recorder;
              recordedChunksRef.current = [];

              recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                  recordedChunksRef.current.push(event.data);
                }
              };

              recorder.start(1000); // 1-second chunks
            } catch (recErr) {
              console.warn('Standard video/webm MediaRecorder not supported, trying default:', recErr);
              const recorder = new MediaRecorder(stream);
              mediaRecorderRef.current = recorder;
              recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                  recordedChunksRef.current.push(event.data);
                }
              };
              recorder.start(1000);
            }
          }
        } catch (err) {
          console.error('Camera/Mic permission denied:', err);
          setCameraActive(false);
        }
      }
    }

    initMedia();

    // Check Speech capabilities
    if ('speechSynthesis' in window) {
      setSpeechSynthesisSupported(true);
    }
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setSpeechRecognitionSupported(true);
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English accent optimized

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setAnswerText(transcript);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      isMounted = false;
      stopAllMediaTracks();
    };
  }, [session.cameraEnabled]);

  // Clean up all hardware tracks
  const stopAllMediaTracks = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // 2. Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalizeInterview();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 3. Read question aloud in voice mode
  useEffect(() => {
    if (session.interviewMode === 'voice' && currentQuestion && 'speechSynthesis' in window) {
      readQuestionAloud(currentQuestion.questionText);
    }
  }, [currentQuestionIndex]);

  const readQuestionAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  // 4. Handle Submitting Answer for Current Question
  const handleSubmitAnswer = async () => {
    if (isSubmitting || isFinishing) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSubmitting(true);
    const durationSeconds = Math.round((Date.now() - questionStartTime) / 1000);

    try {
      await api.submitAnswer(session.id, {
        questionId: currentQuestion.id,
        answerText: answerText.trim() || 'Candidate provided no answer.',
        durationSeconds,
      });

      // Clear input and prepare for next question
      setAnswerText('');
      setQuestionStartTime(Date.now());

      if (currentQuestionIndex + 1 < questions.length) {
        setTransitionMsg('Thank you. Moving to the next question...');
        setTimeout(() => {
          setTransitionMsg(null);
          setCurrentQuestionIndex((prev) => prev + 1);
          setIsSubmitting(false);
        }, 900);
      } else {
        // All questions completed! Finalize interview
        await handleFinalizeInterview();
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setIsSubmitting(false);
    }
  };

  // 5. Finalize Interview & Upload Video
  const handleFinalizeInterview = async () => {
    setIsFinishing(true);
    stopAllMediaTracks();

    // Process recorded video if available
    try {
      if (recordedChunksRef.current.length > 0) {
        const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          try {
            await api.saveRecording(session.id, {
              dataUrl: base64data,
              durationSeconds: session.durationSeconds - timeLeft,
              fileSize: videoBlob.size,
            });
          } catch (recUploadErr) {
            console.warn('Recording upload note:', recUploadErr);
          }
        };
        reader.readAsDataURL(videoBlob);
      }
    } catch (e) {
      console.warn('Error saving video blob:', e);
    }

    // Call server to trigger Gemini AI evaluation
    try {
      const res = await api.finishInterview(session.id);
      onComplete(res.feedback, res.interview);
    } catch (err) {
      console.error('Error finishing interview:', err);
      // Retrieve fallback report
      const fallbackReport = await api.getFeedback(session.id);
      onComplete(fallbackReport.feedback, fallbackReport.interview);
    }
  };

  // Format timer seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 120; // < 2 minutes remaining

  if (isFinishing) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#635BFF] mb-6 shadow-sm">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Finalizing Placement Evaluation
        </h2>
        <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-6">
          Google Gemini is evaluating your technical depth, Embedded C/VLSI concepts, answer structure, and practical explanations...
        </p>
        <div className="w-64 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-[#635BFF] h-2 rounded-full w-2/3 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Interview Cockpit Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div>
            <div className="font-bold text-slate-900 text-xs sm:text-sm">{session.jobRole}</div>
            <div className="text-[11px] text-slate-400">
              {session.interviewType === 'technical' ? 'Technical Round' : 'HR & Behavioral Round'} · {session.interviewMode.toUpperCase()} MODE
            </div>
          </div>
        </div>

        {/* Center: Timer & Progress */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Question</span>
            <span className="text-xs sm:text-sm font-bold text-[#635BFF] font-mono">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-sm font-bold ${
              isLowTime
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Right: End Early */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
        >
          End Interview Early
        </button>
      </div>

      {/* Main Grid: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera Feed (if enabled) or Placement Context Card */}
        <div className={`${session.cameraEnabled ? 'lg:col-span-5' : 'lg:col-span-4'} space-y-4`}>
          {session.cameraEnabled ? (
            <div className="bg-classy-dark rounded-2xl p-3 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 dark-circuit-grid opacity-20 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between pb-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-ping" />
                  REC ACTIVE
                </span>
                <span className="text-slate-400 font-mono text-[10px]">Webcam Feed</span>
              </div>

              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden relative border border-slate-800">
                <video
                  ref={videoElementRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-emerald-400" /> Camera On
                </span>
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" /> Mic On
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <VideoOff className="w-4 h-4 text-slate-400" />
                <span>Camera Mode: Disabled</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                You are in focused text/voice interview mode. No video streams are accessed or recorded during this session.
              </p>
            </div>
          )}

          {/* AI Interviewer Persona Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#635BFF] font-bold text-xs">
                  AI
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">MockWise Placement Interviewer</div>
                  <div className="text-[10px] text-slate-400">Neutral Professional Tone</div>
                </div>
              </div>
              {session.interviewMode === 'voice' && speechSynthesisSupported && (
                <button
                  type="button"
                  onClick={() => readQuestionAloud(currentQuestion?.questionText || '')}
                  title="Repeat question"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Placement Assessment Rubric:</div>
              <div>• Factual technical precision</div>
              <div>• Practical trade-offs and domain vocabulary</div>
              <div>• Clear, structured explanation without rambling</div>
            </div>
          </div>
        </div>

        {/* Right: Active Question & Answer Area */}
        <div className={`${session.cameraEnabled ? 'lg:col-span-7' : 'lg:col-span-8'} space-y-5`}>
          {/* Active Question Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#635BFF] bg-indigo-50 px-2.5 py-1 rounded-md">
                {currentQuestion?.category || 'Core Question'}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {currentQuestion?.questionText}
            </h2>

            {transitionMsg && (
              <div className="flex items-center gap-2 p-2.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>{transitionMsg}</span>
              </div>
            )}
          </div>

          {/* Response Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Your Answer:</span>
              <div className="flex items-center gap-3">
                {session.interviewMode === 'voice' && speechRecognitionSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListening ? 'Listening (Click to Stop)' : 'Speak Answer'}</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-400 font-mono">
                  {answerText.length} characters
                </span>
              </div>
            </div>

            <textarea
              rows={session.cameraEnabled ? 6 : 9}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmitAnswer();
                }
              }}
              placeholder={
                session.interviewMode === 'voice'
                  ? 'Speak into your microphone or type your response here...'
                  : 'Type your detailed technical or behavioral response here... (Press Cmd/Ctrl + Enter to submit)'
              }
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent leading-relaxed text-slate-800 font-sans"
              disabled={isSubmitting || isFinishing}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Shortcut: <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">Cmd/Ctrl + Enter</kbd> to submit
              </span>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || isFinishing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-sm shadow-[#635BFF]/30 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Answer...</span>
                  </>
                ) : currentQuestionIndex + 1 < questions.length ? (
                  <>
                    <span>Submit & Next Question</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Submit Final Answer & Finish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Early Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-sm">End Interview Session Early?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to conclude now? The AI will generate feedback and score your performance based on the questions you have answered so far.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  handleFinalizeInterview();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                End & Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
