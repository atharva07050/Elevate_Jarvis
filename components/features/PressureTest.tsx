import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Timer, AlertTriangle, PlayCircle } from "lucide-react";
import { UserProfile } from "@/App";

const QUESTIONS = [
  {
    id: 1,
    text: "What is the time complexity of searching in a balanced Binary Search Tree?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    answer: "O(log n)",
    category: "Problem Solving",
    skill: "Data Structures"
  },
  {
    id: 2,
    text: "Which data structure is used for Breadth-First Search (BFS)?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
    category: "Problem Solving",
    skill: "Algorithms"
  },
  {
    id: 3,
    text: "What does ACID stand for in databases?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Consistency, Isolation, Durability",
      "Atomicity, Concurrency, Isolation, Durability",
      "Atomicity, Consistency, Integrity, Durability"
    ],
    answer: "Atomicity, Consistency, Isolation, Durability",
    category: "Skill Score",
    skill: "Databases"
  },
  {
    id: 4,
    text: "How would you explain a complex technical concept to a non-technical stakeholder?",
    options: [
      "Use technical jargon to show expertise",
      "Use analogies and avoid jargon",
      "Tell them it's too complex to understand",
      "Send them a link to the documentation"
    ],
    answer: "Use analogies and avoid jargon",
    category: "Communication",
    skill: "Soft Skills"
  },
  {
    id: 5,
    text: "In React, what is the primary purpose of useEffect?",
    options: [
      "To style components",
      "To handle side effects in functional components",
      "To create new state variables",
      "To route between pages"
    ],
    answer: "To handle side effects in functional components",
    category: "Skill Score",
    skill: "React"
  }
];

const POPUPS = [
  "Hurry up! We don't have all day.",
  "Explain your approach out loud!",
  "Are you sure about that answer?",
  "Think about edge cases!",
  "Can you optimize this further?",
  "Time is ticking..."
];

export default function PressureTest({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{questionId: number, isCorrect: boolean, category: string, skill: string}[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleFinishTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    let popupInterval: NodeJS.Timeout;
    if (isActive) {
      const schedulePopup = () => {
        const delay = Math.floor(Math.random() * 15000) + 15000;
        popupInterval = setTimeout(() => {
          const randomMsg = POPUPS[Math.floor(Math.random() * POPUPS.length)];
          setPopupMessage(randomMsg);
          
          setTimeout(() => setPopupMessage(null), 4000);
          
          schedulePopup();
        }, delay);
      };
      schedulePopup();
    }
    return () => clearTimeout(popupInterval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setIsActive(true);
    setTimeLeft(300);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
  };

  const handleFinishTest = (finalAnswers = answers) => {
    let problemSolvingTotal = 0;
    let problemSolvingCorrect = 0;
    let skillTotal = 0;
    let skillCorrect = 0;
    let commTotal = 0;
    let commCorrect = 0;

    const topSkills: string[] = [];
    const areasForImprovement: {name: string, score: number}[] = [];

    finalAnswers.forEach(ans => {
      if (ans.category === "Problem Solving") {
        problemSolvingTotal++;
        if (ans.isCorrect) problemSolvingCorrect++;
      } else if (ans.category === "Skill Score") {
        skillTotal++;
        if (ans.isCorrect) skillCorrect++;
      } else if (ans.category === "Communication") {
        commTotal++;
        if (ans.isCorrect) commCorrect++;
      }

      if (ans.isCorrect) {
        if (!topSkills.includes(ans.skill)) topSkills.push(ans.skill);
      } else {
        areasForImprovement.push({ name: ans.skill, score: Math.floor(Math.random() * 30) + 20 });
      }
    });

    if (topSkills.length === 0) topSkills.push("Willingness to Learn");
    if (areasForImprovement.length === 0) areasForImprovement.push({ name: "Advanced System Design", score: 85 });

    const psScore = problemSolvingTotal > 0 ? Math.round((problemSolvingCorrect / problemSolvingTotal) * 100) : 45;
    const skScore = skillTotal > 0 ? Math.round((skillCorrect / skillTotal) * 100) : 50;
    const cmScore = commTotal > 0 ? Math.round((commCorrect / commTotal) * 100) : 60;

    const overall = Math.round((psScore + skScore + cmScore) / 3);

    const profile: UserProfile = {
      overall,
      skillScore: skScore,
      communication: cmScore,
      problemSolving: psScore,
      topSkills,
      areasForImprovement,
      testTaken: true
    };

    onComplete(profile);
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === QUESTIONS[currentQuestion].answer;
    const newAnswers = [...answers, {
      questionId: QUESTIONS[currentQuestion].id,
      isCorrect,
      category: QUESTIONS[currentQuestion].category,
      skill: QUESTIONS[currentQuestion].skill
    }];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      setIsActive(false);
      handleFinishTest(newAnswers);
    }
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pressure Mode Test</h2>
          <p className="text-muted-foreground">Simulate real interview pressure with timers and interruptions.</p>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 text-2xl font-mono font-bold text-destructive bg-destructive/10 px-4 py-2 rounded-md">
            <Timer className="h-6 w-6" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {!isActive && timeLeft === 300 ? (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="h-16 w-16 text-orange-500 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Ready for the hot seat?</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              This mode simulates a high-pressure interview environment. You will have a strict time limit and the "interviewer" might interrupt you.
            </p>
            <Button size="lg" onClick={startTest} className="text-lg px-8">
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Interview
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">Question {currentQuestion + 1} of {QUESTIONS.length}</Badge>
                  <span className="text-sm text-muted-foreground">Technical Round</span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {QUESTIONS[currentQuestion].text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                  {QUESTIONS[currentQuestion].options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-3 border p-4 rounded-md hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedAnswer(option)}>
                      <RadioGroupItem value={option} id={`option-${i}`} />
                      <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-base">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleNext} disabled={!selectedAnswer}>
                  {currentQuestion === QUESTIONS.length - 1 ? "Submit" : "Next Question"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Interview Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={((currentQuestion) / QUESTIONS.length) * 100} className="mb-2" />
                <p className="text-xs text-muted-foreground text-right">{currentQuestion} / {QUESTIONS.length} completed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Interviewer Popup */}
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
          >
            <Card className="border-destructive shadow-lg shadow-destructive/20 bg-background">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-sm text-destructive">Interviewer</CardTitle>
                  <CardDescription className="text-foreground font-medium mt-1">
                    "{popupMessage}"
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
