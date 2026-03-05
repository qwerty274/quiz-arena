import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    // General email format validation
  const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!generalEmailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

// Allowed domains validation
  const allowedDomainRegex = /@(gmail\.com|yahoo\.com|chitkara\.edu\.in|mail\.com|gmx\.com|outlook\.com)$/i;

  if (!allowedDomainRegex.test(email)) {
    return res.status(400).json({
      message: "Email must end with @gmail.com, @yahoo.com, @chitkara.edu.in, @mail.com, @gmx.com or @outlook.com",
    });
  }


    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, contain 1 uppercase letter and 1 number",
      });
    }

    // 🔥 NEW: Check if username already exists
    const usernameExists = await User.findOne({ name });
    if (usernameExists) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // Existing email check (unchanged)
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Don't Have an Account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user; // already fetched in middleware

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
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
    });

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= SAVE QUIZ RESULT =================
export const saveQuizResult = async (req, res) => {
  try {
    const { score, correctAnswers, totalQuestions, mode } = req.body;
    const userId = req.user._id;

    if (score === undefined || correctAnswers === undefined || totalQuestions === undefined || !mode) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prevTotalScore = user.totalScore || 0;
    const prevAccuracy = user.accuracy || 0;
    const newTotalScore = prevTotalScore + Number(score);
    const newTotalQuizzes = (user.totalQuizzes || 0) + 1;
    const newCorrectAnswers = (user.correctAnswers || 0) + Number(correctAnswers);
    const newTotalQuestions = (user.totalQuestions || 0) + Number(totalQuestions);
    const newAccuracy = newTotalQuestions > 0 ? Math.round((newCorrectAnswers / newTotalQuestions) * 100) : 0;

    const today = new Date();
    const lastQuizDate = user.lastQuizDate ? new Date(user.lastQuizDate) : null;
    const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = lastQuizDate
      ? Math.floor((startOfDay(today) - startOfDay(lastQuizDate)) / msPerDay)
      : null;

    let newStreak = user.currentStreak || 0;
    if (!lastQuizDate) {
      newStreak = 1;
    } else if (diffDays === 0) {
      newStreak = user.currentStreak || 1;
    } else if (diffDays === 1) {
      newStreak = (user.currentStreak || 0) + 1;
    } else {
      newStreak = 1;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          totalScore: newTotalScore,
          prevTotalScore,
          totalQuizzes: newTotalQuizzes,
          totalQuestions: newTotalQuestions,
          correctAnswers: newCorrectAnswers,
          accuracy: newAccuracy,
          prevAccuracy,
          currentStreak: newStreak,
          lastQuizDate: today,
        },
      },
      { new: true }
    );

    res.json({
      message: 'Quiz result saved successfully',
      stats: {
        totalScore: updatedUser.totalScore,
        totalQuizzes: updatedUser.totalQuizzes,
        correctAnswers: updatedUser.correctAnswers,
        accuracy: updatedUser.accuracy,
        currentStreak: updatedUser.currentStreak,
      }
    });

  } catch (error) {
    console.error("SAVE QUIZ RESULT ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ================= UPDATE NAME =================
export const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ name: name.trim(), _id: { $ne: userId } });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true }
    );

    res.json({
      message: 'Name updated successfully',
      name: user.name,
    });

  } catch (error) {
    console.error("UPDATE NAME ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, contain 1 uppercase letter and 1 number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword }
    );

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// ================= UPDATE PROFILE (avatar, recovery email) =================
export const updateProfile = async (req, res) => {
  try {
    const { avatar, recoveryEmail } = req.body;
    const userId = req.user.id;

    const updateData = {};

    // Validate avatar
    if (avatar !== undefined) {
      if (typeof avatar !== 'number' || avatar < 0 || avatar > 11) {
        return res.status(400).json({ message: 'Invalid avatar index' });
      }
      updateData.avatar = avatar;
    }

    // Validate recovery email
    if (recoveryEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recoveryEmail)) {
        return res.status(400).json({ message: 'Invalid recovery email' });
      }
      updateData.recoveryEmail = recoveryEmail;
    } else if (recoveryEmail === "") {
      updateData.recoveryEmail = null;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({
      message: 'Profile updated successfully',
      avatar: user.avatar,
      recoveryEmail: user.recoveryEmail,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// ================= GET LEADERBOARD =================
export const getLeaderboard = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const users = await User.find()
      .sort({ totalScore: -1 })
      .limit(limit)
      .select('name totalScore totalQuizzes correctAnswers accuracy');
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      score: user.totalScore,
      quizzes: user.totalQuizzes,
      correctAnswers: user.correctAnswers,
      accuracy: user.accuracy,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
