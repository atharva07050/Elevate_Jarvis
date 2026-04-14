
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/features/Dashboard";
import ResumeAnalyzer from "@/components/features/ResumeAnalyzer";
import CrashPlan from "@/components/features/CrashPlan";
import PressureTest from "@/components/features/PressureTest";
import MockInterview from "@/components/features/MockInterview";
import StarBuilder from "@/components/features/StarBuilder";
import AIRecruiter from "@/components/features/AIRecruiter";
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
  Zap
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
  { id: "recruiter", label: "AI Recruiter", icon: Target },
  { id: "resume", label: "Resume AI", icon: FileText },
  { id: "plan", label: "7-Day Plan", icon: Calendar },
  { id: "pressure", label: "Pressure Test", icon: Timer },
  { id: "mock", label: "Mock Interview", icon: MessageSquare },
  { id: "star", label: "STAR Builder", icon: Sparkles },
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
    setProfile(newProfile);
    if (user) {
      saveLocalUser(user.email, newProfile);
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
    return <Login onLogin={(user, profile) => {
      setUser(user);
      setProfile(profile);
    }} />;
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Saarthi</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">The Placement Prep Hub</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-auto space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user.email}</p>
              <p className="text-[10px] text-muted-foreground">Ready to Elevate</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
        {/* Mobile Header */}
        <header className="md:hidden border-b bg-card px-4 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Saarthi</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="hidden md:block">
              <h2 className="text-3xl font-bold tracking-tight">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-muted-foreground mt-1">Manage your career growth and placement preparedness.</p>
            </header>

            <Tabs value={activeTab} className="w-full">
              <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[700px] border-primary/5">
                <TabsContent value="dashboard" className="m-0 h-full">
                  <Dashboard profile={profile} onTakeTest={() => setActiveTab("pressure")} />
                </TabsContent>
                <TabsContent value="recruiter" className="m-0 h-full">
                  <AIRecruiter />
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
                      history: [...profile.history, { date: new Date().toLocaleDateString(), score: newProfile.overall }]
                    };
                    handleUpdateProfile(updatedProfile);
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
          </div>
        </main>
      </div>

      <PlacementBot />
    </div>
  );
}
