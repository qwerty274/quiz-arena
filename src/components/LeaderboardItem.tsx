import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      case 1:
        return <Trophy className="w-5 h-5 text-warning" />;
      case 2:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 3:
        return <Award className="w-5 h-5 text-accent" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-3 rounded-xl transition-colors",
        isCurrentUser
          ? "bg-primary/5 border border-primary/20"
          : "hover:bg-secondary/50"
      )}
    >
      {/* Rank */}
      <div className="w-8 flex justify-center">{getRankIcon()}</div>

      {/* Avatar */}
      <Avatar className="w-10 h-10">
        <AvatarFallback
          className={cn(
            "text-sm font-semibold",
            rank === 1 && "bg-warning/20 text-warning",
            rank === 2 && "bg-muted text-muted-foreground",
            rank === 3 && "bg-accent/20 text-accent",
            rank > 3 && "bg-secondary text-secondary-foreground"
          )}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-semibold truncate",
            isCurrentUser ? "text-primary" : "text-foreground"
          )}
        >
          {name}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
          )}
        </p>
      </div>

      {/* Score */}
      <div className="text-right">
        <p className="font-bold text-foreground">{score.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">pts</p>
      </div>
    </div>
  );
};

export default LeaderboardItem;
