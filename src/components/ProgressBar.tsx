import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  variant?: "default" | "timer";
  className?: string;
}

const ProgressBar = ({
  current,
  total,
  variant = "default",
  className,
}: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {variant === "timer" ? "Time remaining" : `Question ${current} of ${total}`}
        </span>
        {variant === "timer" && (
          <span className="text-sm font-bold text-foreground">{current}s</span>
        )}
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variant === "timer"
              ? percentage > 30
                ? "gradient-primary"
                : percentage > 10
                ? "bg-warning"
                : "bg-destructive"
              : "gradient-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
