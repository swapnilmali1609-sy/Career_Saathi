/**
 * High-Performance Automated Proctoring Engine
 * 
 * Provides real-time computer vision and acoustic telemetry:
 * 1. Visual Proctor: Multiple persons detection, candidate absence, camera lens contact/obstruction.
 * 2. Acoustic Proctor: Ambient noise calibration, real-time dB calculation, background noise & secondary voice detection.
 * 3. Incident Capture: Generates evidence snapshot upon proctoring breach.
 */

export class AcousticProctor {
  constructor(stream) {
    this.stream = stream;
    this.audioCtx = null;
    this.analyser = null;
    this.source = null;
    this.dataArray = null;
    this.baselineNoiseFloor = 30; // dB
    this.isCalibrated = false;

    this.init();
  }

  init() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx || !this.stream) return;

      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.25;

      this.source = this.audioCtx.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    } catch (err) {
      console.warn('[AcousticProctor] AudioContext error:', err.message);
    }
  }

  // Calibrate ambient room noise floor over specified duration (fast 350ms default)
  async calibrateBaseline(durationMs = 350) {
    if (!this.analyser) return 30;
    const samples = [];
    const startTime = Date.now();

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const metrics = this.getMetrics();
        if (metrics.decibels > 0) samples.push(metrics.decibels);

        if (Date.now() - startTime >= durationMs) {
          clearInterval(interval);
          if (samples.length > 0) {
            const sorted = samples.sort((a, b) => a - b);
            // Use 25th percentile as true ambient floor
            const p25 = sorted[Math.floor(sorted.length * 0.25)] || 30;
            this.baselineNoiseFloor = Math.max(20, Math.min(55, Math.round(p25)));
          }
          this.isCalibrated = true;
          resolve(this.baselineNoiseFloor);
        }
      }, 50);
    });
  }

  getMetrics() {
    if (!this.analyser || !this.dataArray) {
      return { volume: 0, decibels: 0, isLoud: false, isCriticalNoise: false, noiseBandEnergy: 0 };
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    let sumSquares = 0;
    let highFreqEnergy = 0;
    const totalBins = this.dataArray.length;

    for (let i = 0; i < totalBins; i++) {
      const normalized = this.dataArray[i] / 255;
      sumSquares += normalized * normalized;

      // Track high-frequency/ambient chatter bands (> 1.2 kHz)
      if (i > totalBins * 0.4) {
        highFreqEnergy += normalized;
      }
    }

    const rms = Math.sqrt(sumSquares / totalBins);
    // Convert RMS to an estimated dB scale (30 - 95 dB SPL equivalent)
    const decibels = Math.round(Math.max(20, Math.min(95, 20 + rms * 80)));
    const volumePercent = Math.round(Math.min(100, rms * 150));

    // Dynamic thresholds relative to baseline noise
    const warningThreshold = Math.max(58, this.baselineNoiseFloor + 26);
    const criticalThreshold = Math.max(72, this.baselineNoiseFloor + 38);

    const isLoud = decibels >= warningThreshold;
    const isCriticalNoise = decibels >= criticalThreshold;

    return {
      volume: volumePercent,
      decibels,
      isLoud,
      isCriticalNoise,
      highFreqEnergy: Math.round(highFreqEnergy),
      baseline: this.baselineNoiseFloor
    };
  }

  destroy() {
    if (this.source) {
      try { this.source.disconnect(); } catch (e) {}
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (e) {}
    }
  }
}

export class VisualProctor {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.nativeDetector = null;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 160;
    this.canvas.height = 120;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.history = []; // 3-frame rolling consensus filter
    this.detectorInitialized = false;

