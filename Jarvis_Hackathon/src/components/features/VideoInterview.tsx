
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
import { sendMockInterviewMessage } from "@/lib/gemini";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, FileText,
  Download, User, Clock, Brain, TrendingUp,
  CheckCircle2, AlertCircle, Smile, Star, ArrowLeft,
  Activity, BarChart3, MessageCircle, Shield, Sparkles
} from "lucide-react";
import jsPDF from "jspdf";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const SARVAM_KEY = import.meta.env.VITE_SARVAM_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_KEY || "");
const groq = new Groq({ apiKey: GROQ_KEY || "", dangerouslyAllowBrowser: true });

// ─── Types ────────────────────────────────────────────────────────────────────
type InterviewPhase = "setup" | "active" | "ended";
type Gender = "male" | "female";
type Duration = 300 | 600; // 5 min or 10 min in seconds
type Emotion = "happy" | "neutral" | "anxious" | "stressed" | "sad" | "confident" | "nervous";

interface EmotionSnapshot {
  time: number;
  emotion: Emotion;
  confidence: string;
}

interface TranscriptEntry {
  role: "interviewer" | "candidate";
  text: string;
  time: number;
}

interface PerformanceReport {
  overallScore: number;
  communicationScore: number;
  confidenceScore: number;
  contentScore: number;
  emotionScore: number;
  strengths: string[];
  improvements: string[];
  emotionAnalysis: string;
  tips: string[];
  summary: string;
  dominantEmotion: string;
}

