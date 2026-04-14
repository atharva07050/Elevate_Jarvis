
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import axios from "axios";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const SARVAM_KEY = import.meta.env.VITE_SARVAM_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_KEY || "");
const groq = new Groq({ apiKey: GROQ_KEY || "", dangerouslyAllowBrowser: true });

const SYSTEM_PROMPT = `You are a specialized Placement Bot for Saarthi. 
Your goal is to help students with job-related queries, placement preparation, mock interviews, and resume building. 
If a user asks about anything unrelated to jobs, placements, or professional development (like movies, sports, or hobbies), 
politely inform them that you are a placement-focused assistant and cannot provide such information. 
Example of refusal: "I am your devoted placement assistant. I cannot assist with entertainment queries like movies; however, I can help you prepare for a technical interview today!"
Be professional, encouraging, and helpful.`;

const extractJSON = (text: string) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("No JSON found");
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Extraction failed. Raw text:", text);
    throw e;
  }
};

// Fallback executor for structured JSON tasks (Gemini -> Groq)
async function executeWithFallbackJSON(prompt: string) {
  // 1. Try Gemini
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return extractJSON(result.response.text());
  } catch (geminiError) {
    console.warn("Gemini JSON failed, falling back to Groq...", geminiError);
    
    // 2. Try Groq
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });
      return JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch (groqError) {
      console.error("Both Gemini and Groq JSON failed:", groqError);
      throw new Error("AI Services unavailable for structure generation.");
    }
  }
}

export async function analyzeResume(resumeText: string, jdText?: string) {
  if (!resumeText || resumeText.trim() === "Summary" || resumeText.length < 50) {
    throw new Error("Resume text is too incredibly short or invalid.");
  }

  const jdPrompt = jdText 
    ? `\nJob Description:\n${jdText}\n\nCompare the resume against this JD and include "jdKeywordsMissing" (array). Based on both general quality and JD match, provide an overall "score" (0-100).` 
    : `\nBased on general resume quality, provide an overall "score" (0-100).`;

  const prompt = `
Analyze this resume for technical roles. Return a structured JSON object ONLY.
If the overall score is poor (e.g. less than 75), provide "recommendedResources" (list of objects with "name" and "url") where the user can build a better customized resume (like Novoresume, FlowCV, Zety, Canva). Otherwise, return an empty array for recommendedResources.

Schema:
{
  "score": 0,
  "missingSkills": [],
  "weakWording": [{ "original": "", "suggestion": "" }],
  "actionableFeedback": [],
  "recommendedResources": [{"name": "Site Name", "url": "https://example.com"}]${jdText ? ',\n  "jdKeywordsMissing": []' : ''}
}${jdPrompt}

Resume Content:
${resumeText}
`;

  return executeWithFallbackJSON(prompt);
}

export async function generateCrashPlan(weaknesses: string, company?: string) {
  const companyContext = company ? ` Tailor the plan specifically for ${company}.` : "";
  const prompt = `Generate a 7-day crash plan for these weaknesses: ${weaknesses}.${companyContext} Return JSON only: { "plan": [{ "day": 1, "focus": "", "tasks": [] }] }`;
  return executeWithFallbackJSON(prompt);
}

export async function generateStarStory(scenario: string) {
  const prompt = `Convert this to a STAR story: ${scenario}. Return strict JSON only compliant with this schema: { "situation": "", "task": "", "action": "", "result": "", "tips": [] }`;
  return executeWithFallbackJSON(prompt);
}

