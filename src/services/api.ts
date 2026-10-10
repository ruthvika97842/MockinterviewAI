import {
  User,
  Profile,
  ResumeData,
  InterviewSession,
  InterviewQuestion,
  InterviewAnswer,
  InterviewFeedback,
  Recording,
  AnalyticsData,
} from '../types/index.ts';

const TOKEN_KEY = 'mockwise_auth_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  },

  // Health
  checkHealth() {
    return this.request<{ status: string; hasGeminiKey: boolean; appName: string }>('/health');
  },

  // Auth
  register(data: { email: string; password: string; fullName: string }) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login(data: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCurrentUser() {
    return this.request<{ user: User }>('/auth/me');
  },

  logout() {
    return this.request<{ success: boolean }>('/auth/logout', { method: 'POST' });
  },

  // Profile
  getProfile() {
    return this.request<{ profile: Profile; resume?: ResumeData }>('/profile');
  },

  updateProfile(profile: Partial<Profile>) {
    return this.request<{ success: boolean; profile: Profile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  // Resume
  uploadResume(data: { fileName: string; extractedText: string }) {
    return this.request<{ success: boolean; resume: ResumeData }>('/resume/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteResume() {
    return this.request<{ success: boolean }>('/resume', { method: 'DELETE' });
  },

  // Interviews
  createInterview(config: {
    jobRole: string;
    interviewType: 'technical' | 'hr';
    interviewMode: 'chat' | 'voice';
    cameraEnabled: boolean;
    durationSeconds?: number;
  }) {
    return this.request<{ interview: InterviewSession; questions: InterviewQuestion[] }>('/interview/create', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },

  getInterview(id: string) {
    return this.request<{
      interview: InterviewSession;
      questions: InterviewQuestion[];
      answers: InterviewAnswer[];
    }>(`/interview/${id}`);
  },

  submitAnswer(interviewId: string, data: { questionId: string; answerText: string; durationSeconds: number }) {
    return this.request<{ success: boolean; answer: InterviewAnswer }>(`/interview/${interviewId}/answer`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  finishInterview(interviewId: string) {
    return this.request<{ success: boolean; feedback: InterviewFeedback; interview: InterviewSession }>(
      `/interview/${interviewId}/finish`,
      { method: 'POST' }
    );
  },

  getFeedback(interviewId: string) {
    return this.request<{
      feedback: InterviewFeedback;
      interview: InterviewSession;
      recording?: Recording;
    }>(`/interview/${interviewId}/feedback`);
  },

  // Recordings
  saveRecording(interviewId: string, data: { dataUrl: string; durationSeconds: number; fileSize: number }) {
    return this.request<{ success: boolean; recording: { id: string; fileName: string } }>(
      `/interview/${interviewId}/recording`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  listRecordings() {
    return this.request<{ recordings: Recording[] }>('/recordings');
  },

  deleteRecording(id: string) {
    return this.request<{ success: boolean }>(`/recordings/${id}`, { method: 'DELETE' });
  },

  // History & Analytics
  listInterviews() {
    return this.request<{ interviews: InterviewSession[] }>('/interviews');
  },

  deleteInterview(id: string) {
    return this.request<{ success: boolean }>(`/interviews/${id}`, { method: 'DELETE' });
  },

  getAnalytics() {
    return this.request<{ analytics: AnalyticsData }>('/analytics');
  },
};
