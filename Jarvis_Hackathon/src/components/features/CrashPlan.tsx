import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2, Target, CheckCircle2, Building } from "lucide-react";
import { generateCrashPlan } from "@/lib/gemini";

export default function CrashPlan() {
  const [weaknesses, setWeaknesses] = useState("");
  const [company, setCompany] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = async () => {
    if (!weaknesses.trim()) return;
    
    setIsGenerating(true);
    try {
      const data = await generateCrashPlan(weaknesses, company);
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">7-Day Crash Plan</h2>
        <p className="text-muted-foreground">Personalized placement prep schedule based on your weak areas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What do you need to improve?</CardTitle>
          <CardDescription>Enter your weaknesses and an optional target company.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weaknesses">Weaknesses</Label>
              <Input 
                id="weaknesses" 
                placeholder="e.g., Dynamic Programming, HR Interviews..." 
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Target Company (Optional)</Label>
              <div className="relative">
                <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="company" 
                  className="pl-9"
                  placeholder="e.g., Google, Amazon, Startup" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleGenerate} disabled={isGenerating || !weaknesses.trim()}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Calendar className="mr-2 h-4 w-4" />
            )}
            Generate Plan
          </Button>
        </CardFooter>
      </Card>

      {plan && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {plan.map((day: any, i: number) => (
            <Card key={i} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Day {day.day}</Badge>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg mt-2">{day.focus}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {day.tasks.map((task: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
