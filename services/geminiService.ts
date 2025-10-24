
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Weights } from '../types';

// IMPORTANT: Add your own Gemini API key in an environment variable for this to work.
// For example, in a local environment, you might create a .env.local file:
// API_KEY=YOUR_GEMINI_API_KEY
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey });


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    candidateName: {
      type: Type.STRING,
      description: "The full name of the candidate found in the resume.",
    },
    overallScore: {
      type: Type.NUMBER,
      description: "A number from 0 to 100 representing the overall compatibility, considering the provided scoring weights.",
    },
    summary: {
      type: Type.STRING,
      description: "A one-paragraph summary explaining the score and the candidate's fit for the role.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of key strengths and matched skills.",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of potential weaknesses or areas where the resume doesn't align with the job description.",
    },
    experienceAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        details: { type: Type.STRING },
      },
      description: "Brief analysis of the candidate's work experience and its score.",
    },
    skillsAnalysis: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          details: { type: Type.STRING },
        },
        description: "Brief analysis of the candidate's skills and its score.",
    },
    educationAnalysis: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          details: { type: Type.STRING },
        },
        description: "Brief analysis of the candidate's education and its score.",
    },
  },
  required: ["candidateName", "overallScore", "summary", "strengths", "weaknesses", "experienceAnalysis", "skillsAnalysis", "educationAnalysis"],
};


export const analyzeResume = async (
    jobDescription: string,
    resumeText: string,
    weights: Weights
): Promise<AnalysisResult> => {
    
    const prompt = `
    Analyze the following resume against the provided job description. Act as an expert HR recruitment assistant. Your task is to provide a detailed, unbiased analysis.

    **Job Description:**
    ---
    ${jobDescription}
    ---

    **Resume Text:**
    ---
    ${resumeText}
    ---

    **Scoring Weights:**
    - Skills: ${weights.skills}%
    - Experience: ${weights.experience}%
    - Education: ${weights.education}%

    Based on this information, provide a response in the specified JSON format.
    The 'overallScore' must be a weighted average of the individual scores for experience, skills, and education, based on the provided weights.
    The candidate's name should be extracted accurately from the resume text.
    Strengths should highlight direct matches with the job description.
    Weaknesses should identify missing key requirements.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        // Basic validation
        if (!result.candidateName || typeof result.overallScore !== 'number') {
            throw new Error("Invalid response format from API.");
        }

        return result as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from the AI. The response may be blocked or the API key may be invalid.");
    }
};
