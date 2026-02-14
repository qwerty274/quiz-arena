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
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
