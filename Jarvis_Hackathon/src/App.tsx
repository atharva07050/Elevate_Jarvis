
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/features/Dashboard";
import ResumeAnalyzer from "@/components/features/ResumeAnalyzer";
import CrashPlan from "@/components/features/CrashPlan";
import PressureTest from "@/components/features/PressureTest";
import MockInterview from "@/components/features/MockInterview";
import AIRecruiter from "@/components/features/AIRecruiter";
import CultureFit from "@/components/features/CultureFit";
import Portfolio from "@/components/features/Portfolio";
import SkillRoadmap from "@/components/features/SkillRoadmap";
import AdaptiveQuiz from "@/components/features/AdaptiveQuiz";

import {
  LayoutDashboard,
  FileText,
  Calendar,
  Timer,
  GraduationCap,
  MessageSquare,
  Sparkles,
  LogOut,
  User,
  ChevronRight,
  Target,
  Zap,
  Building2,
  Globe,
  Map,
  BrainCircuit
} from "lucide-react";
import Login from "@/components/auth/Login";
import PlacementBot from "@/components/features/PlacementBot";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import { getCurrentSession, setCurrentSession, saveLocalUser } from "@/lib/storage";
import { cn } from "@/lib/utils";

const DEFAULT_PROFILE: UserProfile = {
  overall: 0,
  skillScore: 0,
  communication: 0,
  problemSolving: 0,
  topSkills: [],
  areasForImprovement: [],
  testTaken: false,
  history: []
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "adaptive", label: "Adaptive Quiz", icon: BrainCircuit },
  { id: "recruiter", label: "AI Recruiter", icon: Target },

  { id: "resume", label: "Resume AI", icon: FileText },
  { id: "plan", label: "7-Day Plan", icon: Calendar },
  { id: "pressure", label: "Pressure Test", icon: Timer },
  { id: "mock", label: "Mock Interview", icon: MessageSquare },
  { id: "culture", label: "Culture Fit", icon: Building2 },
  { id: "portfolio", label: "AI Portfolio", icon: Globe },
  { id: "roadmap", label: "Roadmap to Hire", icon: Map },
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setUser({ email: session.email, uid: session.email });
      setProfile(session.profile || DEFAULT_PROFILE);
    }
    setLoading(false);
  }, []);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    const baseHistory = profile.history && profile.history.length > 0 
      ? profile.history 
      : [
          { date: "Day 1", score: 62 },
          { date: "Day 2", score: 65 },
          { date: "Day 3", score: 68 },
          { date: "Day 4", score: 72 },
          { date: "Day 5", score: 75 },
          { date: "Day 6", score: 77 }
        ];
    
    // add today's entry
    let dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const updatedHistory = [...baseHistory, { date: dateStr, score: newProfile.overall }];
    const profileToSave = { ...newProfile, history: updatedHistory };

    setProfile(profileToSave);
    if (user) {
      saveLocalUser(user.email, profileToSave);
    }
  };

  const handleLogout = () => {
    setCurrentSession(null);
    setUser(null);
    setProfile(DEFAULT_PROFILE);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <GraduationCap className="h-12 w-12 text-primary animate-bounce" />
          <p className="text-muted-foreground font-medium italic">Empowering your career with Saarthi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case "adaptive":
        return <AdaptiveQuiz />;
      case "recruiter":
        return <AIRecruiter />;
      case "resume":
        return <ResumeAnalyzer />;
      case "plan":
        return <CrashPlan profile={profile} />;
      case "pressure":
        return <PressureTest onComplete={(p) => { handleUpdateProfile(p); setActiveTab("dashboard"); }} />;
      case "mock":
        return <MockInterview profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case "culture":
        return <CultureFit />;
      case "portfolio":
        return <Portfolio />;
      case "roadmap":
        return <SkillRoadmap />;
      default:
        return <Dashboard profile={profile} onUpdateProfile={handleUpdateProfile} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-card/30 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Saarthi AI</span>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-white/5 border border-white/10">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.email.split('@')[0]}</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <h1 className="text-lg font-semibold text-white">
               {NAV_ITEMS.find(i => i.id === activeTab)?.label}
             </h1>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" className="border-white/10">
               <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
               Daily Goal: 80%
             </Button>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      
      <PlacementBot />
    </div>
  );
}
