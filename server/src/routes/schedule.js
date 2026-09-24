import { Router } from 'express';
import crypto from 'crypto';
import db from '../db/index.js';
import { requireAuth } from '../services/authService.js';

const router = Router();
router.use(requireAuth);

// GET all schedules for the logged-in user (sorted soonest first)
router.get('/', async (req, res) => {
  try {
    const userSchedules = await db.schedules.findByUserId(req.user.id);
    res.json(userSchedules);
  } catch (err) {
    console.error('[Schedule Get Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve schedules.' });
  }
});

// POST a new scheduled rehearsal session
router.post('/', async (req, res) => {
  try {
    const {
      scheduledFor,
      title,
      category = 'TECHNICAL',
      domain = 'Software Development',
      difficulty = 'INTERMEDIATE',
      targetRole,
      notes = ''
    } = req.body;

    if (!scheduledFor) {
      return res.status(400).json({ message: 'Target date and time (scheduledFor) is required.' });
    }

    const profile = await db.userProfiles.get(req.user.id);
    const resolvedRole = targetRole || profile?.targetRole || 'Software Engineer';
    const resolvedTitle = title || `${category} Rehearsal (${resolvedRole})`;

    const newSchedule = {
      id: `sched-${crypto.randomUUID()}`,
      userId: req.user.id,
      title: resolvedTitle,
      category,
      domain: domain || profile?.targetDomain || 'Software Development',
      difficulty,
      targetRole: resolvedRole,
      scheduledFor: new Date(scheduledFor).toISOString(),
      notes: notes.trim(),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    await db.schedules.create(newSchedule);
    res.status(201).json(newSchedule);
  } catch (err) {
    console.error('[Schedule Create Error]:', err);
    res.status(500).json({ message: 'Failed to schedule rehearsal.' });
  }
});

// DELETE a scheduled rehearsal
router.delete('/:id', async (req, res) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const success = await db.schedules.delete(req.params.id, req.user.id, isAdmin);
    if (!success) {
      return res.status(404).json({ message: 'Scheduled rehearsal not found.' });
    }
    res.json({ ok: true, message: 'Scheduled rehearsal cancelled successfully.' });
  } catch (err) {
    console.error('[Schedule Delete Error]:', err);
    res.status(500).json({ message: 'Failed to cancel scheduled rehearsal.' });
  }
});

export default router;
