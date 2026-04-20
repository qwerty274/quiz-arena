const SCIENCE_SUBJECT_KEYWORDS = {
  Physics: ["force", "motion", "energy", "velocity", "newton", "gravity", "light", "electric", "magnet", "wave"],
  Chemistry: ["chemical", "element", "acid", "base", "molecule", "compound", "reaction", "periodic", "ion", "ph"],
  Biology: ["cell", "dna", "gene", "organism", "plant", "animal", "human", "photosynthesis", "evolution", "blood"],
};

const FALLBACK_QUESTIONS = {
  Physics: [
    {
      question: "SI unit of force is?",
      options: ["Newton", "Joule", "Pascal", "Watt"],
      correctAnswer: 0,
    },
    {
      question: "Speed of light in vacuum is closest to?",
      options: ["3 x 10^8 m/s", "3 x 10^6 m/s", "3 x 10^5 km/s", "3 x 10^9 m/s"],
      correctAnswer: 0,
    },
  ],
  Chemistry: [
    {
      question: "pH of neutral water at room temperature is?",
      options: ["7", "1", "14", "0"],
      correctAnswer: 0,
    },
    {
      question: "Atomic number of Oxygen is?",
      options: ["8", "16", "6", "12"],
      correctAnswer: 0,
    },
  ],
  Biology: [
    {
      question: "Basic unit of life is?",
      options: ["Cell", "Tissue", "Organ", "System"],
      correctAnswer: 0,
    },
    {
      question: "Photosynthesis mainly occurs in?",
      options: ["Leaves", "Roots", "Stem", "Flowers"],
      correctAnswer: 0,
    },
  ],
  Maths: [
    {
      question: "Value of pi is approximately?",
      options: ["3.14", "2.14", "4.13", "1.34"],
      correctAnswer: 0,
    },
    {
      question: "If x + 5 = 12, x = ?",
      options: ["7", "5", "12", "17"],
      correctAnswer: 0,
    },
  ],
};

const shuffleArray = (array) => {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

const decodeHTML = (text = "") =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

export const generateQuestions = async (subject = "Physics", classLevel = "10", amount = 5) => {
  const nAmount = Number(amount) || 5;
  const category = subject === "Maths" ? 19 : 17;
  const difficulty = classLevel === "12" ? "medium" : "easy";
  const fetchAmount = subject === "Maths" ? nAmount : Math.min(nAmount * 4, 50);

  let remoteQuestions = [];
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${fetchAmount}&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    const data = await response.json().catch(() => ({}));
    remoteQuestions = Array.isArray(data.results) ? data.results : [];
  } catch (error) {
    console.warn("OpenTDB fetch failed, using fallback questions only.", error?.message || error);
    remoteQuestions = [];
  }

  let filtered = remoteQuestions;
  if (subject !== "Maths") {
    const keywords = SCIENCE_SUBJECT_KEYWORDS[subject] || [];
    filtered = remoteQuestions.filter((item) => {
      const text = `${item.question} ${item.correct_answer} ${item.incorrect_answers.join(" ")}`.toLowerCase();
      return keywords.some((word) => text.includes(word));
    });
  }

  const normalizedRemote = filtered.slice(0, nAmount).map((item, index) => {
    const options = shuffleArray([
      decodeHTML(item.correct_answer),
      ...item.incorrect_answers.map((ans) => decodeHTML(ans)),
    ]);
    return {
      id: index + 1,
      question: decodeHTML(item.question),
      options,
      correctAnswer: options.indexOf(decodeHTML(item.correct_answer)),
      category: subject,
    };
  });

  if (normalizedRemote.length >= nAmount) return normalizedRemote;

  const needed = nAmount - normalizedRemote.length;
  const localPool = FALLBACK_QUESTIONS[subject] || FALLBACK_QUESTIONS.Physics;
  const fallbackQuestions = Array.from({ length: needed }).map((_, idx) => {
    const item = localPool[idx % localPool.length];
    return {
      id: normalizedRemote.length + idx + 1,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      category: subject,
    };
  });

  return [...normalizedRemote, ...fallbackQuestions];
};
