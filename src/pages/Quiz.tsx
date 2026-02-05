import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import QuizOption from "@/components/QuizOption";
import { ArrowRight, Clock, BookOpen, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock questions
const mockQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    category: "Biology",
  },
  {
    id: 4,
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    category: "History",
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Chemistry",
  },
];

const quizModes = {
  normal: {
    title: "Normal Quiz",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
    timePerQuestion: 30,
  },
  daily: {
    title: "Daily Challenge",
    icon: Calendar,
    color: "text-game-daily",
    bgColor: "bg-game-daily/10",
    timePerQuestion: 20,
  },
  speed: {
    title: "Speed Quiz",
    icon: Zap,
    color: "text-game-speed",
    bgColor: "bg-game-speed/10",
    timePerQuestion: 10,
  },
};

const Quiz = () => {
  const { mode = "normal" } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; time: number }[]>([]);

  const quizConfig = quizModes[mode as keyof typeof quizModes] || quizModes.normal;
  const question = mockQuestions[currentQuestion];
  const totalQuestions = mockQuestions.length;

  // Timer
  useEffect(() => {
    if (isFinished || isRevealed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return quizConfig.timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isRevealed, isFinished]);

  const handleSubmit = () => {
    if (isRevealed) return;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    const timeTaken = quizConfig.timePerQuestion - timeLeft;
    
    if (isCorrect) {
      setScore((prev) => prev + 100 + Math.floor(timeLeft * 2));
    }
    
    setAnswers((prev) => [...prev, { correct: isCorrect, time: timeTaken }]);
    setIsRevealed(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setIsFinished(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
      setTimeLeft(quizConfig.timePerQuestion);
    }
  };

  if (isFinished) {
    const correctAnswers = answers.filter((a) => a.correct).length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const avgTime = Math.round(
      answers.reduce((sum, a) => sum + a.time, 0) / answers.length
    );

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-scale-in">
          <div className="bg-card rounded-2xl border border-border shadow-card p-8 text-center">
            <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground mb-8">Great job! Here's how you did:</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground">{score}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground">{avgTime}s</p>
                <p className="text-sm text-muted-foreground">Avg Time</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    answer.correct
                      ? "bg-success text-success-foreground"
                      : "bg-destructive text-destructive-foreground"
                  )}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/dashboard")}
              >
                Back to Home
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setIsRevealed(false);
                  setScore(0);
                  setTimeLeft(quizConfig.timePerQuestion);
                  setIsFinished(false);
                  setAnswers([]);
                }}
              >
                Play Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon = quizConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", quizConfig.bgColor)}>
              <Icon className={cn("w-5 h-5", quizConfig.color)} />
            </div>
            <div>
              <h1 className="font-bold text-foreground">{quizConfig.title}</h1>
              <p className="text-sm text-muted-foreground">{question.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-xl font-bold text-foreground">{score}</p>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl",
              timeLeft <= 10 ? "bg-destructive/10" : "bg-secondary"
            )}>
              <Clock className={cn("w-5 h-5", timeLeft <= 10 ? "text-destructive" : "text-muted-foreground")} />
              <span className={cn(
                "text-xl font-bold tabular-nums",
                timeLeft <= 10 ? "text-destructive" : "text-foreground"
              )}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8 animate-fade-in">
          <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
        </div>

        {/* Question */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h2 className="text-2xl font-bold text-foreground leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${150 + index * 50}ms` }}
            >
              <QuizOption
                option={option}
                label={["A", "B", "C", "D"][index]}
                isSelected={selectedAnswer === index}
                isCorrect={
                  isRevealed
                    ? index === question.correctAnswer
                      ? true
                      : selectedAnswer === index
                      ? false
                      : null
                    : null
                }
                isRevealed={isRevealed}
                onClick={() => !isRevealed && setSelectedAnswer(index)}
                disabled={isRevealed}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end animate-fade-in" style={{ animationDelay: "400ms" }}>
          {!isRevealed ? (
            <Button
              variant="gradient"
              size="lg"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button variant="gradient" size="lg" onClick={handleNext}>
              {currentQuestion + 1 >= totalQuestions ? "See Results" : "Next Question"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
