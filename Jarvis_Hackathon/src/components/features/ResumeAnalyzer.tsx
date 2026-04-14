
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, AlertCircle, CheckCircle2, Loader2, Upload, Briefcase, ChevronRight } from "lucide-react";
import { analyzeResume } from "@/lib/gemini";
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for pdf.js (fallback to explicitly known version if pdfjsLib.version is undefined in esbuild)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '5.6.205'}/pdf.worker.min.mjs`;

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false); // Controls popup
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setError("");

    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
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
      setShowResults(true); // Open the popup
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
        {/* Left Column: Resume Input */}
        <div className="space-y-6">
          <Card className="flex flex-col h-full bg-card shadow-sm border-primary/10">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="flex justify-between items-center text-lg">
                <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Your Resume</span>
                <div>
                  <input 
                    type="file" 
                    accept=".pdf,.txt,.md" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isExtracting} className="shadow-sm">
                    {isExtracting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload PDF/Text
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Paste your resume text or upload a file. Use the scrollbar on the right to navigate long text.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {/* Added explicit height and vertical scrollbar based on user request */}
              <Textarea 
                placeholder="Paste your resume text here..." 
                className="h-[450px] w-full resize-none font-mono text-sm p-4 border-0 rounded-none focus-visible:ring-0 overflow-y-scroll bg-transparent"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: JD and Analyze */}
        <div className="space-y-6 flex flex-col h-full">
          <Card className="flex flex-col flex-1 bg-card shadow-sm border-primary/10">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Target Job Description (Optional)
              </CardTitle>
              <CardDescription>Paste the JD to get a match score and missing keywords.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Textarea 
                placeholder="Paste the job description here..." 
                className="h-[450px] w-full resize-none font-mono text-sm p-4 border-0 rounded-none focus-visible:ring-0 overflow-y-scroll bg-transparent"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none shadow-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || isExtracting} 
            className="w-full h-14 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Connecting to AI Brain...
              </>
            ) : (
              <>
                <FileText className="mr-3 h-6 w-6" />
                Analyze My Resume
              </>
            )}
          </Button>

          {/* Re-open results button if they closed the popup */}
          {result && !isAnalyzing && (
            <Button variant="outline" onClick={() => setShowResults(true)} className="w-full">
              View Last Analysis Results <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Results Popup Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="!max-w-[75vw] w-[75vw] p-0 overflow-hidden bg-background border-primary/20 shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 pb-2 border-b bg-muted/30">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Resume Analysis Report
            </DialogTitle>
            <DialogDescription>
              Detailed AI feedback to help you perfect your resume.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 bg-muted/10">
              {result && (
                <>
                  {/* Score */}
                  {result.score !== undefined && (
                    <Card className="border-primary/50 shadow-md bg-card overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <FileText className="h-24 w-24" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Overall Resume Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6">
                          <div className="text-5xl font-black text-primary drop-shadow-sm">{result.score}%</div>
                          <div className="flex-1">
                            <Progress value={result.score} className="h-4 shadow-inner" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* JD Keywords */}
                    {result.jdKeywordsMissing?.length > 0 && (
                      <Card className="shadow-sm border border-blue-500/20">
                        <CardHeader className="pb-3 bg-blue-500/5 rounded-t-xl">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            Missing JD Keywords
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex flex-wrap gap-2">
                            {result.jdKeywordsMissing.map((keyword: string, i: number) => (
                              <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-sm">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* General Missing Skills */}
                    <Card className="shadow-sm border border-orange-500/20">
                      <CardHeader className="pb-3 bg-orange-500/5 rounded-t-xl">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          Missing General Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills?.length > 0 ? (
                            result.missingSkills.map((skill: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 shadow-sm">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No critical skills missing found.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Weak Wording */}
                  <Card className="shadow-sm border border-destructive/20">
                    <CardHeader className="pb-3 bg-destructive/5 rounded-t-xl">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Weak Wording Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-4">
                        {result.weakWording?.length > 0 ? (
                          result.weakWording.map((item: any, i: number) => (
                            <li key={i} className="text-sm border-b last:border-0 pb-4 last:pb-0">
                              <div className="p-3 bg-muted/50 rounded-lg border border-border/50 mb-2">
                                <span className="line-through text-muted-foreground block text-xs mb-1 uppercase font-bold tracking-wider">Before</span>
                                <span className="text-muted-foreground">"{item.original}"</span>
                              </div>
                              <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                                <span className="text-green-600 block text-xs mb-1 uppercase font-bold tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Fix Suggestion
                                </span>
                                <span className="text-green-700 font-medium">"{item.suggestion}"</span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No weak wording detected.</p>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Actionable Feedback */}
                  <Card className="bg-primary/5 border-primary/20 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Actionable Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.actionableFeedback?.map((feedback: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm bg-background p-3 rounded-xl shadow-sm border border-border/50">
                            <span className="text-primary font-black mt-0.5">•</span>
                            <span className="text-foreground/80 leading-relaxed">{feedback}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Recommended Resources */}
                  {result.recommendedResources && result.recommendedResources.length > 0 && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                          <FileText className="h-6 w-6" />
                          Resume Building Resources
                        </CardTitle>
                        <CardDescription className="text-blue-600/80 text-base">
                          Your score suggests room for structural improvement. Use these free, highly-rated platforms to quickly generate a professional, ATS-friendly resume.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-4 pt-2">
                          {result.recommendedResources.map((resource: any, i: number) => (
                            <a 
                              key={i} 
                              href={resource.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow border border-blue-100 hover:bg-blue-600 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all"
                            >
                              {resource.name}
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