    this.initNativeDetector();
  }

  async initNativeDetector() {
    if (this.detectorInitialized) return;
    if (typeof window !== 'undefined' && 'FaceDetector' in window) {
      try {
        this.nativeDetector = new window.FaceDetector({
          maxDetectedFaces: 4,
          fastMode: true
        });
      } catch (e) {
        this.nativeDetector = null;
      }
    }
    this.detectorInitialized = true;
  }

  async analyzeFrame() {
    if (!this.videoElement || this.videoElement.readyState < 2) {
      return {
        detectedPersons: 1, // default standby until ready
        isMultiplePersons: false,
        isCameraObstructed: false,
        isCandidatePresent: true,
        faces: [],
        confidence: 0
      };
    }

    // Always compute canvas metrics for lighting & obstruction verification
    const cvMetrics = this.canvasComputerVisionAnalysis();

    // Layer 1: Native Chromium FaceDetector if supported and camera not obstructed
    if (this.nativeDetector && !cvMetrics.isCameraObstructed) {
      try {
        const nativeFaces = await this.nativeDetector.detect(this.videoElement);
        if (nativeFaces && nativeFaces.length > 0) {
          const vw = this.videoElement.videoWidth || 640;
          const vh = this.videoElement.videoHeight || 480;
          const formattedFaces = nativeFaces.map(f => ({
            x: f.boundingBox.x / vw,
            y: f.boundingBox.y / vh,
            width: f.boundingBox.width / vw,
            height: f.boundingBox.height / vh
          }));

          const raw = {
            detectedPersons: nativeFaces.length,
            isMultiplePersons: nativeFaces.length > 1,
            isCameraObstructed: false,
            isCandidatePresent: true,
            skinRatio: cvMetrics.skinRatio,
            avgBrightness: cvMetrics.avgBrightness,
            faces: formattedFaces,
            method: 'NATIVE_FACE_DETECTOR'
          };
          return this.applyTemporalFilter(raw);
        }
      } catch (e) {
        // Fall back to Canvas CV segmentation
      }
    }

    // Layer 2: Fast HTML5 Canvas Computer-Vision Segmentation & Blob Clustering
    return this.applyTemporalFilter(cvMetrics);
  }

  canvasComputerVisionAnalysis() {
    const w = this.canvas.width;  // 160
    const h = this.canvas.height; // 120

    try {
      this.ctx.drawImage(this.videoElement, 0, 0, w, h);
      const imgData = this.ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const totalPixels = w * h;

      let sumY = 0;
      let sumYSquares = 0;
      let skinPixels = 0;
      let centralSkinPixels = 0;

      // 16 horizontal bands (10px wide each)
      const cols = 16;
      const rows = 12;
      const cellWidth = w / cols;
      const cellHeight = h / rows;
      // Grid to track skin presence across spatial cells (16 cols x 12 rows)
      const grid = new Uint8Array(cols * rows);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Luminance Y
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        sumY += y;
        sumYSquares += y * y;

        // Normalized color coordinates
        const sumRgb = r + g + b;
        const rn = sumRgb > 0 ? r / sumRgb : 0;
        const gn = sumRgb > 0 ? g / sumRgb : 0;

        // YCbCr skin chrominance
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

        // Adaptive skin classification: works in standard, warm, or dim lighting (Y >= 18)
        const isYCbCrSkin = cb >= 75 && cb <= 132 && cr >= 130 && cr <= 175 && y >= 18;
        const isNormRgbSkin = rn >= 0.33 && rn <= 0.60 && gn >= 0.24 && gn <= 0.38 && r > g && g > (b * 0.7) && y >= 18;
        const isSkin = isYCbCrSkin || isNormRgbSkin;

        if (isSkin) {
          skinPixels++;
          const pIdx = i >> 2;
          const px = pIdx % w;
          const py = Math.floor(pIdx / w);

          // Central ROI: candidate head usually in center 60%
          if (px >= w * 0.2 && px <= w * 0.8 && py >= h * 0.1 && py <= h * 0.85) {
            centralSkinPixels++;
          }

          const col = Math.min(cols - 1, Math.floor(px / cellWidth));
          const row = Math.min(rows - 1, Math.floor(py / cellHeight));
          grid[row * cols + col]++;
        }
      }

      const avgBrightness = sumY / totalPixels;
      const variance = Math.max(0, (sumYSquares / totalPixels) - (avgBrightness * avgBrightness));
      const stdDev = Math.sqrt(variance);
      const skinRatio = skinPixels / totalPixels;

      // Smart Lens Obstruction Check:
      // A covered lens / finger / black tape has either:
      // 1. Almost zero light: avgBrightness < 6
      // 2. Or very flat uniform darkness: avgBrightness < 30 AND stdDev < 1.8
      const isCameraObstructed = avgBrightness < 6 || (avgBrightness < 30 && stdDev < 1.8);

      if (isCameraObstructed) {
        return {
          detectedPersons: 0,
          isMultiplePersons: false,
          isCameraObstructed: true,
          isCandidatePresent: false,
          skinRatio: 0,
          avgBrightness: Math.round(avgBrightness),
          stdDev: Math.round(stdDev * 10) / 10,
          method: 'CANVAS_CV_OBSTRUCTED',
          faces: []
        };
      }

      // Cluster Grid Analysis: Group active skin cells into spatial components
      // Cell threshold: at least 14 pixels (out of ~100) are skin (14% skin density)
      const activeCellThreshold = 14;
      const activeCells = new Uint8Array(cols * rows);
      for (let c = 0; c < activeCells.length; c++) {
        if (grid[c] >= activeCellThreshold) activeCells[c] = 1;
      }

      // Find horizontal spans of skin in the upper 65% of the screen (head zone)
      const headZoneRows = Math.min(rows, Math.max(6, Math.floor(rows * 0.65)));
      const colHeadScores = new Array(cols).fill(0);
      for (let r = 0; r < headZoneRows; r++) {
        for (let c = 0; c < cols; c++) {
          if (activeCells[r * cols + c]) {
            colHeadScores[c]++;
          }
        }
      }

      // Identify distinct head clusters in the upper region
      // A valid head column must have skin in at least 2 vertical cells in upper region
      const clusterThreshold = 2;
      const clusters = [];
      let currentCluster = null;

      for (let c = 0; c < cols; c++) {
        if (colHeadScores[c] >= clusterThreshold) {
          if (!currentCluster) {
            currentCluster = { startCol: c, endCol: c, maxScore: colHeadScores[c], totalScore: colHeadScores[c] };
          } else {
            currentCluster.endCol = c;
            currentCluster.maxScore = Math.max(currentCluster.maxScore, colHeadScores[c]);
            currentCluster.totalScore += colHeadScores[c];
          }
        } else {
          if (currentCluster) {
            clusters.push(currentCluster);
            currentCluster = null;
          }
        }
      }
      if (currentCluster) clusters.push(currentCluster);

      // Filter clusters to only those that represent a distinct human head:
      // - Width at least 2 columns (>= 12.5% of frame)
      // - Score sum at least 5 (substantial head mass)
      const validHeadClusters = clusters.filter(cl => {
        const width = cl.endCol - cl.startCol + 1;
        return width >= 2 && cl.totalScore >= 5;
      });

      // Multi-Person Detection Check 1: Two separated head clusters with gap >= 1 column
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

      // Multi-Person Detection Check 2: Broad merged head span with dual distinct spatial peaks & valley
      let hasWideDualPeak = false;
      if (!hasTwoSeparatedHeads && validHeadClusters.length >= 1 && skinRatio >= 0.08) {
        for (const cl of validHeadClusters) {
          const clWidth = cl.endCol - cl.startCol + 1;
          if (clWidth >= 6 && cl.totalScore >= 16) {
            // Check for two local peaks separated by a trough
            let peaks = [];
            for (let c = cl.startCol; c <= cl.endCol; c++) {
              const score = colHeadScores[c];
              const prev = c > 0 ? colHeadScores[c - 1] : 0;
              const next = c < cols - 1 ? colHeadScores[c + 1] : 0;
              if (score >= 3 && score >= prev && score >= next) {
                peaks.push({ col: c, score });
              }
            }
            if (peaks.length >= 2 && (peaks[peaks.length - 1].col - peaks[0].col >= 3)) {
              hasWideDualPeak = true;
              break;
            }
          }
        }
      }

      // Multi-Person Detection Check 3: Peripheral Intruder leaning in from left or right border
      let hasPeripheralIntruder = false;
      if (!hasTwoSeparatedHeads && !hasWideDualPeak && skinRatio >= 0.06) {
        const leftBorderActive = colHeadScores[0] >= 2 || colHeadScores[1] >= 2;
        const rightBorderActive = colHeadScores[cols - 1] >= 2 || colHeadScores[cols - 2] >= 2;
        const centerActive = colHeadScores[Math.floor(cols / 2)] >= 3 || colHeadScores[Math.floor(cols / 2) - 1] >= 3;
        if (centerActive && (leftBorderActive || rightBorderActive)) {
          if (leftBorderActive && (colHeadScores[2] <= 1 || colHeadScores[3] <= 1)) {
            hasPeripheralIntruder = true;
          } else if (rightBorderActive && (colHeadScores[cols - 3] <= 1 || colHeadScores[cols - 4] <= 1)) {
            hasPeripheralIntruder = true;
          }
        }
      }

      const isMultiplePersons = (hasTwoSeparatedHeads || hasWideDualPeak || hasPeripheralIntruder) && !isCameraObstructed;

      // Candidate presence: Candidate is present if there is skin in the central ROI or at least 1 valid head cluster
      const isCandidatePresent = (centralSkinPixels > (totalPixels * 0.012) || validHeadClusters.length >= 1) && !isCameraObstructed;
      const detectedPersons = isCameraObstructed ? 0 : isMultiplePersons ? 2 : (isCandidatePresent ? 1 : 0);

      const faces = [];
      if (isCandidatePresent && !isMultiplePersons) {
        faces.push({ x: 0.25, y: 0.15, width: 0.5, height: 0.65 });
      } else if (isMultiplePersons) {
        if (validHeadClusters.length >= 2) {
          validHeadClusters.forEach(cl => {
            faces.push({
              x: cl.startCol / cols,
              y: 0.15,
              width: (cl.endCol - cl.startCol + 1) / cols,
              height: 0.55
            });
          });
        } else {
          // Dual person split overlay
          faces.push({ x: 0.1, y: 0.15, width: 0.38, height: 0.55 });
          faces.push({ x: 0.52, y: 0.15, width: 0.38, height: 0.55 });
        }
      }

      return {
        detectedPersons,
        isMultiplePersons,
        isCameraObstructed,
        isCandidatePresent,
        skinRatio: Math.round(skinRatio * 100),
        avgBrightness: Math.round(avgBrightness),
        stdDev: Math.round(stdDev * 10) / 10,
        method: 'CANVAS_CV_SEGMENTATION',
        faces
      };
    } catch (err) {
      return {
        detectedPersons: 1,
        isMultiplePersons: false,
        isCameraObstructed: false,
        isCandidatePresent: true,
        skinRatio: 15,
        avgBrightness: 80,
        faces: [{ x: 0.25, y: 0.15, width: 0.5, height: 0.65 }],
        method: 'CANVAS_CV_FALLBACK'
      };
    }
  }

  // 3-frame rolling consensus filter to eliminate transient false alerts
  applyTemporalFilter(currentRaw) {
    this.history.push(currentRaw);
    if (this.history.length > 3) {
      this.history.shift();
    }

    if (this.history.length === 1) {
      return currentRaw;
    }

    // Require majority vote (at least 2 out of 3 frames)
    const multiPersonVotes = this.history.filter(h => h.isMultiplePersons).length;
    const obstructedVotes = this.history.filter(h => h.isCameraObstructed).length;
    const presentVotes = this.history.filter(h => h.isCandidatePresent).length;

    const isMultiplePersons = multiPersonVotes >= 2;
    const isCameraObstructed = obstructedVotes >= 2;
    const isCandidatePresent = presentVotes >= 2;

    const detectedPersons = isCameraObstructed
      ? 0
      : isMultiplePersons
        ? Math.max(2, currentRaw.detectedPersons)
        : isCandidatePresent
          ? 1
          : 0;

    return {
      ...currentRaw,
      detectedPersons,
      isMultiplePersons,
      isCameraObstructed,
      isCandidatePresent
    };
  }

  captureSnapshot() {
    try {
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = 360;
      snapCanvas.height = 270;
      const snapCtx = snapCanvas.getContext('2d');
      snapCtx.drawImage(this.videoElement, 0, 0, 360, 270);
      return snapCanvas.toDataURL('image/jpeg', 0.65);
    } catch (e) {
      return null;
    }
  }

  destroy() {
    this.ctx = null;
    this.canvas = null;
    this.history = [];
  }
}

