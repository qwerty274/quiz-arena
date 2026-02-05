import Header from "@/components/Header";
import LeaderboardItem from "@/components/LeaderboardItem";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Leaderboard = () => {
  const navigate = useNavigate();

  const user = {
    name: "Alex Johnson",
    email: "alex@university.edu",
  };

  // Mock leaderboard data
  const allTimeLeaderboard = [
    { rank: 1, name: "Sarah Miller", score: 45420 },
    { rank: 2, name: "James Wilson", score: 42890 },
    { rank: 3, name: "Michael Chen", score: 38450 },
    { rank: 4, name: "Emma Davis", score: 35200 },
    { rank: 5, name: "Alex Johnson", score: 32450 },
    { rank: 6, name: "Olivia Brown", score: 30100 },
    { rank: 7, name: "William Taylor", score: 28750 },
    { rank: 8, name: "Sophia Martinez", score: 26400 },
    { rank: 9, name: "Liam Anderson", score: 24200 },
    { rank: 10, name: "Ava Thompson", score: 22100 },
  ];

  const weeklyLeaderboard = [
    { rank: 1, name: "Emma Davis", score: 8420 },
    { rank: 2, name: "Alex Johnson", score: 7890 },
    { rank: 3, name: "James Wilson", score: 6450 },
    { rank: 4, name: "Sarah Miller", score: 5200 },
    { rank: 5, name: "Michael Chen", score: 4850 },
    { rank: 6, name: "Olivia Brown", score: 4100 },
    { rank: 7, name: "William Taylor", score: 3750 },
    { rank: 8, name: "Sophia Martinez", score: 3400 },
    { rank: 9, name: "Liam Anderson", score: 2900 },
    { rank: 10, name: "Ava Thompson", score: 2500 },
  ];

  const dailyLeaderboard = [
    { rank: 1, name: "Alex Johnson", score: 2450 },
    { rank: 2, name: "Emma Davis", score: 2100 },
    { rank: 3, name: "Michael Chen", score: 1890 },
    { rank: 4, name: "Sarah Miller", score: 1650 },
    { rank: 5, name: "James Wilson", score: 1420 },
    { rank: 6, name: "Olivia Brown", score: 1200 },
    { rank: 7, name: "William Taylor", score: 980 },
    { rank: 8, name: "Sophia Martinez", score: 850 },
    { rank: 9, name: "Liam Anderson", score: 720 },
    { rank: 10, name: "Ava Thompson", score: 580 },
  ];

  const TopThree = ({ data }: { data: typeof allTimeLeaderboard }) => (
    <div className="flex items-end justify-center gap-4 mb-8 pt-8">
      {/* Second Place */}
      <div className="text-center animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center border-4 border-muted-foreground/30">
            <span className="text-2xl font-bold text-muted-foreground">
              {data[1].name.charAt(0)}
            </span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted-foreground/30 flex items-center justify-center">
            <Medal className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <p className="font-semibold text-foreground text-sm">{data[1].name.split(" ")[0]}</p>
        <p className="text-xs text-muted-foreground">{data[1].score.toLocaleString()} pts</p>
        <div className="w-20 h-24 bg-muted/50 rounded-t-lg mx-auto mt-2 flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground">2</span>
        </div>
      </div>

      {/* First Place */}
      <div className="text-center animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-2 rounded-full gradient-accent flex items-center justify-center border-4 border-warning">
            <span className="text-3xl font-bold text-accent-foreground">
              {data[0].name.charAt(0)}
            </span>
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Crown className="w-8 h-8 text-warning" />
          </div>
        </div>
        <p className="font-bold text-foreground">{data[0].name.split(" ")[0]}</p>
        <p className="text-sm text-muted-foreground">{data[0].score.toLocaleString()} pts</p>
        <div className="w-24 h-32 gradient-primary rounded-t-lg mx-auto mt-2 flex items-center justify-center">
          <span className="text-3xl font-bold text-primary-foreground">1</span>
        </div>
      </div>

      {/* Third Place */}
      <div className="text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-accent/20 flex items-center justify-center border-4 border-accent/30">
            <span className="text-2xl font-bold text-accent">
              {data[2].name.charAt(0)}
            </span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
            <Award className="w-4 h-4 text-accent" />
          </div>
        </div>
        <p className="font-semibold text-foreground text-sm">{data[2].name.split(" ")[0]}</p>
        <p className="text-xs text-muted-foreground">{data[2].score.toLocaleString()} pts</p>
        <div className="w-20 h-16 bg-accent/10 rounded-t-lg mx-auto mt-2 flex items-center justify-center">
          <span className="text-2xl font-bold text-accent">3</span>
        </div>
      </div>
    </div>
  );

  const LeaderboardList = ({ data }: { data: typeof allTimeLeaderboard }) => (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card glow-border">
      <div className="p-4 space-y-1">
        {data.slice(3).map((player, index) => (
          <div
            key={player.rank}
            className="animate-fade-in"
            style={{ animationDelay: `${(index + 3) * 50}ms` }}
          >
            <LeaderboardItem
              {...player}
              isCurrentUser={player.name === user.name}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant="mesh" />
      <Header user={user} onLogout={() => navigate("/login")} />

      <main className="container py-8 max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow animate-glow">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Compete with other players and climb the ranks!
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="alltime" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="alltime">All Time</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="daily">Today</TabsTrigger>
          </TabsList>

          <TabsContent value="alltime">
            <TopThree data={allTimeLeaderboard} />
            <LeaderboardList data={allTimeLeaderboard} />
          </TabsContent>

          <TabsContent value="weekly">
            <TopThree data={weeklyLeaderboard} />
            <LeaderboardList data={weeklyLeaderboard} />
          </TabsContent>

          <TabsContent value="daily">
            <TopThree data={dailyLeaderboard} />
            <LeaderboardList data={dailyLeaderboard} />
          </TabsContent>
        </Tabs>

        {/* Your Rank */}
        <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">AJ</span>
              </div>
              <div>
                <p className="font-bold text-foreground">Your Ranking</p>
                <p className="text-sm text-muted-foreground">Keep playing to climb higher!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">#5</p>
              <p className="text-sm text-muted-foreground">32,450 pts</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
