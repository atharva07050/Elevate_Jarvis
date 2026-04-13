/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/features/Dashboard";
import ResumeAnalyzer from "@/components/features/ResumeAnalyzer";
import CrashPlan from "@/components/features/CrashPlan";
import PressureTest from "@/components/features/PressureTest";
import MockInterview from "@/components/features/MockInterview";
import StarBuilder from "@/components/features/StarBuilder";
import { LayoutDashboard, FileText, Calendar, Timer, GraduationCap, MessageSquare, Sparkles } from "lucide-react";

export type UserProfile = {
  overall: number;
  skillScore: number;
  communication: number;
  problemSolving: number;
  topSkills: string[];
  areasForImprovement: { name: string; score: number }[];
  testTaken: boolean;
  history: { date: string; score: number }[];
};

const DEFAULT_PROFILE: UserProfile = {
  overall: 0,
  skillScore: 0,
  communication: 0,
  problemSolving: 0,
  topSkills: [],
  areasForImprovement: [],
  testTaken: false,
  history: [
    { date: "Week 1", score: 45 },
    { date: "Week 2", score: 52 },
    { date: "Week 3", score: 68 },
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Placement Prep Hub</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center overflow-x-auto pb-2">
            <TabsList className="flex w-max min-w-full sm:min-w-0 h-auto p-1">
              <TabsTrigger value="dashboard" className="py-3 flex gap-2 flex-1">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="resume" className="py-3 flex gap-2 flex-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Resume AI</span>
              </TabsTrigger>
              <TabsTrigger value="plan" className="py-3 flex gap-2 flex-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Crash Plan</span>
              </TabsTrigger>
              <TabsTrigger value="pressure" className="py-3 flex gap-2 flex-1">
                <Timer className="h-4 w-4" />
                <span className="hidden sm:inline">Pressure Test</span>
              </TabsTrigger>
              <TabsTrigger value="mock" className="py-3 flex gap-2 flex-1">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Mock Interview</span>
              </TabsTrigger>
              <TabsTrigger value="star" className="py-3 flex gap-2 flex-1">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">STAR Builder</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[600px]">
            <TabsContent value="dashboard" className="m-0 h-full">
              <Dashboard profile={profile} onTakeTest={() => setActiveTab("pressure")} />
            </TabsContent>
            <TabsContent value="resume" className="m-0 h-full">
              <ResumeAnalyzer />
            </TabsContent>
            <TabsContent value="plan" className="m-0 h-full">
              <CrashPlan />
            </TabsContent>
            <TabsContent value="pressure" className="m-0 h-full">
              <PressureTest onComplete={(newProfile) => {
                const updatedProfile = {
                  ...newProfile,
                  history: [...profile.history, { date: "Today", score: newProfile.overall }]
                };
                setProfile(updatedProfile);
                setActiveTab("dashboard");
              }} />
            </TabsContent>
            <TabsContent value="mock" className="m-0 h-full">
              <MockInterview />
            </TabsContent>
            <TabsContent value="star" className="m-0 h-full">
              <StarBuilder />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
