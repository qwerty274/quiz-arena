import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Swords, Users, ArrowLeft, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Matchmaking = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "searching" | "found" | "ready">("idle");
  const [searchTime, setSearchTime] = useState(0);
  const [opponent, setOpponent] = useState<{ name: string; level: number } | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Simulate matchmaking
  useEffect(() => {
    if (status !== "searching") return;

    const timer = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    // Simulate finding opponent after 3-5 seconds
    const matchTimeout = setTimeout(() => {
      setOpponent({ name: "Emma Wilson", level: 12 });
      setStatus("found");
    }, 3000 + Math.random() * 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimeout);
    };
  }, [status]);

  // Countdown after match found
  useEffect(() => {
    if (status !== "found") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setStatus("ready");
          navigate("/quiz/battle");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <AnimatedBackground variant="particles" />
      
      {/* Header */}
      <header className="border-b border-border glass relative z-10">
        <div className="container flex items-center h-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="ml-4">
            <h1 className="font-bold text-foreground">Battle Mode</h1>
            <p className="text-sm text-muted-foreground">Real-time Quiz Battle</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg">
          {status === "idle" && (
            <div className="text-center animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-game-battle/20 mx-auto mb-6 flex items-center justify-center animate-glow shadow-glow-accent">
                <Swords className="w-12 h-12 text-game-battle" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ready for Battle?
              </h2>
              <p className="text-muted-foreground mb-8">
                Challenge a random opponent to a real-time quiz duel!
              </p>
              <Button
                variant="game"
                size="xl"
                className="gradient-accent"
                onClick={() => setStatus("searching")}
              >
                <Users className="w-5 h-5" />
                Find Opponent
              </Button>
            </div>
          )}

          {status === "searching" && (
            <div className="text-center animate-fade-in">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-game-battle/20" />
                <div className="absolute inset-0 rounded-full border-4 border-game-battle border-t-transparent animate-spin" />
                <div className="absolute inset-4 rounded-full bg-game-battle/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-game-battle animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Searching for Opponent...
              </h2>
              <p className="text-muted-foreground mb-2">
                Finding a worthy challenger
              </p>
              <p className="text-lg font-mono text-foreground tabular-nums">
                {formatTime(searchTime)}
              </p>
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => {
                  setStatus("idle");
                  setSearchTime(0);
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {(status === "found" || status === "ready") && opponent && (
            <div className="text-center animate-scale-in">
              <h2 className="text-xl font-bold text-foreground mb-8">
                Opponent Found!
              </h2>

              {/* VS Display */}
              <div className="flex items-center justify-center gap-8 mb-8">
                {/* You */}
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      AJ
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-foreground">You</p>
                  <p className="text-sm text-muted-foreground">Level 8</p>
                </div>

                {/* VS */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-accent-foreground">VS</span>
                  </div>
                </div>

                {/* Opponent */}
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-game-battle">
                    <AvatarFallback className="bg-game-battle text-accent-foreground text-2xl font-bold">
                      {opponent.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-foreground">{opponent.name}</p>
                  <p className="text-sm text-muted-foreground">Level {opponent.level}</p>
                </div>
              </div>

              {/* Countdown */}
              <div className="mb-8">
                <p className="text-muted-foreground mb-2">Battle starts in</p>
                <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-foreground">
                    {countdown}
                  </span>
                </div>
              </div>

              {/* Ready Status */}
              <div className="flex items-center justify-center gap-2 text-success">
                <Check className="w-5 h-5" />
                <span className="font-medium">Both players ready</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Matchmaking;
