export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface Profile {
  userId: string;
  fullName: string;
  age?: number;
  education?: string;
  college?: string;
  degree?: string;
  preferredJobRole: string;
  experienceLevel: string;
  skills: string[];
  careerObjective?: string;
  updatedAt: string;
}

export interface ResumeData {
  id: string;
  userId: string;
  fileName: string;
  extractedText: string;
  parsedSkills: string[];
  parsedProjects: string[];
  parsedEducation?: string;
  createdAt: string;
}

export type InterviewType = 'technical' | 'hr';
export type InterviewMode = 'chat' | 'voice';
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';

export interface InterviewQuestion {
  id: string;
  interviewId: string;
  orderIndex: number;
  questionText: string;
  category: string;
  evaluationCriteria: string;
}

export interface InterviewAnswer {
  id: string;
  interviewId: string;
  questionId: string;
  answerText: string;
  durationSeconds: number;
  submittedAt: string;
}

export interface QuestionEvaluation {
  questionId: string;
  questionText: string;
  answerText: string;
  score: number;
  whatWentWell: string;
  specificMistakes: string;
  missingPoints: string;
  betterSampleAnswer: string;
  practicalTips: string;
}

export interface PresentationAnalysis {
  faceVisibility: string;
  cameraEngagement: string;
  postureAndFraming: string;
  lightingQuality: string;
  practicalTips: string[];
}

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  strengths: string[];
  improvements: string[];
  questionEvaluations: QuestionEvaluation[];
  presentationAnalysis?: PresentationAnalysis;
  recommendedTopics: string[];
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  resumeId?: string;
  jobRole: string;
  interviewType: InterviewType;
  interviewMode: InterviewMode;
  cameraEnabled: boolean;
  durationSeconds: number;
  status: InterviewStatus;
  startedAt: string;
  completedAt?: string;
  overallScore?: number;
  createdAt: string;
}

export interface Recording {
  id: string;
  interviewId: string;
  userId: string;
  fileName: string;
  dataUrl?: string;
  durationSeconds: number;
  fileSize: number;
  createdAt: string;
}

export interface AnalyticsData {
  totalCompleted: number;
  averageScore: number;
  bestScore: number;
  technicalAverage: number;
  hrAverage: number;
  trend: Array<{
    id: string;
    date: string;
    score: number;
    role: string;
    type: string;
  }>;
  recommendedTopics: string[];
}
