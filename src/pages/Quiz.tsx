import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import QuizOption from "@/components/QuizOption";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ArrowRight, Clock, BookOpen, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const mockQuestions = [
  { id: 1, question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswer: 2, category: "Geography" },
  { id: 2, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: 1, category: "Science" },
  { id: 3, question: "What is the largest mammal in the world?", options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correctAnswer: 1, category: "Biology" },
  { id: 4, question: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], correctAnswer: 2, category: "History" },
  { id: 5, question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correctAnswer: 2, category: "Chemistry" },
];

const quizModes: Record<string, { title: string; icon: typeof BookOpen; iconBg: string; iconColor: string; timePerQuestion: number }> = {
  normal: { title: "Normal Quiz", icon: BookOpen, iconBg: "hsla(250, 90%, 65%, 0.1)", iconColor: "var(--primary)", timePerQuestion: 30 },
  daily: { title: "Daily Challenge", icon: Calendar, iconBg: "hsla(280, 85%, 65%, 0.1)", iconColor: "var(--game-daily)", timePerQuestion: 20 },
  speed: { title: "Speed Quiz", icon: Zap, iconBg: "hsla(160, 80%, 45%, 0.1)", iconColor: "var(--game-speed)", timePerQuestion: 10 },
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

  const quizConfig = quizModes[mode] || quizModes.normal;
  const question = mockQuestions[currentQuestion];
  const totalQuestions = mockQuestions.length;

  useEffect(() => {
    if (isFinished || isRevealed) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleSubmit(); return quizConfig.timePerQuestion; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, isRevealed, isFinished]);

  const handleSubmit = () => {
    if (isRevealed) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    const timeTaken = quizConfig.timePerQuestion - timeLeft;
    if (isCorrect) setScore((prev) => prev + 100 + Math.floor(timeLeft * 2));
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
    const avgTime = Math.round(answers.reduce((sum, a) => sum + a.time, 0) / answers.length);

    return (
      <div className="page-center">
        <AnimatedBackground variant="gradient" />
        <div className="quiz-results animate-scale-in">
          <div className="card quiz-results-card glow-border">
            <div className="quiz-results-icon gradient-primary">🎉</div>
            <h1>Quiz Complete!</h1>
            <p className="quiz-results-subtitle">Great job! Here's how you did:</p>
            <div className="quiz-results-stats">
              <div className="quiz-results-stat">
                <p className="quiz-results-stat-value">{score}</p>
                <p className="quiz-results-stat-label">Points</p>
              </div>
              <div className="quiz-results-stat">
                <p className="quiz-results-stat-value">{accuracy}%</p>
                <p className="quiz-results-stat-label">Accuracy</p>
              </div>
              <div className="quiz-results-stat">
                <p className="quiz-results-stat-value">{avgTime}s</p>
                <p className="quiz-results-stat-label">Avg Time</p>
              </div>
            </div>
            <div className="quiz-results-dots">
              {answers.map((answer, index) => (
                <div key={index} className={cn("quiz-result-dot", answer.correct ? "correct" : "wrong")}>{index + 1}</div>
              ))}
            </div>
            <div className="quiz-results-actions">
              <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>Back to Home</button>
              <button className="btn btn-gradient" onClick={() => {
                setCurrentQuestion(0); setSelectedAnswer(null); setIsRevealed(false);
                setScore(0); setTimeLeft(quizConfig.timePerQuestion); setIsFinished(false); setAnswers([]);
              }}>Play Again</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon = quizConfig.icon;

  return (
    <div className="page">
      <AnimatedBackground variant="gradient" />

      <header className="quiz-header glass">
        <div className="container quiz-header-inner">
          <div className="quiz-header-left">
            <div className="quiz-mode-icon" style={{ background: quizConfig.iconBg }}>
              <Icon style={{ color: quizConfig.iconColor }} />
            </div>
            <div>
              <p className="quiz-mode-title">{quizConfig.title}</p>
              <p className="quiz-mode-category">{question.category}</p>
            </div>
          </div>
          <div className="quiz-header-right">
            <div style={{ textAlign: "right" }}>
              <p className="quiz-score-label">Score</p>
              <p className="quiz-score-value">{score}</p>
            </div>
            <div className={cn("quiz-timer", timeLeft <= 10 && "danger")}>
              <Clock />
              <span className="quiz-timer-value">{timeLeft}s</span>
            </div>
          </div>
        </div>
      </header>

      <main className="quiz-main">
        <div className="animate-fade-in" style={{ marginBottom: "2rem" }}>
          <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
        </div>

        <h2 className="quiz-question animate-fade-in" style={{ animationDelay: "100ms" }}>
          {question.question}
        </h2>

        <div className="quiz-options">
          {question.options.map((option, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${150 + index * 50}ms` }}>
              <QuizOption
                option={option}
                label={["A", "B", "C", "D"][index]}
                isSelected={selectedAnswer === index}
                isCorrect={isRevealed ? (index === question.correctAnswer ? true : selectedAnswer === index ? false : null) : null}
                isRevealed={isRevealed}
                onClick={() => !isRevealed && setSelectedAnswer(index)}
                disabled={isRevealed}
              />
            </div>
          ))}
        </div>

        <div className="quiz-actions animate-fade-in" style={{ animationDelay: "400ms" }}>
          {!isRevealed ? (
            <button className="btn btn-gradient btn-lg" onClick={handleSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </button>
          ) : (
            <button className="btn btn-gradient btn-lg" onClick={handleNext}>
              {currentQuestion + 1 >= totalQuestions ? "See Results" : "Next Question"}
              <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
