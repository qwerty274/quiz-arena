import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard = ({ label, value, icon: Icon, trend, className }: StatsCardProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border shadow-card",
        "transition-all duration-200 hover:shadow-card-hover glow-border",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium mt-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-secondary">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