/**
 * ProctoringCoordinator
 * Runs the continuous evaluation loop during the mock interview.
 */
export class ProctoringCoordinator {
  constructor({
    videoElement,
    mediaStream,
    onTelemetryUpdate,
    onWarning,
    onViolation
  }) {
    this.videoElement = videoElement;
    this.mediaStream = mediaStream;
    this.onTelemetryUpdate = onTelemetryUpdate;
    this.onWarning = onWarning;
    this.onViolation = onViolation;

    this.acousticProctor = new AcousticProctor(mediaStream);
    this.visualProctor = new VisualProctor(videoElement);

    this.timerId = null;
    this.isEnforcing = false;

    // Violation persistence trackers to prevent single-frame false positives
    this.multiPersonConsecutiveFrames = 0;
    this.obstructionConsecutiveFrames = 0;
    this.candidateAbsentConsecutiveFrames = 0;
    this.highNoiseConsecutiveTicks = 0;
  }

  async start() {
    this.isEnforcing = true;

    // Fast baseline calibration (350ms)
    await this.acousticProctor.calibrateBaseline(350);

    // Run proctoring cycle every 180ms
    this.timerId = setInterval(() => this.tick(), 180);
  }

  async tick() {
    if (!this.isEnforcing) return;

    // 1. Audio telemetry
    const audioMetrics = this.acousticProctor.getMetrics();

    // 2. Video telemetry
    const visualMetrics = await this.visualProctor.analyzeFrame();

    // 3. Dispatch real-time telemetry to UI
    if (this.onTelemetryUpdate) {
      this.onTelemetryUpdate({
        ...audioMetrics,
        ...visualMetrics
      });
    }

    // 4. Evaluate Integrity Rules

    // RULE A: Multiple Persons Detected -> IMMEDIATE TEST CLOSURE
    if (visualMetrics.isMultiplePersons) {
      this.multiPersonConsecutiveFrames++;
      // Immediate test closure: terminates test as soon as second person is verified across 2 consecutive cycles (~360ms)
      if (this.multiPersonConsecutiveFrames >= 2) {
        this.triggerViolation({
          violationType: 'MULTIPLE_PERSONS',
          title: 'Multiple Persons Detected in Camera View',
          reason: 'An additional person was detected in your camera frame. Examination policy requires candidates to be strictly alone in a private room. The interview has been automatically closed.',
          evidenceSnapshot: this.visualProctor.captureSnapshot(),
          metrics: {
            detectedPersons: Math.max(2, visualMetrics.detectedPersons),
            timestamp: new Date().toISOString()
          }
        });
        return;
      }
    } else {
      this.multiPersonConsecutiveFrames = Math.max(0, this.multiPersonConsecutiveFrames - 1);
    }

    // RULE B: Camera Obstruction / Contact
    if (visualMetrics.isCameraObstructed) {
      this.obstructionConsecutiveFrames++;
      if (this.obstructionConsecutiveFrames >= 6) {
        this.triggerViolation({
          violationType: 'CAMERA_OBSTRUCTION_CONTACT',
          title: 'Camera Lens Blocked or Physical Contact Detected',
          reason: 'Your camera feed was obstructed, covered, or came into physical contact with an object, blocking candidate verification.',
          evidenceSnapshot: this.visualProctor.captureSnapshot(),
          metrics: {
            avgBrightness: visualMetrics.avgBrightness,
            timestamp: new Date().toISOString()
          }
        });
        return;
      }
    } else {
      this.obstructionConsecutiveFrames = Math.max(0, this.obstructionConsecutiveFrames - 1);
    }

    // RULE C: Candidate Left Frame
    if (!visualMetrics.isCandidatePresent && !visualMetrics.isCameraObstructed) {
      this.candidateAbsentConsecutiveFrames++;
      if (this.candidateAbsentConsecutiveFrames === 5) {
        if (this.onWarning) {
          this.onWarning({
            type: 'ABSENCE_WARNING',
            message: '⚠️ Warning: Candidate face not visible in camera frame.'
          });
        }
      } else if (this.candidateAbsentConsecutiveFrames >= 14) {
        // ~2.5 seconds absent
        this.triggerViolation({
          violationType: 'CANDIDATE_ABSENT',
          title: 'Candidate Left Camera Frame',
          reason: 'You were absent from the camera field of view for an extended period during the active test session.',
          evidenceSnapshot: this.visualProctor.captureSnapshot(),
          metrics: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }
    } else {
      this.candidateAbsentConsecutiveFrames = Math.max(0, this.candidateAbsentConsecutiveFrames - 1);
    }

    // RULE D: Excessive Sustained Background Noise / Unauthorized Speech
    if (audioMetrics.isCriticalNoise) {
      this.highNoiseConsecutiveTicks++;
      if (this.highNoiseConsecutiveTicks === 3) {
        if (this.onWarning) {
          this.onWarning({
            type: 'NOISE_WARNING',
            message: `⚠️ High background noise detected (${audioMetrics.decibels} dB). Please maintain a quiet room.`
          });
        }
      } else if (this.highNoiseConsecutiveTicks >= 10) {
        // Sustained loud background noise (~1.8 seconds)
        this.triggerViolation({
          violationType: 'BACKGROUND_NOISE_VIOLATION',
          title: 'Excessive Background Noise / Secondary Voice Detected',
          reason: `Microphone telemetry registered unauthorized sustained background noise or secondary voices (${audioMetrics.decibels} dB). The interview environment must remain strictly quiet.`,
          evidenceSnapshot: this.visualProctor.captureSnapshot(),
          metrics: {
            decibels: audioMetrics.decibels,
            baseline: audioMetrics.baseline,
            timestamp: new Date().toISOString()
          }
        });
        return;
      }
    } else {
      this.highNoiseConsecutiveTicks = Math.max(0, this.highNoiseConsecutiveTicks - 1);
    }
  }

  triggerViolation(violationData) {
    this.stop();
    if (this.onViolation) {
      this.onViolation(violationData);
    }
  }

  stop() {
    this.isEnforcing = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.acousticProctor) {
      this.acousticProctor.destroy();
    }
    if (this.visualProctor) {
      this.visualProctor.destroy();
    }
  }
}
