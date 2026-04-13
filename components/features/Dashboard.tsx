import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, MessageSquare, BrainCircuit, AlertCircle, PlayCircle, TrendingUp } from "lucide-react";
import { UserProfile } from "@/App";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ profile, onTakeTest }: { profile: UserProfile, onTakeTest: () => void }) {
  if (!profile.testTaken) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please take the Pressure Test to generate your personalized placement readiness profile.
          </p>
        </div>
        <Button size="lg" onClick={onTakeTest}>
          <PlayCircle className="mr-2 h-5 w-5" />
          Take Pressure Test
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>
        <p className="text-muted-foreground">Recruiter-style view of your placement readiness based on your test results.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Readiness</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.overall}%</div>
            <p className="text-xs text-muted-foreground">Based on latest test</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Score</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.skillScore}/100</div>
            <Progress value={profile.skillScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communication</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.communication}/100</div>
            <Progress value={profile.communication} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problem Solving</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.problemSolving}/100</div>
            <Progress value={profile.problemSolving} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Readiness Progress
            </CardTitle>
            <CardDescription>Your overall score over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profile.history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Top Skills</CardTitle>
              <CardDescription>Skills verified through your assessment.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.topSkills.length > 0 ? profile.topSkills.map((skill, i) => (
                  <Badge key={i} variant={i < 2 ? "default" : "secondary"} className="text-sm py-1 px-3">{skill}</Badge>
                )) : (
                  <p className="text-sm text-muted-foreground">No skills verified yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Areas for Improvement</CardTitle>
              <CardDescription>Focus areas based on incorrect answers.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {profile.areasForImprovement.length > 0 ? profile.areasForImprovement.map((area, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${area.score < 50 ? 'bg-destructive' : 'bg-orange-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium leading-none">{area.name}</p>
                      <p className="text-sm text-muted-foreground">Score: {area.score}/100</p>
                    </div>
                  </li>
                )) : (
                  <p className="text-sm text-muted-foreground">You nailed it! Keep practicing to maintain your skills.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
