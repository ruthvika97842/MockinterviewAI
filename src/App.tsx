import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { AuthModal } from './pages/AuthModal.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { InterviewSetupWizard } from './pages/InterviewSetupWizard.tsx';
import { LiveInterview } from './pages/LiveInterview.tsx';
import { InterviewResults } from './pages/InterviewResults.tsx';
import { PreviousInterviews } from './pages/PreviousInterviews.tsx';
import { RecordingsPage } from './pages/RecordingsPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import {
  InterviewSession,
  InterviewQuestion,
  InterviewFeedback,
  Recording,
} from './types/index.ts';
import { api } from './services/api.ts';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Active Interview Session State
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<InterviewQuestion[]>([]);

  // Results State
  const [activeFeedback, setActiveFeedback] = useState<InterviewFeedback | null>(null);
  const [activeRecording, setActiveRecording] = useState<Recording | undefined>(undefined);

  // When loading initial auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle Starting Interview from Wizard
  const handleInterviewStarted = (session: InterviewSession, questions: InterviewQuestion[]) => {
    setActiveSession(session);
    setActiveQuestions(questions);
    setCurrentView('interview');
  };

  // Handle Interview Completion
  const handleInterviewCompleted = (feedback: InterviewFeedback, session: InterviewSession) => {
    setActiveFeedback(feedback);
    setActiveSession(session);
    setCurrentView('results');
  };

  // View specific previous interview report
  const handleViewInterviewReport = async (interviewId: string) => {
    try {
      const data = await api.getFeedback(interviewId);
      setActiveFeedback(data.feedback);
      setActiveSession(data.interview);
      setActiveRecording(data.recording);
      setCurrentView('results');
    } catch (err) {
      alert('Could not load report for this session.');
    }
  };

  // If user is not authenticated and views landing
  if (!user || currentView === 'landing') {
    return (
      <>
        <LandingPage
          onStartPracticing={() => {
            if (user) {
              setCurrentView('setup');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setCurrentView('dashboard')}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-classy-canvas text-[#1E2338] flex flex-col font-sans selection:bg-[#635BFF] selection:text-white relative">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Sidebar (Hidden during active live interview for maximum focus) */}
        {currentView !== 'interview' && (
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              onStartInterview={() => setCurrentView('setup')}
              onViewInterview={handleViewInterviewReport}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'setup' && (
            <InterviewSetupWizard
              onInterviewStarted={handleInterviewStarted}
              onCancel={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'interview' && activeSession && (
            <LiveInterview
              session={activeSession}
              questions={activeQuestions}
              onComplete={handleInterviewCompleted}
              onExit={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'results' && activeFeedback && activeSession && (
            <InterviewResults
              feedback={activeFeedback}
              session={activeSession}
              recording={activeRecording}
              onPracticeAgain={() => setCurrentView('setup')}
              onGoToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'history' && (
            <PreviousInterviews
              onViewInterview={handleViewInterviewReport}
              onStartNew={() => setCurrentView('setup')}
            />
          )}

          {currentView === 'recordings' && <RecordingsPage />}

          {currentView === 'analytics' && <AnalyticsPage />}

          {currentView === 'profile' && <ProfilePage />}

          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentView('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
