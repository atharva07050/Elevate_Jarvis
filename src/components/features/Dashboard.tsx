import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Code, MessageSquare, BrainCircuit } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>
        <p className="text-muted-foreground">Recruiter-style view of your placement readiness.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Readiness</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Score</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communication</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72/100</div>
            <Progress value={72} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problem Solving</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90/100</div>
            <Progress value={90} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
            <CardDescription>Skills verified through assessments and projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="text-sm py-1 px-3">React</Badge>
              <Badge variant="default" className="text-sm py-1 px-3">TypeScript</Badge>
              <Badge variant="default" className="text-sm py-1 px-3">Node.js</Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">Python</Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">SQL</Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">Docker</Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">AWS</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>Focus areas for the next 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <div>
                  <p className="text-sm font-medium leading-none">System Design</p>
                  <p className="text-sm text-muted-foreground">Score: 45/100</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div>
                  <p className="text-sm font-medium leading-none">Behavioral Interviews</p>
                  <p className="text-sm text-muted-foreground">Score: 60/100</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
