import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { sendMockInterviewMessage } from "@/lib/gemini";

type Message = {
  role: "user" | "model";
  text: string;
};

export default function MockInterview() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I'm your AI interviewer today. Are you ready to begin the mock interview? Tell me a bit about the role you are applying for." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const responseText = await sendMockInterviewMessage(messages, userMessage);
      setMessages([...newMessages, { role: "model", text: responseText }]);
    } catch (error) {
      setMessages([...newMessages, { role: "model", text: "I'm sorry, I encountered an error. Could you repeat that?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Mock Interview</h2>
        <p className="text-muted-foreground">Practice your behavioral and technical answers with an AI recruiter.</p>
      </div>

      <Card className="flex-1 flex flex-col min-h-[500px] overflow-hidden">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            Interview Chat
          </CardTitle>
          <CardDescription>The AI will ask questions and provide feedback on your answers.</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <ScrollArea className="h-full p-4" ref={scrollRef}>
            <div className="space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-lg px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg px-4 py-3 bg-muted text-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4 bg-background">
          <form 
            className="flex w-full gap-2" 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input 
              placeholder="Type your answer here..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
