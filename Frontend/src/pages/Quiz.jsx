import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import QuizOption from "@/components/QuizOption";
import AnimatedBackground from "@/components/AnimatedBackground";
import SubjectSelector from "@/components/SubjectSelector";
import { ArrowRight, Clock, BookOpen, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const quizModes = {
  normal: { title: "Normal Quiz", icon: BookOpen, iconBg: "hsla(250, 90%, 65%, 0.1)", iconColor: "var(--primary)", timePerQuestion: 30 },
  daily: { title: "Daily Challenge", icon: Calendar, iconBg: "hsla(280, 85%, 65%, 0.1)", iconColor: "var(--game-daily)", timePerQuestion: 20 },
  speed: { title: "Speed Quiz", icon: Zap, iconBg: "hsla(160, 80%, 45%, 0.1)", iconColor: "var(--game-speed)", timePerQuestion: 10 },
};

const SUBJECTS = ["Physics", "Chemistry", "Biology", "Maths"];

const fetchQuestionsFromAPI = async ({ subject, classLevel, questionCount }) => {
  const response = await fetch(
    `http://localhost:4000/api/auth/quiz-questions?subject=${encodeURIComponent(subject)}&classLevel=${encodeURIComponent(classLevel)}&amount=${questionCount}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load questions");
  }
  return data.questions || [];
};

const Quiz = () => {
  const { mode = "normal" } = useParams();
  const navigate = useNavigate();
  const savedResultRef = useRef(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classLevel, setClassLevel] = useState("10");
  const [questionCount, setQuestionCount] = useState(10);

  const quizConfig = quizModes[mode] || quizModes.normal;
  const question = questions[currentQuestion];
  const totalQuestions = questions.length;

  useEffect(() => {
    if (!isFinished || savedResultRef.current) return;

    const saveResult = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const correctAnswers = answers.filter((a) => a.correct).length;

      try {
        const response = await fetch("http://localhost:4000/api/auth/quiz-result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            score,
            correctAnswers,
            totalQuestions,
            mode,
            subject: selectedSubject,
            classLevel,
            clientLocalDate: new Date().toLocaleDateString("en-CA"),
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Failed to save quiz result");
        }
      } catch (error) {
        console.error("Error saving quiz result:", error);
      }
    };

    savedResultRef.current = true;
    saveResult();
  }, [isFinished, answers, score, totalQuestions, mode, selectedSubject, classLevel]);

  useEffect(() => {
    if (isFinished || isRevealed || !hasStarted || !question) return;
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
  }, [currentQuestion, isRevealed, isFinished, hasStarted, question, quizConfig.timePerQuestion]);

  const startQuiz = async () => {
    if (!selectedSubject) {
      setLoadError("Please choose a subject");
      return;
    }

    setLoadError("");
    setIsLoading(true);
    setHasStarted(false);
    savedResultRef.current = false;
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setScore(0);
    setAnswers([]);

    try {
      const fetchedQuestions = await fetchQuestionsFromAPI({
        subject: selectedSubject,
        classLevel,
        questionCount,
      });
      if (!fetchedQuestions.length) {
        setLoadError("No questions found for selected options");
        return;
      }
      setQuestions(fetchedQuestions);
      setTimeLeft(quizConfig.timePerQuestion);
      setHasStarted(true);
    } catch (error) {
      setLoadError(error.message || "Failed to load quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isRevealed || !question) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    const timeTaken = quizConfig.timePerQuestion - timeLeft;

    if (isCorrect) {
      let points = 0;
      if (mode === "normal") points = 14;
      else if (mode === "daily") points = 12;
      else if (mode === "speed") points = 10;
      else points = 14;
      setScore((prev) => prev + points);
    }

    setAnswers((prev) => [...prev, { correct: isCorrect, time: timeTaken }]);
    setIsRevealed(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setIsFinished(true);
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setTimeLeft(quizConfig.timePerQuestion);
  };

  const resetToSetup = () => {
    savedResultRef.current = false;
    setHasStarted(false);
    setIsFinished(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setScore(0);
    setAnswers([]);
    setLoadError("");
  };

  if (isFinished) {
    const correctAnswers = answers.filter((a) => a.correct).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const avgTime = answers.length ? Math.round(answers.reduce((sum, a) => sum + a.time, 0) / answers.length) : 0;

    return (
      <div className="page-center">
        <AnimatedBackground variant="gradient" />
        <div className="quiz-results animate-scale-in">
          <div className="card quiz-results-card glow-border">
            <div className="quiz-results-icon gradient-primary">🎉</div>
            <h1>Quiz Complete!</h1>
            <p className="quiz-results-subtitle">Subject: {selectedSubject} | Class {classLevel}</p>
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
                <div key={index} className={cn("quiz-result-dot", answer.correct ? "correct" : "wrong")}>
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="quiz-results-actions">
              <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>Back to Home</button>
              <button className="btn btn-gradient" onClick={resetToSetup}>Play Again</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="page-center">
        <AnimatedBackground variant="gradient" />
        <div className="card glow-border animate-fade-in" style={{ width: "min(640px, 92vw)", padding: "1.5rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Quiz Setup</h2>
          <SubjectSelector subjects={SUBJECTS} selectedSubject={selectedSubject} onSelect={setSelectedSubject} />
          <div style={{ marginTop: "1rem" }}>
            <p style={{ marginBottom: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>Choose Class</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className={`btn ${classLevel === "10" ? "btn-gradient" : "btn-outline"}`}
                onClick={() => setClassLevel("10")}
              >
                10th
              </button>
              <button
                type="button"
                className={`btn ${classLevel === "12" ? "btn-gradient" : "btn-outline"}`}
                onClick={() => setClassLevel("12")}
              >
                12th
              </button>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <label className="label" htmlFor="questionCount">Number of Questions</label>
            <input
              id="questionCount"
              type="number"
              min={1}
              max={50}
              className="input"
              value={questionCount}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (!Number.isNaN(num)) {
                  setQuestionCount(Math.min(Math.max(num, 1), 50));
                }
              }}
            />
          </div>
          {loadError && (
            <p style={{ marginTop: "0.75rem", color: "var(--destructive)", fontSize: "0.875rem" }}>
              {loadError}
            </p>
          )}
          <button
            className="btn btn-gradient btn-lg"
            style={{ marginTop: "1rem", width: "100%" }}
            onClick={startQuiz}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Start Quiz"}
          </button>
        </div>
      </div>
    );
  }

  const Icon = quizConfig.icon;

  if (!question) {
    return (
      <div className="page-center">
        <AnimatedBackground variant="gradient" />
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", color: "var(--foreground)" }}>Failed to load quiz. Please try again.</p>
          <button className="btn btn-gradient" onClick={resetToSetup} style={{ marginTop: "1rem" }}>Back to Setup</button>
        </div>
      </div>
    );
  }

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
              <p className="quiz-mode-category">{selectedSubject} | Class {classLevel}</p>
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
