import assert from 'assert';
import {
  getCalendarDay,
  getDaysDifference,
  reconcileStreakStatus,
  recordUserActivity,
  getStreakDetails
} from '../services/streakService.js';
import db from '../db/index.js';

async function runStreakTests() {
  console.log('\n======================================================');
  console.log(' DAILY STREAK ENGINE ALGORITHMIC VALIDATION SUITE');
  console.log('======================================================\n');

  // --- Suite 1: Calendar Day & Timezone Boundary Conversion ---
  console.log('--- Suite 1: Calendar Day & Timezone Boundary Conversion ---');
  {
    const utcDate = new Date('2026-09-22T02:00:00Z');
    const dayUtc = getCalendarDay(utcDate, 'UTC');
    assert.strictEqual(dayUtc, '2026-09-22', 'UTC calendar day calculation failed');

    // In US/Pacific (UTC-7/8), 02:00 UTC on 22nd is evening of 21st
    const dayPst = getCalendarDay(utcDate, 'America/Los_Angeles');
    assert.strictEqual(dayPst, '2026-09-21', 'PST calendar day boundary calculation failed');

    // In India (UTC+5:30), 02:00 UTC on 22nd is 07:30 AM on 22nd
    const dayIst = getCalendarDay(utcDate, 'Asia/Kolkata');
    assert.strictEqual(dayIst, '2026-09-22', 'IST calendar day boundary calculation failed');
    console.log('  ✓ Calendar day accurately respects time zone offsets');
  }

  // --- Suite 2: Integer Calendar Day Difference ---
  console.log('\n--- Suite 2: Integer Calendar Day Difference ---');
  {
    const dToday = '2026-09-22';
    const dYesterday = '2026-09-21';
    const dTwoDaysAgo = '2026-09-20';
    const dFiveDaysAgo = '2026-09-17';

    assert.strictEqual(getDaysDifference(dToday, dToday), 0, 'Same day diff must be 0');
    assert.strictEqual(getDaysDifference(dToday, dYesterday), 1, 'Consecutive day diff must be 1');
    assert.strictEqual(getDaysDifference(dToday, dTwoDaysAgo), 2, 'Two days ago diff must be 2');
    assert.strictEqual(getDaysDifference(dToday, dFiveDaysAgo), 5, 'Five days ago diff must be 5');
    assert.strictEqual(getDaysDifference(dYesterday, dToday), -1, 'Future date diff must be negative');
    console.log('  ✓ Calendar days difference accurately calculates discrete calendar intervals');
  }

  // --- Suite 3: Passive Streak Reconciliation (Inspection without Activity) ---
  console.log('\n--- Suite 3: Passive Streak Reconciliation ---');
  {
    const todayDate = new Date('2026-09-22T14:00:00Z');

    // Case A: User completed rehearsal earlier today
    const progressToday = {
      currentStreakDays: 5,
      longestStreakDays: 10,
      lastActiveDate: '2026-09-22T08:00:00Z'
    };
    const statusToday = reconcileStreakStatus(progressToday, todayDate, 'UTC');
    assert.strictEqual(statusToday.currentStreakDays, 5, 'Same day streak should be preserved');
    assert.strictEqual(statusToday.todayCompleted, true, 'todayCompleted must be true for same day');
    assert.strictEqual(statusToday.streakPending, false, 'streakPending must be false when already completed');
    assert.strictEqual(statusToday.streakBroken, false, 'streakBroken must be false');
    console.log('  ✓ Completed today: preserves streak and marks todayCompleted = true');

    // Case B: User completed rehearsal yesterday, pending practice today
    const progressYesterday = {
      currentStreakDays: 5,
      longestStreakDays: 10,
      lastActiveDate: '2026-09-21T18:00:00Z'
    };
    const statusYesterday = reconcileStreakStatus(progressYesterday, todayDate, 'UTC');
    assert.strictEqual(statusYesterday.currentStreakDays, 5, 'Yesterday practice should keep streak alive pending today');
    assert.strictEqual(statusYesterday.todayCompleted, false, 'todayCompleted must be false when not yet practiced');
    assert.strictEqual(statusYesterday.streakPending, true, 'streakPending must be true to prompt user');
    assert.strictEqual(statusYesterday.streakBroken, false, 'streak must not be marked broken while today is still ongoing');
    console.log('  ✓ Practiced yesterday: preserves streak and flags streakPending = true');

    // Case C: User missed yesterday (last practiced 2 days ago)
    const progressMissed = {
      currentStreakDays: 5,
      longestStreakDays: 10,
      lastActiveDate: '2026-09-20T18:00:00Z'
    };
    const statusMissed = reconcileStreakStatus(progressMissed, todayDate, 'UTC');
    assert.strictEqual(statusMissed.currentStreakDays, 0, 'Missed day must reset current streak to 0');
    assert.strictEqual(statusMissed.longestStreakDays, 10, 'Longest streak must never be lost');
    assert.strictEqual(statusMissed.todayCompleted, false, 'todayCompleted must be false');
    assert.strictEqual(statusMissed.streakBroken, true, 'streakBroken must be true when 2+ days elapse');
    console.log('  ✓ Missed yesterday: resets current streak to 0 while preserving longest record');
  }

  // --- Suite 4: Multi-Turn Practice Activity Lifecycle Simulation ---
  console.log('\n--- Suite 4: Practice Activity Lifecycle Simulation ---');
  {
    const testUserId = 'user-test-streak-simulator';

    // Reset test user progress
    await db.userProgress.update(testUserId, {
      userId: testUserId,
      currentStreakDays: 0,
      longestStreakDays: 0,
      totalXpPoints: 0,
      level: 1,
      lastActiveDate: null,
      activityDays: []
    });

    // 1. First practice day
    const day1Res = await recordUserActivity(testUserId, 'FIRST_PRACTICE');
    assert.strictEqual(day1Res.currentStreakDays, 1, 'Initial practice must start streak at 1');
    assert.strictEqual(day1Res.longestStreakDays, 1, 'Longest streak must be at least 1');
    assert.strictEqual(day1Res.streakExtended, true, 'Streak extended on day 1');
    console.log('  ✓ Day 1 first activity: starts streak at 1 day');

    // 2. Second practice on SAME day (should not increment again)
    const sameDayRes = await recordUserActivity(testUserId, 'SECOND_PRACTICE_SAME_DAY');
    assert.strictEqual(sameDayRes.currentStreakDays, 1, 'Same day practice must NOT double-increment streak');
    assert.strictEqual(sameDayRes.streakExtended, false, 'streakExtended must be false on duplicate same-day activity');
    console.log('  ✓ Duplicate practice on same calendar day preserves 1 day without false increments');

    // 3. Simulate consecutive day 2 (manual mock of yesterday's timestamp)
    const prog = await db.userProgress.get(testUserId);
    prog.lastActiveDate = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    await db.userProgress.update(testUserId, prog);

    const day2Res = await recordUserActivity(testUserId, 'PRACTICE_DAY_2');
    assert.strictEqual(day2Res.currentStreakDays, 2, 'Consecutive day practice must increment streak to 2');
    assert.strictEqual(day2Res.longestStreakDays, 2, 'Longest streak must increase to 2');
    assert.strictEqual(day2Res.streakExtended, true, 'streakExtended must be true');
    console.log('  ✓ Consecutive day practice increments streak to 2 days');

    // 4. Simulate consecutive day 3 (milestone badge trigger)
    const prog2 = await db.userProgress.get(testUserId);
    prog2.lastActiveDate = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    await db.userProgress.update(testUserId, prog2);

    const day3Res = await recordUserActivity(testUserId, 'PRACTICE_DAY_3');
    assert.strictEqual(day3Res.currentStreakDays, 3, 'Consecutive day practice must increment streak to 3');
    assert.strictEqual(day3Res.longestStreakDays, 3, 'Longest streak must reach 3');
    assert.ok(day3Res.awardedBadges.includes('ach-2'), 'Should award 3-day consistency badge ach-2');
    console.log('  ✓ Consecutive day 3 reaches milestone and automatically unlocks Consistency Champion badge');

    // 5. Simulate lapse (2 days missed) and then resume
    const prog3 = await db.userProgress.get(testUserId);
    prog3.lastActiveDate = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
    await db.userProgress.update(testUserId, prog3);

    const dayResumeRes = await recordUserActivity(testUserId, 'RESUME_AFTER_LAPSE');
    assert.strictEqual(dayResumeRes.currentStreakDays, 1, 'Resuming after lapse must reset streak to 1');
    assert.strictEqual(dayResumeRes.longestStreakDays, 3, 'Longest streak must retain prior high score of 3');
    assert.strictEqual(dayResumeRes.streakReset, true, 'streakReset flag must be true');
    console.log('  ✓ Resuming after lapse resets current streak to 1 while retaining longest streak of 3');
  }

  // --- Suite 5: 7-Day Rolling History & Milestone Calculation ---
  console.log('\n--- Suite 5: 7-Day Rolling History & Milestone Calculation ---');
  {
    const details = await getStreakDetails('user-demo-1');
    assert.ok(Array.isArray(details.rolling7Days), 'rolling7Days must be an array');
    assert.strictEqual(details.rolling7Days.length, 7, 'rolling7Days must contain exactly 7 days');
    assert.strictEqual(details.rolling7Days[6].isToday, true, 'Last element of rolling7Days must be today');
    assert.strictEqual(typeof details.nextMilestone, 'number', 'nextMilestone must be a number');
    assert.ok(details.nextMilestone > 0, 'nextMilestone must be positive');
    console.log(`  ✓ 7-Day rolling calendar generated with next milestone: ${details.nextMilestone} days`);
  }

  console.log('\n======================================================');
  console.log(' ALL DAILY STREAK TESTS PASSED ACCURATELY! (5/5)');
  console.log('======================================================\n');
}

runStreakTests().catch(err => {
  console.error('\n❌ STREAK TEST SUITE FAILED:', err);
  process.exit(1);
});
