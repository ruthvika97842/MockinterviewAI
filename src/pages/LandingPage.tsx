import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileText,
  Video,
  CheckCircle2,
  Terminal,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';

interface LandingPageProps {
  onStartPracticing: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPracticing,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#1E2338] selection:bg-[#635BFF] selection:text-white relative overflow-x-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-30 h-18 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-6 sm:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#635BFF] to-[#10152B] flex items-center justify-center text-white shadow-md shadow-[#635BFF]/25">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-xl">MockWise</span>
              <span className="text-[#635BFF] font-semibold text-xs tracking-wider uppercase">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Campus Placement Engine</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#ece-track" className="hover:text-slate-900 transition-colors">ECE & Tech Tracks</a>
          <a href="#rubric" className="hover:text-slate-900 transition-colors">AI Evaluation</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onStartPracticing}
            className="inline-flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg shadow-sm shadow-[#635BFF]/30 transition-all hover:scale-[1.02]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section with Ambient Glow & Precision Grid */}
      <section className="relative pt-18 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        {/* Classy Ambient Lighting Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[840px] h-[440px] bg-gradient-to-b from-[#635BFF]/15 via-[#635BFF]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute inset-0 circuit-grid-overlay pointer-events-none opacity-70" />

        <div className="relative z-10 text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/90 border border-indigo-100 text-xs font-medium text-[#635BFF] shadow-xs backdrop-blur-xs">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Mock Interview Engine for Engineering Students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Practice Smarter.{' '}
            <span className="text-[#635BFF] underline decoration-indigo-200 underline-offset-8">
              Interview Better.
            </span>{' '}
            Get Hired.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-9 font-normal">
            Experience realistic AI-powered interviews, discover your strengths, understand your mistakes, and build the confidence to succeed in your next opportunity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartPracticing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-md shadow-[#635BFF]/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white/90 backdrop-blur-xs hover:bg-white border border-slate-200 rounded-xl transition-all shadow-2xs"
            >
              <span>Explore Features</span>
            </a>
          </div>
        </div>

        {/* Dashboard Preview / Realistic Mockup */}
        <div className="relative z-10 mx-auto max-w-5xl rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xl shadow-indigo-900/10 overflow-hidden">
          {/* Mock browser header */}
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs text-slate-400 font-mono ml-2">mockwise.ai/interview/live</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300 font-mono">10:00 TIMER</span>
              <span className="text-emerald-400 font-semibold">● ACTIVE SESSION</span>
            </div>
          </div>

          {/* Realistic Interview Cockpit Preview */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/60">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-[#635BFF]">Question 2 of 6 · Embedded C & RTOS</span>
                  <span className="font-mono">Time Remaining: 07:42</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-base leading-snug">
                  "Explain the role of the volatile keyword in microcontroller firmware and why omitting it can result in race conditions inside an ISR."
                </h3>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-2">Candidate Text Answer (Live Response)</div>
                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed font-sans">
                  "The volatile keyword informs the compiler that a variable can be modified unexpectedly by external hardware or an Interrupt Service Routine. Without volatile, the compiler optimizes by caching the variable value in a CPU register instead of re-reading memory..."
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                  <span>Press Cmd + Enter to submit answer</span>
                  <span className="text-indigo-600 font-medium">Ready to submit</span>
                </div>
              </div>
            </div>

            {/* Scorecard preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Real-Time Evaluation Preview</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Scored Post-Interview</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Technical Conceptual Depth</span>
                      <span className="font-mono text-indigo-600">88 / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-[#635BFF] h-2 rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Clarity & Communication</span>
                      <span className="font-mono text-emerald-600">84 / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[84%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Evidence-based feedback: identifies specific mistakes and missing points</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct model answers provided for every answered question</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-indigo-300">Campus Placement Ready</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Calibrated for top Indian engineering placement drives (TCS Ninja/Digital, Bosch, Qualcomm, Intel, Texas Instruments, Wipro, Infosys).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Tracks Section (ECE & Tech Highlight) */}
      <section id="ece-track" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">Curated Placement Tracks</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Engineered for ECE, Core Electronics & Software Placements
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Standard interview bots only know basic web code. MockWise AI understands microcontrollers, registers, timing analysis, and campus HR rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#635BFF] flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Embedded Systems & Firmware</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Targeting roles at Bosch, Texas Instruments, STMicroelectronics, and automotive firmware teams.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                <div>• Embedded C, Memory Mapping & Volatile</div>
                <div>• FreeRTOS Task Queues, Mutexes & Priority Inversion</div>
                <div>• SPI, I2C, UART, CAN Bus & Interrupt Handling</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">VLSI & Digital Logic Design</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Targeting ASIC/FPGA digital design roles at Qualcomm, Intel, Synopsys, and MediaTek.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                <div>• Setup & Hold Slack, Metastability, Clock Skew</div>
                <div>• Verilog / VHDL FSM Design & Debounce Logic</div>
                <div>• Static Timing Analysis (STA) & Combinational Gates</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Software & Behavioral HR</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Targeting IT campus placement drives (TCS, Infosys, Cognizant, Product Startups).
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                <div>• Data Structures, Operating Systems & Networks</div>
                <div>• Resume Project Deep-Dive & Architecture Defense</div>
                <div>• STAR Framework for Campus Behavioral Questions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">Simple 4-Step Process</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How MockWise AI Works
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            A structured workflow mimicking authentic campus hiring drives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono">01</span>
            <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Upload Resume & Role</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your PDF/DOCX resume. MockWise automatically extracts your key projects, microcontrollers, and languages to personalize questions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono">02</span>
            <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Configure Session</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose Technical or HR round, select Chat or Voice mode, and enable the camera to simulate a real video interview.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono">03</span>
            <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Take 10-Min Interview</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The AI interviewer asks one question at a time. No hints or premature grading during the interview—just authentic pressure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono">04</span>
            <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Review In-Depth Report</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get evidence-based scores, mistake analysis, missing technical points, and high-scoring model answers for every question.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">Production Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Everything You Need to Ace Your Placement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Resume-Based Personalization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Questions are grounded in your actual college projects and tools. If your resume highlights STM32 or Verilog, the AI will test your real contributions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Camera Recording & Video Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record your practice session with explicit browser consent. Replay your video to assess your framing, presentation, and delivery.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Evidence-Based Evaluation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero fake scores or arbitrary numbers. Every point is backed by exact transcript evidence, citing missed terms, edge cases, and better answers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Chat & Voice Interview Modes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switch seamlessly between typing your answers in focused Chat mode or speaking into your microphone in realistic Voice mode.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Historical Analytics & Trajectory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track your progress over time with score trends, technical vs. HR comparisons, and frequently missed topic recommendations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Privacy & Local Data Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All resume text and session recordings remain private to your account. No hidden webcam access or unwanted surveillance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-classy-dark text-white text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 dark-circuit-grid opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-indigo-300 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Join Hundreds of Placement Aspirants</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Clear Your Campus Placement?
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
            Join engineering students mastering core technical fundamentals, Embedded C/VLSI nuances, and building real interview confidence with MockWise AI.
          </p>
          <div className="pt-3">
            <button
              onClick={onStartPracticing}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-xl shadow-xl shadow-[#635BFF]/35 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Your Free Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 sm:px-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="text-white font-bold text-sm">MockWise AI</span>
            <span className="text-xs text-slate-500">© 2026 MockWise AI Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            <span className="cursor-pointer hover:text-white transition-colors">Contact Support</span>
            <span className="text-slate-600 font-mono text-[11px]">v1.0.0-prod</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
