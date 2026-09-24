import assert from 'assert';

const BASE = 'http://localhost:3001/api';

async function runTests() {
  console.log('🧪 Starting PrepAI Comprehensive API Test Suite...');
  let token = null;

  // 1. Health Check
  const healthRes = await fetch(`${BASE}/health`);
  const health = await healthRes.json();
  assert.strictEqual(health.ok, true, 'Health check failed');
  console.log('  ✓ 1. Health check passed');

  // 2. Auth Login (Demo Candidate)
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alex@example.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  assert.ok(loginData.token, 'Login failed to return token');
  token = loginData.token;
  console.log('  ✓ 2. Login authentication passed for Alex Rivera');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. User Profile
  const profRes = await fetch(`${BASE}/profile`, { headers: authHeaders });
  const profile = await profRes.json();
  assert.ok(profile.targetRole, 'Profile retrieval failed');
  console.log(`  ✓ 3. Profile fetched: ${profile.targetRole}`);

  // 4. Resume Processing
  const resumeRes = await fetch(`${BASE}/resume/upload`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      resumeText: 'Senior Software Engineer with 5 years experience in React, Node.js, PostgreSQL, Docker, and REST APIs. Led payments service migration.'
    })
  });
  const resumeData = await resumeRes.json();
  assert.ok(resumeData.extractedSkills.length > 0, 'Resume skill extraction failed');
  console.log(`  ✓ 4. Resume parsed with ${resumeData.extractedSkills.length} extracted skills`);

  // 5. Job Description Matcher
  const jdRes = await fetch(`${BASE}/resume/analyze-jd`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      jobDescriptionText: 'Looking for a Senior Backend Developer proficient in Node.js, Redis caching, Kubernetes, and PostgreSQL.'
    })
  });
  const jdData = await jdRes.json();
  assert.ok(typeof jdData.matchScore === 'number', 'JD Match score calculation failed');
  console.log(`  ✓ 5. JD Matcher calculated alignment score: ${jdData.matchScore}%`);

  // 6. Interview Creation
  const createSessRes = await fetch(`${BASE}/interview/create`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      category: 'TECHNICAL',
      domain: 'Software Development',
      difficulty: 'INTERMEDIATE',
      role: 'Full-Stack Developer',
      totalQuestions: 3
    })
  });
  const session = await createSessRes.json();
  assert.strictEqual(session.questions.length, 3, 'Interview question creation failed');
  console.log(`  ✓ 6. Created adaptive interview session with ${session.questions.length} questions`);

  // 7. Answer Submission & 10-Factor Evaluation
  const q1 = session.questions[0];
  const ansRes = await fetch(`${BASE}/interview/${session.id}/answer`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      questionId: q1.id,
      answerText: 'In my past project, we faced heavy database connection pool spikes. I introduced a Redis write-through cache and rate limiting using token bucket algorithms. As a result, database load dropped by 45% and p99 latency stabilized under 60ms.',
      inputMode: 'VOICE'
    })
  });
  const evalData = await ansRes.json();
  assert.ok(evalData.evaluation.overallScore > 0, 'Answer evaluation score missing');
  assert.ok(evalData.evaluation.strengths.length > 0, 'Strengths missing');
  console.log(`  ✓ 7. Evaluated answer with 10-factor rubric: Score ${evalData.evaluation.overallScore}/100`);

  // 8. Dynamic Follow-Up Question
  const followUpRes = await fetch(`${BASE}/interview/${session.id}/follow-up`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      questionId: q1.id,
      previousAnswer: 'I used Redis write-through cache.'
    })
  });
  const followUp = await followUpRes.json();
  assert.ok(followUp.questionText, 'Follow-up question generation failed');
  console.log(`  ✓ 8. Proactive follow-up question generated: "${followUp.questionText.slice(0, 45)}..."`);

  // 9. Finalize Interview Session
  const finishRes = await fetch(`${BASE}/interview/${session.id}/finish`, {
    method: 'POST',
    headers: authHeaders
  });
  const finishData = await finishRes.json();
  assert.strictEqual(finishData.status, 'COMPLETED', 'Failed to complete session');
  console.log(`  ✓ 9. Finalized session scorecard: Overall ${finishData.overallScore}%`);

  // 10. Coding Sandbox Runner
  const runCodeRes = await fetch(`${BASE}/coding/run`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      problemId: 'cp-1', // Two Sum
      language: 'javascript',
      code: 'function twoSum(nums, target) { const map = {}; for (let i = 0; i < nums.length; i++) { const diff = target - nums[i]; if (diff in map) return [map[diff], i]; map[nums[i]] = i; } return []; }'
    })
  });
  const runCodeData = await runCodeRes.json();
  assert.strictEqual(runCodeData.status, 'SUCCESS', 'Two Sum code execution failed');
  console.log(`  ✓ 10. Coding Sandbox executed Two Sum solution: all tests passed (${runCodeData.executionTimeMs}ms)`);

  // 11. Question Bank Query & Upvote
  const qbRes = await fetch(`${BASE}/question-bank?category=TECHNICAL`, { headers: authHeaders });
  const qbList = await qbRes.json();
  assert.ok(qbList.length > 0, 'Question bank query failed');
  console.log(`  ✓ 11. Question bank retrieved ${qbList.length} curated questions`);

  // 12. Dashboard Analytics
  const anRes = await fetch(`${BASE}/analytics/dashboard`, { headers: authHeaders });
  const anData = await anRes.json();
  assert.ok(anData.radarMetrics.length === 6, 'Radar metrics incomplete');
  console.log(`  ✓ 12. Dashboard analytics retrieved with 6-factor radar scores`);

  // 13. Gamification Badges & Leaderboard
  const gamRes = await fetch(`${BASE}/gamification/status`, { headers: authHeaders });
  const gamData = await gamRes.json();
  assert.ok(gamData.xpPoints > 0, 'XP points tracking failed');
  console.log(`  ✓ 13. Gamification confirmed: ${gamData.xpPoints} XP, Level ${gamData.level}`);

  // 14. Admin Check (Login as Admin)
  const adminLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@prepai.com', password: 'password123' })
  });
  const adminLogin = await adminLoginRes.json();
  const adminHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminLogin.token}`
  };

  const adminStatsRes = await fetch(`${BASE}/admin/stats`, { headers: adminHeaders });
  const adminStats = await adminStatsRes.json();
  assert.ok(adminStats.totalUsers >= 2, 'Admin stats verification failed');
  console.log(`  ✓ 14. Admin Control Center verified: ${adminStats.totalUsers} users, AI status: "${adminStats.aiModel}"`);

  // 15. Schedule Lifecycle (List, Create, Delete)
  const schedListRes = await fetch(`${BASE}/schedule`, { headers: authHeaders });
  const schedList = await schedListRes.json();
  assert.ok(Array.isArray(schedList) && schedList.length >= 1, 'Schedule list failed to return initial item');
  console.log(`  ✓ 15a. Schedule retrieved ${schedList.length} upcoming rehearsal session(s)`);

  const newSchedRes = await fetch(`${BASE}/schedule`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Behavioral STAR Leadership Drill',
      category: 'BEHAVIORAL',
      domain: 'Software Development',
      difficulty: 'ADVANCED',
      targetRole: 'Engineering Manager',
      scheduledFor: new Date(Date.now() + 172800000).toISOString(),
      notes: 'Practice cross-team negotiation scenarios'
    })
  });
  const newSched = await newSchedRes.json();
  assert.ok(newSched.id, 'Failed to book new rehearsal schedule');
  console.log(`  ✓ 15b. Booked new scheduled rehearsal: "${newSched.title}"`);

  const delSchedRes = await fetch(`${BASE}/schedule/${newSched.id}`, {
    method: 'DELETE',
    headers: authHeaders
  });
  const delSched = await delSchedRes.json();
  assert.strictEqual(delSched.ok, true, 'Failed to cancel scheduled rehearsal');
  console.log(`  ✓ 15c. Cancelled scheduled rehearsal successfully`);

  console.log('\n🎉 ALL 15 TEST SUITES PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
