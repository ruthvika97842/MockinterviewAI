import { Router, Request, Response } from 'express';
import { db } from './db.ts';
import { generateInterviewQuestions, evaluateInterview } from './gemini.ts';
import {
  User,
  Profile,
  ResumeData,
  InterviewSession,
  InterviewAnswer,
  Recording,
} from './types.ts';

export const apiRouter = Router();

// Middleware to resolve authenticated user from header or session
function getAuthenticatedUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Token can be the user id or session id
    if (token) return token;
  }
  // Default fallback to the demo user if no header passed
  return 'usr-demo-101';
}

// ----------------- HEALTH & CONFIG -----------------
apiRouter.get('/health', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
  );
  res.json({
    status: 'ok',
    appName: 'MockWise AI',
    hasGeminiKey,
    timestamp: new Date().toISOString(),
  });
});

// ----------------- AUTHENTICATION -----------------
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    if (db.findUserByEmail(email)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      passwordHash: password, // For production we hash; simple internal storage
      fullName: fullName.trim(),
      createdAt: new Date().toISOString(),
    };
    db.createUser(newUser);

    // Initialize blank profile
    const newProfile: Profile = {
      userId: newUser.id,
      fullName: newUser.fullName,
      education: 'Undergraduate',
      preferredJobRole: 'Embedded Software Engineer',
      experienceLevel: 'Fresher / Final Year Undergrad',
      skills: ['Embedded C', 'Microcontrollers', 'C++'],
      updatedAt: new Date().toISOString(),
    };
    db.saveProfile(newProfile);

    res.status(201).json({
      user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName },
      token: newUser.id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      user: { id: user.id, email: user.email, fullName: user.fullName },
      token: user.id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const user = db.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    user: { id: user.id, email: user.email, fullName: user.fullName },
  });
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ----------------- PROFILE -----------------
apiRouter.get('/profile', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  let profile = db.getProfile(userId);
  if (!profile) {
    const user = db.findUserById(userId);
    profile = {
      userId,
      fullName: user ? user.fullName : 'Engineering Candidate',
      preferredJobRole: 'Embedded Software Engineer',
      experienceLevel: 'Fresher / Final Year Undergrad',
      skills: ['Embedded C', 'Microcontrollers'],
      updatedAt: new Date().toISOString(),
    };
    db.saveProfile(profile);
  }
  const resume = db.getResume(userId);
  res.json({ profile, resume });
});

apiRouter.put('/profile', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const data = req.body;
  const updatedProfile: Profile = {
    userId,
    fullName: data.fullName || 'Engineering Candidate',
    age: data.age ? Number(data.age) : undefined,
    education: data.education || '',
    college: data.college || '',
    degree: data.degree || '',
    preferredJobRole: data.preferredJobRole || 'Embedded Software Engineer',
    experienceLevel: data.experienceLevel || 'Fresher / Final Year Undergrad',
    skills: Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    careerObjective: data.careerObjective || '',
    updatedAt: new Date().toISOString(),
  };
  db.saveProfile(updatedProfile);
  res.json({ success: true, profile: updatedProfile });
});

