import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface GameModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "normal" | "daily" | "battle" | "speed";
  badge?: string;
  onClick: () => void;
  disabled?: boolean;
}

const variantStyles = {
  normal: {
    gradient: "from-primary to-primary/80",
    iconBg: "bg-primary/20",
    hoverBorder: "hover:border-primary/30",
  },
  daily: {
    gradient: "from-game-daily to-game-daily/80",
    iconBg: "bg-game-daily/20",
    hoverBorder: "hover:border-game-daily/30",
  },
  battle: {
    gradient: "from-game-battle to-game-battle/80",
    iconBg: "bg-game-battle/20",
    hoverBorder: "hover:border-game-battle/30",
  },
  speed: {
    gradient: "from-game-speed to-game-speed/80",
    iconBg: "bg-game-speed/20",
    hoverBorder: "hover:border-game-speed/30",
  },
};

const GameModeCard = ({
  title,
  description,
  icon: Icon,
  variant,
  badge,
  onClick,
  disabled = false,
}: GameModeCardProps) => {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative w-full p-6 rounded-2xl bg-card border-2 border-border",
        "shadow-card transition-all duration-300",
        "hover:shadow-card-hover hover:-translate-y-1",
        styles.hoverBorder,
        "text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed hover:translate-y-0"
      )}
    >
      {/* Badge */}
      {badge && (
        <span
          className={cn(
            "absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold",
            "bg-gradient-to-r text-primary-foreground shadow-sm",
            styles.gradient
          )}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
          "transition-transform duration-300 group-hover:scale-110",
          styles.iconBg
        )}
      >
        <Icon
          className={cn("w-7 h-7", {
            "text-primary": variant === "normal",
            "text-game-daily": variant === "daily",
            "text-game-battle": variant === "battle",
            "text-game-speed": variant === "speed",
          })}
        />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl",
          "bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity",
          styles.gradient
        )}
      />
    </button>
  );
};

export default GameModeCard;
