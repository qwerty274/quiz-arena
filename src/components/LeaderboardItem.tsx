import { cn } from "@/lib/utils";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardItemProps {
  rank: number;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

const LeaderboardItem = ({ rank, name, score, isCurrentUser }: LeaderboardItemProps) => {
  const getRankIcon = () => {
    switch (rank) {
      case 1: return <Trophy style={{ width: "1.25rem", height: "1.25rem", color: "var(--warning)" }} />;
      case 2: return <Medal style={{ width: "1.25rem", height: "1.25rem", color: "var(--muted-foreground)" }} />;
      case 3: return <Award style={{ width: "1.25rem", height: "1.25rem", color: "var(--accent)" }} />;
      default: return <span className="leaderboard-rank-num">{rank}</span>;
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarBg = rank === 1 ? "hsla(45, 95%, 55%, 0.2)" :
    rank === 2 ? "var(--muted)" :
    rank === 3 ? "hsla(340, 85%, 60%, 0.2)" : "var(--secondary)";

  const avatarColor = rank === 1 ? "var(--warning)" :
    rank === 2 ? "var(--muted-foreground)" :
    rank === 3 ? "var(--accent)" : "var(--secondary-foreground)";

  return (
    <div className={cn("leaderboard-item", isCurrentUser && "current-user")}>
      <div className="leaderboard-rank">{getRankIcon()}</div>
      <div className="avatar" style={{ background: avatarBg, color: avatarColor }}>
        {getInitials(name)}
      </div>
      <div className="leaderboard-name">
        <p className={cn(isCurrentUser && "highlight")}>
          {name}
          {isCurrentUser && <span>(You)</span>}
        </p>
      </div>
      <div className="leaderboard-score">
        <p>{score.toLocaleString()}</p>
        <small>pts</small>
      </div>
    </div>
  );
};

export default LeaderboardItem;
