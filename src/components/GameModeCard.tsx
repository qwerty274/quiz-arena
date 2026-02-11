import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "normal" | "daily" | "battle" | "speed";
  badge?: string;
  onClick: () => void;
  disabled?: boolean;
}

const GameModeCard = ({ title, description, icon: Icon, variant, badge, onClick, disabled = false }: GameModeCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(`game-card game-card-${variant} glow-border`, disabled && "disabled")}
    >
      {badge && (
        <span className="game-card-badge">{badge}</span>
      )}
      <div className="game-card-icon">
        <Icon />
      </div>
      <h3 className="game-card-title">{title}</h3>
      <p className="game-card-desc">{description}</p>
      <div className="game-card-bar" />
    </button>
  );
};

export default GameModeCard;
