import { Router } from 'express';
import db from '../db/index.js';
import { userBadges, achievements } from '../data.js';
import { requireAuth } from '../services/authService.js';
import { getStreakDetails, recordUserActivity } from '../services/streakService.js';

const router = Router();

// Get gamification stats, badges, and accurate daily streak for current user
router.get('/status', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const timeZone = req.headers['x-timezone'] || req.query.timeZone || 'UTC';
    const streakDetails = await getStreakDetails(userId, timeZone);

    const progress = (await db.userProgress.get(userId)) || {
      totalXpPoints: 100,
      level: 1,
      currentStreakDays: streakDetails?.currentStreakDays ?? 1,
      longestStreakDays: streakDetails?.longestStreakDays ?? 1
    };

    const unlockedBadgeIds = userBadges.get(userId) || [];
    const badgeList = achievements.map(ach => ({
      ...ach,
      isUnlocked: unlockedBadgeIds.includes(ach.id)
    }));

    const nextLevelXp = progress.level * 300;
    const currentLevelBaseXp = (progress.level - 1) * 300;
    const levelProgressPercent = Math.min(100, Math.round(
      ((progress.totalXpPoints - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100
    ));

    res.json({
      xpPoints: progress.totalXpPoints,
      level: progress.level,
      levelProgressPercent,
      currentStreakDays: streakDetails?.currentStreakDays ?? progress.currentStreakDays ?? 1,
      longestStreakDays: streakDetails?.longestStreakDays ?? progress.longestStreakDays ?? 1,
      todayCompleted: streakDetails?.todayCompleted ?? false,
      streakPending: streakDetails?.streakPending ?? false,
      streakBroken: streakDetails?.streakBroken ?? false,
      nextMilestone: streakDetails?.nextMilestone ?? 7,
      rolling7Days: streakDetails?.rolling7Days ?? [],
      lastActiveDate: streakDetails?.lastActiveDate || progress.lastActiveDate,
      badges: badgeList
    });
  } catch (err) {
    console.error('[Gamification Status Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve gamification status.' });
  }
});

// Daily Activity Check-In (e.g. daily drill, review, or deliberate practice)
router.post('/check-in', requireAuth, async (req, res) => {
  try {
    const timeZone = req.headers['x-timezone'] || req.body.timeZone || 'UTC';
    const result = await recordUserActivity(req.user.id, 'CHECK_IN', req.body, timeZone);
    const details = await getStreakDetails(req.user.id, timeZone);
    res.json({
      message: 'Daily practice activity logged successfully',
      ...result,
      ...details
    });
  } catch (err) {
    console.error('[Gamification Check-in Error]:', err);
    res.status(500).json({ message: 'Failed to log daily practice.' });
  }
});

// Community / Weekly Leaderboard
router.get('/leaderboard', requireAuth, async (req, res) => {
  try {
    const allUsers = await db.users.getAll();
    const leaderboard = await Promise.all(
      allUsers.map(async u => {
        const streakInfo = await getStreakDetails(u.id);
        const prog = (await db.userProgress.get(u.id)) || { totalXpPoints: 50, level: 1, currentStreakDays: 1 };
        return {
          userId: u.id,
          name: u.name,
          avatarUrl: u.avatarUrl,
          role: u.role,
          xpPoints: prog.totalXpPoints,
          level: prog.level,
          streakDays: streakInfo?.currentStreakDays ?? prog.currentStreakDays ?? 1,
          todayCompleted: streakInfo?.todayCompleted ?? false
        };
      })
    );

    res.json(leaderboard.sort((a, b) => b.xpPoints - a.xpPoints));
  } catch (err) {
    console.error('[Leaderboard Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve leaderboard.' });
  }
});

export default router;
