import { Router } from 'express';
import crypto from 'crypto';
import db from '../db/index.js';
import { requireAuth } from '../services/authService.js';

const router = Router();

// Filter & search question bank
router.get('/', requireAuth, async (req, res) => {
  try {
    const { category, domain, difficulty, role, search } = req.query;
    let results = await db.questionBank.getAll(domain, difficulty, category);

    if (role && role !== 'ALL') {
      const r = role.toLowerCase();
      results = results.filter(q =>
        (q.targetRoles && q.targetRoles.some(tr => tr.toLowerCase() === r || tr.toLowerCase() === 'all')) ||
        (q.domain && q.domain.toLowerCase().includes(r)) ||
        (q.title && q.title.toLowerCase().includes(r)) ||
        (q.coreCompetencyTested && q.coreCompetencyTested.toLowerCase().includes(r))
      );
    }
    if (search) {
      const term = search.toLowerCase();
      results = results.filter(q =>
        q.title.toLowerCase().includes(term) ||
        q.questionText.toLowerCase().includes(term) ||
        (q.keyConcepts && q.keyConcepts.some(k => k.toLowerCase().includes(term)))
      );
    }

    res.json(results);
  } catch (err) {
    console.error('[Question Bank Get Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve question bank.' });
  }
});

// Add question to community bank
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, questionText, category, domain, difficulty, sampleAnswer, explanation, keyConcepts } = req.body;
    if (!title || !questionText || !sampleAnswer) {
      return res.status(400).json({ message: 'Title, question text, and sample answer are required.' });
    }

    const newQuestion = {
      id: `qb-${crypto.randomUUID()}`,
      title,
      questionText,
      category: category || 'TECHNICAL',
      domain: domain || 'Software Development',
      difficulty: difficulty || 'INTERMEDIATE',
      questionType: 'TECHNICAL_DEEP_DIVE',
      sampleAnswer,
      explanation: explanation || 'Community contributed question.',
      keyConcepts: Array.isArray(keyConcepts) ? keyConcepts : (keyConcepts ? keyConcepts.split(',').map(s => s.trim()) : []),
      authorType: req.user.role === 'ADMIN' ? 'OFFICIAL' : 'COMMUNITY',
      upvotes: 1
    };

    await db.questionBank.create(newQuestion);
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error('[Question Bank Create Error]:', err);
    res.status(500).json({ message: 'Failed to add question.' });
  }
});

// Upvote question
router.post('/:id/upvote', requireAuth, async (req, res) => {
  try {
    const newCount = await db.questionBank.upvote(req.params.id);
    if (newCount === null) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    res.json({ ok: true, upvotes: newCount });
  } catch (err) {
    console.error('[Question Bank Upvote Error]:', err);
    res.status(500).json({ message: 'Failed to upvote question.' });
  }
});

export default router;
