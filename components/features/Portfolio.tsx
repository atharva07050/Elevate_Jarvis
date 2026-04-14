
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Globe, Loader2, Download, Share2, Eye, CheckCircle,
  Star, TrendingUp, Code, MessageSquare, BarChart3,
  User, Briefcase, Award, Sparkles, ExternalLink, Copy
} from "lucide-react";
import { getCurrentSession } from "@/lib/storage";
import { sendChatMessage } from "@/lib/gemini";

export default function Portfolio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");

  const generatePortfolio = async () => {
    if (!name.trim()) return;
    setIsGenerating(true);

    // Gather user data from the session
    const session = getCurrentSession();
    const profile = session?.profile;

    const prompt = `You are a professional portfolio generator for Saarthi AI Placement Hub.
Generate a professional portfolio summary for this candidate:

Name: ${name}
Target Role: ${role || "Software Engineer"}
GitHub: ${github || "N/A"}
LinkedIn: ${linkedin || "N/A"}
Bio: ${bio || "N/A"}
Saarthi Assessment Data: ${JSON.stringify(profile || {})}

Return a JSON object:
{
  "headline": "A catchy one-line professional headline",
  "about": "A 3-4 sentence professional summary paragraph",
  "topSkills": [{"name": "string", "level": number 0-100}],
  "achievements": ["string", "string", "string"],
  "interviewReadiness": number 0-100,
  "recommendedRoles": ["string", "string"],
  "strengthAreas": [{"area": "string", "description": "string"}],
  "portfolioTips": ["string", "string"]
}`;

    try {
      const res = await sendChatMessage([], prompt);
      const parsed = JSON.parse(res.replace(/```json\n?/g, "").replace(/```/g, "").trim());
      setPortfolio(parsed);
    } catch {
      setPortfolio({
        headline: `${role || "Software"} Professional | Ready for Impact`,
        about: `${name} is an aspiring ${role || "Software Engineer"} with strong analytical skills and a passion for building impactful solutions. With a solid foundation in modern technologies and excellent problem-solving abilities, they are ready to contribute meaningfully to any team.`,
        topSkills: [
          { name: "Problem Solving", level: profile?.problemSolving || 75 },
          { name: "Communication", level: profile?.communication || 70 },
          { name: "Technical Skills", level: profile?.skillScore || 80 },
          { name: "Adaptability", level: 78 },
        ],
        achievements: ["Completed AI-powered Mock Interviews", "Resume optimized with AI analysis", "Consistent self-improvement track record"],
        interviewReadiness: profile?.overall || 70,
        recommendedRoles: [role || "Software Engineer", "Full-Stack Developer"],
        strengthAreas: [
          { area: "Technical Foundation", description: "Strong grasp of core CS fundamentals" },
          { area: "Communication", description: "Clear and structured verbal skills" }
        ],
        portfolioTips: ["Add 2-3 projects to GitHub", "Write a technical blog post"]
      });
    }
    setIsGenerating(false);
  };

  const copyPortfolioText = () => {
    if (!portfolio) return;
    const text = `
${name} — ${portfolio.headline}

${portfolio.about}

Skills: ${portfolio.topSkills.map((s: any) => `${s.name} (${s.level}%)`).join(", ")}

Achievements:
${portfolio.achievements.map((a: string) => `• ${a}`).join("\n")}

Interview Readiness: ${portfolio.interviewReadiness}%
Recommended Roles: ${portfolio.recommendedRoles.join(", ")}
    `.trim();
    navigator.clipboard.writeText(text);
  };

  // ─── Input Form ─────────────────────────────────────────────
  if (!portfolio) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Portfolio Generator</h2>
          <p className="text-muted-foreground mt-1 text-sm">Auto-generate a professional placement portfolio from your Saarthi data.</p>
        </div>
        <Card className="border-white/5 bg-card/50 backdrop-blur-xl max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/20 rounded-2xl border border-white/5">
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">Build Your Portfolio</CardTitle>
            <p className="text-sm text-muted-foreground">We'll combine your profile data with AI to create a professional placement portfolio.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Full Name *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Target Role</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Developer" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Code className="h-4 w-4 text-primary" /> GitHub URL</label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/username" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><ExternalLink className="h-4 w-4 text-primary" /> LinkedIn URL</label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/name" className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Short Bio</label>
              <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Passionate developer with a love for clean code..." className="bg-white/5 border-white/10" />
            </div>
            <Button onClick={generatePortfolio} disabled={isGenerating || !name.trim()} className="w-full h-12 text-lg font-bold">
              {isGenerating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Crafting Your Portfolio...</> : <><Sparkles className="mr-2 h-5 w-5" /> Generate AI Portfolio</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Portfolio View ─────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your AI Portfolio</h2>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={copyPortfolioText}><Copy className="mr-2 h-4 w-4" /> Copy Text</Button>
          <Button variant="outline" size="sm" onClick={() => setPortfolio(null)}><Sparkles className="mr-2 h-4 w-4" /> Regenerate</Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="border-white/5 bg-card/30 backdrop-blur-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
        <CardContent className="p-8 space-y-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              <p className="text-primary font-semibold">{portfolio.headline}</p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{portfolio.about}</p>
              <div className="flex gap-2 pt-2">
                {github && <Badge variant="secondary" className="bg-white/5"><Code className="h-3 w-3 mr-1" /> GitHub</Badge>}
                {linkedin && <Badge variant="secondary" className="bg-white/5"><ExternalLink className="h-3 w-3 mr-1" /> LinkedIn</Badge>}
                <Badge className="bg-primary/20 text-primary">{role || "Software Engineer"}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Readiness */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-white/5 bg-card/30 backdrop-blur-md md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-2"><BarChart3 className="h-3 w-3" /> Core Skills</h3>
            {portfolio.topSkills?.map((skill: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className={`font-bold ${skill.level >= 75 ? "text-emerald-400" : skill.level >= 50 ? "text-amber-400" : "text-rose-400"}`}>{skill.level}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/30 backdrop-blur-md">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-[10px] font-bold text-primary tracking-widest uppercase">Interview Ready</h3>
            <div className="text-5xl font-bold text-white">{portfolio.interviewReadiness}%</div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-muted-foreground tracking-widest">BEST FIT ROLES</h4>
              {portfolio.recommendedRoles?.map((r: string, i: number) => (
                <Badge key={i} variant="secondary" className="bg-white/5 block">{r}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="border-white/5 bg-card/30 backdrop-blur-md">
        <CardContent className="p-6 space-y-3">
          <h3 className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-2"><Award className="h-3 w-3" /> Key Achievements</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {portfolio.achievements?.map((a: string, i: number) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">{a}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-white/5 bg-card/30 backdrop-blur-md">
        <CardContent className="p-6 space-y-3">
          <h3 className="text-[10px] font-bold text-amber-400 tracking-widest uppercase flex items-center gap-2"><Star className="h-3 w-3" /> Portfolio Enhancement Tips</h3>
          <div className="grid gap-2">
            {portfolio.portfolioTips?.map((tip: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <TrendingUp className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-sm text-amber-100">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
