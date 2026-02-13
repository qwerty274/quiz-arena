import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Swords, Users, ArrowLeft, Loader2, Check } from "lucide-react";

const Matchmaking = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [searchTime, setSearchTime] = useState(0);
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (status !== "searching") return;
    const timer = setInterval(() => setSearchTime((prev) => prev + 1), 1000);
    const matchTimeout = setTimeout(() => {
      setOpponent({ name: "Emma Wilson", level: 12 });
      setStatus("found");
    }, 3000 + Math.random() * 2000);
    return () => { clearInterval(timer); clearTimeout(matchTimeout); };
  }, [status]);

  useEffect(() => {
    if (status !== "found") return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { setStatus("ready"); navigate("/quiz/battle"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <AnimatedBackground variant="particles" />

      <header className="matchmaking-header glass">
        <div className="container matchmaking-header-inner">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
          <div>
            <p style={{ fontWeight: 700, color: "var(--foreground)" }}>Battle Mode</p>
            <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Real-time Quiz Battle</p>
          </div>
        </div>
      </header>

      <main className="matchmaking-main">
        <div className="matchmaking-content">
          {status === "idle" && (
            <div className="animate-fade-in">
              <div className="matchmaking-icon animate-glow" style={{ boxShadow: "var(--shadow-glow-accent)" }}>
                <Swords />
              </div>
              <h2 className="matchmaking-title">Ready for Battle?</h2>
              <p className="matchmaking-subtitle">Challenge a random opponent to a real-time quiz duel!</p>
              <button className="btn btn-game btn-xl gradient-accent" onClick={() => setStatus("searching")}>
                <Users style={{ width: "1.25rem", height: "1.25rem" }} /> Find Opponent
              </button>
            </div>
          )}

          {status === "searching" && (
            <div className="animate-fade-in">
              <div className="matchmaking-spinner">
                <div className="matchmaking-spinner-ring" />
                <div className="matchmaking-spinner-active" />
                <div className="matchmaking-spinner-inner">
                  <Loader2 />
                </div>
              </div>
              <h2 className="matchmaking-title">Searching for Opponent...</h2>
              <p className="matchmaking-subtitle" style={{ marginBottom: "0.5rem" }}>Finding a worthy challenger</p>
              <p className="matchmaking-time">{formatTime(searchTime)}</p>
              <button className="btn btn-outline" style={{ marginTop: "2rem" }} onClick={() => { setStatus("idle"); setSearchTime(0); }}>
                Cancel
              </button>
            </div>
          )}

          {(status === "found" || status === "ready") && opponent && (
            <div className="animate-scale-in">
              <h2 className="matchmaking-title" style={{ marginBottom: "2rem" }}>Opponent Found!</h2>

              <div className="vs-display">
                <div className="vs-player">
                  <div className="vs-avatar" style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "4px solid var(--primary)" }}>AJ</div>
                  <p className="vs-player-name">You</p>
                  <p className="vs-player-level">Level 8</p>
                </div>

                <div className="vs-badge gradient-accent">
                  <span>VS</span>
                </div>

                <div className="vs-player">
                  <div className="vs-avatar" style={{ background: "var(--game-battle)", color: "var(--accent-foreground)", border: "4px solid var(--game-battle)" }}>
                    {opponent.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <p className="vs-player-name">{opponent.name}</p>
                  <p className="vs-player-level">Level {opponent.level}</p>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <p style={{ color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Battle starts in</p>
                <div className="countdown-circle gradient-primary">
                  <span className="countdown-value">{countdown}</span>
                </div>
              </div>

              <div className="ready-status">
                <Check /> <span>Both players ready</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Matchmaking;
