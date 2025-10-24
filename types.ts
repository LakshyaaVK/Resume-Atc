export interface Weights {
  skills: number;
  experience: number;
  education: number;
}

interface AnalysisSection {
  score: number;
  details: string;
}

export interface AnalysisResult {
  candidateName: string;
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  experienceAnalysis: AnalysisSection;
  skillsAnalysis: AnalysisSection;
  educationAnalysis: AnalysisSection;
}

export interface StoredAnalysis extends AnalysisResult {
  id: string;
  timestamp: string;
  fileName: string;
}
