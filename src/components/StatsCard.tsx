import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

const StatsCard = ({ label, value, icon: Icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn("stats-card glow-border", className)}>
      <div className="stats-card-inner">
        <div>
          <p className="stats-card-label">{label}</p>
          <p className="stats-card-value">{value}</p>
          {trend && (
            <p className={cn("stats-card-trend", trend.isPositive ? "positive" : "negative")}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="stats-card-icon-wrap">
          <Icon />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
