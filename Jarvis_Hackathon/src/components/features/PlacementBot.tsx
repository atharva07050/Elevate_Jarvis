
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, MicOff, Bot, Globe, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getChatResponse } from "@/lib/ai";


type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const LANGUAGES = [
  { code: 'en-US', label: 'English (American)', voiceName: 'Google US English' },
  { code: 'en-GB', label: 'English (UK)', voiceName: 'Google UK English Female' },
  { code: 'hi-IN', label: 'Hindi (भारत)', voiceName: 'Google हिन्दी' },
  { code: 'fr-FR', label: 'French (France)', voiceName: 'Google Français' },
  { code: 'es-ES', label: 'Spanish (España)', voiceName: 'Google español' },
];

export default function PlacementBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Saarthi placement assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState('en-US');
  const [isTalkingModeOn, setIsTalkingModeOn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speak = (text: string) => {
    if (!isTalkingModeOn) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const selectedLang = LANGUAGES.find(l => l.code === lang);
    const voice = voices.find(v => v.lang === lang || v.name.includes(selectedLang?.label || ''));
    if (voice) utterance.voice = voice;
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current.lang = lang;
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getChatResponse(text, messages);
      setIsTyping(false);
      const assistantMsg: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMsg]);
      speak(response);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my placement brain." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[550px] bg-card border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b bg-primary flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold text-sm">Saarthi Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={isTalkingModeOn ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setIsTalkingModeOn(!isTalkingModeOn)} 
                  className={isTalkingModeOn ? "text-primary text-xs h-7" : "text-white hover:bg-white/10 text-xs h-7"}
                >
                  {isTalkingModeOn ? <Volume2 className="h-3 w-3 mr-1" /> : <VolumeX className="h-3 w-3 mr-1" />}
                  Talk: {isTalkingModeOn ? 'ON' : 'OFF'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 h-7 w-7">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="px-4 py-2 bg-muted/50 border-b flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                <Globe className="h-3 w-3" />
                Language
              </div>
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="h-7 text-xs w-[140px] bg-card border rounded px-2 text-foreground"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-card border shadow-sm rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder={lang.startsWith('hi') ? "सवाल पूछें..." : "Ask about placement..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="bg-muted/30 border-none focus-visible:ring-1"
                />
                <Button 
                  size="icon" 
                  variant={isListening ? "destructive" : "outline"} 
                  onClick={toggleListening}
                  className={isListening ? "animate-pulse" : ""}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button size="icon" onClick={() => handleSend()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        animate={isOpen ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl border-4 border-background"
      >
        <Bot className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