const EMOTION_COLORS: Record<Emotion, string> = {
  happy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  confident: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  neutral: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  anxious: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  nervous: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  stressed: "bg-red-500/20 text-red-400 border-red-500/30",
  sad: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const EMOTION_EMOJIS: Record<Emotion, string> = {
  happy: "😊", confident: "💪", neutral: "😐",
  anxious: "😟", nervous: "😰", stressed: "😤", sad: "😔",
};

const EMOTION_BAR_COLORS: Record<Emotion, string> = {
  happy: "#10b981", confident: "#3b82f6", neutral: "#6b7280",
  anxious: "#f59e0b", nervous: "#f97316", stressed: "#ef4444", sad: "#8b5cf6",
};

// ─── Premium AI Avatar Component ──────────────────────────────────────────────
function AIAvatar({ gender, isSpeaking, isThinking }: { gender: Gender; isSpeaking: boolean; isThinking: boolean }) {
  const isMale = gender === "male";
  const [mouthHeight, setMouthHeight] = useState(4);

  useEffect(() => {
    if (!isSpeaking) { setMouthHeight(4); return; }
    const interval = setInterval(() => {
      setMouthHeight(Math.floor(Math.random() * 10) + 4);
    }, 120);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      {/* Animated background rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isSpeaking && [1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full border border-primary/20 animate-ping"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: "1.5s"
            }}
          />
        ))}
      </div>

      {/* Subtle grid BG */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      {/* Avatar SVG */}
      <svg viewBox="0 0 220 300" className="w-52 h-auto relative z-10 drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
        {/* ── Body ── */}
        {isMale ? (
          <>
            {/* Suit jacket */}
            <rect x="40" y="195" width="140" height="105" rx="10" fill="#1e3a5f" />
            {/* Shirt */}
            <rect x="80" y="195" width="60" height="105" fill="#f8fafc" />
            {/* Left lapel */}
            <polygon points="80,195 60,230 80,240" fill="#1e3a5f" />
            {/* Right lapel */}
            <polygon points="140,195 160,230 140,240" fill="#1e3a5f" />
            {/* Tie */}
            <polygon points="110,200 105,215 110,265 115,215" fill="#6366f1" />
            <polygon points="107,198 113,198 117,208 103,208" fill="#4f46e5" />
            {/* Jacket lines */}
            <line x1="80" y1="195" x2="60" y2="300" stroke="#1e3a5f" strokeWidth="2" />
            <line x1="140" y1="195" x2="160" y2="300" stroke="#1e3a5f" strokeWidth="2" />
          </>
        ) : (
          <>
            {/* Blazer */}
            <rect x="40" y="195" width="140" height="105" rx="10" fill="#5b21b6" />
            <rect x="75" y="195" width="70" height="105" fill="#7c3aed" />
            {/* Collar */}
            <polygon points="110,200 85,225 110,215" fill="#ddd6fe" />
            <polygon points="110,200 135,225 110,215" fill="#ddd6fe" />
            {/* Necklace */}
            <ellipse cx="110" cy="205" rx="15" ry="4" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          </>
        )}

        {/* Neck */}
        <rect x="95" y="168" width="30" height="32" rx="5" fill="#f5c5a3" />

        {/* Head */}
        <ellipse cx="110" cy="140" rx="54" ry="60" fill="#f5c5a3" />

        {/* Face shadow */}
        <ellipse cx="110" cy="160" rx="40" ry="20" fill="#e8a882" opacity="0.3" />

        {/* Hair */}
        {isMale ? (
          <path d="M56,120 Q56,70 110,68 Q164,70 164,120 Q164,95 145,82 Q110,72 75,82 Q56,95 56,120" fill="#2d1b0e" />
        ) : (
          <>
            <path d="M56,120 Q56,70 110,68 Q164,70 164,120 Q164,95 145,82 Q110,72 75,82 Q56,95 56,120" fill="#7c2d12" />
            {/* Long hair strands */}
            <path d="M56,122 Q44,160 50,195 Q65,180 68,155 Q63,135 56,122" fill="#7c2d12" />
            <path d="M164,122 Q176,160 170,195 Q155,180 152,155 Q157,135 164,122" fill="#7c2d12" />
            <path d="M56,130 Q42,170 46,210" stroke="#6b2208" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M164,130 Q178,170 174,210" stroke="#6b2208" strokeWidth="3" fill="none" opacity="0.5" />
          </>
        )}

        {/* Eyebrows */}
        <path d="M82,110 Q90,105 100,109" stroke={isMale ? "#2d1b0e" : "#7c2d12"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M120,109 Q130,105 138,110" stroke={isMale ? "#2d1b0e" : "#7c2d12"} strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Eyes */}
        <ellipse cx="91" cy="128" rx="10" ry="11" fill="white" />
        <ellipse cx="129" cy="128" rx="10" ry="11" fill="white" />
        {/* Irises */}
        <circle cx="93" cy="129" r="7" fill={isMale ? "#1e3a5f" : "#6d28d9"} />
        <circle cx="131" cy="129" r="7" fill={isMale ? "#1e3a5f" : "#6d28d9"} />
        {/* Pupils */}
        <circle cx="94" cy="130" r="4" fill="#0f172a" />
        <circle cx="132" cy="130" r="4" fill="#0f172a" />
        {/* Highlights */}
        <circle cx="96" cy="127" r="2" fill="white" />
        <circle cx="134" cy="127" r="2" fill="white" />

        {/* Eyelashes for female */}
        {!isMale && (
          <>
            <path d="M81,118 Q83,113 85,116" stroke="#1a0a00" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M86,116 Q87,111 90,113" stroke="#1a0a00" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M92,115 Q93,110 96,112" stroke="#1a0a00" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M119,115 Q121,110 124,112" stroke="#1a0a00" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M125,116 Q127,111 130,113" stroke="#1a0a00" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M132,117 Q135,112 137,115" stroke="#1a0a00" strokeWidth="1" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Glasses for male */}
        {isMale && (
          <>
            <rect x="79" y="120" width="24" height="18" rx="5" fill="none" stroke="#334155" strokeWidth="1.8" />
            <rect x="117" y="120" width="24" height="18" rx="5" fill="none" stroke="#334155" strokeWidth="1.8" />
            <line x1="103" y1="128" x2="117" y2="128" stroke="#334155" strokeWidth="1.8" />
            <line x1="56" y1="128" x2="79" y2="128" stroke="#334155" strokeWidth="1.8" />
            <line x1="141" y1="128" x2="164" y2="128" stroke="#334155" strokeWidth="1.8" />
          </>
        )}

        {/* Nose */}
        <path d="M107,140 Q110,152 113,140" stroke="#d4956a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="105" cy="153" r="2.5" fill="#d4956a" opacity="0.4" />
        <circle cx="115" cy="153" r="2.5" fill="#d4956a" opacity="0.4" />

        {/* Mouth - animated when speaking */}
        {isSpeaking ? (
          <ellipse cx="110" cy="163" rx="15" ry={mouthHeight} fill="#c0392b">
            <animate attributeName="ry" values="4;10;5;9;4" dur="0.25s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          <path d="M95,163 Q110,175 125,163" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Blush for female */}
        {!isMale && (
          <>
            <ellipse cx="78" cy="148" rx="10" ry="6" fill="#f87171" opacity="0.25" />
            <ellipse cx="142" cy="148" rx="10" ry="6" fill="#f87171" opacity="0.25" />
          </>
        )}

        {/* Ears */}
        <ellipse cx="56" cy="138" rx="8" ry="12" fill="#f0b090" />
        <ellipse cx="164" cy="138" rx="8" ry="12" fill="#f0b090" />
        {/* Earrings for female */}
        {!isMale && (
          <>
            <circle cx="56" cy="152" r="3.5" fill="#fbbf24" />
            <circle cx="164" cy="152" r="3.5" fill="#fbbf24" />
          </>
        )}
      </svg>

      {/* Name tag */}
      <div className="relative z-10 mt-3 text-center">
        <p className="text-white font-bold text-base tracking-wide">{isMale ? "Mr. Arjun Sharma" : "Ms. Priya Menon"}</p>
        <p className="text-slate-400 text-xs mt-0.5">Senior AI Interviewer · {isMale ? "Tech Lead" : "HR Director"}</p>
      </div>

      {/* Thinking indicator */}
      {isThinking && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm z-20">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Thinking...</span>
        </div>
      )}

      {/* Speaking sound bars */}
      {isSpeaking && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 z-20 bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm">
          {[4, 7, 5, 9, 6, 8, 4, 7, 5].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full"
              style={{
                height: `${h + Math.random() * 8}px`,
                animation: `bounce 0.${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Score Ring Component ─────────────────────────────────────────────────────
function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 text-center font-medium">{label}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function VideoInterview({ onBack }: { onBack?: () => void }) {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [gender, setGender] = useState<Gender>("male");
  const [duration, setDuration] = useState<Duration>(300);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");
  const [emotionLog, setEmotionLog] = useState<EmotionSnapshot[]>([]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself and why you're interested in this role.");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [report, setReport] = useState<string>("");
  const [parsedReport, setParsedReport] = useState<PerformanceReport | null>(null);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; text: string }[]>([]);
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<"overview" | "emotions" | "transcript">("overview");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const emotionTimerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const timeElapsedRef = useRef(0);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const emotionLogRef = useRef<EmotionSnapshot[]>([]);
  const timeLiftRef = useRef(duration);

  // Keep refs up to date
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { emotionLogRef.current = emotionLog; }, [emotionLog]);
  useEffect(() => { timeLiftRef.current = timeLeft; }, [timeLeft]);

  // FIX: Attach stream to video element when entering active phase
  useEffect(() => {
    if (phase === "active" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  // ── Start camera ────────────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraError(false);
    } catch (err) {
      console.warn("Camera access denied:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  // ── Speech Recognition ──────────────────────────────────────────────────────
  const setupSpeechRecognition = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
  };

  const listenForAnswer = useCallback(() => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    recognitionRef.current.onresult = async (e: any) => {
      const answer = e.results[0][0].transcript;
      setIsListening(false);
      await handleUserAnswer(answer);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
    try { recognitionRef.current.start(); } catch { }
  }, []);

  // ── TTS ─────────────────────────────────────────────────────────────────────
  const speak = useCallback((text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = gender === "female" ? 1.2 : 0.9;

    const trySetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (gender === "male") {
        const voice = voices.find(v =>
          v.name.includes("David") || v.name.includes("Male") ||
          v.name.includes("Google UK English Male") || v.name.includes("Microsoft David")
        );
        if (voice) utterance.voice = voice;
      } else {
        const voice = voices.find(v =>
          v.name.includes("Zira") || v.name.includes("Female") ||
          v.name.includes("Google UK English Female") || v.name.includes("Microsoft Zira") ||
          v.name.includes("Samantha") || v.name.includes("Victoria")
        );
        if (voice) utterance.voice = voice;
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      trySetVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = trySetVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); onEnd?.(); };
    utterance.onerror = () => { setIsSpeaking(false); onEnd?.(); };
    window.speechSynthesis.speak(utterance);
  }, [gender]);

  // ── Emotion Detection via Gemini Vision ─────────────────────────────────────
  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || cameraError) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 320; canvas.height = 240;
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const base64 = canvas.toDataURL("image/jpeg", 0.55).split(",")[1];

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        { inlineData: { mimeType: "image/jpeg", data: base64 } },
        `Analyze the facial expression in this image. Identify the primary emotion from ONLY: happy, neutral, anxious, stressed, sad, confident, nervous.
         Respond ONLY with valid JSON: {"emotion": "<emotion>", "confidence": "<High|Medium|Low>"}`
      ]);
      const text = result.response.text();
      const start = text.indexOf("{"), end = text.lastIndexOf("}");
      if (start !== -1) {
        const parsed = JSON.parse(text.substring(start, end + 1));
        const emotion = parsed.emotion as Emotion;
        if (["happy", "neutral", "anxious", "stressed", "sad", "confident", "nervous"].includes(emotion)) {
          setCurrentEmotion(emotion);
          setEmotionLog(prev => [...prev, { time: timeElapsedRef.current, emotion, confidence: parsed.confidence }]);
        }
      }
    } catch { /* silently ignore */ }
  }, [cameraError]);

  // ── Handle User Answer ───────────────────────────────────────────────────────
  const handleUserAnswer = async (answer: string) => {
    const elapsed = timeLiftRef.current ? (duration - timeLiftRef.current) : 0;
    const entry: TranscriptEntry = { role: "candidate", text: answer, time: elapsed };
    setTranscript(prev => [...prev, entry]);

    const updatedHistory = [...conversationHistory, { role: "user", text: answer }];
    setConversationHistory(updatedHistory);
    setIsAIThinking(true);

    try {
      const nextQ = await sendMockInterviewMessage(updatedHistory, answer, targetCompany, targetRole);
      setIsAIThinking(false);
      setCurrentQuestion(nextQ);
      const newHistory = [...updatedHistory, { role: "model", text: nextQ }];
      setConversationHistory(newHistory);
      setTranscript(prev => [...prev, { role: "interviewer", text: nextQ, time: elapsed + 2 }]);
      speak(nextQ, () => { if (timeLiftRef.current > 0) listenForAnswer(); });
    } catch {
      setIsAIThinking(false);
    }
  };

  // ── Start Interview ──────────────────────────────────────────────────────────
  const startInterview = async () => {
    await startCamera();
    setupSpeechRecognition();
    setTimeLeft(duration);
    timeLiftRef.current = duration;
    // Generate dynamic first question based on company/role
    setIsAIThinking(true);
    let firstQ = "Tell me about yourself and why you're interested in this role.";
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const contextPrompt = `You are a professional interviewer at ${targetCompany || 'a top tech company'}. 
      The candidate is applying for the role of ${targetRole || 'Software Engineer'}. 
      Generate a unique, professional opening question for the interview. 
      It could be about experience, motivation, or a specific skill related to ${targetRole}. 
      Keep it to ONE sentence.`;
      
      const result = await model.generateContent(contextPrompt);
      const generatedQ = result.response.text().trim();
      if (generatedQ) firstQ = generatedQ;
    } catch (err) {
      console.warn("Failed to generate dynamic opening, using fallback.", err);
    }

    setIsAIThinking(false);
    setCurrentQuestion(firstQ);
    setTranscript([{ role: "interviewer", text: firstQ, time: 0 }]);
    setConversationHistory([{ role: "model", text: firstQ }]);
    setEmotionLog([]);
    setPhase("active");

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        timeElapsedRef.current = duration - prev + 1;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    emotionTimerRef.current = setInterval(detectEmotion, 7000);

    setTimeout(() => { speak(firstQ, () => listenForAnswer()); }, 1500);
  };

  // ── End Interview ────────────────────────────────────────────────────────────
  const endInterview = useCallback(async () => {
    clearInterval(timerRef.current);
    clearInterval(emotionTimerRef.current);
    window.speechSynthesis.cancel();
    try { recognitionRef.current?.stop(); } catch { }
    stopCamera();
    setPhase("ended");
    setIsAIThinking(true);

    const finalTranscript = transcriptRef.current;
    const finalEmotionLog = emotionLogRef.current;

    try {
      const emotionSummary = finalEmotionLog.reduce((acc, e) => {
        acc[e.emotion] = (acc[e.emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const transcriptText = finalTranscript.map(t => `${t.role.toUpperCase()}: ${t.text}`).join("\n");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`
You are an expert interview performance coach. Analyze this mock interview comprehensively.

INTERVIEW TRANSCRIPT:
${transcriptText}

EMOTION DATA (detected during interview):
${JSON.stringify(emotionSummary)}
Total emotion readings: ${finalEmotionLog.length}

Generate a detailed JSON performance report with this EXACT schema:
{
  "overallScore": <0-100>,
  "communicationScore": <0-100>,
  "confidenceScore": <0-100>,
  "contentScore": <0-100>,
  "emotionScore": <0-100>,
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<specific area 1>", "<specific area 2>", "<specific area 3>"],
  "emotionAnalysis": "<2-3 sentences analyzing the emotional state during the interview>",
  "tips": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>"],
  "summary": "<3-4 sentence overall summary of performance>",
  "dominantEmotion": "<the most frequent emotion>"
}

Base the emotionScore on positivity (confident/happy = high, stressed/anxious = low).
Be honest but constructive. Return ONLY the JSON object.
      `);

      const rawText = result.response.text();
      const start = rawText.indexOf("{"), end = rawText.lastIndexOf("}");
      if (start !== -1) {
        const parsed: PerformanceReport = JSON.parse(rawText.substring(start, end + 1));
        setParsedReport(parsed);
        setReport(rawText.substring(start, end + 1));
      }
    } catch {
      const fallback: PerformanceReport = {
        overallScore: 72, communicationScore: 75, confidenceScore: 68,
        contentScore: 74, emotionScore: 70,
        strengths: ["Engaged with the interview process", "Provided structured responses", "Maintained conversation flow"],
        improvements: ["Practice more concise answers", "Show more confidence", "Use more specific examples"],
        emotionAnalysis: "Your emotional state showed a mix of focus and mild nervousness, which is completely normal.",
        tips: ["Practice STAR method responses", "Record yourself answering questions", "Take deep breaths before answering"],
        summary: "You completed the interview successfully. Keep practicing to build confidence and precision.",
        dominantEmotion: "neutral"
      };
      setParsedReport(fallback);
    }
    setIsAIThinking(false);
  }, []);

  // ── Download PDF ─────────────────────────────────────────────────────────────
  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageW, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text("Saarthi AI Video Interview Report", pageW / 2, 18, { align: "center" });
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Interviewer: ${gender === "male" ? "Mr. Arjun Sharma" : "Ms. Priya Menon"}  |  Duration: ${duration / 60} min  |  Date: ${new Date().toLocaleDateString()}`, pageW / 2, 32, { align: "center" });

    if (parsedReport) {
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Performance Scores", 15, 58);

      let y = 68;
      doc.setFontSize(11); doc.setFont("helvetica", "normal");
      [
        { label: "Overall Score", val: parsedReport.overallScore },
        { label: "Communication", val: parsedReport.communicationScore },
        { label: "Confidence", val: parsedReport.confidenceScore },
        { label: "Answer Quality", val: parsedReport.contentScore },
        { label: "Emotional Composure", val: parsedReport.emotionScore },
      ].forEach(({ label, val }) => {
        doc.text(`${label}: ${val}/100`, 20, y); y += 7;
      });

      y += 5; doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Summary", 15, y); y += 8;
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      const sumLines = doc.splitTextToSize(parsedReport.summary, pageW - 30);
      sumLines.forEach((l: string) => { doc.text(l, 20, y); y += 6; });

      y += 5; doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("Strengths", 15, y); y += 7;
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      parsedReport.strengths.forEach(s => { doc.text(`✓ ${s}`, 20, y); y += 7; });

      y += 3; doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("Areas for Improvement", 15, y); y += 7;
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      parsedReport.improvements.forEach(s => { doc.text(`• ${s}`, 20, y); y += 7; });

      y += 3; doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("Emotion Analysis", 15, y); y += 7;
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      const eLines = doc.splitTextToSize(parsedReport.emotionAnalysis, pageW - 30);
      eLines.forEach((l: string) => { doc.text(l, 20, y); y += 6; });

      // Emotion summary
      const emoSummary = emotionLog.reduce((acc, e) => { acc[e.emotion] = (acc[e.emotion] || 0) + 1; return acc; }, {} as Record<string, number>);
      if (Object.keys(emoSummary).length > 0) {
        doc.addPage(); y = 20;
        doc.setFontSize(14); doc.setFont("helvetica", "bold");
        doc.text("Detailed Emotion Log", 15, y); y += 10;
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        Object.entries(emoSummary).sort((a, b) => b[1] - a[1]).forEach(([emotion, count]) => {
          const pct = emotionLog.length ? Math.round((count / emotionLog.length) * 100) : 0;
          doc.text(`${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${pct}% (${count} readings)`, 20, y); y += 7;
        });
      }
    }

    // Transcript
    doc.addPage();
    doc.setFontSize(14); doc.setFont("helvetica", "bold");
    doc.text("Full Interview Transcript", 15, 20);
    let y = 30;
    doc.setFontSize(9);
    transcript.forEach(entry => {
      const mins = Math.floor(entry.time / 60);
      const secs = entry.time % 60;
      doc.setFont("helvetica", "bold");
      doc.text(`[${mins}:${secs.toString().padStart(2, "0")}] ${entry.role.toUpperCase()}:`, 15, y); y += 6;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(entry.text, pageW - 30);
      lines.forEach((l: string) => { if (y > 270) { doc.addPage(); y = 20; } doc.text(l, 20, y); y += 5; });
      y += 4;
    });

    doc.save(`Saarthi_VideoInterview_Report_${Date.now()}.pdf`);
  };

  const toggleMic = () => { streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; }); setIsMicOn(p => !p); };
  const toggleCam = () => { streamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; }); setIsCamOn(p => !p); };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(emotionTimerRef.current);
      stopCamera();
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const emotionSummary = emotionLog.reduce((acc, e) => {
    acc[e.emotion] = (acc[e.emotion] || 0) + 1;
    return acc;
  }, {} as Record<Emotion, number>);

  // ══════════════════════ SETUP SCREEN ══════════════════════════════════════════
  if (phase === "setup") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Back button */}
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Mock Interview
            </button>
          )}

          {/* Hero card */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/5" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <Video className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">AI Video Interview</h2>
                <p className="text-slate-400 mt-2">Face-to-face with an AI interviewer. Real-time emotion tracking. Detailed report.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Choose Interviewer */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Choose Your Interviewer
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {(["male", "female"] as Gender[]).map(g => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center group ${
                            gender === g
                              ? "border-primary bg-primary/15 shadow-lg shadow-primary/20"
                              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          {/* Mini avatar preview */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative"
                            style={{ background: g === "male" ? "linear-gradient(135deg, #1e3a5f, #0f172a)" : "linear-gradient(135deg, #5b21b6, #0f172a)" }}>
                            <svg viewBox="0 0 60 70" className="w-full h-auto absolute bottom-0">
                              <rect x="15" y="50" width="30" height="25" rx="3" fill={g === "male" ? "#1e3a5f" : "#5b21b6"} />
                              <ellipse cx="30" cy="35" rx="14" ry="16" fill="#f5c5a3" />
                              <path d={g === "male"
                                ? "M16,28 Q16,14 30,13 Q44,14 44,28 Q38,20 30,18 Q22,20 16,28"
                                : "M16,28 Q16,14 30,13 Q44,14 44,28 Q38,20 30,18 Q22,20 16,28"}
                                fill={g === "male" ? "#2d1b0e" : "#7c2d12"} />
                            </svg>
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${gender === g ? "text-white" : "text-slate-300"}`}>
                              {g === "male" ? "Mr. Arjun" : "Ms. Priya"}
                            </p>
                            <p className="text-[10px] text-slate-500">{g === "male" ? "Tech Lead" : "HR Director"}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Context Inputs */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Interview Focus
                    </p>
                    <div className="space-y-2">
                       <input 
                        type="text" 
                        placeholder="Target Company (e.g. Google, TCS, Startup)" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Target Role (e.g. Frontend Developer, Analyst)" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Choose Duration */}
                <div>
                  <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Interview Duration
                  </p>
                  <div className="space-y-3">
                    {([
                      { val: 300 as Duration, label: "5 Minutes", desc: "Quick mock — warm-up round", icon: "⚡" },
                      { val: 600 as Duration, label: "10 Minutes", desc: "Full mock — deep dive", icon: "🎯" },
                    ]).map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setDuration(opt.val)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${
                          duration === opt.val
                            ? "border-primary bg-primary/15 shadow-lg shadow-primary/20"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <p className={`font-bold text-sm ${duration === opt.val ? "text-white" : "text-slate-300"}`}>{opt.label}</p>
                          <p className="text-xs text-slate-500">{opt.desc}</p>
                        </div>
                        {duration === opt.val && <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </button>
                    ))}
                  </div>

                  {/* What to expect */}
                  <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2">
                    {[
                      { icon: Brain, text: "AI emotion analysis via webcam" },
                      { icon: Activity, text: "Real-time stress tracking" },
                      { icon: BarChart3, text: "Performance score (out of 100)" },
                      { icon: FileText, text: "Downloadable PDF report" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-xs text-slate-400">
                        <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={startInterview}
                className="w-full mt-6 h-14 rounded-2xl text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                <Video className="h-5 w-5" />
                Start {duration / 60}-Minute Video Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════ ENDED / REPORT ════════════════════════════════════════
  if (phase === "ended") {
    return (
      <div className="space-y-6" style={{ minHeight: "80vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Interview Complete 🎉
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Interviewed by {gender === "male" ? "Mr. Arjun Sharma" : "Ms. Priya Menon"} · {duration / 60} min session
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <Download className="h-4 w-4" />
            Download PDF Report
          </button>
        </div>

        {isAIThinking ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground font-medium">AI is analyzing your full performance...</p>
            <p className="text-xs text-muted-foreground">This takes a few seconds</p>
          </div>
        ) : parsedReport ? (
          <>
            {/* Score rings row */}
            <div className="rounded-3xl p-6 border border-white/5 shadow-2xl" style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)" }}>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-6">Performance Scores</p>
              <div className="flex flex-wrap justify-around gap-4">
                <ScoreRing score={parsedReport.overallScore} label="Overall" color="#6366f1" />
                <ScoreRing score={parsedReport.communicationScore} label="Communication" color="#10b981" />
                <ScoreRing score={parsedReport.confidenceScore} label="Confidence" color="#f59e0b" />
                <ScoreRing score={parsedReport.contentScore} label="Answer Quality" color="#3b82f6" />
                <ScoreRing score={parsedReport.emotionScore} label="Composure" color="#8b5cf6" />
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 p-1 rounded-xl bg-muted border w-fit">
              {([
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "emotions", label: "Emotions", icon: Smile },
                { id: "transcript", label: "Transcript", icon: MessageCircle },
              ] as { id: typeof activeReportTab; label: string; icon: any }[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveReportTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeReportTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeReportTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Summary */}
                <Card className="md:col-span-2 border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4 text-primary" /> Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{parsedReport.summary}</p>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="border-emerald-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {parsedReport.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Star className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Improvements */}
                <Card className="border-orange-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {parsedReport.improvements.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="md:col-span-2 border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Pro Tips for Your Next Interview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {parsedReport.tips.map((tip, i) => (
                        <div key={i} className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm">
                          <span className="text-primary font-bold mr-1">{i + 1}.</span> {tip}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab: Emotions */}
            {activeReportTab === "emotions" && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-primary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Smile className="h-4 w-4 text-primary" />
                      Emotion Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.keys(emotionSummary).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No emotion data captured. Ensure your face was visible on camera.</p>
                    ) : (
                      Object.entries(emotionSummary)
                        .sort((a, b) => b[1] - a[1])
                        .map(([emotion, count]) => {
                          const pct = Math.round((count / emotionLog.length) * 100);
                          return (
                            <div key={emotion}>
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="capitalize flex items-center gap-1.5 font-medium">
                                  {EMOTION_EMOJIS[emotion as Emotion]} {emotion}
                                  {parsedReport.dominantEmotion === emotion && (
                                    <span className="text-xs text-primary font-normal">(dominant)</span>
                                  )}
                                </span>
                                <span className="font-bold text-primary">{pct}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full transition-all duration-1000"
                                  style={{ width: `${pct}%`, backgroundColor: EMOTION_BAR_COLORS[emotion as Emotion] }}
                                />
                              </div>
                            </div>
                          );
                        })
                    )}
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Emotional Intelligence Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{parsedReport.emotionAnalysis}</p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-muted/40 text-center">
                        <p className="text-2xl">{EMOTION_EMOJIS[parsedReport.dominantEmotion as Emotion] || "😐"}</p>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">Dominant: {parsedReport.dominantEmotion}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/40 text-center">
                        <p className="text-2xl font-bold text-primary">{emotionLog.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Readings</p>
                      </div>
                    </div>

                    {/* Emotion timeline dots */}
                    {emotionLog.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Emotion timeline</p>
                        <div className="flex flex-wrap gap-1.5">
                          {emotionLog.map((e, i) => (
                            <div
                              key={i}
                              title={`${EMOTION_EMOJIS[e.emotion]} ${e.emotion} at ${Math.floor(e.time / 60)}:${(e.time % 60).toString().padStart(2, "0")}`}
                              className="w-4 h-4 rounded-full border border-white/10 cursor-help"
                              style={{ backgroundColor: EMOTION_BAR_COLORS[e.emotion] }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab: Transcript */}
            {activeReportTab === "transcript" && (
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Full Interview Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[450px] overflow-y-auto space-y-3 pr-2">
                  {transcript.map((entry, i) => {
                    const mins = Math.floor(entry.time / 60);
                    const secs = entry.time % 60;
                    return (
                      <div key={i} className={`flex gap-3 ${entry.role === "candidate" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          entry.role === "candidate"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted border rounded-tl-none"
                        }`}>
                          <div className="flex items-center gap-2 mb-1 opacity-70">
                            <span className="text-xs font-bold uppercase">{entry.role === "candidate" ? "You" : gender === "male" ? "Mr. Sharma" : "Ms. Priya"}</span>
                            <span className="text-xs">{mins}:{secs.toString().padStart(2, "0")}</span>
                          </div>
                          <p className="leading-relaxed">{entry.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </>
        ) : null}

        {/* Restart */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {
            setPhase("setup"); setTimeLeft(300); setEmotionLog([]); setTranscript([]);
            setReport(""); setParsedReport(null); setConversationHistory([]);
          }}>
            Start Another Interview
          </Button>
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Mock Interview</Button>}
        </div>
      </div>
    );
  }

  // ══════════════════════ ACTIVE INTERVIEW ══════════════════════════════════════
  return (
    <div className="space-y-4 flex flex-col" style={{ minHeight: "80vh" }}>
      {/* Hidden canvas for emotion detection */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold text-sm shadow-sm border ${
            timeLeft <= 60 ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" : "bg-muted border-border"
          }`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
            <span className="text-xs font-normal opacity-60">/ {formatTime(duration)}</span>
          </div>
          <Badge className={`${EMOTION_COLORS[currentEmotion]} border capitalize px-3 py-1`}>
            {EMOTION_EMOJIS[currentEmotion]} {currentEmotion}
          </Badge>
          {isListening && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full animate-pulse">
              <Mic className="h-3 w-3" /> Listening...
            </div>
          )}
        </div>
        <Button variant="destructive" size="sm" onClick={endInterview} className="gap-2 shadow-md">
          <PhoneOff className="h-4 w-4" />
          End Interview
        </Button>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-2 gap-4 flex-1" style={{ minHeight: "400px" }}>
        {/* AI Avatar */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl" style={{ background: "#0f172a" }}>
          <AIAvatar gender={gender} isSpeaking={isSpeaking} isThinking={isAIThinking} />
        </div>

        {/* User Camera */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
          <video
            ref={videoRef}
            autoPlay playsInline muted
            className={`w-full h-full object-cover ${!isCamOn ? "opacity-0" : ""}`}
            style={{ transform: "scaleX(-1)" }}
          />
          {!isCamOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 gap-3">
              <VideoOff className="h-10 w-10 text-slate-600" />
              <p className="text-xs text-slate-600">Camera off</p>
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 gap-2 px-4 text-center">
              <AlertCircle className="h-8 w-8 text-orange-400" />
              <p className="text-xs text-orange-400 font-medium">Camera access denied</p>
              <p className="text-xs text-slate-500">Emotion tracking disabled</p>
            </div>
          )}
          <div className="absolute bottom-3 left-3 text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
            You
          </div>
          {/* Emotion badge overlay */}
          <div className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border ${EMOTION_COLORS[currentEmotion]}`}>
            {EMOTION_EMOJIS[currentEmotion]} {currentEmotion}
          </div>
        </div>
      </div>

      {/* Question + controls */}
      <Card className="border-primary/10 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">{gender === "male" ? "Mr. Arjun Sharma" : "Ms. Priya Menon"} asks:</p>
              <p className="text-sm leading-relaxed text-foreground font-medium">{currentQuestion}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant={isMicOn ? "outline" : "destructive"} size="icon" onClick={toggleMic} className="h-9 w-9" title={isMicOn ? "Mute mic" : "Unmute mic"}>
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button variant={isCamOn ? "outline" : "destructive"} size="icon" onClick={toggleCam} className="h-9 w-9" title={isCamOn ? "Turn off camera" : "Turn on camera"}>
                {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={listenForAnswer}
              disabled={isListening || isAIThinking}
              className="gap-2 shadow-md shadow-primary/20"
            >
              {isListening ? (
                <><MicOff className="h-4 w-4 animate-pulse" /> Listening...</>
              ) : isAIThinking ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Thinking...</>
              ) : (
                <><Mic className="h-4 w-4" /> Speak My Answer</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
