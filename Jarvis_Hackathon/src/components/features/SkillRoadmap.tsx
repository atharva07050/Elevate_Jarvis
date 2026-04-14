
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Map, Loader2, Target, CheckCircle, AlertCircle,
  TrendingUp, ChevronRight, Sparkles, ArrowRight,
  Award, BookOpen, Code, Zap, BarChart3
} from "lucide-react";
import { sendChatMessage } from "@/lib/gemini";
import { getCurrentSession } from "@/lib/storage";

export default function SkillRoadmap() {
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const generateRoadmap = async () => {
    if (!targetRole.trim()) return;
    setIsLoading(true);

    const session = getCurrentSession();
    const profile = session?.profile;

    const prompt = `You are a career placement analyst for Saarthi AI.
    
A student wants to get hired as "${targetRole}" ${targetCompany ? `at "${targetCompany}"` : ""}.

Their current assessment data from Saarthi:
- Overall Readiness: ${profile?.overall || 0}%
- Skill Score: ${profile?.skillScore || 0}/100
- Communication: ${profile?.communication || 0}/100  
- Problem Solving: ${profile?.problemSolving || 0}/100
- Top Skills: ${(profile?.topSkills || []).join(", ") || "None assessed yet"}
- Areas for Improvement: ${(profile?.areasForImprovement || []).join(", ") || "None identified"}

Generate a detailed skill gap analysis and roadmap. Return valid JSON:
{
  "readinessPercent": number 0-100,
  "gapSummary": "A 2-sentence professional summary of the gap",
  "missingSkills": [{"skill": "string", "importance": "Critical" | "Important" | "Nice-to-Have", "currentLevel": number 0-100, "requiredLevel": number 0-100}],
  "roadmapPhases": [
    {
      "phase": "Week 1-2",
      "title": "string",
      "tasks": ["string", "string"],
      "milestone": "string"
    }
  ],
  "quickWins": ["string", "string"],
  "dealBreakers": ["string"],
  "competitiveEdge": ["Things that would make them stand out"]
}`;

    try {
      const res = await sendChatMessage([], prompt);
      const parsed = JSON.parse(res.replace(/```json\n?/g, "").replace(/```/g, "").trim());
      setRoadmap(parsed);
    } catch {
      setRoadmap({
        readinessPercent: Math.min(90, (profile?.overall || 50) + 15),
        gapSummary: `You have a solid foundation for a ${targetRole} role. Focus on bridging specific technical gaps and building practical project experience to become fully competitive.`,
        missingSkills: [
          { skill: "System Design", importance: "Critical", currentLevel: 30, requiredLevel: 80 },
          { skill: "Data Structures", importance: "Critical", currentLevel: profile?.skillScore || 50, requiredLevel: 85 },
          { skill: "Behavioral Interviews", importance: "Important", currentLevel: profile?.communication || 40, requiredLevel: 75 },
          { skill: "Project Portfolio", importance: "Important", currentLevel: 25, requiredLevel: 70 },
        ],
        roadmapPhases: [
          { phase: "Week 1-2", title: "Foundation Sprint", tasks: ["Master core data structures", "Complete 20 easy-level problems"], milestone: "Pass a basic coding assessment" },
          { phase: "Week 3-4", title: "Deep Dive", tasks: ["Study system design fundamentals", "Build one end-to-end project"], milestone: "Deploy a project to production" },
          { phase: "Week 5-6", title: "Interview Ready", tasks: ["Do 5 mock interviews", "Refine resume with AI feedback"], milestone: "Score 80%+ on mock interviews" },
        ],
        quickWins: ["Update LinkedIn headline", "Add 3 projects to GitHub", "Practice elevator pitch"],
        dealBreakers: ["No hands-on project experience", "Weak problem-solving fundamentals"],
        competitiveEdge: ["Open-source contributions", "Technical blog posts", "Hackathon participation"]
      });
    }
    setIsLoading(false);
  };

  // ─── Input Form ─────────────────────────────────────────────
  if (!roadmap) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roadmap to Hire</h2>
          <p className="text-muted-foreground mt-1 text-sm">See exactly what stands between you and your dream job.</p>
        </div>
        <Card className="border-white/5 bg-card/50 backdrop-blur-xl max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/20 rounded-2xl border border-white/5">
                <Map className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">Define Your Target</CardTitle>
            <p className="text-sm text-muted-foreground">We'll compare your Saarthi profile data against the requirements for your dream role.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Target Role *</label>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Frontend Developer, Data Scientist" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Target Company (optional)</label>
              <Input value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} placeholder="e.g. Google, TCS, any startup" className="bg-white/5 border-white/10" />
            </div>
            <Button onClick={generateRoadmap} disabled={isLoading || !targetRole.trim()} className="w-full h-12 text-lg font-bold">
              {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Your Gap...</> : <><Map className="mr-2 h-5 w-5" /> Generate My Roadmap</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Roadmap View ───────────────────────────────────────────
  const importanceColor = (imp: string) => {
    if (imp === "Critical") return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    if (imp === "Important") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Roadmap to <span className="text-primary">{targetRole}</span></h2>
          {targetCompany && <p className="text-sm text-muted-foreground mt-0.5">at {targetCompany}</p>}
        </div>
        <Button variant="outline" onClick={() => setRoadmap(null)}><Sparkles className="mr-2 h-4 w-4" /> New Analysis</Button>
      </div>

      {/* Readiness Gauge */}
      <Card className="border-white/5 bg-card/30 backdrop-blur-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />
        <CardContent className="p-8">
          <div className="flex items-center gap-8">
            <div className="text-center space-y-2">
              <div className="text-6xl font-bold text-white">{roadmap.readinessPercent}%</div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Current Readiness</div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${roadmap.readinessPercent >= 75 ? "bg-emerald-500" : roadmap.readinessPercent >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${roadmap.readinessPercent}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 italic">"{roadmap.gapSummary}"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Gaps */}
      <Card className="border-white/5 bg-card/30 backdrop-blur-md">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-2"><BarChart3 className="h-3 w-3" /> Skill Gap Analysis</h3>
          <div className="grid gap-4">
            {roadmap.missingSkills?.map((skill: any, i: number) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{skill.skill}</span>
                    <Badge className={importanceColor(skill.importance)}>{skill.importance}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{skill.currentLevel}% → {skill.requiredLevel}%</span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="absolute h-full bg-white/10 rounded-full" style={{ width: `${skill.requiredLevel}%` }} />
                  <div className={`absolute h-full rounded-full ${skill.currentLevel >= skill.requiredLevel ? "bg-emerald-500" : "bg-primary"}`} style={{ width: `${skill.currentLevel}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phased Roadmap */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-2"><Map className="h-3 w-3" /> Your Action Plan</h3>
        {roadmap.roadmapPhases?.map((phase: any, i: number) => (
          <Card key={i} className="border-white/5 bg-card/30 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all">
            <div className="flex">
              <div className="w-2 bg-gradient-to-b from-primary to-purple-600 shrink-0" />
              <CardContent className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-mono">{phase.phase}</Badge>
                  <h4 className="text-lg font-bold text-white">{phase.title}</h4>
                </div>
                <ul className="space-y-2 mb-4">
                  {phase.tasks?.map((task: string, j: number) => (
                    <li key={j} className="text-sm text-slate-400 flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {task}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <Award className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-300 font-medium">Milestone: {phase.milestone}</span>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Wins & Deal Breakers */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-white/5 bg-card/30 backdrop-blur-md">
          <CardContent className="p-5 space-y-3">
            <h4 className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-2"><Zap className="h-3 w-3" /> Quick Wins</h4>
            <ul className="space-y-2">
              {roadmap.quickWins?.map((w: string, i: number) => (
                <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2"><CheckCircle className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" /> {w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/30 backdrop-blur-md">
          <CardContent className="p-5 space-y-3">
            <h4 className="text-[10px] font-bold text-rose-400 tracking-widest uppercase flex items-center gap-2"><AlertCircle className="h-3 w-3" /> Deal Breakers</h4>
            <ul className="space-y-2">
              {roadmap.dealBreakers?.map((d: string, i: number) => (
                <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2"><AlertCircle className="h-3 w-3 text-rose-400 mt-0.5 shrink-0" /> {d}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/30 backdrop-blur-md">
          <CardContent className="p-5 space-y-3">
            <h4 className="text-[10px] font-bold text-purple-400 tracking-widest uppercase flex items-center gap-2"><Award className="h-3 w-3" /> Competitive Edge</h4>
            <ul className="space-y-2">
              {roadmap.competitiveEdge?.map((c: string, i: number) => (
                <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2"><Sparkles className="h-3 w-3 text-purple-400 mt-0.5 shrink-0" /> {c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
