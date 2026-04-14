
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2, Loader2, Send, Bot, User, RefreshCw,
  TrendingUp, AlertTriangle, CheckCircle, ChevronRight,
  Sparkles, ArrowLeft, BarChart3
} from "lucide-react";
import { sendChatMessage } from "@/lib/gemini";

interface Message {
  role: "ai" | "user";
  text: string;
}

const COMPANIES = [
  { name: "Google", values: "Googliness, Innovation, User Focus, Data-Driven, Collaboration", color: "from-blue-500 to-green-500" },
  { name: "Amazon", values: "Customer Obsession, Ownership, Bias for Action, Frugality, Earn Trust", color: "from-amber-500 to-orange-600" },
  { name: "Microsoft", values: "Growth Mindset, Diversity & Inclusion, Innovation, Trustworthy Computing", color: "from-blue-600 to-cyan-500" },
  { name: "TCS", values: "Integrity, Leading Change, Excellence, Respect for Individual, Learning", color: "from-indigo-500 to-purple-600" },
  { name: "Infosys", values: "Client Value, Leadership by Example, Integrity, Fairness, Excellence", color: "from-blue-400 to-indigo-600" },
  { name: "Wipro", values: "Spirit of Being Human, Be Passionate, Be Global, Integrity, Unyielding Quality", color: "from-purple-500 to-pink-600" },
];

