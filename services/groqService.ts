import type { AnalysisResult, Weights } from '../types';

// IMPORTANT: Add your own Groq API key in an environment variable for this to work.
// For example, in a local environment, you might create a .env file:
// GROQ_API_KEY=YOUR_GROQ_API_KEY
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set. Please add your Groq API key to the .env file.");
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Using llama-3.3-70b-versatile - a powerful model available on Groq
const MODEL = 'llama-3.3-70b-versatile';

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

    Based on this information, provide your response in a STRICT JSON format with the following structure:
    {
        "candidateName": "The full name of the candidate found in the resume",
        "overallScore": <A number from 0 to 100 representing the overall compatibility, considering the provided scoring weights>,
        "summary": "A one-paragraph summary explaining the score and the candidate's fit for the role",
        "strengths": ["List", "of", "key", "strengths", "and", "matched", "skills"],
        "weaknesses": ["List", "of", "potential", "weaknesses", "or", "missing", "requirements"],
        "experienceAnalysis": {
            "score": <number 0-100>,
            "details": "Brief analysis of the candidate's work experience"
        },
        "skillsAnalysis": {
            "score": <number 0-100>,
            "details": "Brief analysis of the candidate's skills"
        },
        "educationAnalysis": {
            "score": <number 0-100>,
            "details": "Brief analysis of the candidate's education"
        }
    }

    The 'overallScore' must be a weighted average of the individual scores for experience, skills, and education, based on the provided weights.
    The candidate's name should be extracted accurately from the resume text.
    Strengths should highlight direct matches with the job description.
    Weaknesses should identify missing key requirements.
    
    IMPORTANT: Return ONLY valid JSON, no additional text or explanation before or after the JSON object.
    `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert HR recruitment assistant that analyzes resumes. You always respond with valid JSON only, no additional text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.2,
                max_tokens: 2048,
                response_format: { type: 'json_object' }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Groq API error:", errorData);
            throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const jsonText = data.choices[0]?.message?.content?.trim();

        if (!jsonText) {
            throw new Error("Empty response from Groq API.");
        }

        const result = JSON.parse(jsonText);

        // Basic validation
        if (!result.candidateName || typeof result.overallScore !== 'number') {
            throw new Error("Invalid response format from API.");
        }

        return result as AnalysisResult;

    } catch (error) {
        console.error("Error calling Groq API:", error);
        throw new Error("Failed to get analysis from the AI. The response may be blocked or the API key may be invalid.");
    }
};
