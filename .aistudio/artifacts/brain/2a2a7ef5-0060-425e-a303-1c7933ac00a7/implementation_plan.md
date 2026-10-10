# MockWise AI — AI-Powered Mock Interview Platform

MockWise AI is a full-stack, production-minded mock interview web application designed for Indian college students, fresh graduates, and job seekers to practice real-world technical and HR interviews, identify mistakes, and secure campus placements.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the planning phase:

- **Confirmed Track Focus**: Specialized technical interview tracks and question banks prioritizing **ECE (Electronics & Communication Engineering)** roles—including **Embedded Software Engineer, VLSI / Digital Design Engineer, Microcontrollers / Firmware Engineer, IoT & Robotics, and DSP / Hardware Systems**—alongside standard Software Engineering and Data Analyst roles.
- **Confirmed Interaction Mode**: **Prioritize Chat Interview Mode** with clean, responsive question-by-question layout, real-time timer, answer review, and rapid submission, while maintaining a fully functional **Voice Mode** toggle with browser speech synthesis and voice recognition.
- **Data Persistence & Backend**: Unified full-stack architecture using a high-performance Express server integrated into Vite, persistent relational SQLite/JSON storage with session authentication, and direct Supabase configuration hooks.

---

### 1. Overview & Core Concept

- **What It Does**: Conducts authentic, timed 10-minute technical and HR interviews. The AI acts strictly as a neutral professional interviewer—asking one question at a time, adapting to user resume projects and answers without revealing answers or grades mid-interview, and producing evidence-backed evaluations post-interview.
- **Target Audience / Persona**: Indian engineering undergraduates, Tier-2/3 college graduates, and job seekers aiming for core engineering (ECE/VLSI/Embedded) and IT campus placements.
- **Key Value**: Replaces anxiety and generic chatbot advice with realistic interview simulation, evidence-based rubrics, ECE domain questions (registers, timers, FSMs, setup/hold times, C pointers), camera presentation evaluation, and previous attempt tracking.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Landing & Orientation**: Clean hero showcasing the MockWise workflow, placement role specializations, interview score breakdown, and direct CTA to start practice.
2. **Registration & Profile Setup**: Secure email/password authentication, onboarding profile capturing college/degree, ECE or tech specialization, skills, career objective, and PDF/DOCX resume upload with automatic key project and skill extraction.
3. **Interview Configuration Wizard**:
   - Step 1: Role Selection (e.g., Embedded Software, VLSI Design, Firmware, Full Stack, Data Analyst, Custom).
   - Step 2: Interview Type (Technical vs. HR / Behavioral).
   - Step 3: Interview Mode (Chat Interview [Prioritized] vs. Voice Interview).
   - Step 4: Camera Preference (Camera ON with live video preview & recording vs. Camera OFF).
   - Step 5: Duration & Question Count Confirmation (10 minutes, 6–8 questions).
4. **Active Interview Session**:
   - Professional interviewer header with countdown timer, question count indicator, and live camera feed (if enabled).
   - Question delivery: strictly one question at a time, neutral interviewer transitions.
   - Response box: character count, keyboard shortcuts (Cmd/Ctrl + Enter), speech-to-text option.
   - Resource cleanup on interview end: streams stopped immediately.
5. **Detailed AI Feedback & Report**:
   - Overall score (out of 100), technical depth, communication, and key strengths/improvement areas.
   - Question-by-question card expansion: candidate's answer, score /10, what went well, specific mistakes, missing points, and actionable model answers.
   - Optional camera presentation insights (framing, eye engagement toward camera).
6. **Dashboard, Recordings & History**:
   - Trend charts, average & best scores, previous interview list with filters (Technical/HR/Voice/Chat), recording playback, and score analytics.

#### Visual Identity & Theme
- **Color Palette**:
  - Dominant Canvas: Deep Navy (`#10152B`) for landing accents, Crisp Off-White/Light Slate (`#F7F8FC`) for dashboard canvas.
  - Primary Brand: Electric Indigo (`#635BFF`) for high-intent actions, buttons, and active tabs.
  - Secondary Accent: Soft Lavender (`#EEEAFE`) for subtle panel highlights and active selection outlines.
  - Semantic Status: Emerald (`#16A34A`) for strengths/scores $\ge 80$, Amber (`#D97706`) for areas to improve ($50$–$79$), Coral/Crimson (`#DC2626`) for critical gaps ($< 50$).
- **Typography & Discipline**:
  - Font Stack: `Plus Jakarta Sans` / `Inter` with strict zero-pill discipline (no decorative floating pills or badge spam; metadata rendered with clean unboxed typographic separators `·`).
  - Monospace Tabular Figures: `font-mono tabular-nums` for timers, percentages, and metrics.
- **Anti-Slop Guidelines**:
  - No decorative status dots or pulsing circles on static text.
  - Clear 60-30-10 color distribution.
  - WCAG AA contrast on all interactive elements.

---

### 3. Key Product Decisions & Trade-Offs

