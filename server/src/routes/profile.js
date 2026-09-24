import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../services/authService.js';

const router = Router();

// Get current profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const profile = await db.userProfiles.get(req.user.id) || {
      userId: req.user.id,
      targetRole: 'Software Engineer',
      targetDomain: 'Software Development',
      skills: [],
      experienceYears: 0,
      preferredDifficulty: 'INTERMEDIATE'
    };
    res.json(profile);
  } catch (err) {
    console.error('[Profile Get Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve profile.' });
  }
});

// Update profile
router.put('/', requireAuth, async (req, res) => {
  try {
    const existing = await db.userProfiles.get(req.user.id) || { userId: req.user.id };
    const updated = {
      ...existing,
      headline: req.body.headline ?? existing.headline,
      targetRole: req.body.targetRole ?? existing.targetRole,
      targetDomain: req.body.targetDomain ?? existing.targetDomain,
      experienceYears: Number(req.body.experienceYears ?? existing.experienceYears ?? 0),
      skills: Array.isArray(req.body.skills) ? req.body.skills : (existing.skills || []),
      linkedinUrl: req.body.linkedinUrl ?? existing.linkedinUrl,
      githubUrl: req.body.githubUrl ?? existing.githubUrl,
      preferredDifficulty: req.body.preferredDifficulty ?? existing.preferredDifficulty ?? 'INTERMEDIATE',
      updatedAt: new Date().toISOString()
    };

    const saved = await db.userProfiles.upsert(req.user.id, updated);
    res.json(saved);
  } catch (err) {
    console.error('[Profile Update Error]:', err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

export default router;
