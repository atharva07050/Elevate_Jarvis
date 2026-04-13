import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Target, Activity, Trophy, Lightbulb } from "lucide-react";
import { generateStarStory } from "@/lib/gemini";

type StarResult = {
  situation: string;
  task: string;
  action: string;
  result: string;
  tips: string[];
};

export default function StarBuilder() {
  const [scenario, setScenario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [starStory, setStarStory] = useState<StarResult | null>(null);

  const handleGenerate = async () => {
    if (!scenario.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await generateStarStory(scenario);
      setStarStory(result);
    } catch (error) {
      console.error("Failed to generate STAR story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">STAR Story Builder</h2>
        <p className="text-muted-foreground">Turn your raw experiences into perfect behavioral interview answers.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 flex-1">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Your Experience</CardTitle>
            <CardDescription>Briefly describe a challenge you faced or a project you completed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="e.g., Our website was loading very slowly, so I optimized the images and implemented lazy loading. It made the site 50% faster and the client was happy." 
              className="min-h-[200px] resize-none"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleGenerate} disabled={isLoading || !scenario.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Formatting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Format as STAR
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {starStory ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Situation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{starStory.situation}</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-orange-500" />
                      Task
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{starStory.task}</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      Action
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{starStory.action}</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-500" />
                      Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{starStory.result}</p>
                  </CardContent>
                </Card>
              </div>

              {starStory.tips && starStory.tips.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Interview Tips for this Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {starStory.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center bg-muted/50 border-dashed">
              <CardContent className="text-center text-muted-foreground py-12">
                <Sparkles className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p>Your formatted STAR story will appear here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