- **Server-Side AI Proxy (`/api/interview/*`)**:
  - *Decision*: Route all Google Gemini API calls via Express server using `@google/genai` with model `gemini-3.8-flash`.
  - *Why*: Strict security requirement—API keys are never exposed in browser client code. Structured JSON schemas ensure consistent response models for question generation and post-interview feedback.
- **Relational Persistent Storage**:
  - *Decision*: Full-stack Express backend with persistent file-backed database handling user profiles, resumes, interviews, questions, answers, and feedback.
  - *Why*: Allows zero-configuration, immediate local testing in AI Studio while preserving complete multi-user data isolation and data integrity across restarts.
- **Web MediaRecorder for In-Browser Video Recording**:
  - *Decision*: Capture video/audio directly using the standard HTML5 `MediaRecorder` API with chunks compiled to WebM/MP4 and stored via server endpoints for private playback.
  - *Why*: Privacy-first, respects camera permissions, stops hardware tracks promptly upon interview completion.
- **ECE Question Banks & Resume Grounding**:
  - *Decision*: Pre-seed rich ECE question templates (Embedded C, RTOS synchronization, interrupts, SPI/I2C/UART, Verilog/VHDL, setup/hold violations, static timing analysis) combined with resume-extracted project topics.
  - *Why*: Fulfills user preference for ECE placement focus with authentic industry questions.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MOCKWISE AI ARCHITECTURE                        │
└────────────────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────────────┐
  │                         FRONTEND (REACT)                           │
  │                                                                    │
  │  ┌───────────────┐  ┌───────────────┐  ┌────────────────────────┐  │
  │  │  LandingPage  │  │   AuthModal   │  │  UserProfile & Resume  │  │
  │  └───────┬───────┘  └───────┬───────┘  └───────────┬────────────┘  │
  │          │                  │                      │               │
  │  ┌───────▼──────────────────▼──────────────────────▼────────────┐  │
  │  │             Dashboard & Performance Analytics                │  │
  │  └──────────────────────────┬───────────────────────────────────┘  │
  │                             │                                      │
  │  ┌──────────────────────────▼───────────────────────────────────┐  │
  │  │            Interview Setup Wizard (5-Step Config)            │  │
  │  └──────────────────────────┬───────────────────────────────────┘  │
  │                             │                                      │
  │  ┌──────────────────────────▼───────────────────────────────────┐  │
  │  │  Live Interview Engine (Chat / Voice + Camera MediaRecorder) │  │
  │  └──────────────────────────┬───────────────────────────────────┘  │
  │                             │                                      │
  │  ┌──────────────────────────▼───────────────────────────────────┐  │
  │  │  Interview Results & Question-by-Question Evaluation View    │  │
  │  └──────────────────────────────────────────────────────────────┘  │
  └─────────────────────────────────┬──────────────────────────────────┘
                                    │ HTTP / REST APIs
  ┌─────────────────────────────────▼──────────────────────────────────┐
  │                      BACKEND (NODE / EXPRESS)                      │
  │                                                                    │
  │  ┌───────────────────────┐  ┌───────────────────────────────────┐  │
  │  │ Auth & Session Guard  │  │ Resume Parser (PDF/DOCX Extractor)│  │
  │  └───────────────────────┘  └───────────────────────────────────┘  │
  │  ┌───────────────────────┐  ┌───────────────────────────────────┐  │
  │  │ Video Storage Service │  │ Persistent Database Manager       │  │
  │  └───────────────────────┘  └───────────────────────────────────┘  │
  │  ┌──────────────────────────────────────────────────────────────┐  │
  │  │  Gemini AI Service (@google/genai, gemini-3.8-flash)         │  │
  │  │  - Contextual ECE/Tech & HR Question Generator               │  │
  │  │  - Neutral Interview Turn Orchestrator                       │  │
  │  │  - Question-by-Question Evaluation & Rubric Evaluator        │  │
  │  │  - Camera Presentation & Communication Assessor              │  │
  │  └──────────────────────────────────────────────────────────────┘  │
  └────────────────────────────────────────────────────────────────────┘
```

#### Database Schema
- **users**: `id`, `email`, `password_hash`, `full_name`, `created_at`
- **profiles**: `user_id`, `college`, `degree`, `preferred_job_role`, `experience_level`, `skills`, `career_objective`, `updated_at`
- **resumes**: `id`, `user_id`, `file_name`, `extracted_text`, `parsed_skills`, `parsed_projects`, `created_at`
- **interviews**: `id`, `user_id`, `resume_id`, `job_role`, `interview_type`, `interview_mode`, `camera_enabled`, `duration_seconds`, `status`, `started_at`, `completed_at`, `overall_score`, `created_at`
- **interview_questions**: `id`, `interview_id`, `order_index`, `question_text`, `category`, `evaluation_criteria`
- **interview_answers**: `id`, `interview_id`, `question_id`, `answer_text`, `duration_seconds`, `submitted_at`
- **interview_feedback**: `id`, `interview_id`, `overall_score`, `technical_score`, `communication_score`, `strengths`, `improvements`, `question_evaluations_json`, `presentation_analysis_json`, `created_at`
- **recordings**: `id`, `interview_id`, `user_id`, `storage_path`, `duration_seconds`, `file_size`, `created_at`