// ----------------- RESUME MANAGEMENT & EXTRACTION -----------------
apiRouter.post('/resume/upload', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { fileName, fileContentText, extractedText } = req.body;

    const rawText = extractedText || fileContentText || '';
    if (!rawText.trim()) {
      return res.status(400).json({ error: 'No readable text content provided in resume.' });
    }

    // Heuristic extraction of skills, projects, and education
    const skillsKeywords = [
      'Embedded C', 'C++', 'Python', 'Verilog', 'VHDL', 'STM32', 'ARM Cortex', '8051',
      'FreeRTOS', 'RTOS', 'SPI', 'I2C', 'UART', 'CAN', 'FPGA', 'MATLAB', 'Keil',
      'React', 'Node.js', 'TypeScript', 'SQL', 'Git', 'Linux', 'PCB Design', 'IoT'
    ];
    const detectedSkills = skillsKeywords.filter((kw) =>
      new RegExp(`\\b${kw.replace(/[+*?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawText)
    );

    // Project extraction
    const lines = rawText.split('\n');
    const projects: string[] = [];
    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (
        (trimmed.toLowerCase().includes('project') || trimmed.toLowerCase().includes('developed') || trimmed.toLowerCase().includes('designed')) &&
        trimmed.length > 15 &&
        trimmed.length < 120
      ) {
        projects.push(trimmed);
      }
    });

    const resume: ResumeData = {
      id: `res-${Date.now()}`,
      userId,
      fileName: fileName || 'Uploaded_Resume.pdf',
      extractedText: rawText,
      parsedSkills: detectedSkills.length > 0 ? detectedSkills : ['Embedded Systems', 'Technical Problem Solving'],
      parsedProjects: projects.slice(0, 4),
      parsedEducation: rawText.includes('B.Tech') ? 'B.Tech Engineering' : 'Engineering Degree',
      createdAt: new Date().toISOString(),
    };

    db.saveResume(resume);

    // Update user profile skills with parsed skills if profile has few
    const currentProfile = db.getProfile(userId);
    if (currentProfile && detectedSkills.length > 0) {
      const mergedSkills = Array.from(new Set([...currentProfile.skills, ...detectedSkills]));
      currentProfile.skills = mergedSkills;
      db.saveProfile(currentProfile);
    }

    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process resume.' });
  }
});

apiRouter.delete('/resume', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const deleted = db.deleteResume(userId);
  res.json({ success: deleted });
});

// ----------------- INTERVIEWS -----------------
apiRouter.post('/interview/create', async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { jobRole, interviewType, interviewMode, cameraEnabled, durationSeconds } = req.body;

    const profile = db.getProfile(userId);
    const resume = db.getResume(userId);

    const interviewId = `int-${Date.now()}`;
    const newInterview: InterviewSession = {
      id: interviewId,
      userId,
      resumeId: resume?.id,
      jobRole: jobRole || profile?.preferredJobRole || 'Embedded Software Engineer',
      interviewType: interviewType === 'hr' ? 'hr' : 'technical',
      interviewMode: interviewMode === 'voice' ? 'voice' : 'chat',
      cameraEnabled: Boolean(cameraEnabled),
      durationSeconds: Number(durationSeconds) || 600, // 10 minutes
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    db.createInterview(newInterview);

    // Generate AI questions tailored to resume & role
    const questions = await generateInterviewQuestions({
      interviewId,
      role: newInterview.jobRole,
      type: newInterview.interviewType,
      resumeText: resume?.extractedText,
      experienceLevel: profile?.experienceLevel,
    });

    db.saveQuestions(questions);

    res.status(201).json({
      interview: newInterview,
      questions,
    });
  } catch (err) {
    console.error('Error creating interview session:', err);
    res.status(500).json({ error: 'Failed to create interview session.' });
  }
});

apiRouter.get('/interview/:id', (req: Request, res: Response) => {
  const interview = db.getInterview(req.params.id);
  if (!interview) {
    return res.status(404).json({ error: 'Interview session not found.' });
  }
  const questions = db.getQuestions(interview.id);
  const answers = db.getAnswers(interview.id);
  res.json({ interview, questions, answers });
});

apiRouter.post('/interview/:id/answer', (req: Request, res: Response) => {
  const interviewId = req.params.id;
  const { questionId, answerText, durationSeconds } = req.body;

  const interview = db.getInterview(interviewId);
  if (!interview) {
    return res.status(404).json({ error: 'Interview not found.' });
  }

  const answer: InterviewAnswer = {
    id: `ans-${Date.now()}`,
    interviewId,
    questionId,
    answerText: answerText || '',
    durationSeconds: Number(durationSeconds) || 0,
    submittedAt: new Date().toISOString(),
  };

  db.saveAnswer(answer);
  res.json({ success: true, answer });
});

apiRouter.post('/interview/:id/finish', async (req: Request, res: Response) => {
  try {
    const interviewId = req.params.id;
    const interview = db.getInterview(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    const questions = db.getQuestions(interviewId);
    const answers = db.getAnswers(interviewId);

    // Call Gemini AI evaluation engine
    const feedback = await evaluateInterview({
      interviewId,
      role: interview.jobRole,
      type: interview.interviewType,
      questions,
      answers,
      cameraEnabled: interview.cameraEnabled,
    });

    db.saveFeedback(feedback);

    // Update interview status & overall score
    db.updateInterview(interviewId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      overallScore: feedback.overallScore,
    });

    res.json({
      success: true,
      feedback,
      interview: db.getInterview(interviewId),
    });
  } catch (err) {
    console.error('Error finishing interview:', err);
    res.status(500).json({ error: 'Failed to evaluate interview.' });
  }
});

apiRouter.get('/interview/:id/feedback', (req: Request, res: Response) => {
  const interviewId = req.params.id;
  const feedback = db.getFeedback(interviewId);
  const interview = db.getInterview(interviewId);
  const recording = db.getRecording(interviewId);

  if (!feedback) {
    return res.status(404).json({ error: 'Feedback report not available for this session.' });
  }

  res.json({ feedback, interview, recording });
});

// ----------------- RECORDINGS -----------------
apiRouter.post('/interview/:id/recording', (req: Request, res: Response) => {
  const interviewId = req.params.id;
  const userId = getAuthenticatedUserId(req);
  const { dataUrl, durationSeconds, fileSize } = req.body;

  const recording: Recording = {
    id: `rec-${Date.now()}`,
    interviewId,
    userId,
    fileName: `MockWise_Session_${interviewId}.webm`,
    dataUrl,
    durationSeconds: Number(durationSeconds) || 0,
    fileSize: Number(fileSize) || 0,
    createdAt: new Date().toISOString(),
  };

  db.saveRecording(recording);
  res.status(201).json({ success: true, recording: { id: recording.id, fileName: recording.fileName } });
});

apiRouter.get('/recordings', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const recordings = db.listRecordings(userId);
  res.json({ recordings });
});

apiRouter.delete('/recordings/:id', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const deleted = db.deleteRecording(req.params.id, userId);
  res.json({ success: deleted });
});

// ----------------- PREVIOUS INTERVIEWS & HISTORY -----------------
apiRouter.get('/interviews', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const interviews = db.listInterviews(userId);
  res.json({ interviews });
});

apiRouter.delete('/interviews/:id', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const deleted = db.deleteInterview(req.params.id, userId);
  res.json({ success: deleted });
});

// ----------------- ANALYTICS -----------------
apiRouter.get('/analytics', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const analytics = db.getAnalytics(userId);
  res.json({ analytics });
});
