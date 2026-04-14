import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BrainCircuit, Loader2, Timer, CheckCircle2,
  AlertCircle, ChevronRight, XCircle, TrendingUp, BarChart, BookOpen, AlertTriangle
} from "lucide-react";
import { generateAdaptiveQuiz } from "@/lib/gemini";
import { QuizQuestion, UserProfile, QuizAttempt } from "@/lib/types";
import { getCurrentSession, saveLocalUser } from "@/lib/storage";

export default function AdaptiveQuiz() {
  const [phase, setPhase] = useState<"dashboard" | "quiz" | "results">("dashboard");
  const [subject, setSubject] = useState<"Aptitude" | "DSA">("DSA");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [attemptsThisSession, setAttemptsThisSession] = useState<QuizAttempt[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const session = getCurrentSession();
    if (session && session.profile) {
      setUserProfile(session.profile);
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === "quiz" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (phase === "quiz" && timeLeft === 0 && !selectedAnswer) {
      handleAnswerSubmit(""); // Auto-submit incorrect
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft, selectedAnswer]);

  // Derived Analytics
  const masteryLevels = userProfile?.masteryLevels || {};
  
  // Topics with mastery < 60%
  const weakestTopics = Object.entries(masteryLevels)
    .filter(([_, data]) => (data.correct / (data.totalAttempts || 1)) * 100 < 60)
    .sort((a, b) => a[1].level - b[1].level)
    .slice(0, 5)
    .map(([topic]) => topic);

  // Fundamental Check Logic
  const getFundamentalWarnings = () => {
    const warnings: string[] = [];
    Object.entries(masteryLevels).forEach(([topic, data]) => {
        // If they have taken more than 3 attempts and failing often on lower levels
        if (data.totalAttempts >= 3 && (data.correct / data.totalAttempts) < 0.4 && data.level <= 2) {
            warnings.push(topic);
        }
    });
    return warnings;
  };

  const startQuiz = async (overrideSubject?: "Aptitude" | "DSA", specificTopics?: string[]) => {
    setIsGenerating(true);
    const sub = overrideSubject || subject;
    const topicsToTarget = specificTopics || weakestTopics;
    
    try {
      const qz = await generateAdaptiveQuiz(sub, difficulty, topicsToTarget);
      setQuestions(qz);
      setAttemptsThisSession([]);
      setCurrentIndex(0);
      setTimeLeft(60);
      setSelectedAnswer("");
      setPhase("quiz");
    } catch (e) {
      console.error("Failed to generate quiz", e);
      alert("Error generating quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateLeitnerSystem = (topic: string, isCorrect: boolean) => {
    if (!userProfile) return;
    const currentMastery = userProfile.masteryLevels || {};
    const existing = currentMastery[topic] || { level: 1, nextReview: Date.now(), totalAttempts: 0, correct: 0 };
    
    // Leitner Logic
    let newLevel = existing.level;
    if (isCorrect) {
        newLevel = Math.min(5, newLevel + 1);
    } else {
        newLevel = Math.max(1, newLevel - 1);
    }
    
    // Spaced Repetition (Days to ms)
    const reviewIntervals = [0, 1, 3, 7, 14, 30]; 
    const nextReview = Date.now() + (reviewIntervals[newLevel] * 24 * 60 * 60 * 1000);

    const updatedProfile = {
      ...userProfile,
      masteryLevels: {
        ...currentMastery,
        [topic]: {
          level: newLevel,
          nextReview,
          totalAttempts: existing.totalAttempts + 1,
          correct: existing.correct + (isCorrect ? 1 : 0)
        }
      }
    };
    
    // Persist
    setUserProfile(updatedProfile);
    const session = getCurrentSession();
    if (session) saveLocalUser(session.email, updatedProfile);
  };

  const handleAnswerSubmit = (ans: string) => {
    const q = questions[currentIndex];
    const isCorrect = ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    
    setAttemptsThisSession(prev => [...prev, {
      topic: q.topic,
      difficulty: q.difficulty,
      isCorrect,
      timeTaken: 60 - timeLeft,
      date: Date.now()
    }]);

    updateLeitnerSystem(q.topic, isCorrect);
    setSelectedAnswer(ans);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(60);
        setSelectedAnswer("");
      } else {
        setPhase("results");
      }
    }, 2000);
  };

  if (phase === "dashboard") {
    const warnings = getFundamentalWarnings();
    return (
      <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Adaptive Quiz & Weakness Analytics</h2>
          <p className="text-muted-foreground mt-1">Smart learning through Spaced Repetition (Leitner System).</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Quick Start */}
          <Card className="border-white/5 bg-card/30 backdrop-blur-md md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> Setup Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Subject</label>
                <div className="flex gap-2">
                  <Button variant={subject === "Aptitude" ? "default" : "outline"} onClick={() => setSubject("Aptitude")} className="flex-1">Aptitude</Button>
                  <Button variant={subject === "DSA" ? "default" : "outline"} onClick={() => setSubject("DSA")} className="flex-1">DSA</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Difficulty</label>
                <div className="flex gap-2">
                  <Button variant={difficulty === "Easy" ? "default" : "outline"} onClick={() => setDifficulty("Easy")} className="flex-1 text-xs">Easy</Button>
                  <Button variant={difficulty === "Medium" ? "default" : "outline"} onClick={() => setDifficulty("Medium")} className="flex-1 text-xs">Med</Button>
                  <Button variant={difficulty === "Hard" ? "default" : "outline"} onClick={() => setDifficulty("Hard")} className="flex-1 text-xs">Hard</Button>
                </div>
              </div>
              <Button onClick={() => startQuiz()} disabled={isGenerating} className="w-full mt-4">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Start General Quiz"}
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-white/5 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-amber-400" /> Priority Practice (Weakest Topics)</CardTitle>
                <CardDescription>Topics where mastery is under 60%.</CardDescription>
              </CardHeader>
              <CardContent>
                {weakestTopics.length === 0 ? (
                  <p className="text-sm text-slate-400">Take more quizzes to generate weakness analytics.</p>
                ) : (
                  <div className="grid gap-3">
                    {weakestTopics.map((topic, i) => {
                      const data = masteryLevels[topic];
                      const pct = Math.round((data.correct / data.totalAttempts) * 100);
                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <span className="font-semibold text-white">{topic}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="bg-rose-500/10 text-rose-400 text-[10px]">Lvl {data.level}</Badge>
                                <span className="text-xs text-rose-400">{pct}% Correct</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => startQuiz(subject, [topic])}>Target Practice</Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {warnings.length > 0 && (
                <Card className="border-rose-500/20 bg-rose-500/5">
                    <CardHeader>
                        <CardTitle className="text-sm text-rose-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Fundamental Check</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-rose-300 mb-2">You are struggling heavily with easy questions in these topics. We strongly recommend revisiting the basics:</p>
                        <div className="flex flex-wrap gap-2">
                            {warnings.map((w, i) => <Badge key={i} className="bg-rose-500 text-white">{w}</Badge>)}
                        </div>
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = questions[currentIndex];
    const isAnswered = !!selectedAnswer;
    const progress = ((currentIndex) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
         <div className="flex items-center justify-between mb-4">
           <Badge variant="secondary"><BrainCircuit className="w-3 h-3 mr-1"/> Q{currentIndex + 1} of {questions.length}</Badge>
           <div className={`flex items-center gap-2 font-mono ${timeLeft <= 10 ? 'text-rose-500' : 'text-primary'}`}>
             <Timer className="w-4 h-4" /> 00:{timeLeft.toString().padStart(2, '0')}
           </div>
         </div>
         <Progress value={progress} className="h-1 bg-white/10" />

         <Card className="border-white/5 bg-card/50 backdrop-blur-xl">
           <CardContent className="p-8 space-y-8">
             <div className="flex justify-between items-start">
               <h3 className="text-xl font-medium leading-relaxed text-white">{q.question}</h3>
               <Badge className="bg-indigo-500/20 text-indigo-400 ml-4 shrink-0">{q.topic}</Badge>
             </div>

             <div className="grid gap-3">
               {q.options && q.options.map((opt, i) => {
                 const isSelected = selectedAnswer === opt;
                 const isActuallyCorrect = opt === q.correctAnswer;
                 let btnClass = "border-white/10 hover:bg-white/5 justify-start h-auto p-4 text-left font-normal";
                 if (isAnswered) {
                   if (isActuallyCorrect) btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 justify-start h-auto p-4 text-left font-normal";
                   else if (isSelected) btnClass = "bg-rose-500/20 border-rose-500/50 text-rose-400 justify-start h-auto p-4 text-left font-normal";
                 }
                 return (
                   <Button 
                     key={i} 
                     variant="outline" 
                     className={btnClass}
                     onClick={() => !isAnswered && handleAnswerSubmit(opt)}
                     disabled={isAnswered}
                   >
                     {opt}
                   </Button>
                 );
               })}
               {!q.options && (
                   <div className="flex gap-2">
                       <Input 
                        placeholder="Type your answer..." 
                        disabled={isAnswered}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAnswerSubmit(e.currentTarget.value)
                        }}
                        className="bg-white/5 border-white/10"
                       />
                       <Button disabled={isAnswered} onClick={(e) => {
                           const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                           handleAnswerSubmit(input.value);
                       }}>Submit</Button>
                   </div>
               )}
             </div>

             {isAnswered && (
                 <div className={`p-4 rounded-xl text-sm ${selectedAnswer.toLowerCase() === q.correctAnswer.toLowerCase() ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                     <p className="font-bold mb-1">{selectedAnswer.toLowerCase() === q.correctAnswer.toLowerCase() ? 'Correct!' : `Incorrect. The answer is ${q.correctAnswer}`}</p>
                     <p>{q.explanation}</p>
                 </div>
             )}
           </CardContent>
         </Card>
      </div>
    );
  }

  if (phase === "results") {
    const correctCount = attemptsThisSession.filter(a => a.isCorrect).length;
    return (
        <div className="max-w-2xl mx-auto space-y-6 text-center animate-in fade-in">
            <div className="p-8 border border-white/5 bg-card/30 rounded-3xl backdrop-blur-md">
                <BarChart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <div className="text-5xl font-black text-white mt-6">{correctCount} / {questions.length}</div>
                <p className="text-slate-400 mt-2">Score</p>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Button className="w-full" onClick={() => setPhase("dashboard")}>View Analytics</Button>
                    <Button variant="outline" className="w-full" onClick={() => startQuiz()}>Try Again</Button>
                </div>
            </div>
        </div>
    )
  }

  return null;
}