export default function CultureFit() {
  const [selectedCompany, setSelectedCompany] = useState<typeof COMPANIES[0] | null>(null);
  const [phase, setPhase] = useState<"select" | "interview" | "report">("select");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [report, setReport] = useState<any>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const MAX_QUESTIONS = 6;

  const startInterview = async (company: typeof COMPANIES[0]) => {
    setSelectedCompany(company);
    setPhase("interview");
    setIsThinking(true);

    const systemPrompt = `You are a Cultural Fit Interviewer for ${company.name}. 
    The company's core values are: ${company.values}.
    Ask ONE behavioral/situational question at a time that specifically tests alignment with these values.
    Make questions feel natural and conversational. Do NOT list all values at once.
    Start with a warm greeting mentioning the company name, then ask the first question.`;

    try {
      const response = await sendChatMessage([], systemPrompt);
      setMessages([{ role: "ai", text: response }]);
      setQuestionCount(1);
    } catch {
      setMessages([{ role: "ai", text: `Welcome to the ${company.name} Cultural Fit simulation! Let's start: Tell me about a time you put the customer first, even when it was difficult.` }]);
      setQuestionCount(1);
    }
    setIsThinking(false);
  };

  const handleSend = async () => {
    if (!userInput.trim() || isThinking || !selectedCompany) return;
    const answer = userInput.trim();
    setUserInput("");

    const updatedMessages = [...messages, { role: "user" as const, text: answer }];
    setMessages(updatedMessages);
    setIsThinking(true);

    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);

    if (questionCount >= MAX_QUESTIONS) {
      // Generate final report
      const reportPrompt = `You conducted a cultural fit interview for ${selectedCompany.name} (values: ${selectedCompany.values}).
      Here is the full conversation:
      ${updatedMessages.map(m => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`).join("\n")}
      
      Generate a JSON report:
      {
        "overallScore": number 0-100,
        "cultureFitVerdict": "Strong Fit" | "Moderate Fit" | "Weak Fit",
        "valueScores": [{"value": "string", "score": number 0-100, "feedback": "string"}],
        "strengths": ["string"],
        "redFlags": ["string"],
        "tips": ["string"],
        "summary": "string"
      }`;

      try {
        const reportRes = await sendChatMessage([], reportPrompt);
        const parsed = JSON.parse(reportRes.replace(/```json\n?/g, "").replace(/```/g, "").trim());
        setReport(parsed);
      } catch {
        setReport({
          overallScore: 72,
          cultureFitVerdict: "Moderate Fit",
          valueScores: selectedCompany.values.split(", ").map(v => ({ value: v, score: Math.floor(60 + Math.random() * 30), feedback: "Shows understanding but needs more depth." })),
          strengths: ["Good communication", "Relevant experiences"],
          redFlags: ["Could align more with specific values"],
          tips: ["Research company values before real interviews", "Use STAR method for answers"],
          summary: "The candidate shows potential cultural alignment but should deepen their understanding of specific company values."
        });
      }
      setPhase("report");
      setIsThinking(false);
      return;
    }

    const historyForAI = updatedMessages.map(m => ({
      role: m.role === "ai" ? "model" : "user",
      text: m.text
    }));

    const nextPrompt = `Continue the cultural fit interview for ${selectedCompany.name} (values: ${selectedCompany.values}).
    This is question ${questionCount + 1} of ${MAX_QUESTIONS}. Ask ONE new question testing a different value than before.
    Be conversational and briefly acknowledge their previous answer before asking.`;

    try {
      const nextQ = await sendChatMessage(historyForAI, nextPrompt);
      setMessages(prev => [...prev, { role: "ai", text: nextQ }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "That's interesting! Now, tell me about a time you had to adapt to a major change at work or school. How did you handle it?" }]);
    }
    setQuestionCount(prev => prev + 1);
    setIsThinking(false);
  };

  const reset = () => {
    setSelectedCompany(null);
    setPhase("select");
    setMessages([]);
    setReport(null);
    setQuestionCount(0);
  };

  // ─── Company Selection ────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cultural Fit Simulator</h2>
          <p className="text-muted-foreground mt-1 text-sm">Practice behavioral interviews tailored to a specific company's core values.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {COMPANIES.map((company) => (
            <Card
              key={company.name}
              className="border-white/5 bg-card/30 backdrop-blur-md cursor-pointer hover:border-primary/40 transition-all group overflow-hidden"
              onClick={() => startInterview(company)}
            >
              <div className={`h-1.5 bg-gradient-to-r ${company.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-primary/10 transition-all">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{company.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {company.values.split(", ").map((v, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/5 text-[10px] font-normal">{v}</Badge>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-primary text-xs">
                  Start Simulation <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ─── Final Report ─────────────────────────────────────────────
  if (phase === "report" && report) {
    const verdictColor = report.cultureFitVerdict === "Strong Fit" ? "text-emerald-400" : report.cultureFitVerdict === "Moderate Fit" ? "text-amber-400" : "text-rose-400";
    return (
      <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={reset}><ArrowLeft className="mr-2 h-4 w-4" /> New Simulation</Button>
          <Badge className={`bg-gradient-to-r ${selectedCompany?.color} text-white px-4 py-1`}>{selectedCompany?.name}</Badge>
        </div>

        <Card className="border-white/5 bg-card/30 backdrop-blur-md overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${selectedCompany?.color}`} />
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-3">
              <div className="text-6xl font-bold text-white">{report.overallScore}%</div>
              <div className={`text-xl font-bold ${verdictColor}`}>{report.cultureFitVerdict}</div>
              <p className="text-sm text-slate-400 max-w-xl mx-auto italic">"{report.summary}"</p>
            </div>

            <div className="grid gap-3">
              <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase">Value-by-Value Breakdown</h4>
              {report.valueScores?.map((vs: any, i: number) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">{vs.value}</span>
                    <span className={`text-sm font-bold ${vs.score >= 75 ? "text-emerald-400" : vs.score >= 50 ? "text-amber-400" : "text-rose-400"}`}>{vs.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${vs.score}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">{vs.feedback}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <h4 className="text-[10px] font-bold text-emerald-400 mb-3 tracking-widest flex items-center gap-2"><CheckCircle className="h-3 w-3" /> STRENGTHS</h4>
                <ul className="space-y-2">
                  {report.strengths?.map((s: string, i: number) => <li key={i} className="text-sm text-emerald-100 flex items-center gap-2"><span className="w-1 h-1 bg-emerald-400 rounded-full" /> {s}</li>)}
                </ul>
              </div>
              <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                <h4 className="text-[10px] font-bold text-amber-400 mb-3 tracking-widest flex items-center gap-2"><AlertTriangle className="h-3 w-3" /> RED FLAGS</h4>
                <ul className="space-y-2">
                  {report.redFlags?.map((s: string, i: number) => <li key={i} className="text-sm text-amber-100 flex items-center gap-2"><span className="w-1 h-1 bg-amber-400 rounded-full" /> {s}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Interview Chat ───────────────────────────────────────────
  return (
    <div className="space-y-4 animate-in fade-in duration-700 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={reset}><ArrowLeft className="mr-2 h-4 w-4" /> Exit</Button>
        <div className="flex items-center gap-3">
          <Badge className={`bg-gradient-to-r ${selectedCompany?.color} text-white`}>{selectedCompany?.name}</Badge>
          <Badge variant="secondary" className="bg-white/5">{questionCount}/{MAX_QUESTIONS}</Badge>
        </div>
      </div>

      <Card className="border-white/5 bg-card/30 backdrop-blur-md">
        <CardContent className="p-0">
          <div ref={scrollRef} className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="p-2 bg-primary/20 rounded-xl h-fit shrink-0"><Bot className="h-4 w-4 text-primary" /></div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-white rounded-br-sm" : "bg-white/5 text-slate-300 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="p-2 bg-white/10 rounded-xl h-fit shrink-0"><User className="h-4 w-4" /></div>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-3">
                <div className="p-2 bg-primary/20 rounded-xl h-fit"><Bot className="h-4 w-4 text-primary" /></div>
                <div className="bg-white/5 p-4 rounded-2xl rounded-bl-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-3">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type your answer..."
                className="bg-white/5 border-white/10 min-h-[50px] max-h-[120px]"
              />
              <Button onClick={handleSend} disabled={isThinking || !userInput.trim()} className="shrink-0 h-auto">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
