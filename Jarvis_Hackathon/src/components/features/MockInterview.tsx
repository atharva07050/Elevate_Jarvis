
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX, Video, MessageSquare, ChevronRight, Sparkles } from "lucide-react";
import { sendMockInterviewMessage } from "@/lib/gemini";
import VideoInterview from "./VideoInterview";

type Message = {
  role: "user" | "model";
  text: string;
};

type Mode = "select" | "text" | "video";

export default function MockInterview() {
  const [mode, setMode] = useState<Mode>("select");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I'm your Saarthi AI interviewer today. Are you ready to begin? Tell me about the role you're targeting." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTalkingModeOn, setIsTalkingModeOn] = useState(false);
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (!isTalkingModeOn) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const responseText = await sendMockInterviewMessage(messages, userMessage, targetCompany, targetRole);
      setMessages([...newMessages, { role: "model", text: responseText }]);
      speak(responseText);
    } catch (error) {
      setMessages([...newMessages, { role: "model", text: "I'm sorry, I'm having trouble with my voice. Could you please try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ──── MODE SELECTION SCREEN ─────────────────────────────────────────────────
  if (mode === "select") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Mock Interview</h2>
          <p className="text-muted-foreground mt-1">Choose your interview experience — text chat or full AI video interview.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-4">
          {/* Text Interview card */}
          <button
            onClick={() => setMode("text")}
            className="group text-left p-6 rounded-2xl border-2 border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-all shadow-sm hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-4 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-1">Text Mock Interview</h3>
              <p className="text-muted-foreground text-sm mb-4">Chat-based interview with AI. Type or speak your answers. Great for quick practice.</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {["AI interviewer via chat", "Voice recognition support", "Talking mode (AI reads back)", "No camera needed"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mt-5 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                Start Text Interview <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </button>

          {/* Video Interview card */}
          <button
            onClick={() => setMode("video")}
            className="group text-left p-6 rounded-2xl border-2 border-border hover:border-primary/50 bg-card transition-all shadow-sm hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.04) 100%)" }}
          >
            {/* "New" badge */}
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> NEW
            </div>

            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-x-2 -translate-y-10 group-hover:scale-125 transition-transform duration-500"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <Video className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">AI Video Interview</h3>
              <p className="text-muted-foreground text-sm mb-4">Face-to-face with an AI character. Real-time emotion tracking. Full performance report.</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {[
                  "Choose male or female AI interviewer",
                  "Gender-matched voice & personality",
                  "Your webcam + expression tracking",
                  "5 or 10 minute session",
                  "Emotion report (stress, anxiety, etc.)",
                  "Scored performance report + PDF"
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mt-5 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                Start Video Interview <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Global Context (Company/Role) */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Interview Focus (Optional)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Target Company</label>
              <Input 
                placeholder="e.g. Google, Microsoft, TCS" 
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="rounded-xl border-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Target Role</label>
              <Input 
                placeholder="e.g. Software Engineer, Data Scientist" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="rounded-xl border-primary/10"
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 italic">* This context helps the AI tailor questions specifically for your goals.</p>
        </div>
      </div>
    );
  }

  // ──── VIDEO INTERVIEW MODE ──────────────────────────────────────────────────
  if (mode === "video") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("select")}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back
          </button>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-xl font-bold">AI Video Interview</h2>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-500 font-semibold">LIVE</span>
        </div>
        <VideoInterview onBack={() => setMode("select")} />
      </div>
    );
  }

  // ──── TEXT INTERVIEW MODE ─────────────────────────────────────────────────
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("select")}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back
          </button>
          <div className="h-4 w-px bg-border" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Text Mock Interview</h2>
            <p className="text-muted-foreground text-xs">Type or voice your answers below.</p>
          </div>
        </div>
        <Button
          variant={isTalkingModeOn ? "default" : "outline"}
          onClick={() => setIsTalkingModeOn(!isTalkingModeOn)}
          className="gap-2 shadow-sm"
        >
          {isTalkingModeOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          Talking Mode: {isTalkingModeOn ? 'ON' : 'OFF'}
        </Button>
      </div>

      <Card className="flex-1 flex flex-col min-h-[500px] overflow-hidden border-primary/10 shadow-xl">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            Interview Session
          </CardTitle>
          <CardDescription>Practice in multiple languages: speak or type your answers.</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border shadow-sm'}`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border rounded-tl-none'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-card border text-sm flex items-center gap-2 rounded-tl-none">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span className="text-muted-foreground italic">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 bg-muted/10">
          <form
            className="flex w-full gap-3"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input
              placeholder="Type your answer here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-card shadow-sm border-primary/10"
            />
            <Button
              type="button"
              variant={isListening ? "destructive" : "secondary"}
              size="icon"
              onClick={toggleListening}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button type="submit" disabled={!input.trim() || isLoading} className="shadow-lg shadow-primary/20">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
