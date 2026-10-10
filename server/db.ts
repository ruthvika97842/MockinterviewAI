import fs from 'fs';
import path from 'path';
import {
  User,
  Profile,
  ResumeData,
  InterviewSession,
  InterviewQuestion,
  InterviewAnswer,
  InterviewFeedback,
  Recording,
} from './types.ts';

interface DatabaseSchema {
  users: User[];
  profiles: Profile[];
  resumes: ResumeData[];
  interviews: InterviewSession[];
  interviewQuestions: InterviewQuestion[];
  interviewAnswers: InterviewAnswer[];
  interviewFeedback: InterviewFeedback[];
  recordings: Recording[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
    this.seedDefaultsIfEmpty();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('Error reading db.json, creating new database instance:', err);
    }
    return {
      users: [],
      profiles: [],
      resumes: [],
      interviews: [],
      interviewQuestions: [],
      interviewAnswers: [],
      interviewFeedback: [],
      recordings: [],
    };
  }

  private save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save db.json:', err);
    }
  }

  private seedDefaultsIfEmpty() {
    if (this.data.users.length === 0) {
      const demoUser: User = {
        id: 'usr-demo-101',
        email: 'kamparuthvika22@gmail.com',
        fullName: 'Ruthvika Kampa',
        passwordHash: 'demo123', // Demo password
        createdAt: new Date().toISOString(),
      };
      this.data.users.push(demoUser);

      const demoProfile: Profile = {
        userId: demoUser.id,
        fullName: 'Ruthvika Kampa',
        age: 21,
        education: 'B.Tech Undergrad',
        college: 'National Institute of Technology',
        degree: 'Electronics & Communication Engineering (ECE)',
        preferredJobRole: 'Embedded Software Engineer',
        experienceLevel: 'Fresher / Final Year Undergrad',
        skills: ['Embedded C', 'STM32', 'ARM Cortex-M', 'RTOS (FreeRTOS)', 'I2C / SPI / UART', 'Verilog', 'Microcontrollers'],
        careerObjective: 'Aspiring Embedded Systems Engineer targeting core electronics and automotive firmware placement drives.',
        updatedAt: new Date().toISOString(),
      };
      this.data.profiles.push(demoProfile);

      const demoResume: ResumeData = {
        id: 'res-demo-202',
        userId: demoUser.id,
        fileName: 'Ruthvika_Kampa_ECE_Resume.pdf',
        extractedText: `Ruthvika Kampa - Final Year B.Tech ECE
Education: B.Tech in Electronics & Communication Engineering (CGPA: 8.7/10)
Projects:
1. Smart Agricultural IoT Monitoring using STM32 Microcontroller: Interfaced temperature, soil moisture sensors via I2C and communicated sensor payloads via FreeRTOS task queues and ESP32 UART.
2. Digital Clock with Alarm using Verilog on Xilinx Basys 3 FPGA: Designed finite state machine (FSM) with debounce logic, 7-segment multiplexing display, and synchronous counters.
3. Automotive CAN Bus Communication Node: Developed firmware in Embedded C to broadcast sensor diagnostics and packet arbitration.
Technical Skills: Embedded C, C++, Verilog, ARM Cortex-M4, FreeRTOS, Microcontrollers (STM32, ESP32, 8051), Linux, Git, Keil uVision, Proteus.`,
        parsedSkills: ['Embedded C', 'STM32', 'FreeRTOS', 'Verilog', 'I2C', 'SPI', 'UART', 'CAN Bus', 'FSM'],
        parsedProjects: [
          'Smart Agricultural IoT Monitoring with FreeRTOS & STM32',
          'Digital Clock with Alarm in Verilog on FPGA',
          'Automotive CAN Bus Communication Node'
        ],
        parsedEducation: 'B.Tech in Electronics & Communication Engineering',
        createdAt: new Date().toISOString(),
      };
      this.data.resumes.push(demoResume);

      // Seed a completed sample interview to demonstrate history and analytics out of the box
      const demoInterview: InterviewSession = {
        id: 'int-demo-301',
        userId: demoUser.id,
        resumeId: demoResume.id,
        jobRole: 'Embedded Software Engineer',
        interviewType: 'technical',
        interviewMode: 'chat',
        cameraEnabled: false,
        durationSeconds: 600,
        status: 'completed',
        startedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        completedAt: new Date(Date.now() - 3600000 * 24 + 540000).toISOString(),
        overallScore: 84,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      };
      this.data.interviews.push(demoInterview);

      const q1: InterviewQuestion = {
        id: 'q-demo-1',
        interviewId: demoInterview.id,
        orderIndex: 1,
        questionText: 'Can you explain the significance of the "volatile" keyword in Embedded C and describe two concrete scenarios where omitting it causes firmware bugs?',
        category: 'Embedded C Fundamentals',
        evaluationCriteria: 'Understands compiler optimization, hardware registers, interrupt service routines (ISR), and shared memory variables.',
      };
      const q2: InterviewQuestion = {
        id: 'q-demo-2',
        interviewId: demoInterview.id,
        orderIndex: 2,
        questionText: 'In your STM32 IoT project, you used FreeRTOS task queues. What is priority inversion in real-time operating systems, and how did FreeRTOS address it?',
        category: 'RTOS & Embedded Systems',
        evaluationCriteria: 'Knowledge of priority inversion, high/low priority tasks, unbounded delay, and Priority Inheritance mechanism in Mutexes.',
      };
      this.data.interviewQuestions.push(q1, q2);

      this.data.interviewAnswers.push({
        id: 'ans-demo-1',
        interviewId: demoInterview.id,
        questionId: q1.id,
        answerText: 'The volatile keyword tells the C compiler not to optimize the variable because its value can change unexpectedly from outside the current execution flow. Two scenarios: memory-mapped peripheral hardware registers (like reading an ADC status register), and global flags modified inside an Interrupt Service Routine (ISR) that are read in the main while(1) loop.',
        durationSeconds: 75,
        submittedAt: new Date(Date.now() - 3600000 * 24 + 120000).toISOString(),
      });
      this.data.interviewAnswers.push({
        id: 'ans-demo-2',
        interviewId: demoInterview.id,
        questionId: q2.id,
        answerText: 'Priority inversion happens when a high-priority task is blocked waiting for a resource locked by a lower-priority task, and a medium-priority task preempts the lower task, indefinitely starving the high-priority task. In FreeRTOS, mutexes use priority inheritance where the low task temporarily inherits the high task priority until it releases the mutex.',
        durationSeconds: 90,
        submittedAt: new Date(Date.now() - 3600000 * 24 + 300000).toISOString(),
      });

      this.data.interviewFeedback.push({
        id: 'fb-demo-1',
        interviewId: demoInterview.id,
        overallScore: 84,
        technicalScore: 88,
        communicationScore: 80,
        strengths: [
          'Strong command of Embedded C compiler optimization nuances and hardware registers.',
          'Accurate and structured explanation of FreeRTOS priority inheritance mechanics.',
          'Direct, crisp answers without irrelevant filler words.'
        ],
        improvements: [
          'Mention binary semaphores vs mutexes when explaining why priority inheritance only applies to mutexes in RTOS.',
          'Could explicitly state how memory barriers and compiler flags (like -O2 or -O3) affect volatile variables.'
        ],
        questionEvaluations: [
          {
            questionId: q1.id,
            questionText: q1.questionText,
            answerText: 'The volatile keyword tells the C compiler not to optimize the variable because its value can change unexpectedly...',
            score: 9,
            whatWentWell: 'Identified both memory-mapped registers and ISR flags accurately with clear technical justification.',
            specificMistakes: 'Did not point out multi-threaded or multi-core shared memory variables as a third classic case.',
            missingPoints: 'Mentioning cache coherency or exact compiler assembly caching (e.g. keeping variable in CPU register vs memory re-read).',
            betterSampleAnswer: 'In Embedded C, "volatile" informs the compiler that a variable may be altered by factors outside current code flow, disabling aggressive register caching. Scenario 1: Memory-mapped hardware I/O registers (e.g., UART Status Register), where reading the same memory address must trigger fresh bus access. Scenario 2: Global flags shared between an ISR and foreground loop; without volatile, the compiler will optimize while(!flag) into an infinite loop by caching flag in a CPU register.',
            practicalTips: 'Keep a quick code snippet ready in mind showing `volatile uint32_t *reg = (uint32_t *)0x40021000;` during placement interviews.'
          },
          {
            questionId: q2.id,
            questionText: q2.questionText,
            answerText: 'Priority inversion happens when a high-priority task is blocked waiting for a resource locked by a lower-priority task...',
            score: 8,
            whatWentWell: 'Clear definition of the high-medium-low task deadlock scenario and correctly identified Priority Inheritance in Mutexes.',
            specificMistakes: 'Did not contrast FreeRTOS binary semaphores with mutexes regarding ownership and inheritance.',
            missingPoints: 'Explaining that binary semaphores in FreeRTOS do not support priority inheritance and can still suffer from priority inversion.',
            betterSampleAnswer: 'Priority inversion occurs when a medium-priority task preempts a low-priority task holding a shared lock needed by a high-priority task, causing unbounded delay to the high-priority task. FreeRTOS solves this through Priority Inheritance on Mutexes: the task holding the mutex temporarily assumes the highest priority among tasks waiting for that mutex until release. Notably, FreeRTOS binary semaphores lack priority inheritance, so mutexes must always be used for resource mutual exclusion.',
            practicalTips: 'Highlight the difference between synchronization (semaphores) and mutual exclusion (mutexes) in campus tests.'
          }
        ],
        recommendedTopics: [
          'Embedded C: Pointers to functions and callback mechanisms',
          'ARM Cortex-M: Nested Vectored Interrupt Controller (NVIC) prioritization and tail-chaining',
          'VLSI: Setup and hold slack margin calculations'
        ],
        createdAt: new Date(Date.now() - 3600000 * 24 + 540000).toISOString(),
      });

      this.save();
    }
  }

  // --- User & Profile Operations ---
  findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  getProfile(userId: string): Profile | undefined {
    return this.data.profiles.find((p) => p.userId === userId);
  }

  saveProfile(profile: Profile): Profile {
    const idx = this.data.profiles.findIndex((p) => p.userId === profile.userId);
    if (idx >= 0) {
      this.data.profiles[idx] = { ...this.data.profiles[idx], ...profile, updatedAt: new Date().toISOString() };
    } else {
      this.data.profiles.push(profile);
    }
    this.save();
    return profile;
  }

  // --- Resume Operations ---
  getResume(userId: string): ResumeData | undefined {
    return this.data.resumes.find((r) => r.userId === userId);
  }

  saveResume(resume: ResumeData): ResumeData {
    const idx = this.data.resumes.findIndex((r) => r.userId === resume.userId);
    if (idx >= 0) {
      this.data.resumes[idx] = resume;
    } else {
      this.data.resumes.push(resume);
    }
    this.save();
    return resume;
  }

  deleteResume(userId: string): boolean {
    const initialLen = this.data.resumes.length;
    this.data.resumes = this.data.resumes.filter((r) => r.userId !== userId);
    this.save();
    return this.data.resumes.length < initialLen;
  }

  // --- Interview Operations ---
  createInterview(interview: InterviewSession): InterviewSession {
    this.data.interviews.push(interview);
    this.save();
    return interview;
  }

  getInterview(id: string): InterviewSession | undefined {
    return this.data.interviews.find((i) => i.id === id);
  }

  updateInterview(id: string, updates: Partial<InterviewSession>): InterviewSession | undefined {
    const idx = this.data.interviews.findIndex((i) => i.id === id);
    if (idx >= 0) {
      this.data.interviews[idx] = { ...this.data.interviews[idx], ...updates };
      this.save();
      return this.data.interviews[idx];
    }
    return undefined;
  }

  deleteInterview(id: string, userId: string): boolean {
    const idx = this.data.interviews.findIndex((i) => i.id === id && i.userId === userId);
    if (idx >= 0) {
      this.data.interviews.splice(idx, 1);
      this.data.interviewQuestions = this.data.interviewQuestions.filter((q) => q.interviewId !== id);
      this.data.interviewAnswers = this.data.interviewAnswers.filter((a) => a.interviewId !== id);
      this.data.interviewFeedback = this.data.interviewFeedback.filter((f) => f.interviewId !== id);
      this.data.recordings = this.data.recordings.filter((r) => r.interviewId !== id);
      this.save();
      return true;
    }
    return false;
  }

  listInterviews(userId: string): InterviewSession[] {
    return this.data.interviews
      .filter((i) => i.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Questions Operations ---
  saveQuestions(questions: InterviewQuestion[]) {
    this.data.interviewQuestions.push(...questions);
    this.save();
  }

  getQuestions(interviewId: string): InterviewQuestion[] {
    return this.data.interviewQuestions
      .filter((q) => q.interviewId === interviewId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  // --- Answers Operations ---
  saveAnswer(answer: InterviewAnswer): InterviewAnswer {
    const idx = this.data.interviewAnswers.findIndex(
      (a) => a.interviewId === answer.interviewId && a.questionId === answer.questionId
    );
    if (idx >= 0) {
      this.data.interviewAnswers[idx] = answer;
    } else {
      this.data.interviewAnswers.push(answer);
    }
    this.save();
    return answer;
  }

  getAnswers(interviewId: string): InterviewAnswer[] {
    return this.data.interviewAnswers.filter((a) => a.interviewId === interviewId);
  }

  // --- Feedback Operations ---
  saveFeedback(feedback: InterviewFeedback): InterviewFeedback {
    const idx = this.data.interviewFeedback.findIndex((f) => f.interviewId === feedback.interviewId);
    if (idx >= 0) {
      this.data.interviewFeedback[idx] = feedback;
    } else {
      this.data.interviewFeedback.push(feedback);
    }
    this.save();
    return feedback;
  }

  getFeedback(interviewId: string): InterviewFeedback | undefined {
    return this.data.interviewFeedback.find((f) => f.interviewId === interviewId);
  }

  // --- Recordings Operations ---
  saveRecording(recording: Recording): Recording {
    const idx = this.data.recordings.findIndex((r) => r.interviewId === recording.interviewId);
    if (idx >= 0) {
      this.data.recordings[idx] = recording;
    } else {
      this.data.recordings.push(recording);
    }
    this.save();
    return recording;
  }

  getRecording(interviewId: string): Recording | undefined {
    return this.data.recordings.find((r) => r.interviewId === interviewId);
  }

  listRecordings(userId: string): Recording[] {
    return this.data.recordings
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  deleteRecording(id: string, userId: string): boolean {
    const idx = this.data.recordings.findIndex((r) => r.id === id && r.userId === userId);
    if (idx >= 0) {
      this.data.recordings.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // --- Analytics calculation ---
  getAnalytics(userId: string) {
    const userInterviews = this.data.interviews.filter(
      (i) => i.userId === userId && i.status === 'completed' && typeof i.overallScore === 'number'
    );

    const total = userInterviews.length;
    const scores = userInterviews.map((i) => i.overallScore!);
    const avgScore = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
    const bestScore = total > 0 ? Math.max(...scores) : 0;

    const technicalInterviews = userInterviews.filter((i) => i.interviewType === 'technical');
    const hrInterviews = userInterviews.filter((i) => i.interviewType === 'hr');

    const techAvg =
      technicalInterviews.length > 0
        ? Math.round(technicalInterviews.reduce((a, b) => a + b.overallScore!, 0) / technicalInterviews.length)
        : 0;

    const hrAvg =
      hrInterviews.length > 0
        ? Math.round(hrInterviews.reduce((a, b) => a + b.overallScore!, 0) / hrInterviews.length)
        : 0;

    // Build trend series
    const trend = userInterviews
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((i) => ({
        id: i.id,
        date: new Date(i.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        score: i.overallScore,
        role: i.jobRole,
        type: i.interviewType,
      }));

    // Collect frequently recommended topics from feedback
    const feedbackList = this.data.interviewFeedback.filter((f) =>
      userInterviews.some((i) => i.id === f.interviewId)
    );

    const topicCounts: Record<string, number> = {};
    feedbackList.forEach((fb) => {
      (fb.recommendedTopics || []).forEach((t) => {
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      });
    });

    const recommendedTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    return {
      totalCompleted: total,
      averageScore: avgScore,
      bestScore: bestScore,
      technicalAverage: techAvg,
      hrAverage: hrAvg,
      trend,
      recommendedTopics:
        recommendedTopics.length > 0
          ? recommendedTopics
          : [
              'Embedded C: Pointers, Memory Mapping, and Volatile Qualifiers',
              'VLSI: Setup and Hold Time Violations and Meta-stability',
              'Microcontrollers: Interrupt Vectors & Low-power Sleep Modes',
              'Behavioral: The STAR Method for Project Conflict Resolution',
            ],
    };
  }
}

export const db = new Database();
