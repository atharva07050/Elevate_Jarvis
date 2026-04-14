
export type UserProfile = {
  overall: number;
  skillScore: number;
  communication: number;
  problemSolving: number;
  topSkills: string[];
  areasForImprovement: { name: string; score: number }[];
  testTaken: boolean;
  history: { date: string; score: number }[];
  masteryLevels?: Record<string, { level: number; nextReview: number; totalAttempts: number; correct: number }>;
};

export type QuizAttempt = {
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isCorrect: boolean;
  timeTaken: number;
  date: number;
};

export type QuizQuestion = {
  id: string;
  topic: string;
  type: "MCQ" | "True/False" | "Fill-in-the-blanks";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
};
