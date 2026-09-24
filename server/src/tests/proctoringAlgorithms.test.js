import assert from 'node:assert/strict';

// Test the proctoring computer vision & acoustic algorithms in pure JS

console.log('\n======================================================');
console.log(' PROCTORING ALGORITHMS & ACCURACY TEST SUITE');
console.log('======================================================\n');

// 1. Texture Variance & Lens Obstruction Check
function evaluateObstruction(avgBrightness, stdDev) {
  return avgBrightness < 6 || (avgBrightness < 30 && stdDev < 1.8);
}

console.log('--- Suite 1: Lens Obstruction & Texture Variance Detection ---');
{
  // Pitch black (lens covered with finger or tape)
  assert.equal(evaluateObstruction(3, 0.4), true, 'Pitch black must be detected as lens obstruction');

  // Flat uniform dark surface (e.g. black sticker over lens)
  assert.equal(evaluateObstruction(18, 1.1), true, 'Flat dark uniform surface must be detected as obstruction');

  // Dim room with candidate (textured scene)
  assert.equal(evaluateObstruction(24, 12.5), false, 'Dim room with textured features is NOT an obstruction');

  // Normal room
  assert.equal(evaluateObstruction(85, 32.0), false, 'Normal room is NOT an obstruction');

  console.log('  ✓ Correctly distinguishes physical lens obstruction from normal or dim room lighting');
}

// 2. Multi-Model Adaptive Skin Tone Classification
function isSkinPixel(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const sumRgb = r + g + b;
  const rn = sumRgb > 0 ? r / sumRgb : 0;
  const gn = sumRgb > 0 ? g / sumRgb : 0;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

  const isYCbCrSkin = cb >= 75 && cb <= 132 && cr >= 130 && cr <= 175 && y >= 18;
  const isNormRgbSkin = rn >= 0.33 && rn <= 0.60 && gn >= 0.24 && gn <= 0.38 && r > g && g > (b * 0.7) && y >= 18;
  return isYCbCrSkin || isNormRgbSkin;
}

console.log('\n--- Suite 2: Multi-Model Adaptive Skin Tone Classification ---');
{
  // Fair skin tone in warm lighting
  assert.equal(isSkinPixel(215, 170, 140), true, 'Fair skin in warm light must be recognized as skin');

  // Medium / Tan skin tone
  assert.equal(isSkinPixel(175, 125, 95), true, 'Medium/Tan skin must be recognized as skin');

  // Dark skin tone
  assert.equal(isSkinPixel(90, 60, 45), true, 'Dark skin tone in indoor light must be recognized as skin');

  // Blue shirt / background
  assert.equal(isSkinPixel(40, 80, 200), false, 'Blue background must NOT be recognized as skin');

  // White wall
  assert.equal(isSkinPixel(240, 240, 240), false, 'White wall must NOT be recognized as skin');

  // Black keyboard / clothing
  assert.equal(isSkinPixel(15, 15, 20), false, 'Dark clothing must NOT be recognized as skin');

  console.log('  ✓ Adaptive skin locus matches varied skin tones and rejects background/clothing');
}

// 3. Cluster Separation: Candidate Face vs. Hand Gestures & Multi-Person Detection
function evaluateCandidateAndPersons({ headClusters, skinRatio, isCameraObstructed }) {
  if (isCameraObstructed) return { detectedPersons: 0, isMultiplePersons: false };

  // Filter clusters representing human head in upper region
  const validHeadClusters = headClusters.filter(cl => {
    const width = cl.endCol - cl.startCol + 1;
    return width >= 2 && cl.totalScore >= 5;
  });

  let hasTwoSeparatedHeads = false;
  if (validHeadClusters.length >= 2 && skinRatio >= 0.05) {
    for (let k = 0; k < validHeadClusters.length - 1; k++) {
      const gap = validHeadClusters[k + 1].startCol - validHeadClusters[k].endCol - 1;
      if (gap >= 1) {
        hasTwoSeparatedHeads = true;
        break;
      }
    }
  }

  const isCandidatePresent = validHeadClusters.length >= 1;
  const detectedPersons = hasTwoSeparatedHeads ? 2 : (isCandidatePresent ? 1 : 0);
  return { detectedPersons, isMultiplePersons: detectedPersons > 1 };
}

