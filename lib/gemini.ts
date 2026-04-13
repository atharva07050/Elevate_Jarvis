import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResume(resumeText: string, jdText?: string) {
  const jdPrompt = jdText 
    ? `\nJob Description:\n${jdText}\n\nAlso compare the resume against the Job Description. Provide a "matchScore" (0-100) and a "jdKeywordsMissing" array.` 
    : '';

  const prompt = `
You are an expert technical recruiter. Analyze the following resume text.
Identify:
1. Missing skills (based on standard software engineering roles).
2. Weak wording or vague statements.
3. Actionable feedback (e.g., "Add projects / quantify achievements").${jdPrompt}

Format the output as a clean, structured JSON object with the following schema:
{
  "missingSkills": ["skill1", "skill2"],
  "weakWording": [
    { "original": "Did some coding", "suggestion": "Developed a REST API using Node.js" }
  ],
  "actionableFeedback": ["feedback1", "feedback2"]${jdText ? ',\n  "matchScore": 85,\n  "jdKeywordsMissing": ["keyword1", "keyword2"]' : ''}
}

Resume Text:
${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}

export async function generateCrashPlan(weaknesses: string, company?: string) {
  const companyPrompt = company 
    ? ` Tailor the plan specifically for ${company}'s interview process, focusing on their known interview patterns (e.g., Leadership Principles for Amazon, specific data structures for Google, etc.).` 
    : '';

  const prompt = `
You are an expert career coach. Generate a 7-Day Placement Crash Plan based on the user's weaknesses: "${weaknesses}".${companyPrompt}
Provide a focused, actionable plan for each day.

Format the output as a clean, structured JSON object with the following schema:
{
  "plan": [
    { "day": 1, "focus": "Aptitude", "tasks": ["Task 1", "Task 2"] },
    ... up to day 7
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
}

export async function sendMockInterviewMessage(history: {role: string, text: string}[], message: string) {
  const systemInstruction = `You are a strict but fair technical interviewer at a top tech company. 
You are conducting a mock interview. 
Ask one technical or behavioral question at a time. 
Wait for the candidate's response. 
Provide brief, constructive feedback on their response, then ask the next question.
Keep your responses concise and conversational.`;

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction,
      },
    });
    return response.text || "I'm sorry, could you repeat that?";
  } catch (error) {
    console.error("Error in mock interview:", error);
    throw error;
  }
}

export async function generateStarStory(scenario: string) {
  const prompt = `
You are an expert career coach and recruiter. The user wants to format a raw experience or scenario into a professional behavioral interview answer using the STAR (Situation, Task, Action, Result) method.

Raw Scenario: "${scenario}"

Enhance the story to sound professional, impactful, and metric-driven where possible.
Format the output as a clean, structured JSON object with the following schema:
{
  "situation": "Describe the context and background.",
  "task": "Describe the challenge or goal.",
  "action": "Detail the specific actions the user took.",
  "result": "Explain the positive outcome, quantifying if possible.",
  "tips": ["Tip to make this story better in an interview", "Another tip"]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating STAR story:", error);
    throw error;
  }
}

