import { useEffect, useState } from "react";
import Header from "@/components/Header";
import GameModeCard from "@/components/GameModeCard";
import StatsCard from "@/components/StatsCard";
import LeaderboardItem from "@/components/LeaderboardItem";
import AnimatedBackground from "@/components/AnimatedBackground";
import { BookOpen, Calendar, Swords, Zap, Trophy, Target, Flame, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [topPlayers, setTopPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) navigate("/login");
}, []);

useEffect(() => {
  fetchTopPlayers();
}, []);

const fetchTopPlayers = async () => {
  try {
    setLoadingPlayers(true);
    const response = await fetch("http://localhost:4000/api/auth/leaderboard?limit=5");
    const data = await response.json();
    setTopPlayers(data);
  } catch (error) {
    console.error("Failed to fetch top players:", error);
    setTopPlayers([]);
  } finally {
    setLoadingPlayers(false);
  }
};


  const stats = [
    { label: "Total Score", value: "12,450", icon: Trophy, trend: { value: 12, isPositive: true } },
    { label: "Quizzes Played", value: "47", icon: Target },
    { label: "Current Streak", value: "5 days", icon: Flame },
    { label: "Win Rate", value: "68%", icon: Award, trend: { value: 5, isPositive: true } },
  ];

  const gameModes = [
    { title: "Normal Quiz", description: "Classic quiz with Beginner, Intermediate, and Advanced levels. Perfect for practice!", icon: BookOpen, variant: "normal", path: "/quiz/normal" },
    { title: "Daily Challenge", description: "One attempt per day. Test your knowledge and compete for the daily crown!", icon: Calendar, variant: "daily", badge: "NEW", path: "/quiz/daily" },
    { title: "Battle Mode", description: "Real-time multiplayer quiz battles. Challenge friends or random opponents!", icon: Swords, variant: "battle", path: "/matchmaking" },
    { title: "Speed Quiz", description: "Race against the clock! Answer as many questions as you can before time runs out.", icon: Zap, variant: "speed", path: "/quiz/speed" },
  ];

  const displayName = user?.name?.split(" ")[0] || "Player";

  return (
    <div className="page">
      <AnimatedBackground variant="mesh" />
      <Header />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="dashboard-welcome animate-fade-in" style={{ marginBottom: "2rem" }}>
          <h1>Welcome back, {displayName}! 👋</h1>
          <p>Ready to test your knowledge today?</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        <div className="dashboard-main">
          <div>
            <h2 className="section-heading">Game Modes</h2>
            <div className="game-modes-grid">
              {gameModes.map((mode, index) => (
                <div key={mode.title} className="animate-fade-in" style={{ animationDelay: `${(index + 4) * 50}ms` }}>
                  <GameModeCard {...mode} onClick={() => navigate(mode.path)} />
                </div>
              ))}
            </div>
          </div>

          <div className="leaderboard-sidebar animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="leaderboard-sidebar-header">
              <h2 className="section-heading" style={{ marginBottom: 0 }}>Top Players</h2>
              <button onClick={() => navigate("/leaderboard")} className="view-all-link">View all</button>
            </div>
            <div className="card glow-border" style={{ padding: "1rem" }}>
              {loadingPlayers ? (
                <div style={{ textAlign: "center", padding: "1rem", color: "var(--muted-foreground)" }}>
                  <p>Loading...</p>
                </div>
              ) : topPlayers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "1rem", color: "var(--muted-foreground)" }}>
                  <p>No players yet</p>
                </div>
              ) : (
                topPlayers.map((player) => (
                  <LeaderboardItem key={player.rank} {...player} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