export async function sendMockInterviewMessage(
  history: {role: string, text: string}[], 
  message: string,
  targetCompany?: string,
  targetRole?: string
) {
  let contextStr = "";
  if (targetCompany || targetRole) {
    contextStr = ` The candidate is preparing for ${targetRole || 'their target role'} at ${targetCompany || 'their target company'}.`;
  }

  const systemInstruction = SYSTEM_PROMPT + " You are currently in a Mock Interview." + contextStr + " Ask ONE specific question at a time.";
  
  // 1. Try Gemini
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (geminiError) {
    console.warn("Gemini Mock Interview failed, falling back to Groq...", geminiError);
    
    // 2. Try Groq
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemInstruction },
          ...history.map(h => ({ role: h.role === "user" ? "user" as const : "assistant" as const, content: h.text })),
          { role: "user", content: message }
        ],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0]?.message?.content || "I couldn't process that.";
    } catch (groqError) {
      console.warn("Groq Mock Interview failed, falling back to Sarvam...", groqError);
      
      // 3. Try Sarvam
      try {
        const response = await axios.post('https://api.sarvam.ai/chat/completions', {
          model: "sarvam-1",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: message }
          ]
        }, {
          headers: { 'api-subscription-key': SARVAM_KEY }
        });
        return response.data.choices[0].message.content;
      } catch (sarvamError) {
        console.error("All AI services failed for Mock Interview.");
        return "I apologize, my communication system is fully glitchy right now. Please try again later.";
      }
    }
  }
}

/**
 * AI Recruiter Evaluation (Aastha's Feature)
 */
export async function generateEvaluation(data: any) {
  const prompt = `
You are an expert AI Tech Recruiter.
Analyze the following student performance data and generate a professional, structured recruiter evaluation report.

Student Data:
${JSON.stringify(data, null, 2)}

Provide your output as a valid JSON object matching the following structure exactly:
{
  "name": "string",
  "role": "string",
  "subtitle": "Placement Readiness Assessment",
  "tagline": "This report provides an AI-driven evaluation of the candidate's placement readiness.",
  "skillScore": number (0-100),
  "communicationScore": number (0-100),
  "problemSolvingScore": number (0-100),
  "scoreInterpretations": {
    "skill": "string",
    "communication": "string",
    "problemSolving": "string"
  },
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvementSuggestions": ["string"],
  "detailedAnalysis": {
    "technical": "string",
    "communication": "string",
    "problemSolving": "string"
  },
  "recommendations": {
    "shortTerm": ["string", "string"],
    "longTerm": ["string"]
  },
  "hiringStatus": "Ready for Placement" | "Needs Improvement" | "High Risk Candidate",
  "hiringDecisionJustification": "string"
}
`;

  try {
    const json = await executeWithFallbackJSON(prompt);
    return json;
  } catch (err) {
    console.error("AI Evaluation generation failed.");
    throw err;
  }
}

/**
 * AI Mentor Plan (Collaborative Enhancement)
 */
export async function generateMentorPlan(weakTopicsString: string) {
  const prompt = `
You are an intelligent career assistant integrated into Saarthi AI.
Analyze the student's weak areas and recommend high-quality learning resources and a study path.

Weak Topics: "${weakTopicsString}"

Return a valid JSON array matching this exact schema:
[
  {
    "topic": "string",
    "explanation": "string (Why is this important for placements?)",
    "keyConcepts": ["string", "string"],
    "youtubeLink": "string (A valid search link for this topic on YouTube)",
    "notes": ["string", "string (Short revision points)"],
    "practiceQuestions": ["string", "string (Specific interview questions to solve)"]
  }
]
`;

  try {
    const json = await executeWithFallbackJSON(prompt);
    return Array.isArray(json) ? json : [json];
  } catch (err) {
    console.error("Mentor Plan generation failed.");
    const topics = weakTopicsString.split(',').map(s => s.trim()).filter(Boolean);
    return topics.map(topic => ({
      topic,
      explanation: `Mastering ${topic} is crucial for recruitment technical rounds.`,
      keyConcepts: ["Fundamental theory", "Common applications"],
      youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
      notes: ["Review core syntax", "Understand time complexity"],
      practiceQuestions: [`Implement basic ${topic} algorithm.`]
    }));
  }
}

/**
 * Generic chat message sender with fallback (Agnostic of feature)
 */
export async function sendChatMessage(
  history: { role: "user" | "model", text: string }[], 
  message: string
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (err) {
    console.warn("Gemini Chat failed, falling back to Groq...", err);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          ...history.map(m => ({ role: m.role === "model" ? "assistant" as const : "user" as const, content: m.text })),
          { role: "user", content: message }
        ],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0]?.message?.content || "";
    } catch (groqErr) {
      console.error("Chat services failed:", groqErr);
      throw new Error("AI Chat services unavailable.");
    }
  }
}
