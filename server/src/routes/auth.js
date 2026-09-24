import { Router } from 'express';
import crypto from 'crypto';
import db from '../db/index.js';
import { hashPassword, comparePassword, issueToken, requireAuth } from '../services/authService.js';

const router = Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetRole = 'Software Engineer' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db.users.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ message: 'An account with this email address already exists.' });
    }

    const newUser = {
      id: `user-${crypto.randomUUID()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: await hashPassword(password),
      role: 'USER',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    await db.users.create(newUser);

    // Initialize User Profile
    await db.userProfiles.upsert(newUser.id, {
      userId: newUser.id,
      headline: `${targetRole} candidate`,
      targetRole,
      targetDomain: 'Software Development',
      experienceYears: 1,
      skills: ['Problem Solving', 'Communication'],
      education: null,
      preferredDifficulty: 'BEGINNER',
      updatedAt: new Date().toISOString()
    });

    // Initialize User Progress & Gamification
    await db.userProgress.update(newUser.id, {
      userId: newUser.id,
      totalInterviews: 0,
      totalAnswers: 0,
      averageScore: 0,
      technicalAverage: 0,
      communicationAvg: 0,
      confidenceAvg: 0,
      currentStreakDays: 1,
      longestStreakDays: 1,
      totalXpPoints: 50,
      level: 1,
      strongestTopics: [],
      weakestTopics: [],
      lastActiveDate: new Date().toISOString()
    });

    const token = issueToken(newUser);
    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl
      },
      token
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    res.status(500).json({ message: 'Error creating account.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.users.findByEmail(normalizedEmail);

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials. Please verify your email and password.' });
    }

    const token = issueToken(user);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      token
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    res.status(500).json({ message: 'Error signing in.' });
  }
});

// Get Current Authenticated User
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const profile = await db.userProfiles.get(user.id) || {};
    const progress = await db.userProgress.get(user.id) || {};

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      profile,
      progress
    });
  } catch (err) {
    console.error('[Auth Me Error]:', err);
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
});

// Forgot Password Request (mock/development)
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({
    ok: true,
    message: `If an account exists with ${email}, a password reset verification code has been dispatched.`
  });
});

export default router;
