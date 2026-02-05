import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface QuizOptionProps {
  option: string;
  label: string;
  isSelected: boolean;
  isCorrect?: boolean | null;
  isRevealed: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const optionLabels = ["A", "B", "C", "D"];

const QuizOption = ({
  option,
  label,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
  disabled,
}: QuizOptionProps) => {
  const getStateStyles = () => {
    if (!isRevealed) {
      return isSelected
        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
        : "border-border hover:border-primary/30 hover:bg-secondary/50";
    }

    if (isCorrect === true) {
      return "border-success bg-success/10";
    }
    if (isCorrect === false && isSelected) {
      return "border-destructive bg-destructive/10";
    }
    return "border-border opacity-50";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isRevealed}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed",
        getStateStyles()
      )}
    >
      <div className="flex items-center gap-4">
        {/* Option label */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center font-bold",
            "transition-colors duration-200",
            isRevealed && isCorrect === true && "bg-success text-success-foreground",
            isRevealed && isCorrect === false && isSelected && "bg-destructive text-destructive-foreground",
            !isRevealed && isSelected && "bg-primary text-primary-foreground",
            !isRevealed && !isSelected && "bg-secondary text-secondary-foreground"
          )}
        >
          {isRevealed && isCorrect === true ? (
            <Check className="w-5 h-5" />
          ) : isRevealed && isCorrect === false && isSelected ? (
            <X className="w-5 h-5" />
          ) : (
            label
          )}
        </div>

        {/* Option text */}
        <span className="flex-1 font-medium text-foreground">{option}</span>
      </div>
    </button>
  );
};

export default QuizOption;
