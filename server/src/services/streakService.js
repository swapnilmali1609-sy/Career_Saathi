import db from '../db/index.js';
import { userBadges, achievements } from '../data.js';

/**
 * Format date to YYYY-MM-DD in given timeZone
 */
export function getCalendarDay(dateInput = new Date(), timeZone = 'UTC') {
  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput;
    if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);

    // Use Intl.DateTimeFormat with ISO year/month/day
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(d);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Calculate difference in whole calendar days between two YYYY-MM-DD strings or dates
 */
export function getDaysDifference(currentDate, previousDate, timeZone = 'UTC') {
  if (!previousDate) return null;
  const currDayStr = typeof currentDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(currentDate)
    ? currentDate
    : getCalendarDay(currentDate, timeZone);
  const prevDayStr = typeof previousDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(previousDate)
    ? previousDate
    : getCalendarDay(previousDate, timeZone);

  const currMidnight = new Date(`${currDayStr}T00:00:00Z`).getTime();
  const prevMidnight = new Date(`${prevDayStr}T00:00:00Z`).getTime();

  return Math.round((currMidnight - prevMidnight) / (24 * 60 * 60 * 1000));
}

/**
 * Reconcile a progress record based on current time (without recording new activity)
 */
export function reconcileStreakStatus(progress, now = new Date(), timeZone = 'UTC') {
  if (!progress) {
    return {
      currentStreakDays: 0,
      longestStreakDays: 0,
      todayCompleted: false,
      streakPending: false,
      streakBroken: false,
      lastActiveDate: null
    };
  }

  const lastActive = progress.lastActiveDate;
  if (!lastActive) {
    return {
      currentStreakDays: progress.currentStreakDays || 0,
      longestStreakDays: progress.longestStreakDays || 0,
      todayCompleted: false,
      streakPending: false,
      streakBroken: false,
      lastActiveDate: null
    };
  }

  const diff = getDaysDifference(now, lastActive, timeZone);

  if (diff === 0) {
    // Already completed today
    return {
      currentStreakDays: progress.currentStreakDays || 1,
      longestStreakDays: progress.longestStreakDays || progress.currentStreakDays || 1,
      todayCompleted: true,
      streakPending: false,
      streakBroken: false,
      lastActiveDate: lastActive
    };
  } else if (diff === 1) {
    // Completed yesterday, streak is active and pending for today!
    return {
      currentStreakDays: progress.currentStreakDays || 1,
      longestStreakDays: progress.longestStreakDays || progress.currentStreakDays || 1,
      todayCompleted: false,
      streakPending: true,
      streakBroken: false,
      lastActiveDate: lastActive
    };
  } else {
    // 2 or more days have elapsed: streak is broken
    return {
      currentStreakDays: 0,
      longestStreakDays: progress.longestStreakDays || 1,
      todayCompleted: false,
      streakPending: false,
      streakBroken: true,
      lastActiveDate: lastActive
    };
  }
}

/**
 * Record candidate practice activity and advance daily streak
 */