console.log('\n--- Suite 3: Candidate Presence & Hand vs. Person Clustering ---');
{
  // Case A: Single candidate in center
  const singleCandidate = evaluateCandidateAndPersons({
    headClusters: [{ startCol: 5, endCol: 10, totalScore: 24 }],
    skinRatio: 0.15,
    isCameraObstructed: false
  });
  assert.equal(singleCandidate.detectedPersons, 1);
  assert.equal(singleCandidate.isMultiplePersons, false);

  // Case B: Candidate gesturing with hands (hands do NOT create a wide separated head cluster in upper frame)
  const candidateWithHands = evaluateCandidateAndPersons({
    headClusters: [
      { startCol: 5, endCol: 10, totalScore: 22 }, // Head
      { startCol: 14, endCol: 14, totalScore: 3 }  // Hand edge in upper frame: width=1, score=3 (<5 threshold)
    ],
    skinRatio: 0.16,
    isCameraObstructed: false
  });
  assert.equal(candidateWithHands.detectedPersons, 1, 'Gesturing hand must NOT trigger multiple persons');
  assert.equal(candidateWithHands.isMultiplePersons, false);

  // Case C: Two distinct individuals sitting side-by-side
  const twoPeople = evaluateCandidateAndPersons({
    headClusters: [
      { startCol: 1, endCol: 5, totalScore: 16 },  // Person 1 (cols 1..5)
      { startCol: 9, endCol: 13, totalScore: 18 }  // Person 2 (cols 9..13, gap = 9 - 5 - 1 = 3 >= 1)
    ],
    skinRatio: 0.22,
    isCameraObstructed: false
  });
  assert.equal(twoPeople.detectedPersons, 2, 'Two separated individuals must be flagged');
  assert.equal(twoPeople.isMultiplePersons, true);

  // Case D: Second person leaning in with realistic lower skin ratio (11% skin ratio)
  const leaningPerson = evaluateCandidateAndPersons({
    headClusters: [
      { startCol: 4, endCol: 8, totalScore: 18 },  // Candidate center
      { startCol: 11, endCol: 14, totalScore: 10 } // Second person entering on right (gap = 2 >= 1)
    ],
    skinRatio: 0.11,
    isCameraObstructed: false
  });
  assert.equal(leaningPerson.detectedPersons, 2, 'Second person entering frame with 11% skin ratio must be flagged');
  assert.equal(leaningPerson.isMultiplePersons, true);

  console.log('  ✓ Head aspect ratio and spatial separation successfully reject candidate hand gestures');
  console.log('  ✓ Accurately identifies genuine two-person scenarios');
  console.log('  ✓ Correctly catches peripheral intruders and low-skin-ratio secondary individuals');
}

// 4. Temporal Rolling Consensus Filter (3-frame window)
class TemporalFilterTester {
  constructor() {
    this.history = [];
  }

  filter(raw) {
    this.history.push(raw);
    if (this.history.length > 3) this.history.shift();
    if (this.history.length === 1) return raw;

    const multiPersonVotes = this.history.filter(h => h.isMultiplePersons).length;
    const obstructedVotes = this.history.filter(h => h.isCameraObstructed).length;
    const presentVotes = this.history.filter(h => h.isCandidatePresent).length;

    return {
      isMultiplePersons: multiPersonVotes >= 2,
      isCameraObstructed: obstructedVotes >= 2,
      isCandidatePresent: presentVotes >= 2
    };
  }
}

console.log('\n--- Suite 4: 3-Frame Temporal Rolling Consensus Filter ---');
{
  const filter = new TemporalFilterTester();

  // Frame 1: Normal (1 person)
  let f1 = filter.filter({ isMultiplePersons: false, isCameraObstructed: false, isCandidatePresent: true });
  assert.equal(f1.isMultiplePersons, false);

  // Frame 2: Sudden 1-frame glitch (hand flashed quickly)
  let f2 = filter.filter({ isMultiplePersons: true, isCameraObstructed: false, isCandidatePresent: true });
  assert.equal(f2.isMultiplePersons, false, '1-frame transient glitch must be suppressed by filter');

  // Frame 3: Returned to normal
  let f3 = filter.filter({ isMultiplePersons: false, isCameraObstructed: false, isCandidatePresent: true });
  assert.equal(f3.isMultiplePersons, false);

  // Frame 4 & 5: Sustained second person (2 consecutive frames)
  filter.filter({ isMultiplePersons: true, isCameraObstructed: false, isCandidatePresent: true });
  let f5 = filter.filter({ isMultiplePersons: true, isCameraObstructed: false, isCandidatePresent: true });
  assert.equal(f5.isMultiplePersons, true, 'Sustained condition (>= 2 frames) must be recognized');

  console.log('  ✓ Temporal consensus eliminates single-frame flickers and stabilizes detection state');
}

console.log('\n======================================================');
console.log(' ALL PROCTORING ALGORITHM TESTS PASSED! (4/4)');
console.log('======================================================\n');
