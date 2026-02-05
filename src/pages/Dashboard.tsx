import Header from "@/components/Header";
import GameModeCard from "@/components/GameModeCard";
import StatsCard from "@/components/StatsCard";
import LeaderboardItem from "@/components/LeaderboardItem";
import { BookOpen, Calendar, Swords, Zap, Trophy, Target, Flame, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@university.edu",
  };

  // Mock stats
  const stats = [
    { label: "Total Score", value: "12,450", icon: Trophy, trend: { value: 12, isPositive: true } },
    { label: "Quizzes Played", value: "47", icon: Target },
    { label: "Current Streak", value: "5 days", icon: Flame },
    { label: "Win Rate", value: "68%", icon: Award, trend: { value: 5, isPositive: true } },
  ];

  // Mock leaderboard
  const leaderboard = [
    { rank: 1, name: "Sarah Miller", score: 15420 },
    { rank: 2, name: "James Wilson", score: 14890 },
    { rank: 3, name: "Alex Johnson", score: 12450 },
    { rank: 4, name: "Emma Davis", score: 11200 },
    { rank: 5, name: "Michael Brown", score: 10850 },
  ];

  const gameModes = [
    {
      title: "Normal Quiz",
      description: "Classic quiz with Beginner, Intermediate, and Advanced levels. Perfect for practice!",
      icon: BookOpen,
      variant: "normal" as const,
      path: "/quiz/normal",
    },
    {
      title: "Daily Challenge",
      description: "One attempt per day. Test your knowledge and compete for the daily crown!",
      icon: Calendar,
      variant: "daily" as const,
      badge: "NEW",
      path: "/quiz/daily",
    },
    {
      title: "Battle Mode",
      description: "Real-time multiplayer quiz battles. Challenge friends or random opponents!",
      icon: Swords,
      variant: "battle" as const,
      path: "/matchmaking",
    },
    {
      title: "Speed Quiz",
      description: "Race against the clock! Answer as many questions as you can before time runs out.",
      icon: Zap,
      variant: "speed" as const,
      path: "/quiz/speed",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={() => navigate("/login")} />

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to test your knowledge today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Modes */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">Game Modes</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {gameModes.map((mode, index) => (
                <div
                  key={mode.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <GameModeCard
                    {...mode}
                    onClick={() => navigate(mode.path)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Top Players</h2>
              <button
                onClick={() => navigate("/leaderboard")}
                className="text-sm text-primary font-medium hover:underline"
              >
                View all
              </button>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card p-4">
              <div className="space-y-1">
                {leaderboard.map((player) => (
                  <LeaderboardItem
                    key={player.rank}
                    {...player}
                    isCurrentUser={player.name === user.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
