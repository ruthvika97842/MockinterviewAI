# MockWise AI — AI-Powered Mock Interview Platform

MockWise AI is a full-stack mock interview web application designed for Indian college engineering students and job seekers preparing for campus placements. It provides realistic technical and HR interview simulations with specialized question tracks for **Electronics & Communication Engineering (ECE)**—including Embedded Software, VLSI Digital Design, Microcontrollers/RTOS, and Hardware Systems—alongside Software and Data tracks.

---

## Key Features

1. **Dedicated Placement Tracks & ECE Focus**:
   - Specialized technical banks for Embedded Systems (STM32, FreeRTOS, memory-mapped I/O, `volatile`, SPI/I2C/UART/CAN).
   - VLSI & Digital Logic (Setup & hold slack, metastability, Verilog/VHDL FSMs, STA).
   - Software Engineering (OS concurrency, indexing, system design, DSA).
   - Campus HR & Behavioral rounds (STAR framework, team conflict resolution, placement motivation).

2. **Resume-Grounded Question Generation**:
   - Upload PDF, DOCX, or text resumes.
   - Extracts candidate projects and technologies to formulate authentic follow-up questions testing real contributions.

3. **Realistic Interviewer Persona**:
   - Conducts timed 10-minute interviews (6–8 questions).
   - Asks strictly one question at a time.
   - Professional, neutral tone with no mid-interview grading, hints, or spoilers.

4. **Chat & Voice Modes**:
   - **Chat Mode (Prioritized)**: Focused text response workspace with character counter and keyboard shortcuts (`Cmd/Ctrl + Enter`).
   - **Voice Mode**: Speech synthesis audio question playback (`speechSynthesis`) and live microphone voice transcription (`SpeechRecognition`).

5. **Camera & Video Recording**:
   - In-browser camera testing and live video preview.
   - Genuine `MediaRecorder` recording in Camera ON mode with local authenticated playback.
   - Automatic resource cleanup stopping all camera and microphone tracks immediately upon session completion.

6. **Evidence-Based AI Evaluation Engine**:
   - Powered by **Google Gemini AI** (`gemini-3.8-flash` via `@google/genai`).
   - Detailed rubric with overall, technical, and communication scores.
   - Question-by-question breakdown: candidate answer, score /10, strengths, mistakes, missing concepts, model placement answers, and practical tips.
   - Camera presentation framing analysis when camera recording is enabled.

7. **Historical Analytics & Trajectory**:
   - Chronological score trajectory SVG chart.
   - Technical vs. HR performance comparisons.
   - Prioritized revision recommendations.
   - Saved video recording management with playback and download.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript (`tsx`).
- **Database & Persistence**: Persistent file-backed relational store (`./data/db.json`) with direct support for optional external Supabase PostgreSQL sync.
- **AI**: Official Google Gen AI SDK (`@google/genai`) using `gemini-3.8-flash`.

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# GEMINI_API_KEY: Required for real-time Gemini AI API calls.
GEMINI_API_KEY="your-gemini-api-key"

# APP_URL: Optional host URL
APP_URL="http://localhost:3000"
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Full-Stack Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## Acceptance Testing Checklist

- [x] **Registration & Login**: Create an account or use one-click demo credentials (`kamparuthvika22@gmail.com`).
- [x] **Profile & Resume**: Configure college, degree, target role, and upload resume with automatic skill extraction.
- [x] **Setup Wizard**: Select ECE or Tech role, Technical or HR round, Chat or Voice mode, Camera ON/OFF.
- [x] **Live Interview Engine**: 10-minute countdown timer, question progression, and responsive response input.
- [x] **Video Recording**: WebM recording via `MediaRecorder` with automatic camera track cleanup.
- [x] **AI Results Report**: Evidence-backed scores, mistake analysis, and model placement answers.
- [x] **History & Recordings**: Filter past sessions, play video recordings, and review analytics.
