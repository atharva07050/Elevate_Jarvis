
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, GraduationCap, Mail, Sparkles } from "lucide-react";
import { getLocalUser, saveLocalUser, setCurrentSession } from "@/lib/storage";
import { UserProfile } from "@/lib/types";

const SAMPLE_PROFILE: UserProfile = {
  overall: 82,
  skillScore: 85,
  communication: 78,
  problemSolving: 84,
  topSkills: ["React.js", "TypeScript", "Node.js", "System Design"],
  areasForImprovement: ["DSA (Advanced)", "Advanced Cloud Architecture"],
  testTaken: true,
  history: [
    { date: "2024-03-10", score: 65 },
    { date: "2024-03-25", score: 72 },
    { date: "2024-04-05", score: 82 }
  ]
};

const NEW_USER_PROFILE: UserProfile = {
  overall: 0,
  skillScore: 0,
  communication: 0,
  problemSolving: 0,
  topSkills: [],
  areasForImprovement: [],
  testTaken: false,
  history: []
};

// Simple Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login({ onLogin }: { onLogin: (user: any, profile: UserProfile) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = (e?: React.FormEvent, googleLogin = false) => {
    e?.preventDefault();
    setLoading(true);
    
    // Use target email or simulated google email
    const authEmail = googleLogin ? "atharva07050@gmail.com" : email;
    if (!authEmail) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      let profile = getLocalUser(authEmail);

      if (!profile) {
        // If it's the specific target email, give sample data
        if (authEmail === "atharva07050@gmail.com") {
          profile = SAMPLE_PROFILE;
        } else {
          profile = NEW_USER_PROFILE;
        }
        saveLocalUser(authEmail, profile);
      }

      setCurrentSession(authEmail);
      onLogin({ email: authEmail, uid: authEmail }, profile);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Animated background highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <Card className="w-full max-w-md shadow-2xl border-white/5 bg-card/70 backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500" />
        
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/20 rounded-2xl shadow-inner border border-white/5 relative group">
              <GraduationCap className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-500 animate-bounce" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Saarthi Elevate
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium mt-1">
            Precision AI for your placement journey.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 pl-10 h-12 rounded-xl border-white/10 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-xl transition-all" 
              disabled={loading}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Enter Dashboard"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-bold">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 font-bold rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
            onClick={() => handleAuth(undefined, true)}
            disabled={loading}
          >
            <GoogleIcon />
            {loading ? "Connecting..." : "Sign in with Google"}
          </Button>

          <div className="text-center space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Local Storage Mode: Enabled
            </p>
            <p className="text-[10px] text-muted-foreground opacity-50">
              No cloud needed. Your data stays on your device.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
