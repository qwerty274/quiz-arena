import { useState } from "react";
import Header from "@/components/Header";
import LeaderboardItem from "@/components/LeaderboardItem";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("alltime");

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

  const tabs = { alltime: allTimeLeaderboard, weekly: weeklyLeaderboard, daily: dailyLeaderboard };
  const currentData = tabs[activeTab];

  const TopThree = ({ data }: { data: typeof allTimeLeaderboard }) => (
    <div className="podium">
      {/* Second Place */}
      <div className="podium-player animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="podium-avatar">
          <div className="podium-avatar-circle second">{data[1].name.charAt(0)}</div>
          <div className="podium-medal" style={{ background: "hsla(215, 20%, 65%, 0.3)" }}>
            <Medal style={{ color: "var(--muted-foreground)" }} />
          </div>
        </div>
        <p className="podium-name">{data[1].name.split(" ")[0]}</p>
        <p className="podium-pts">{data[1].score.toLocaleString()} pts</p>
        <div className="podium-bar second"><span className="podium-bar-num second">2</span></div>
      </div>

      {/* First Place */}
      <div className="podium-player animate-fade-in">
        <div className="podium-avatar">
          <div className="podium-avatar-circle first gradient-accent" style={{ color: "var(--accent-foreground)" }}>{data[0].name.charAt(0)}</div>
          <div className="podium-crown"><Crown /></div>
        </div>
        <p className="podium-name first">{data[0].name.split(" ")[0]}</p>
        <p className="podium-pts">{data[0].score.toLocaleString()} pts</p>
        <div className="podium-bar first gradient-primary"><span className="podium-bar-num first">1</span></div>
      </div>

      {/* Third Place */}
      <div className="podium-player animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="podium-avatar">
          <div className="podium-avatar-circle third">{data[2].name.charAt(0)}</div>
          <div className="podium-medal" style={{ background: "hsla(340, 85%, 60%, 0.2)" }}>
            <Award style={{ color: "var(--accent)" }} />
          </div>
        </div>
        <p className="podium-name">{data[2].name.split(" ")[0]}</p>
        <p className="podium-pts">{data[2].score.toLocaleString()} pts</p>
        <div className="podium-bar third"><span className="podium-bar-num third">3</span></div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <AnimatedBackground variant="mesh" />
      <Header />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem", maxWidth: "42rem" }}>
        <div className="leaderboard-page-title animate-fade-in">
          <div className="leaderboard-trophy gradient-primary">
            <Trophy />
          </div>
          <h1>Leaderboard</h1>
          <p>Compete with other players and climb the ranks!</p>
        </div>

        {/* Tabs */}
        <div className="tabs-list">
          {[
            { key: "alltime", label: "All Time" },
            { key: "weekly", label: "This Week" },
            { key: "daily", label: "Today" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab-trigger ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <TopThree data={currentData} />

        <div className="card glow-border" style={{ padding: "1rem" }}>
          {currentData.slice(3).map((player, index) => (
            <div key={player.rank} className="animate-fade-in" style={{ animationDelay: `${(index + 3) * 50}ms` }}>
              <LeaderboardItem {...player} />
            </div>
          ))}
        </div>

        {/* Your Rank */}
        <div className="your-rank animate-fade-in">
          <div className="your-rank-inner">
            <div className="your-rank-left">
              <div className="your-rank-avatar">AJ</div>
              <div className="your-rank-info">
                <p>Your Ranking</p>
                <small>Keep playing to climb higher!</small>
              </div>
            </div>
            <div className="your-rank-right">
              <p className="your-rank-num">#5</p>
              <p className="your-rank-pts">32,450 pts</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
