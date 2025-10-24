import React from 'react';
import type { StoredAnalysis } from '../types';
import { History, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryPanelProps {
  history: StoredAnalysis[];
  onSelect: (record: StoredAnalysis) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  currentAnalysisId?: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onDelete, onClear, currentAnalysisId }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/30 relative overflow-hidden group">
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-3xl group-hover:from-cyan-400/30 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:from-blue-400/30 transition-all duration-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-xl"></div>
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 p-4 rounded-2xl shadow-xl">
              <History className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Analysis History
            </h2>
            <p className="text-slate-400 text-lg">Previous AI screenings</p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-slate-400 hover:text-red-400 transition-all duration-300 flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-red-500/10 border border-slate-700/30 hover:border-red-500/30"
            title="Clear all history"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto space-y-4 pr-2 relative z-10">
        <AnimatePresence>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-full blur-xl"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/30">
                  <History className="h-12 w-12 text-slate-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No Analysis History</h3>
              <p className="text-slate-500">Your AI screening history will appear here.</p>
            </div>
          ) : (
            history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className={`group bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl cursor-pointer transition-all duration-300 hover-lift border ${
                  currentAnalysisId === item.id 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/40 shadow-lg shadow-cyan-500/20' 
                    : 'border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between" onClick={() => onSelect(item)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-4 h-4 rounded-full ${currentAnalysisId === item.id ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`}></div>
                      <h4 className="text-lg font-bold text-slate-200 truncate" title={item.candidateName}>
                        {item.candidateName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-cyan-400">{item.overallScore}</span>
                        <span className="text-slate-500">AI Score</span>
                      </div>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="ml-4 p-3 text-slate-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100 border border-slate-700/30 hover:border-red-500/30"
                    title="Delete analysis"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
