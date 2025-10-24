
import React from 'react';
import { Brain, Sparkles, Zap, Shield, Target, User, LogIn } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  user: any;
  onAuthClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onProfileClick }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="bg-slate-900/20 backdrop-blur-xl border-b border-slate-700/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 p-3 rounded-2xl shadow-2xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  The Chosen One
                </h1>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  AI Resume Intelligence
                </p>
              </div>
            </div>

            {/* Navigation Features & Auth */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span>Precise</span>
                </div>
              </div>
              
              {/* Authentication */}
              {!isSupabaseConfigured() ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full backdrop-blur-sm border border-slate-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-200">AI Active</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    Local Mode
                  </div>
                </div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full backdrop-blur-sm border border-slate-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-200">AI Active</span>
                  </div>
                  <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
                  >
                    <User className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Profile'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full backdrop-blur-sm border border-slate-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-200">AI Active</span>
                  </div>
                  <button
                    onClick={onAuthClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Auth */}
            <div className="lg:hidden">
              {!isSupabaseConfigured() ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300">Local Mode</span>
                </div>
              ) : user ? (
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
                >
                  <User className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400">Profile</span>
                </button>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="text-sm">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
