import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  variant?: "default" | "timer";
  className?: string;
}

const ProgressBar = ({ current, total, variant = "default", className }: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);

  const fillClass = variant === "timer"
    ? percentage > 30 ? "primary" : percentage > 10 ? "warning" : "danger"
    : "primary";

  return (
    <div className={cn("progress-bar-wrapper", className)}>
      <div className="progress-bar-header">
        <span>
          {variant === "timer" ? "Time remaining" : `Question ${current} of ${total}`}
        </span>
        {variant === "timer" && <strong>{current}s</strong>}
      </div>
      <div className="progress-bar-track">
        <div
          className={cn("progress-bar-fill", fillClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
