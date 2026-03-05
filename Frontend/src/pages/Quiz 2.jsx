import { useState, useEffect } from "react";
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

// Function to decode HTML entities
const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SUBJECTS = ["DSA", "Operating System", "Linux", "MySQL"];

// Function to fetch questions from Open Trivia Database
const fetchQuestionsFromAPI = async (subject, amount) => {
  try {
    const subjectParam = subject ? `&subject=${encodeURIComponent(subject)}` : "";
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple&category=18${subjectParam}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results.map((item, index) => {
        const options = shuffleArray([
          decodeHTML(item.correct_answer),
          ...item.incorrect_answers.map(ans => decodeHTML(ans))
        ]);
        
        const correctAnswer = options.indexOf(decodeHTML(item.correct_answer));
        
        return {
          id: index + 1,
          question: decodeHTML(item.question),
          options: options,
          correctAnswer: correctAnswer,
          category: subject || decodeHTML(item.category),
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

const Quiz = () => {
  const { mode = "normal" } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [hasStarted, setHasStarted] = useState(false);

  const quizConfig = quizModes[mode] || quizModes.normal;
  const question = questions[currentQuestion];
  const totalQuestions = questions.length;

  // Fetch questions when quiz starts
  useEffect(() => {
    if (!hasStarted) return;
    const loadQuestion = async () => {
      setIsLoading(true);
      const fetchedQuestions = await fetchQuestionsFromAPI(selectedSubject, questionCount);
      setQuestions(fetchedQuestions);
      setTimeLeft(quizConfig.timePerQuestion);
      setIsLoading(false);
    };
    loadQuestion();
  }, [mode, quizConfig.timePerQuestion, selectedSubject, questionCount, hasStarted]);

  useEffect(() => {
    if (isFinished || isRevealed) return;
    if (!question) return;
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
    
    // Points based on quiz mode
    let points = 0;
    if (isCorrect) {
      if (mode === "normal") points = 14;
      else if (mode === "daily") points = 12;
      else if (mode === "speed") points = 10;
      else points = 14; // default to normal
      setScore((prev) => prev + points);
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
    const avgTime = Math.round(answers.reduce((sum, a) => sum + a.time, 0) / answers.length);

    // Save quiz result to database
    const saveResult = async () => {
      const token = localStorage.getItem("token");
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
          }),
        });

        const data = await response.json();
        console.log("Quiz result saved:", data);
      } catch (error) {
        console.error("Error saving quiz result:", error);
      }
    };

    // Save result when component mounts (only once)
    if (!sessionStorage.getItem(`quiz-saved-${Date.now()}`)) {
      saveResult();
      sessionStorage.setItem(`quiz-saved-${Date.now()}`, "true");
    }

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

  if (!hasStarted) {
    return (
      <div className="page-center">
        <AnimatedBackground variant="gradient" />
        <div className="card" style={{ padding: "2rem", width: "min(560px, 92vw)" }}>
          <h2 style={{ marginBottom: "1rem" }}>Setup Quiz</h2>
          <SubjectSelector
            subjects={SUBJECTS}
            selectedSubject={selectedSubject}
            onSelect={(subject) => setSelectedSubject(subject)}
            label="Choose subject"
          />
          <div style={{ marginTop: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--foreground)" }}>
              Number of questions
            </label>
            <input
              className="input"
              type="number"
              min={1}
              max={50}
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            />
          </div>
          <button
            className="btn btn-gradient"
            style={{ marginTop: "1.5rem", width: "100%" }}
            onClick={() => setHasStarted(true)}
            disabled={!selectedSubject}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-center">
        <AnimatedBackground variant="gradient" />
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", color: "var(--foreground)" }}>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="page-center">
        <AnimatedBackground variant="gradient" />
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", color: "var(--foreground)" }}>Failed to load quiz. Please try again.</p>
          <button className="btn btn-gradient" onClick={() => navigate("/dashboard")} style={{ marginTop: "1rem" }}>Back to Home</button>
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
              <p className="quiz-mode-category">{selectedSubject || question?.category}</p>
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

        <>
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
        </>
      </main>
    </div>
  );
};

export default Quiz;
