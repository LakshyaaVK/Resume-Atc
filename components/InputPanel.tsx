
import React from 'react';
import type { Weights } from '../types';
import { FileUp, SlidersHorizontal, BrainCircuit } from 'lucide-react';

interface InputPanelProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onFileChange: (file: File | null) => void;
  fileName: string;
  weights: Weights;
  setWeights: (weights: Weights) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  hasRequiredInputs: boolean;
}

const WeightSlider: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManualChange: (value: number) => void;
}> = ({ label, value, onChange, onManualChange }) => {
  const [isManualInput, setIsManualInput] = React.useState(false);
  const [manualValue, setManualValue] = React.useState(value.toString());

  React.useEffect(() => {
    setManualValue(value.toString());
  }, [value]);

  const handleManualSubmit = () => {
    const numValue = parseInt(manualValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onManualChange(numValue);
      setIsManualInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualSubmit();
    } else if (e.key === 'Escape') {
      setIsManualInput(false);
      setManualValue(value.toString());
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/20 hover:border-slate-600/40 transition-all duration-300 group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
          <span className="text-lg font-bold text-slate-200">{label}</span>
        </div>
        
        {/* Manual Input Toggle */}
        <div className="flex items-center gap-3">
          {!isManualInput ? (
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-500/30">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-black text-xl">{value}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleManualSubmit}
                className="w-16 bg-slate-700/50 border border-cyan-500/30 rounded-lg px-2 py-1 text-cyan-400 font-bold text-center focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                autoFocus
              />
              <span className="text-cyan-400 font-bold">%</span>
            </div>
          )}
          
          <button
            onClick={() => setIsManualInput(!isManualInput)}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 hover:bg-slate-700/30 rounded-lg"
            title={isManualInput ? "Use slider" : "Enter manually"}
          >
            {isManualInput ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Progress bar display */}
        <div className="relative">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>0%</span>
            <span>100%</span>
          </div>
          
          {/* Progress bar background */}
          <div className="w-full h-4 bg-slate-700/40 rounded-full relative overflow-hidden">
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-700"
              style={{ width: `${value}%` }}
            ></div>
            
            {/* Value indicator on progress bar */}
            <div 
              className="absolute -top-8 transform -translate-x-1/2 text-xs font-bold text-cyan-400 bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded border border-cyan-500/30"
              style={{ left: `${value}%` }}
            >
              {value}%
            </div>
          </div>
        </div>
        
        {/* Slider control */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={value}
            onChange={onChange}
            className="w-full h-6 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-700 slider-thumb-smooth"
          />
        </div>
      </div>
    </div>
  );
};

export const InputPanel: React.FC<InputPanelProps> = ({
  jobDescription,
  setJobDescription,
  onFileChange,
  fileName,
  weights,
  setWeights,
  onAnalyze,
  isLoading,
  hasRequiredInputs,
}) => {
  
  const handleWeightChange = (field: keyof Weights, value: number) => {
    setWeights({ ...weights, [field]: value });
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/30 flex flex-col gap-8 relative overflow-hidden group">
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl group-hover:from-cyan-400/30 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:from-blue-400/30 transition-all duration-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-xl"></div>
      
      {/* Header Section */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 p-4 rounded-2xl shadow-xl">
              <BrainCircuit className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
              AI Analysis Engine
            </h2>
            <p className="text-slate-400 text-lg">Configure your screening parameters</p>
          </div>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
          <label htmlFor="job-description" className="text-lg font-bold text-slate-200">
            Job Description
          </label>
        </div>
        <div className="relative group">
          <textarea
            id="job-description"
            rows={6}
            className="w-full bg-slate-800/60 border border-slate-600/30 rounded-2xl p-6 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm resize-none group-hover:border-slate-500/50"
            placeholder="Paste the complete job description here to enable AI-powered candidate matching..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          <label htmlFor="resume-upload" className="text-lg font-bold text-slate-200">
            Candidate Resume
          </label>
        </div>
        <label htmlFor="file-upload" className="w-full flex items-center justify-center px-8 py-12 border-2 border-dashed border-slate-600/40 rounded-2xl cursor-pointer hover:border-cyan-500/60 hover:bg-slate-800/40 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="text-center relative z-10">
            <div className="p-4 bg-slate-800/60 rounded-2xl mb-6 group-hover:bg-gradient-to-r group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300">
              <FileUp className="h-10 w-10 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            <p className="text-lg text-slate-300 group-hover:text-slate-200 transition-colors duration-300 mb-2">
              <span className="font-bold text-cyan-400 group-hover:text-cyan-300">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500">PDF, DOCX files supported • Max 10MB</p>
            {fileName && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-green-400 font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {fileName}
                </p>
              </div>
            )}
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept=".pdf,.docx"
          onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
        />
      </div>

      {/* Scoring Weights Section */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl">
              <SlidersHorizontal className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Scoring Weights
            </h3>
            <p className="text-slate-400">Customize AI analysis priorities</p>
          </div>
        </div>
        
        {/* Weight Controls */}
        <div className="space-y-6 max-h-80 overflow-y-auto pr-2">
          <WeightSlider 
            label="Skills Match" 
            value={weights.skills} 
            onChange={(e) => handleWeightChange('skills', parseInt(e.target.value, 10))} 
            onManualChange={(value) => handleWeightChange('skills', value)}
          />
          <WeightSlider 
            label="Experience Level" 
            value={weights.experience} 
            onChange={(e) => handleWeightChange('experience', parseInt(e.target.value, 10))} 
            onManualChange={(value) => handleWeightChange('experience', value)}
          />
          <WeightSlider 
            label="Education" 
            value={weights.education} 
            onChange={(e) => handleWeightChange('education', parseInt(e.target.value, 10))} 
            onManualChange={(value) => handleWeightChange('education', value)}
          />
        </div>
      </div>

      {/* Analysis Button */}
      <div className="relative z-10">
        <button
          onClick={onAnalyze}
          disabled={isLoading || !hasRequiredInputs}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-black py-6 px-8 rounded-2xl hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 disabled:from-slate-600 disabled:via-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed disabled:text-slate-400 transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl hover:shadow-cyan-500/30 disabled:shadow-none group overflow-hidden btn-ripple hover-lift text-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center gap-4">
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>AI Analyzing...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="h-6 w-6" />
                <span>Launch AI Analysis</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
