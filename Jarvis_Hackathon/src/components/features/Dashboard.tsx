
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, MessageSquare, BrainCircuit, AlertCircle, PlayCircle, TrendingUp } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SIMULATED_DATA: UserProfile = {
  overall: 78,
  skillScore: 82,
  communication: 74,
  problemSolving: 85,
  topSkills: ["React", "TypeScript", "Node.js", "System Design", "Algorithms"],
  areasForImprovement: [
    { name: "Dynamic Programming", score: 45 },
    { name: "System Design", score: 58 },
    { name: "Communication Skills", score: 65 }
  ],
  testTaken: true,
  history: [
    { date: "Day 1", score: 62 },
    { date: "Day 2", score: 65 },
    { date: "Day 3", score: 68 },
    { date: "Day 4", score: 72 },
    { date: "Day 5", score: 75 },
    { date: "Day 6", score: 77 },
    { date: "Today", score: 78 }
  ]
};

export default function Dashboard({ profile: realProfile, onTakeTest }: { profile: UserProfile, onTakeTest: () => void }) {
  // Use simulated data if no test has been taken yet
  const profile = realProfile.testTaken ? realProfile : SIMULATED_DATA;
  
  const hasHistory = profile.history && profile.history.length > 0;
  const lastScore = hasHistory ? profile.history[profile.history.length - 1].score : 0;
  const prevScore = (profile.history && profile.history.length > 1) ? profile.history[profile.history.length - 2].score : 0;
  const trend = lastScore - prevScore;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Student Profile</h2>
          <p className="text-muted-foreground">Recruiter-style view of your placement readiness.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-sm font-semibold text-primary">Live Readiness Profile</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-all group overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Readiness</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile.overall}%</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span> from last session
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-all group overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Score</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile.skillScore}/100</div>
            <Progress value={profile.skillScore} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-all group overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communication</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile.communication}/100</div>
            <Progress value={profile.communication} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-all group overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problem Solving</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile.problemSolving}/100</div>
            <Progress value={profile.problemSolving} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Readiness Progress
            </CardTitle>
            <CardDescription>Visualizing your professional growth over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profile.history} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: "#ffffff", stroke: "hsl(var(--primary))", strokeWidth: 2 }} 
                  activeDot={{ r: 8, stroke: "#ffffff", strokeWidth: 2, fill: "hsl(var(--primary))" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle>Top Skills</CardTitle>
              <CardDescription>Verified competencies through assessments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.topSkills.length > 0 ? profile.topSkills.map((skill, i) => (
                  <Badge key={i} variant={i < 2 ? "default" : "secondary"} className="text-sm py-1.5 px-4 rounded-full transition-all hover:scale-105">
                    {skill}
                  </Badge>
                )) : (
                  <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-xl w-full text-center">No skills verified yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle>Focus Areas</CardTitle>
              <CardDescription>Critical topics for your next review.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {profile.areasForImprovement.length > 0 ? profile.areasForImprovement.map((area, i) => (
                  <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full shadow-sm ${area.score < 50 ? 'bg-destructive' : 'bg-orange-500'}`}></div>
                      <div>
                        <p className="text-sm font-bold">{area.name}</p>
                        <p className="text-xs text-muted-foreground">Current: {area.score}/100</p>
                      </div>
                    </div>
                    <Progress value={area.score} className="w-16 h-1.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </li>
                )) : (
                  <li className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-xl w-full text-center">You're doing great! Keep it up.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
