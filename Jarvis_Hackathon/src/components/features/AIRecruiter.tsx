
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, Activity, MessageSquare, Clock, BookOpen, 
  AlertCircle, Bot, Sparkles, CheckCircle, ArrowLeft,
  Star, TrendingUp, BarChart2, Printer, Briefcase,
  Target, ChevronRight, Loader2, ExternalLink,
  PlayCircle, PenTool, ClipboardList, Code2
} from 'lucide-react';
import { generateEvaluation, generateMentorPlan } from "@/lib/gemini";

// ─── Sub-Components ───────────────────────────────────────────────────────────

const EvaluationForm = ({ onSubmit, isSubmitting }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    aptitude_score: '',
    technical_score: '',
    interview_score: '',
    communication_feedback: '',
    time_taken: '',
    strong_topics: '',
    weak_topics: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="border-white/5 bg-card/50 backdrop-blur-xl max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
           <div className="p-3 bg-primary/20 rounded-2xl border border-white/5">
              <Bot className="h-8 w-8 text-primary" />
           </div>
        </div>
        <CardTitle className="text-2xl font-bold">AI Candidate Evaluator</CardTitle>
        <CardDescription>Enter candidate data to generate an objective AI-driven placement readiness report.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Candidate Name</label>
                <Input name="name" required placeholder="e.g. Jane Doe" value={formData.name} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Aptitude Score (0-100)</label>
                <Input type="number" name="aptitude_score" min="0" max="100" required placeholder="85" value={formData.aptitude_score} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Technical Score (0-100)</label>
                <Input type="number" name="technical_score" min="0" max="100" required placeholder="92" value={formData.technical_score} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Interview Score (0-100)</label>
                <Input type="number" name="interview_score" min="0" max="100" required placeholder="88" value={formData.interview_score} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Target Role</label>
                <Input name="role" required placeholder="Frontend Engineer" value={formData.role} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Strong Topics</label>
                <Input name="strong_topics" required placeholder="React, DSA, Git" value={formData.strong_topics} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><AlertCircle className="h-4 w-4 text-primary" /> Weak Topics</label>
                <Input name="weak_topics" required placeholder="System Design, AWS" value={formData.weak_topics} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Communication Feedback</label>
                <Textarea name="communication_feedback" required placeholder="Describe style..." value={formData.communication_feedback} onChange={handleChange} className="bg-white/5 border-white/10 h-[100px]" />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Generating Report...</> : "Generate AI Evaluation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ReportCard = ({ report, onReset, onGeneratePlan }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready for Placement': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Needs Improvement': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <Card className="border-white/5 bg-card/50 backdrop-blur-xl max-w-4xl mx-auto overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-primary" />
      <CardHeader className="border-b border-white/5 bg-white/5">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
               <Bot className="h-6 w-6 text-primary" /> AI RECRUITER REPORT
            </CardTitle>
            <p className="text-sm text-primary font-bold mt-1 tracking-widest uppercase">{report.subtitle}</p>
          </div>
          <Badge className={getStatusColor(report.hiringStatus)}>{report.hiringStatus}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">{report.skillScore}%</div>
            <div className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> Skill</div>
          </div>
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">{report.communicationScore}%</div>
            <div className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-center gap-1"><MessageSquare className="h-3 w-3 text-blue-500" /> Communication</div>
          </div>
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">{report.problemSolvingScore}%</div>
            <div className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-center gap-1"><Activity className="h-3 w-3 text-emerald-500" /> Problem Solving</div>
          </div>
        </div>

        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
           <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><BarChart2 className="h-4 w-4 text-primary" /> EXECUTIVE SUMMARY</h4>
           <p className="text-sm text-slate-300 leading-relaxed italic">"{report.summary}"</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <h4 className="text-[10px] font-bold text-emerald-400 mb-3 tracking-widest flex items-center gap-2"><CheckCircle className="h-3 w-3" /> STRENGTHS</h4>
              <ul className="space-y-2">
                {report.strengths.map((s: string, i: number) => <li key={i} className="text-sm text-emerald-100 flex items-center gap-2"><div className="w-1 h-1 bg-emerald-400 rounded-full"/> {s}</li>)}
              </ul>
           </div>
           <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
              <h4 className="text-[10px] font-bold text-amber-400 mb-3 tracking-widest flex items-center gap-2"><AlertCircle className="h-3 w-3" /> AREAS FOR GROWTH</h4>
              <ul className="space-y-2">
                {report.weaknesses.map((s: string, i: number) => <li key={i} className="text-sm text-amber-100 flex items-center gap-2"><div className="w-1 h-1 bg-amber-400 rounded-full"/> {s}</li>)}
              </ul>
           </div>
        </div>

        <div className="space-y-4">
           <h4 className="text-[10px] font-bold text-primary mb-3 tracking-widest">DETAILED ANALYSIS</h4>
           <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-muted-foreground block mb-1">Technical</span>
                <p className="text-xs text-slate-400 leading-tight">{report.detailedAnalysis.technical}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-muted-foreground block mb-1">Communication</span>
                <p className="text-xs text-slate-400 leading-tight">{report.detailedAnalysis.communication}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <span className="text-[10px] text-muted-foreground block mb-1">Logic</span>
                <p className="text-xs text-slate-400 leading-tight">{report.detailedAnalysis.problemSolving}</p>
              </div>
           </div>
        </div>
      </CardContent>

      <CardHeader className="bg-white/5 border-t border-white/5 p-6">
        <div className="flex flex-col md:flex-row gap-4">
           <Button variant="outline" onClick={onReset} className="flex-1"><ArrowLeft className="mr-2 h-4 w-4" /> Another Evaluation</Button>
           <Button onClick={() => onGeneratePlan(report.weaknesses.join(', '))} className="flex-1">
             <BookOpen className="mr-2 h-4 w-4" /> Personalized Mentor Plan
           </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

const MentorPlanView = ({ planData, onBack }: any) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Report
          </Button>
          <div className="text-right">
             <h2 className="text-xl font-bold">Strategic Mentorship Path</h2>
             <p className="text-xs text-muted-foreground">Expertly curated guidance based on your performance data.</p>
          </div>
       </div>

       <div className="space-y-6">
          {planData.map((item: any, i: number) => (
            <Card key={i} className="border-white/5 bg-card/30 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all">
               <div className="h-1 bg-gradient-to-r from-primary to-purple-500 opacity-50" />
               <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                           <span className="text-primary/50 text-xl font-mono">{i + 1}.</span> {item.topic}
                        </h3>
                        <p className="text-sm text-slate-400 max-w-2xl italic leading-relaxed">"{item.explanation}"</p>
                     </div>
                     <div className="flex gap-2">
                        {item.youtubeLink && (
                          <a href={item.youtubeLink} target="_blank" rel="noopener noreferrer">
                             <Button size="sm" variant="outline" className="text-rose-400 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/20">
                                <PlayCircle className="mr-2 h-4 w-4" /> YouTube
                             </Button>
                          </a>
                        )}
                        {item.leetcodeLink && (
                          <a href={item.leetcodeLink} target="_blank" rel="noopener noreferrer">
                             <Button size="sm" variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/20">
                                <Code2 className="mr-2 h-4 w-4" /> LeetCode
                             </Button>
                          </a>
                        )}
                     </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-2">
                           <ChevronRight className="h-3 w-3" /> Key Concepts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {item.keyConcepts?.map((c: string, idx: number) => (
                             <Badge key={idx} variant="secondary" className="bg-white/5 text-[10px] font-normal">{c}</Badge>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-purple-400 tracking-widest uppercase flex items-center gap-2">
                           <PenTool className="h-3 w-3" /> Revision Notes
                        </h4>
                        <ul className="space-y-1">
                           {item.notes?.map((n: string, idx: number) => (
                             <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-2">
                                <span className="text-purple-400 mt-1.5">•</span> {n}
                             </li>
                           ))}
                        </ul>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-2">
                           <ClipboardList className="h-3 w-3" /> Practice
                        </h4>
                        <ul className="space-y-1">
                           {item.practiceQuestions?.map((q: string, idx: number) => (
                             <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-2">
                                <span className="text-emerald-400 mt-1.5">•</span> {q}
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))}
       </div>
    </div>
  );
};

// ─── Main Module ──────────────────────────────────────────────────────────────

export default function AIRecruiter() {
  const [report, setReport] = useState<any>(null);
  const [mentorPlan, setMentorPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEvaluation = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await generateEvaluation(data);
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async (topics: string) => {
    setIsLoading(true);
    try {
      const res = await generateMentorPlan(topics);
      setMentorPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Tech Recruiter</h2>
        <p className="text-muted-foreground mt-1 text-sm">Automated scoring and mentorship mapping using multi-tier AI analysis.</p>
      </div>

      {!report ? (
        <EvaluationForm onSubmit={handleEvaluation} isSubmitting={isLoading} />
      ) : mentorPlan ? (
        <MentorPlanView planData={mentorPlan} onBack={() => setMentorPlan(null)} />
      ) : (
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center space-y-4">
               <Loader2 className="h-10 w-10 text-primary animate-spin" />
               <p className="font-bold text-primary animate-pulse">Designing your growth path...</p>
            </div>
          )}
          <ReportCard 
            report={report} 
            onReset={() => setReport(null)} 
            onGeneratePlan={handleGeneratePlan} 
          />
        </div>
      )}
    </div>
  );
}
