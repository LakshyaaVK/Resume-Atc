import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { analyzeResume } from './services/geminiService';
import { parseFile } from './services/fileParser';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { saveAnalysisResult, getUserAnalysisResults, deleteAnalysisResult } from './lib/database';
import type { StoredAnalysis, Weights } from './types';

const HISTORY_STORAGE_KEY = 'resumeAnalysisHistory';

export default function App() {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<StoredAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [weights, setWeights] = useState<Weights>({
    skills: 50,
    experience: 40,
    education: 10,
  });
  const [history, setHistory] = useState<StoredAnalysis[]>([]);
  
  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Initialize authentication and load data
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Running in local-only mode.');
      loadLocalHistory();
      return;
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserHistory(session.user.id);
      } else {
        loadLocalHistory();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserHistory(session.user.id);
        } else {
          loadLocalHistory();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserHistory = async (userId: string) => {
    try {
      const results = await getUserAnalysisResults(userId);
      setHistory(results.map(result => ({
        id: result.id!,
        timestamp: result.created_at!,
        fileName: 'Saved Analysis',
        ...result
      })));
    } catch (error) {
      console.error('Error loading user history:', error);
      loadLocalHistory();
    }
  };

  const loadLocalHistory = () => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setResumeText('');
      setFileName('');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);
    setFileName(file.name);
    try {
      const text = await parseFile(file);
      setResumeText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file.');
      setResumeText('');
      setFileName('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError('Please provide both a job description and a resume.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(jobDescription, resumeText, weights);
      const newRecord: StoredAnalysis = {
        ...result,
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toISOString(),
        fileName,
      };
      setAnalysisResult(newRecord);

      // Save to database if user is authenticated and Supabase is configured
      if (user && isSupabaseConfigured()) {
        try {
          await saveAnalysisResult({
            user_id: user.id,
            job_description: jobDescription,
            resume_text: resumeText,
            overall_score: result.overallScore,
            summary: result.summary,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            skills_analysis: result.skillsAnalysis,
            experience_analysis: result.experienceAnalysis,
            education_analysis: result.educationAnalysis,
            weights: weights,
          });
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Continue with local storage as fallback
        }
      }

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, resumeText, weights, fileName, history, user]);

  const handleSelectHistory = (record: StoredAnalysis) => {
    setAnalysisResult(record);
    setError('');
  };

  const handleDeleteHistory = async (idToDelete: string) => {
    // Delete from database if user is authenticated and Supabase is configured
    if (user && isSupabaseConfigured()) {
      try {
        await deleteAnalysisResult(idToDelete, user.id);
      } catch (error) {
        console.error('Error deleting from database:', error);
      }
    }

    const updatedHistory = history.filter(item => item.id !== idToDelete);
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    if (analysisResult?.id === idToDelete) {
      setAnalysisResult(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    setAnalysisResult(null);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // User state will be updated by the auth state change listener
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserProfile(false);
    // User state will be updated by the auth state change listener
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans text-slate-100 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
      </div>
      
      <Header 
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowUserProfile(true)}
      />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                The Chosen One
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-8 leading-relaxed">
              Advanced AI-powered resume screening that finds the perfect candidate match
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                AI-Powered Analysis
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                Real-time Scoring
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                Smart Matching
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Input & History */}
            <div className="xl:col-span-2 space-y-8">
              <InputPanel
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onFileChange={handleFileChange}
                fileName={fileName}
                weights={weights}
                setWeights={setWeights}
                onAnalyze={handleAnalyzeClick}
                isLoading={isLoading}
                hasRequiredInputs={!!jobDescription.trim() && !!resumeText.trim()}
              />
              <HistoryPanel 
                history={history}
                onSelect={handleSelectHistory}
                onDelete={handleDeleteHistory}
                onClear={handleClearHistory}
                currentAnalysisId={analysisResult?.id}
              />
            </div>
            
            {/* Right Column - Results */}
            <div className="xl:col-span-1">
              <ResultsPanel
                result={analysisResult}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Authentication Modal */}
      {isSupabaseConfigured() && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* User Profile Modal */}
      {isSupabaseConfigured() && showUserProfile && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowUserProfile(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <UserProfile user={user} onSignOut={handleSignOut} />
          </div>
        </div>
      )}
    </div>
  );
}