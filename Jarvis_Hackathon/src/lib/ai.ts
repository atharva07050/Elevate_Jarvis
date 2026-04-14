
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

export async function getChatResponse(message: string, history: { role: 'user' | 'assistant', content: string }[]) {
  // 1. Try Gemini
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT });
    const contents = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const result = await model.generateContent({ contents });
    return result.response.text();
  } catch (geminiError) {
    console.warn("Gemini Chat failed, falling back to Groq LLaMA...", geminiError);
    
    // 2. Try Groq (LLaMA 3)
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.map(h => ({ role: h.role === "user" ? "user" as const : "assistant" as const, content: h.content })),
          { role: "user", content: message }
        ],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0]?.message?.content || "I couldn't process that.";
    } catch (groqError) {
      console.warn("Groq Chat failed, falling back to Sarvam...", groqError);
      
      // 3. Try Sarvam
      try {
        const response = await axios.post('https://api.sarvam.ai/chat/completions', {
          model: "sarvam-1",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message } // Sarvam prefers shorter histories
          ]
        }, {
          headers: { 'api-subscription-key': SARVAM_KEY }
        });
        return response.data.choices[0].message.content;
      } catch (sarvamError) {
        console.error("All Chat services failed.");
        return "I am currently experiencing massive technical difficulties across all my brains. Please try again in a moment!";
      }
    }
  }
}