export async function recordUserActivity(userId, activityType = 'PRACTICE', metadata = {}, timeZone = 'UTC') {
  if (!userId) return null;

  const now = new Date();
  const progress = (await db.userProgress.get(userId)) || {
    userId,
    totalInterviews: 0,
    totalAnswers: 0,
    averageScore: 0,
    currentStreakDays: 0,
    longestStreakDays: 0,
    totalXpPoints: 50,
    level: 1,
    strongestTopics: [],
    weakestTopics: [],
    lastActiveDate: null,
    activityDays: []
  };

  const lastActive = progress.lastActiveDate;
  const diff = getDaysDifference(now, lastActive, timeZone);

  let currentStreak = progress.currentStreakDays || 0;
  let longestStreak = progress.longestStreakDays || currentStreak;
  let streakExtended = false;
  let streakReset = false;

  if (lastActive === null || diff === null) {
    // First activity ever
    currentStreak = 1;
    longestStreak = Math.max(longestStreak, 1);
    streakExtended = true;
  } else if (diff === 0) {
    // Same day practice: streak maintained, no double increment
    currentStreak = Math.max(1, currentStreak);
    streakExtended = false;
  } else if (diff === 1) {
    // Consecutive day: increment streak!
    currentStreak += 1;
    longestStreak = Math.max(longestStreak, currentStreak);
    streakExtended = true;
  } else if (diff > 1) {
    // Missed one or more days: reset to 1 today
    currentStreak = 1;
    streakReset = true;
    streakExtended = true;
  } else {
    // Negative diff (clock skew safeguard)
    currentStreak = Math.max(1, currentStreak);
  }

  // Award XP points: +50 XP for the first practice of the day, +15 XP for subsequent practices
  const xpEarned = (diff !== 0 || lastActive === null) ? 50 : 15;
  const newXp = (progress.totalXpPoints || 0) + xpEarned;
  const newLevel = Math.max(1, Math.floor(newXp / 300) + 1);

  // Update activity days log (last 14 distinct calendar days)
  const todayStr = getCalendarDay(now, timeZone);
  const existingDays = Array.isArray(progress.activityDays) ? progress.activityDays : [];
  const updatedDays = [...new Set([todayStr, ...existingDays])].slice(0, 14);

  // Check achievements for streak milestones
  const userBadgeList = userBadges.get(userId) || [];
  let awardedBadges = [];

  if (currentStreak >= 3 && !userBadgeList.includes('ach-2')) {
    userBadgeList.push('ach-2');
    awardedBadges.push('ach-2');
  }

  if (userBadgeList.length > 0) {
    userBadges.set(userId, userBadgeList);
  }

  const updatedProgress = {
    ...progress,
    totalXpPoints: newXp,
    level: newLevel,
    currentStreakDays: currentStreak,
    longestStreakDays: longestStreak,
    lastActiveDate: now.toISOString(),
    activityDays: updatedDays
  };

  await db.userProgress.update(userId, updatedProgress);

  return {
    userId,
    activityType,
    xpEarned,
    totalXpPoints: newXp,
    level: newLevel,
    currentStreakDays: currentStreak,
    longestStreakDays: longestStreak,
    todayCompleted: true,
    streakExtended,
    streakReset,
    awardedBadges,
    lastActiveDate: now.toISOString()
  };
}

/**
 * Get detailed streak status with calendar history distinguishing mock interview days, practice days, and absent days
 */
