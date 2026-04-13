import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { analyzeResume } from "@/lib/gemini";

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }
    
    setIsAnalyzing(true);
    setError("");
    try {
      const data = await analyzeResume(resumeText);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Resume Analyzer</h2>
        <p className="text-muted-foreground">AI-powered checks for missing skills and weak wording.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>Paste your resume text below for instant feedback.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea 
              placeholder="Paste your resume text here..." 
              className="min-h-[300px] h-full resize-none font-mono text-sm"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!result && !isAnalyzing && !error && (
            <Card className="h-full flex items-center justify-center bg-muted/50 border-dashed">
              <CardContent className="text-center text-muted-foreground py-12">
                <FileText className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p>Results will appear here after analysis.</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Missing Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills?.length > 0 ? (
                      result.missingSkills.map((skill: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No critical skills missing found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Weak Wording
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.weakWording?.length > 0 ? (
                      result.weakWording.map((item: any, i: number) => (
                        <li key={i} className="text-sm border-b last:border-0 pb-3 last:pb-0">
                          <span className="line-through text-muted-foreground block mb-1">"{item.original}"</span>
                          <span className="text-green-600 font-medium flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                            {item.suggestion}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No weak wording detected.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">Actionable Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.actionableFeedback?.map((feedback: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
