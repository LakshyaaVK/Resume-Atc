import { supabase, AnalysisResult, UserProfile } from './supabase';

// User Profile Functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const createUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
};

// Analysis Results Functions
export const saveAnalysisResult = async (result: Omit<AnalysisResult, 'id' | 'created_at' | 'updated_at'>): Promise<AnalysisResult | null> => {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert(result)
    .select()
    .single();

  if (error) {
    console.error('Error saving analysis result:', error);
    return null;
  }

  return data;
};

export const getUserAnalysisResults = async (userId: string, limit: number = 50): Promise<AnalysisResult[]> => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching analysis results:', error);
    return [];
  }

  return data || [];
};

export const getAnalysisResult = async (resultId: string, userId: string): Promise<AnalysisResult | null> => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('id', resultId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching analysis result:', error);
    return null;
  }

  return data;
};

export const updateAnalysisResult = async (resultId: string, userId: string, updates: Partial<AnalysisResult>): Promise<AnalysisResult | null> => {
  const { data, error } = await supabase
    .from('analysis_results')
    .update(updates)
    .eq('id', resultId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating analysis result:', error);
    return null;
  }

  return data;
};

export const deleteAnalysisResult = async (resultId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('analysis_results')
    .delete()
    .eq('id', resultId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting analysis result:', error);
    return false;
  }

  return true;
};

// Statistics Functions
export const getUserStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('overall_score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  const results = data || [];
  const totalAnalyses = results.length;
  const averageScore = totalAnalyses > 0 
    ? results.reduce((sum, result) => sum + result.overall_score, 0) / totalAnalyses 
    : 0;
  
  const recentAnalyses = results.slice(0, 5);
  const scoreTrend = results.slice(0, 10).map(r => r.overall_score);

  return {
    totalAnalyses,
    averageScore: Math.round(averageScore),
    recentAnalyses,
    scoreTrend,
  };
};
