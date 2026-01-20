import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Star, BarChart2, User, FileText, Briefcase, GraduationCap } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import type { StoredAnalysis } from '../types';

interface ResultsPanelProps {
    result: StoredAnalysis | null;
    isLoading: boolean;
    error: string;
}

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-slate-700 border-t-cyan-400 border-r-blue-400 border-b-purple-400"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-24 w-24 border-4 border-cyan-400/20"></div>
            <div className="absolute inset-2 animate-pulse rounded-full h-20 w-20 bg-gradient-to-r from-cyan-400/10 to-blue-400/10"></div>
        </div>
        <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-200">AI Analysis in Progress</h3>
            <p className="text-slate-400 text-lg">Processing candidate data with advanced algorithms</p>
            <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        </div>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-2xl backdrop-blur-sm">
        <div className="relative">
            <XCircle className="h-16 w-16 text-red-400" />
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-red-400/30"></div>
        </div>
        <div className="mt-6 space-y-2">
            <p className="font-bold text-red-300 text-lg">Analysis Failed</p>
            <p className="text-sm text-red-400 max-w-md">{message}</p>
        </div>
    </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-2xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/30">
                <BarChart2 className="h-16 w-16 text-slate-400" />
            </div>
        </div>
        <div className="space-y-4">
            <h3 className="text-3xl font-black text-slate-200">AI Dashboard Ready</h3>
            <p className="text-slate-400 text-lg max-w-md">Upload a resume and provide a job description to unlock powerful AI-driven candidate analysis.</p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    Smart Matching
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Real-time Scoring
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Detailed Insights
                </span>
            </div>
        </div>
    </div>
);

const ResultCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-slate-700/20 transition-all duration-300 card-hover min-h-[140px] max-h-[180px] mb-4">
        <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-700/50 rounded-lg">
                {icon}
            </div>
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{title}</span>
        </h4>
        <div className="text-slate-400 space-y-2 leading-relaxed overflow-hidden">{children}</div>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading, error }) => {
    const scoreData = result ? [{ name: 'score', value: result.overallScore, fill: '#22d3ee' }] : [];

    const renderContent = () => {
        if (isLoading) return <Loader />;
        if (error) return <ErrorDisplay message={error} />;
        if (!result) return <InitialState />;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Main Score Dashboard */}
                <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/30 shadow-2xl relative overflow-hidden group">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl group-hover:from-cyan-400/30 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-xl group-hover:from-blue-400/30 transition-all duration-500"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                        {/* Score Visualization */}
                        <div className="w-56 h-56 relative">
                            <ResponsiveContainer>
                                <RadialBarChart
                                    innerRadius="50%"
                                    outerRadius="100%"
                                    data={scoreData}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar background dataKey="value" cornerRadius={20} fill="url(#scoreGradient)" />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#22d3ee" />
                                            <stop offset="50%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white text-6xl font-black"
                                    >
                                        {result.overallScore}
                                    </text>
                                    <text
                                        x="50%"
                                        y="70%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-slate-400 text-lg font-bold"
                                    >
                                        AI Score
                                    </text>
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Candidate Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center gap-4 justify-center lg:justify-start mb-6">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    <div className="relative bg-gradient-to-r from-cyan-400 to-blue-500 p-4 rounded-2xl shadow-xl">
                                        <User size={32} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                                        {result.candidateName}
                                    </h2>
                                    <p className="text-slate-400 text-lg">AI-Analyzed Candidate</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-xl leading-relaxed">{result.summary}</p>
                        </div>
                    </div>
                </div>

                {/* Strengths and Gaps Section */}
                <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/30">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg">
                            <CheckCircle className="text-white" size={20} />
                        </div>
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Analysis Summary</span>
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-700/30 p-4 rounded-xl border border-green-500/20">
                            <h4 className="font-bold text-green-400 flex items-center gap-2 mb-3">
                                <CheckCircle className="text-green-400" size={18} />
                                Strengths
                            </h4>
                            <ul className="list-disc list-inside space-y-2">
                                {result.strengths.slice(0, 3).map((s, i) => (
                                    <li key={i} className="text-sm text-slate-300 leading-relaxed">
                                        {s.length > 60 ? `${s.substring(0, 60)}...` : s}
                                    </li>
                                ))}
                                {result.strengths.length > 3 && (
                                    <li className="text-xs text-slate-500 italic">
                                        +{result.strengths.length - 3} more strengths
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="bg-slate-700/30 p-4 rounded-xl border border-yellow-500/20">
                            <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-3">
                                <XCircle className="text-yellow-400" size={18} />
                                Potential Gaps
                            </h4>
                            <ul className="list-disc list-inside space-y-2">
                                {result.weaknesses.slice(0, 3).map((w, i) => (
                                    <li key={i} className="text-sm text-slate-300 leading-relaxed">
                                        {w.length > 60 ? `${w.substring(0, 60)}...` : w}
                                    </li>
                                ))}
                                {result.weaknesses.length > 3 && (
                                    <li className="text-xs text-slate-500 italic">
                                        +{result.weaknesses.length - 3} more areas for improvement
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis Section */}
                <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/30">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <BarChart2 className="text-white" size={24} />
                        </div>
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Detailed Breakdown</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Skills Analysis */}
                        <div className="bg-slate-700/30 p-6 rounded-xl border border-cyan-500/20 flex flex-col">
                            <h4 className="font-bold text-cyan-400 flex items-center gap-2 mb-4">
                                <Star className="text-cyan-400" size={20} />
                                Skills
                            </h4>
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative w-24 h-24 mb-2">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-600/50" />
                                        <circle cx="48" cy="48" r="40" stroke="url(#cyanGradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${result.skillsAnalysis.score * 2.51} 251`} />
                                        <defs>
                                            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#22d3ee" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-cyan-400">{result.skillsAnalysis.score}</span>
                                </div>
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed flex-1">
                                {result.skillsAnalysis.details}
                            </div>
                        </div>

                        {/* Experience Analysis */}
                        <div className="bg-slate-700/30 p-6 rounded-xl border border-blue-500/20 flex flex-col">
                            <h4 className="font-bold text-blue-400 flex items-center gap-2 mb-4">
                                <Briefcase className="text-blue-400" size={20} />
                                Experience
                            </h4>
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative w-24 h-24 mb-2">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-600/50" />
                                        <circle cx="48" cy="48" r="40" stroke="url(#blueGradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${result.experienceAnalysis.score * 2.51} 251`} />
                                        <defs>
                                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#2563eb" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-blue-400">{result.experienceAnalysis.score}</span>
                                </div>
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed flex-1">
                                {result.experienceAnalysis.details}
                            </div>
                        </div>

                        {/* Education Analysis */}
                        <div className="bg-slate-700/30 p-6 rounded-xl border border-purple-500/20 flex flex-col">
                            <h4 className="font-bold text-purple-400 flex items-center gap-2 mb-4">
                                <GraduationCap className="text-purple-400" size={20} />
                                Education
                            </h4>
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative w-24 h-24 mb-2">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-600/50" />
                                        <circle cx="48" cy="48" r="40" stroke="url(#purpleGradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${result.educationAnalysis.score * 2.51} 251`} />
                                        <defs>
                                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#a855f7" />
                                                <stop offset="100%" stopColor="#9333ea" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-purple-400">{result.educationAnalysis.score}</span>
                                </div>
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed flex-1">
                                {result.educationAnalysis.details}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/30 min-h-[500px] relative overflow-hidden group">
            {/* Premium Background Effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/15 to-transparent rounded-full blur-3xl group-hover:from-cyan-400/20 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-2xl group-hover:from-blue-400/20 transition-all duration-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-xl"></div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={isLoading ? 'loading' : error ? 'error' : result ? 'result' : 'initial'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full relative z-10"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};