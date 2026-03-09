import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

const sanitizeAmount = (amount) => {
  const n = Number(amount);
  if (!Number.isInteger(n)) return 5;
  return Math.min(Math.max(n, 1), 50);
};

const buildToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "24h" });

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || 0,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!generalEmailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const allowedDomainRegex = /@(gmail\.com|yahoo\.com|chitkara\.edu\.in|mail\.com|gmx\.com|outlook\.com)$/i;
    if (!allowedDomainRegex.test(email)) {
      return res.status(400).json({
        message: "Email must end with @gmail.com, @yahoo.com, @chitkara.edu.in, @mail.com, @gmx.com or @outlook.com",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, contain 1 uppercase letter and 1 number",
      });
    }

    const usernameExists = await User.findOne({ name });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, avatar: 0 });
    const token = buildToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Don't Have an Account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = buildToken(user._id);
    res.json({
      message: "Login successful",
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || 0,
      createdAt: user.createdAt,
      totalScore: user.totalScore || 0,
      prevTotalScore: user.prevTotalScore || 0,
      totalQuizzes: user.totalQuizzes || 0,
      totalQuestions: user.totalQuestions || 0,
      correctAnswers: user.correctAnswers || 0,
      accuracy: user.accuracy || 0,
      prevAccuracy: user.prevAccuracy || 0,
      currentStreak: user.currentStreak || 0,
      lastQuizDate: user.lastQuizDate || null,
      lastQuizLocalDate: user.lastQuizLocalDate || null,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    const updates = {};

    if (avatar !== undefined) {
      const avatarNumber = Number(avatar);
      if (!Number.isInteger(avatarNumber) || avatarNumber < 0 || avatarNumber > 11) {
        return res.status(400).json({ message: "Avatar index must be between 0 and 11" });
      }
      updates.avatar = avatarNumber;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const saveQuizResult = async (req, res) => {
  try {
    const { score, correctAnswers, totalQuestions, mode, clientLocalDate } = req.body;
    const userId = req.user._id;
    if (score === undefined || correctAnswers === undefined || totalQuestions === undefined || !mode) {
      return res.status(400).json({ message: "All fields required" });
    }

    const incScore = Number(score) || 0;
    const incCorrect = Number(correctAnswers) || 0;
    const incTotalQuestions = Number(totalQuestions) || 0;
    const localDate = clientLocalDate || new Date().toISOString().slice(0, 10);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prevTotalScore = user.totalScore || 0;
    const prevAccuracy = user.accuracy || 0;
    const nextTotalScore = prevTotalScore + incScore;
    const nextTotalQuizzes = (user.totalQuizzes || 0) + 1;
    const nextCorrectAnswers = (user.correctAnswers || 0) + incCorrect;
    const nextTotalQuestions = (user.totalQuestions || 0) + incTotalQuestions;
    const nextAccuracy = nextTotalQuestions > 0
      ? Math.round((nextCorrectAnswers / nextTotalQuestions) * 100)
      : 0;

    const parseLocalDate = (dateStr) => {
      if (!dateStr || typeof dateStr !== "string") return null;
      const parts = dateStr.split("-").map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
      const [year, month, day] = parts;
      return new Date(Date.UTC(year, month - 1, day));
    };

    const lastLocalDate = parseLocalDate(user.lastQuizLocalDate);
    const todayLocalDate = parseLocalDate(localDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays =
      lastLocalDate && todayLocalDate
        ? Math.floor((todayLocalDate.getTime() - lastLocalDate.getTime()) / msPerDay)
        : null;

    let nextStreak = user.currentStreak || 0;
    if (!lastLocalDate) {
      nextStreak = 1;
    } else if (diffDays === 0) {
      nextStreak = user.currentStreak || 1;
    } else if (diffDays === 1) {
      nextStreak = (user.currentStreak || 0) + 1;
    } else {
      nextStreak = 1;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          prevTotalScore,
          prevAccuracy,
          totalScore: nextTotalScore,
          totalQuizzes: nextTotalQuizzes,
          correctAnswers: nextCorrectAnswers,
          totalQuestions: nextTotalQuestions,
          accuracy: nextAccuracy,
          currentStreak: nextStreak,
          lastQuizLocalDate: localDate,
          lastQuizDate: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Quiz result saved successfully",
      stats: {
        totalScore: updatedUser.totalScore,
        totalQuizzes: updatedUser.totalQuizzes,
        totalQuestions: updatedUser.totalQuestions,
        correctAnswers: updatedUser.correctAnswers,
        accuracy: updatedUser.accuracy,
        currentStreak: updatedUser.currentStreak,
      },
    });
  } catch (error) {
    console.error("SAVE QUIZ RESULT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getQuizQuestions = async (req, res) => {
  try {
    const subject = req.query.subject || "Physics";
    const classLevel = req.query.classLevel || "10";
    const amount = sanitizeAmount(req.query.amount || 5);
    const category = subject === "Maths" ? 19 : 17;
    const difficulty = classLevel === "12" ? "medium" : "easy";
    const fetchAmount = subject === "Maths" ? amount : Math.min(amount * 4, 50);

    const response = await fetch(
      `https://opentdb.com/api.php?amount=${fetchAmount}&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    const data = await response.json();
    const remoteQuestions = Array.isArray(data.results) ? data.results : [];

    let filtered = remoteQuestions;
    if (subject !== "Maths") {
      const keywords = SCIENCE_SUBJECT_KEYWORDS[subject] || [];
      filtered = remoteQuestions.filter((item) => {
        const text = `${item.question} ${item.correct_answer} ${item.incorrect_answers.join(" ")}`.toLowerCase();
        return keywords.some((word) => text.includes(word));
      });
    }

    const normalizedRemote = filtered.slice(0, amount).map((item, index) => {
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

    if (normalizedRemote.length >= amount) {
      return res.json({ questions: normalizedRemote });
    }

    const needed = amount - normalizedRemote.length;
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

    return res.json({
      questions: [...normalizedRemote, ...fallbackQuestions],
    });
  } catch (error) {
    console.error("GET QUIZ QUESTIONS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const usernameExists = await User.findOne({ name: name.trim(), _id: { $ne: userId } });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(userId, { name: name.trim() }, { new: true });
    res.json({
      message: "Name updated successfully",
      name: user.name,
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.error("UPDATE NAME ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, contain 1 uppercase letter and 1 number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const users = await User.find()
      .sort({ totalScore: -1 })
      .limit(limit)
      .select("name totalScore totalQuizzes correctAnswers accuracy avatar");

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      score: user.totalScore,
      quizzes: user.totalQuizzes,
      correctAnswers: user.correctAnswers,
      accuracy: user.accuracy,
      avatar: user.avatar || 0,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