export async function getStreakDetails(userId, timeZone = 'UTC') {
  if (!userId) return null;

  const now = new Date();
  const progress = (await db.userProgress.get(userId)) || {
    userId,
    currentStreakDays: 1,
    longestStreakDays: 1,
    totalXpPoints: 50,
    level: 1,
    lastActiveDate: now.toISOString(),
    activityDays: [getCalendarDay(now, timeZone)]
  };

  const status = reconcileStreakStatus(progress, now, timeZone);

  // If streak was broken (e.g. 2+ days elapsed without activity), persist reconciliation
  if (status.streakBroken && progress.currentStreakDays !== 0) {
    await db.userProgress.update(userId, {
      ...progress,
      currentStreakDays: 0
    });
  }

  // Load all user interview sessions to cross-reference mock interview days
  let userSessions = [];
  try {
    userSessions = (await db.sessions.findByUserId(userId)) || [];
  } catch (err) {
    userSessions = [];
  }

  // Index mock interview sessions by calendar date
  const sessionsByDate = new Map();
  for (const s of userSessions) {
    const rawDate = s.completedAt || s.startedAt || s.createdAt;
    if (!rawDate) continue;
    const dateStr = getCalendarDay(rawDate, timeZone);
    if (!sessionsByDate.has(dateStr)) {
      sessionsByDate.set(dateStr, []);
    }
    sessionsByDate.get(dateStr).push({
      id: s.id,
      role: s.targetRole || s.roleProfile?.title || 'Mock Interview',
      category: s.category || 'TECHNICAL',
      difficulty: s.difficulty || 'INTERMEDIATE',
      score: s.overallScore != null ? s.overallScore : null,
      status: s.status || 'COMPLETED',
      completedAt: s.completedAt || s.createdAt
    });
  }

  // Generate calendar activity set
  const activeDaysSet = new Set(Array.isArray(progress.activityDays) ? progress.activityDays : []);
  if (status.todayCompleted) {
    activeDaysSet.add(getCalendarDay(now, timeZone));
  }

  // Add all dates where mock sessions exist into active days
  for (const dateKey of sessionsByDate.keys()) {
    activeDaysSet.add(dateKey);
  }

  // Synthesize active days corresponding to current streak if not already populated
  if (status.currentStreakDays > 0) {
    const startOffset = status.todayCompleted ? 0 : (status.streakPending ? 1 : 999);
    for (let k = 0; k < Math.min(status.currentStreakDays, 7); k++) {
      const pastDate = new Date(now.getTime() - (k + startOffset) * 24 * 60 * 60 * 1000);
      activeDaysSet.add(getCalendarDay(pastDate, timeZone));
    }
  }

  // Helper to build rolling day history with exact Mock Given vs Absent classification
  function buildRollingDays(numDays) {
    const result = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = getCalendarDay(targetDate, timeZone);
      const dayOfWeek = new Intl.DateTimeFormat('en-US', { timeZone: timeZone || 'UTC', weekday: 'short' }).format(targetDate);
      const dayFormatted = new Intl.DateTimeFormat('en-US', { timeZone: timeZone || 'UTC', day: 'numeric', month: 'short' }).format(targetDate);
      const isToday = i === 0;

      const dayMocks = sessionsByDate.get(dateStr) || [];
      const hasMock = dayMocks.length > 0;
      const hasPractice = activeDaysSet.has(dateStr);

      let dayStatus = 'ABSENT';
      let statusLabel = 'Absent (No Mock or Practice Session)';

      if (isToday) {
        if (hasMock) {
          dayStatus = 'MOCK_GIVEN';
          statusLabel = `Mock Interview Completed Today (${dayMocks.length} ${dayMocks.length === 1 ? 'session' : 'sessions'})`;
        } else if (hasPractice || status.todayCompleted) {
          dayStatus = 'PRACTICE_COMPLETED';
          statusLabel = 'Daily Practice Completed Today';
        } else {
          dayStatus = 'TODAY_PENDING';
          statusLabel = 'Practice Pending Today';
        }
      } else {
        // Past day
        if (hasMock) {
          dayStatus = 'MOCK_GIVEN';
          const topMock = dayMocks[0];
          statusLabel = `Mock Interview Given: ${topMock.role}${topMock.score != null ? ` (Score: ${topMock.score}%)` : ''}`;
        } else if (hasPractice) {
          dayStatus = 'PRACTICE_COMPLETED';
          statusLabel = 'Daily Practice Drill Completed';
        } else {
          dayStatus = 'ABSENT';
          statusLabel = 'Absent (No Mock or Practice Session)';
        }
      }

      const isAbsent = !isToday && !hasMock && !hasPractice;
      const isActive = hasMock || hasPractice || (isToday && status.todayCompleted);

      result.push({
        date: dateStr,
        day: dayOfWeek,
        dayFormatted,
        isToday,
        active: isActive,
        hasMock,
        mockCount: dayMocks.length,
        mocks: dayMocks,
        isAbsent,
        status: dayStatus,
        statusLabel
      });
    }
    return result;
  }

  const rolling7Days = buildRollingDays(7);
  const rolling14Days = buildRollingDays(14);
  const rolling30Days = buildRollingDays(30);

  const totalMocksIn7Days = rolling7Days.filter(d => d.hasMock).length;
  const totalAbsentIn7Days = rolling7Days.filter(d => d.isAbsent).length;
  const totalActiveIn7Days = rolling7Days.filter(d => d.active).length;

  const totalMocksIn30Days = rolling30Days.filter(d => d.hasMock).length;
  const totalAbsentIn30Days = rolling30Days.filter(d => d.isAbsent).length;
  const totalActiveIn30Days = rolling30Days.filter(d => d.active).length;

  const nextMilestone = status.currentStreakDays < 3 ? 3
    : status.currentStreakDays < 7 ? 7
    : status.currentStreakDays < 14 ? 14
    : status.currentStreakDays < 30 ? 30
    : status.currentStreakDays + 10;

  return {
    currentStreakDays: status.currentStreakDays,
    longestStreakDays: status.longestStreakDays,
    todayCompleted: status.todayCompleted,
    streakPending: status.streakPending,
    streakBroken: status.streakBroken,
    nextMilestone,
    lastActiveDate: status.lastActiveDate,
    rolling7Days,
    rolling14Days,
    rolling30Days,
    totalMocksIn7Days,
    totalAbsentIn7Days,
    totalActiveIn7Days,
    totalMocksIn30Days,
    totalAbsentIn30Days,
    totalActiveIn30Days,
    summary: {
      totalMocks: totalMocksIn30Days,
      totalAbsent: totalAbsentIn30Days,
      totalActive: totalActiveIn30Days,
      weeklyMocks: totalMocksIn7Days,
      weeklyAbsent: totalAbsentIn7Days,
      weeklyActive: totalActiveIn7Days
    }
  };
}
