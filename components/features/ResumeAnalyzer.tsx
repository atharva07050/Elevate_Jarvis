import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { FileText, AlertCircle, CheckCircle2, Loader2, Upload, Briefcase } from "lucide-react";
import { analyzeResume } from "@/lib/gemini";
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setError("");

    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        setResumeText(fullText);
      } else {
        const text = await file.text();
        setResumeText(text);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to extract text from file. Please try pasting it instead.");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste or upload your resume text first.");
      return;
    }
    
    setIsAnalyzing(true);
    setError("");
    try {
      const data = await analyzeResume(resumeText, jdText);
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
        <h2 className="text-3xl font-bold tracking-tight">Resume Analyzer & JD Matcher</h2>
        <p className="text-muted-foreground">AI-powered checks for missing skills, weak wording, and job description matching.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Your Resume</span>
                <div>
                  <input 
                    type="file" 
                    accept=".pdf,.txt,.md" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isExtracting}>
                    {isExtracting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload PDF/Text
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Paste your resume text or upload a file.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste your resume text here..." 
                className="min-h-[200px] resize-none font-mono text-sm"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Target Job Description (Optional)
              </CardTitle>
              <CardDescription>Paste the JD to get a match score and missing keywords.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste the job description here..." 
                className="min-h-[150px] resize-none font-mono text-sm"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleAnalyze} disabled={isAnalyzing || isExtracting} className="w-full">
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
        </div>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!result && !isAnalyzing && !error && (
            <Card className="h-full min-h-[400px] flex items-center justify-center bg-muted/50 border-dashed">
              <CardContent className="text-center text-muted-foreground py-12">
                <FileText className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p>Results will appear here after analysis.</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {result.matchScore !== undefined && (
                <Card className="border-primary/50 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">JD Match Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-primary">{result.matchScore}%</div>
                      <div className="flex-1">
                        <Progress value={result.matchScore} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.jdKeywordsMissing?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      Missing JD Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.jdKeywordsMissing.map((keyword: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Missing General Skills
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
