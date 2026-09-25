import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  FastForward,
  Keyboard,
  ShieldCheck,
  ShieldAlert,
  Users,
  Eye,
  Radio,
  Camera,
  RotateCcw,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Code2,
  Lock,
  Sliders,
  Sun
} from 'lucide-react';
import { getRoleProfile } from '../../constants/roleConfigs.js';
import { getLanguageProfile } from '../../constants/languages.js';
import { ProctoringCoordinator, AcousticProctor, VisualProctor } from '../../services/proctoringEngine.js';

export default function LiveMockInterview({
  session,
  onSubmitAnswer,
  onRequestFollowUp,
  onFinishSession,
  onTerminateSession,
  onExit
}) {
  // Gate: Mandatory Hardware & Proctoring Verification
  const [hardwareVerified, setHardwareVerified] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [calibrating, setCalibrating] = useState(true);
  const [setupDecibels, setSetupDecibels] = useState(0);
  const [setupPersons, setSetupPersons] = useState(1);
  const [setupFaceObstructed, setSetupFaceObstructed] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({
    videoGranted: false,
    audioGranted: false,
    videoLabel: '',
    audioLabel: ''
  });
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');
  const [proctorSensitivity, setProctorSensitivity] = useState('STANDARD'); // 'RELAXED', 'STANDARD', 'STRICT'
  const [setupVisualMetrics, setSetupVisualMetrics] = useState({
    detectedPersons: 1,
    isMultiplePersons: false,
    isCameraObstructed: false,
    isCandidatePresent: true,
    faces: [{ x: 0.25, y: 0.15, width: 0.50, height: 0.65, confidence: 95 }],
    confidence: 95,
    lightingCondition: 'OPTIMAL',
    avgBrightness: 100
  });
  const [overrideChecked, setOverrideChecked] = useState(false);
  const [calibratingLighting, setCalibratingLighting] = useState(false);

  // Active Interview State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [inputMode, setInputMode] = useState('VOICE'); // 'VOICE' or 'TEXT'
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question default
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [askingFollowUp, setAskingFollowUp] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [showRoleGuidelines, setShowRoleGuidelines] = useState(true);
  const activeRoleProfile = session.roleProfile?.title
    ? session.roleProfile
    : getRoleProfile(session.targetRole, session.domain || session.category);
  const programmingLanguage = session.programmingLanguage || session.languageProfile?.name || 'Python';
  const activeLanguageProfile = session.languageProfile?.corePillars
    ? session.languageProfile
    : getLanguageProfile(programmingLanguage);

  // Real-time Proctoring Telemetry State
  const [proctorWarning, setProctorWarning] = useState(null);
  const [liveTelemetry, setLiveTelemetry] = useState({
    decibels: 30,
    volume: 0,
    detectedPersons: 1,
    isMultiplePersons: false,
    isCameraObstructed: false,
    isCandidatePresent: true,
    isLoud: false,
    isCriticalNoise: false
  });

  // Termination State
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationData, setTerminationData] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const setupVideoRef = useRef(null);
  const setupVisualRef = useRef(null);
  const setupIntervalRef = useRef(null);
  const acousticRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const proctorCoordinatorRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  const questions = session.questions || [];
  const currentQuestion = questions[currentIndex];

  // Speech cadence & filler word metrics
  const fillerWordRegex = /\b(um|uh|like|basically|actually|literally|you know|sort of)\b/gi;
  const fillerMatches = (answerText || '').match(fillerWordRegex) || [];
  const words = (answerText || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const estimatedWpm = Math.round(wordCount / (Math.max(1, (180 - timeLeft)) / 60));

  // Synthesized Web Audio API sound effects
  function playAudioCue(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'stop') {
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(520.0, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'violation') {
        // Urgent multi-tone alert siren
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.15);
        osc.frequency.setValueAtTime(880, now + 0.3);
        osc.frequency.setValueAtTime(220, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Audio cues are non-fatal
    }
  }

  // Enumerate all connected cameras
  const refreshConnectedDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedVideoDeviceId) {
        setSelectedVideoDeviceId(videoInputs[0].deviceId);
      }
    } catch (e) {
      console.warn('Could not enumerate devices:', e);
    }
  };

  // Switch camera cleanly
  const switchCamera = async (deviceId) => {
    setSelectedVideoDeviceId(deviceId);
    setCalibrating(true);
    setMediaError(null);
    try {
      const newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      });
      const newVideoTrack = newVideoStream.getVideoTracks()[0];
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(t => {
          t.stop();
          streamRef.current.removeTrack(t);
        });
        streamRef.current.addTrack(newVideoTrack);
      } else {
        streamRef.current = newVideoStream;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
      if (setupVideoRef.current) {
        setupVideoRef.current.srcObject = streamRef.current;
        setupVideoRef.current.play().catch(() => {});
      }
      setDeviceStatus(prev => ({
        ...prev,
        videoGranted: true,
        videoLabel: newVideoTrack.label || 'Selected Camera'
      }));
      setCalibrating(false);
    } catch (err) {
      console.error('Camera switch error:', err);
      setMediaError(`Failed to switch camera: ${err.message}`);
      setCalibrating(false);
    }
  };

  // Adjust proctoring sensitivity mode ('RELAXED', 'STANDARD', 'STRICT')
  const handleSensitivityChange = (newMode) => {
    setProctorSensitivity(newMode);
    if (setupVisualRef.current) {
      setupVisualRef.current.setSensitivity(newMode);
    }
    if (proctorCoordinatorRef.current) {
      proctorCoordinatorRef.current.setSensitivity(newMode);
    }
  };

  // Auto-calibrate ambient lighting and room baseline
  const handleCalibrateLighting = async () => {
    if (!setupVisualRef.current) return;
    setCalibratingLighting(true);
    try {
      await setupVisualRef.current.calibrateEnvironment();
      const updated = await setupVisualRef.current.analyzeFrame();
      setSetupVisualMetrics(updated);
    } finally {
      setTimeout(() => setCalibratingLighting(false), 350);
    }
  };

  // 1. Mandatory Media Device Initialization (Fast & Direct)
  const requestMediaAccess = async () => {
    setMediaError(null);
    setCalibrating(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam access is not supported in this browser environment.');
      }

      let stream = null;
      const idealConstraints = {
        video: selectedVideoDeviceId
          ? { deviceId: { exact: selectedVideoDeviceId } }
          : { facingMode: 'user', width: { ideal: 1280, min: 640 }, height: { ideal: 720, min: 480 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      };

      try {
        stream = await navigator.mediaDevices.getUserMedia(idealConstraints);
      } catch (errConstraint) {
        if (errConstraint.name === 'NotAllowedError' || errConstraint.name === 'PermissionDeniedError') {
          throw errConstraint;
        }
        // Immediate fast fallback: attempt standard combined stream
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (errCombined) {
          // If combined video+audio fails (e.g. mic busy or not plugged in), ensure camera works
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }

      const hasVideo = stream && stream.getVideoTracks().length > 0;
      const hasAudio = stream && stream.getAudioTracks().length > 0;

      if (!hasVideo) {
        throw new Error('No camera stream detected. Camera permission is strictly mandatory for proctored mock interviews.');
      }

      streamRef.current = stream;
      setDeviceStatus({
        videoGranted: hasVideo,
        audioGranted: hasAudio,
        videoLabel: stream.getVideoTracks()[0]?.label || 'Active Camera',
        audioLabel: stream.getAudioTracks()[0]?.label || (hasAudio ? 'Active Microphone' : 'Microphone Offline')
      });

      // Attach stream to active or setup video immediately (<200ms latency)
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      if (setupVideoRef.current) {
        setupVideoRef.current.srcObject = stream;
        setupVideoRef.current.play().catch(() => {});
      }

      // Populate available camera hardware list
      refreshConnectedDevices();

      // Monitor hardware track disconnection
      stream.getTracks().forEach((track) => {
        track.onended = () => {
          handleProctorViolation({
            violationType: 'DEVICE_REVOKED',
            title: 'Device Disconnected',
            reason: `${track.kind === 'video' ? 'Camera' : 'Microphone'} access was terminated or unplugged during the session.`
          });
        };
      });

      // Create persistent VisualProctor for setup if not already created
      if (setupVideoRef.current && !setupVisualRef.current) {
        setupVisualRef.current = new VisualProctor(setupVideoRef.current, { sensitivity: proctorSensitivity });
      }

      // Fast acoustic calibration in background (300ms) without blocking video presentation
      if (hasAudio) {
        try {
          if (acousticRef.current) acousticRef.current.destroy();
          const acoustic = new AcousticProctor(stream);
          acousticRef.current = acoustic;
          acoustic.calibrateBaseline(300).then(() => {
            setCalibrating(false);
          }).catch(() => setCalibrating(false));
        } catch (acErr) {
          console.warn('[Acoustic Calibration Warning]:', acErr);
          setCalibrating(false);
        }
      } else {
        setCalibrating(false);
      }

      // Pre-check setup telemetry loop using single persistent setupVisualRef
      if (setupIntervalRef.current) clearInterval(setupIntervalRef.current);
      setupIntervalRef.current = setInterval(async () => {
        if (!streamRef.current || hardwareVerified) {
          clearInterval(setupIntervalRef.current);
          return;
        }
        if (acousticRef.current) {
          const aMetrics = acousticRef.current.getMetrics();
          setSetupDecibels(aMetrics.decibels);
        }

        if (setupVideoRef.current && hasVideo) {
          if (!setupVisualRef.current) {
            setupVisualRef.current = new VisualProctor(setupVideoRef.current, { sensitivity: proctorSensitivity });
          }
          const vMetrics = await setupVisualRef.current.analyzeFrame();
          setSetupPersons(vMetrics.detectedPersons);
          setSetupFaceObstructed(vMetrics.isCameraObstructed);
          setSetupVisualMetrics(vMetrics);
        }
      }, 200);

    } catch (err) {
      console.error('[Media Access Error]:', err);
      setDeviceStatus({
        videoGranted: false,
        audioGranted: false,
        videoLabel: 'Not Connected',
        audioLabel: 'Not Connected'
      });
      setMediaError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera access is strictly mandatory for proctored mock interviews. Please click the tune/lock icon in your browser address bar and set Camera to "Allow".'
          : err.name === 'NotReadableError' || err.name === 'TrackStartError'
            ? 'Your camera is currently locked by another application (Zoom, Teams, Skype, or another browser tab). Please close conflicting apps and click "Grant Camera & Microphone Access".'
            : err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'
              ? 'No hardware webcam or camera found. A physical camera is mandatory to participate in this proctored interview.'
              : (err.message || 'Unable to initialize mandatory camera device.')
      );
      setCalibrating(false);
    }
  };

  useEffect(() => {
    requestMediaAccess();

    return () => {
      if (setupIntervalRef.current) {
        clearInterval(setupIntervalRef.current);
        setupIntervalRef.current = null;
      }
      if (setupVisualRef.current) {
        setupVisualRef.current.destroy();
        setupVisualRef.current = null;
      }
      if (acousticRef.current) {
        acousticRef.current.destroy();
        acousticRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (proctorCoordinatorRef.current) {
        proctorCoordinatorRef.current.stop();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // 2. Start Continuous Proctoring Enforcement once Hardware Verified
  useEffect(() => {
    if (!hardwareVerified || isTerminated) return;

    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      initAudioVisualizer(streamRef.current);

      const coordinator = new ProctoringCoordinator({
        videoElement: videoRef.current,
        mediaStream: streamRef.current,
        sensitivity: proctorSensitivity,
        onTelemetryUpdate: (telemetry) => {
          setLiveTelemetry(telemetry);
        },
        onWarning: (warn) => {
          setProctorWarning(warn.message);
          playAudioCue('warning');
          if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
          warningTimeoutRef.current = setTimeout(() => setProctorWarning(null), 4000);
        },
        onViolation: (violation) => {
          handleProctorViolation(violation);
        }
      });

      proctorCoordinatorRef.current = coordinator;
      coordinator.start();
    }

    return () => {
      if (proctorCoordinatorRef.current) {
        proctorCoordinatorRef.current.stop();
      }
    };
  }, [hardwareVerified, isTerminated]);

  // 3. Automated Test Closure on Proctoring Violation
  const handleProctorViolation = async (violation) => {
    playAudioCue('violation');
    setIsTerminated(true);
    setTerminationData(violation);

    // Stop proctoring engine & media tracks immediately
    if (proctorCoordinatorRef.current) {
      proctorCoordinatorRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Persist termination record in session
    if (onTerminateSession) {
      await onTerminateSession({
        violationType: violation.violationType || 'PROCTORING_BREACH',
        reason: violation.reason,
        evidence: violation.evidenceSnapshot || null,
        metrics: violation.metrics || null
      });
    }
  };

  // Audio Visualizer Canvas Loop
  function initAudioVisualizer(stream) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 64;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function draw() {
        if (!canvasRef.current || isTerminated) return;
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.8;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          ctx.fillStyle = `rgba(99, 102, 241, ${Math.max(0.2, dataArray[i] / 255)})`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
      }
      draw();
    } catch (e) {
      // Ignore visualizer if AudioContext fails
    }
  }

  // Timer Tick
  useEffect(() => {
    if (!hardwareVerified || isPaused || currentFeedback || isTerminated) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 31) {
          playAudioCue('warning');
        }
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hardwareVerified, isPaused, currentFeedback, isTerminated]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(180);
    setAnswerText('');
    setCurrentFeedback(null);
  }, [currentIndex]);

  // Text-To-Speech for AI Interviewer Voice
  const speakQuestion = () => {
    if (!currentQuestion) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech Recognition for Voice Input
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      playAudioCue('stop');
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSessionError('Voice speech recognition is not supported in this browser. Switched to Keyboard input mode.');
        setInputMode('TEXT');
        return;
      }
      setSessionError(null);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setAnswerText(transcript);
      };

      recognition.onerror = (err) => {
        console.warn('[Speech Rec Error]:', err.error);
        if (err.error === 'not-allowed') {
          setSessionError('Microphone permission was denied by your browser. Please allow microphone permissions (click the lock or tune icon next to the URL) or switch to Keyboard mode below.');
        } else if (err.error === 'network') {
          setSessionError('Speech recognition service had a connection hiccup. You can continue by typing in Keyboard mode.');
        } else if (err.error !== 'no-speech') {
          setSessionError(`Microphone notice: ${err.error}. You can switch to Keyboard mode anytime.`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
      playAudioCue('start');
    }
  };

  // Submit Answer & Request Evaluation
  const handleAnswerSubmit = async () => {
    if (!answerText.trim() || isTerminated) return;
    if (isRecording) toggleRecording();

    setEvaluating(true);
    setSessionError(null);
    try {
      const result = await onSubmitAnswer({
        questionId: currentQuestion.id,
        answerText,
        inputMode,
        deliveryMetrics: {
          wordCount,
          wpm: estimatedWpm,
          fillerWordsCount: fillerMatches.length,
          durationSeconds: 180 - timeLeft
        }
      });
      setCurrentFeedback(result.evaluation);
      playAudioCue('success');
    } catch (err) {
      setSessionError('Evaluation error: ' + (err.message || 'Unable to process answer.'));
    } finally {
      setEvaluating(false);
    }
  };

  // Request Dynamic AI Follow-up
  const handleFollowUp = async () => {
    setAskingFollowUp(true);
    setSessionError(null);
    try {
      await onRequestFollowUp({
        questionId: currentQuestion.id,
        previousAnswer: answerText
      });
      setCurrentIndex(questions.length);
    } catch (err) {
      setSessionError('Failed to generate follow-up question: ' + (err.message || 'Service unavailable.'));
    } finally {
      setAskingFollowUp(false);
    }
  };

  // Next Question / Finish Session
  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinishSession();
    }
  };

  // ==========================================
  // VIEW 1: PROCTORING TERMINATION INCIDENT
  // ==========================================
  if (isTerminated && terminationData) {
    return (
      <div style={{ maxWidth: 840, margin: '2rem auto', padding: '0 1rem' }}>
        <div className="card-elevated" style={{
          border: '2px solid var(--accent-rose)',
          background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.08) 0%, var(--bg-surface-elevated) 100%)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(244, 63, 94, 0.2)'
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(244, 63, 94, 0.2)',
            border: '2px solid var(--accent-rose)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-rose)',
            marginBottom: '1.25rem',
            animation: 'pulse 2s infinite'
          }}>
            <ShieldAlert size={40} />
          </div>

          <div style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(244, 63, 94, 0.25)',
            border: '1px solid var(--accent-rose)',
            color: '#fb7185',
            fontWeight: 800,
            fontSize: '0.82rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            AUTOMATIC TEST TERMINATION • PROCTORING BREACH
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            {terminationData.title || 'Examination Integrity Violation'}
          </h1>

          <p style={{
            maxWidth: 640,
            margin: '0 auto 2rem auto',
            color: 'var(--text-secondary)',
            fontSize: '0.98rem',
            lineHeight: 1.6
          }}>
            {terminationData.reason}
          </p>

          {/* Evidence Snapshot Frame if captured */}
          {terminationData.evidenceSnapshot && (
            <div style={{
              maxWidth: 380,
              margin: '0 auto 2rem auto',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '0.75rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Captured Incident Evidence Frame
              </span>
              <img
                src={terminationData.evidenceSnapshot}
                alt="Proctoring Incident Snapshot"
                style={{ width: '100%', borderRadius: 'calc(var(--radius-md) - 2px)', border: '1px solid var(--border-subtle)' }}
              />
            </div>
          )}

          {/* Telemetry Breakdown Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            maxWidth: 620,
            margin: '0 auto 2.5rem auto',
            textAlign: 'left'
          }}>
            <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                Violation Category
              </span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                {terminationData.violationType || 'SECURITY_POLICY'}
              </strong>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                Incident Recorded At
              </span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                {new Date().toLocaleTimeString()}
              </strong>
            </div>

            {terminationData.metrics?.decibels && (
              <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                  Microphone Decibels
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--accent-rose)' }}>
                  {terminationData.metrics.decibels} dB (Permitted: &lt; 50 dB)
                </strong>
              </div>
            )}

            {terminationData.metrics?.detectedPersons && (
              <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                  People in Camera
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--accent-rose)' }}>
                  {terminationData.metrics.detectedPersons} persons (Permitted: 1)
                </strong>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onExit}
              style={{ minWidth: 200 }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MANDATORY HARDWARE CHECK GATE
  // ==========================================
  if (!hardwareVerified) {
    const hasLiveCamera = Boolean(
      deviceStatus.videoGranted &&
      streamRef.current &&
      streamRef.current.getVideoTracks().some(t => t.readyState === 'live' && t.enabled)
    );
    const hasLiveAudio = Boolean(
      deviceStatus.audioGranted &&
      streamRef.current &&
      streamRef.current.getAudioTracks().some(t => t.readyState === 'live' && t.enabled)
    );
    const isSinglePerson = setupPersons === 1 && !setupFaceObstructed;
    const isQuiet = setupDecibels < 58;
    const isReadyToStart = hasLiveCamera && (isSinglePerson || overrideChecked) && !calibrating;

    return (
      <div style={{ maxWidth: 960, margin: '1.5rem auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="eyebrow" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} /> MANDATORY PROCTORING & HARDWARE VERIFICATION
          </span>
          <h1 className="page-title" style={{ fontSize: '1.85rem' }}>System Integrity & Device Check</h1>
          <p className="page-subtitle">
            Webcam access is strictly mandatory to verify your identity, monitor test integrity, and enable real-time AI anti-cheating proctoring.
          </p>
        </div>

        {/* Live Device Permission Status Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Camera Card */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${hasLiveCamera ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-full)',
                background: hasLiveCamera ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hasLiveCamera ? 'var(--accent-emerald)' : 'var(--accent-rose)'
              }}>
                <Camera size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>Camera Video Feed</strong>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  {hasLiveCamera ? (deviceStatus.videoLabel || 'Active & Streaming') : 'Camera Permission Required (Mandatory)'}
                </span>
              </div>
            </div>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: hasLiveCamera ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: hasLiveCamera ? 'var(--accent-emerald)' : 'var(--accent-rose)',
              border: `1px solid ${hasLiveCamera ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
            }}>
              {hasLiveCamera ? 'CONNECTED' : 'MANDATORY'}
            </span>
          </div>

          {/* Microphone Card */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${hasLiveAudio ? 'rgba(16, 185, 129, 0.35)' : 'rgba(99, 102, 241, 0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-full)',
                background: hasLiveAudio ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hasLiveAudio ? 'var(--accent-emerald)' : 'var(--primary)'
              }}>
                <Mic size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>Microphone Audio</strong>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  {hasLiveAudio ? (deviceStatus.audioLabel || 'Active & Listening') : 'Microphone Recommended'}
                </span>
              </div>
            </div>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: hasLiveAudio ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: hasLiveAudio ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              border: `1px solid ${hasLiveAudio ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}>
              {hasLiveAudio ? 'CONNECTED' : 'PENDING'}
            </span>
          </div>
        </div>

        {/* Media Error Alert or Browser Permission Instructions */}
        {(!hasLiveCamera || !hasLiveAudio || mediaError) && (
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: mediaError || !hasLiveCamera ? 'rgba(244, 63, 94, 0.1)' : 'rgba(99, 102, 241, 0.08)',
            border: `1.5px solid ${mediaError || !hasLiveCamera ? 'rgba(244, 63, 94, 0.35)' : 'rgba(99, 102, 241, 0.25)'}`,
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', marginBottom: '0.85rem' }}>
              {mediaError || !hasLiveCamera ? (
                <AlertCircle size={22} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <Info size={22} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem', color: mediaError || !hasLiveCamera ? '#fb7185' : 'var(--text-primary)' }}>
                  {mediaError ? 'Permission Action Required' : 'Mandatory Camera Permission Required'}
                </h4>
                <p style={{ fontSize: '0.86rem', lineHeight: 1.5, margin: 0, color: 'var(--text-secondary)' }}>
                  {mediaError || 'Your browser needs permission to access your webcam. The proctored interview requires continuous camera monitoring for candidate presence and anti-cheating compliance.'}
                </p>
              </div>
            </div>

            {/* Step by step browser instruction pill */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              marginBottom: '1rem'
            }}>
              <strong>How to enable permissions in Chrome / Edge / Firefox / Safari:</strong>
              <ol style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', marginBottom: 0 }}>
                <li>Look at your browser's address bar (at the very top, next to <code>http://localhost:5174/</code>).</li>
                <li>Click the <strong>tune / lock / sliders icon (🎛️ or 🔒)</strong>.</li>
                <li>Toggle <strong>Camera</strong> and <strong>Microphone</strong> to <strong>"Allow"</strong> or <strong>"On"</strong>.</li>
                <li>Click <strong>"Grant Camera & Microphone Access"</strong> below to refresh device streams.</li>
              </ol>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={requestMediaAccess}
                style={{ gap: '0.45rem', fontWeight: 700 }}
              >
                <Camera size={15} />
                <span>Grant Camera & Microphone Access</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={requestMediaAccess}
                style={{ gap: '0.4rem', fontWeight: 700 }}
              >
                <RefreshCw size={15} />
                <span>Prompt Browser Again</span>
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Live Webcam and Mic Visualizer */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={18} color="var(--primary)" />
              Camera Feed Verification
            </h3>

            <div style={{
              position: 'relative',
              width: '100%',
              height: 270,
              background: '#090d16',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${hasLiveCamera ? (isSinglePerson ? 'var(--accent-emerald)' : 'var(--accent-rose)') : 'rgba(99, 102, 241, 0.3)'}`
            }}>
              <video
                ref={setupVideoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={(e) => e.currentTarget.play().catch(() => {})}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />

              {(!streamRef.current || !hasLiveCamera) && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#090d16',
                  padding: '1.25rem',
                  textAlign: 'center',
                  gap: '0.75rem',
                  zIndex: 2
                }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1.5px solid rgba(244, 63, 94, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Camera size={26} color="var(--accent-rose)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                      Webcam Access Strictly Mandatory
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 320, display: 'block', marginTop: '0.2rem' }}>
                      Physical camera stream is required for continuous proctoring and face tracking before the interview can start.
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.3rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={requestMediaAccess}
                      style={{ gap: '0.4rem', fontWeight: 700 }}
                    >
                      <Camera size={15} />
                      <span>Grant Camera Access Now</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Real-Time Face Alignment & Target Tracking Overlay */}
              {streamRef.current && hasLiveCamera && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {setupVisualMetrics.faces && setupVisualMetrics.faces.length > 0 ? (
                    setupVisualMetrics.faces.map((face, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          position: 'absolute',
                          left: `${face.x * 100}%`,
                          top: `${face.y * 100}%`,
                          width: `${face.width * 100}%`,
                          height: `${face.height * 100}%`,
                          border: `2px solid ${face.isSecondary ? 'rgba(244, 63, 94, 0.9)' : 'rgba(16, 185, 129, 0.9)'}`,
                          borderRadius: '12px',
                          boxShadow: `0 0 16px ${face.isSecondary ? 'rgba(244, 63, 94, 0.45)' : 'rgba(16, 185, 129, 0.45)'}`,
                          transition: 'all 0.12s ease-out'
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          top: -24,
                          left: 0,
                          background: face.isSecondary ? 'rgba(244, 63, 94, 0.95)' : 'rgba(16, 185, 129, 0.95)',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.02em',
                          whiteSpace: 'nowrap'
                        }}>
                          {face.isSecondary ? '⚠️ Additional Person' : `Candidate Face • ${face.confidence || 95}%`}
                        </span>
                      </div>
                    ))
                  ) : (
                    /* Subtle Alignment Guide Oval when searching */
                    <div style={{
                      position: 'absolute',
                      top: '14%',
                      left: '28%',
                      width: '44%',
                      height: '66%',
                      border: '2px dashed rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.15)'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
                        Align Face Within Oval
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Live Status HUD Header Overlay */}
              {streamRef.current && hasLiveCamera && (
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  right: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background: isSinglePerson ? 'rgba(16, 185, 129, 0.9)' : 'rgba(244, 63, 94, 0.9)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backdropFilter: 'blur(8px)'
                  }}>
                    <Users size={13} />
                    <span>
                      {setupFaceObstructed
                        ? 'Camera Obstructed'
                        : setupPersons === 1
                          ? '1 Candidate Verified'
                          : setupPersons > 1
                            ? `ALERT: ${setupPersons} Persons in Frame`
                            : 'Position Face in Frame'}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: setupVisualMetrics.lightingCondition === 'DIM' ? 'var(--accent-amber)' : 'var(--text-primary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(8px)'
                  }}>
                    <Sun size={12} color={setupVisualMetrics.lightingCondition === 'DIM' ? 'var(--accent-amber)' : 'var(--accent-emerald)'} />
                    <span>
                      {setupVisualMetrics.lightingCondition === 'DIM'
                        ? 'Dim Light (Compensated)'
                        : setupVisualMetrics.lightingCondition === 'OVEREXPOSED'
                          ? 'Bright Lighting'
                          : 'Optimal Lighting'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Camera Sensitivity & Calibration Toolbar */}
            <div style={{
              marginTop: '0.85rem',
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Sliders size={14} color="var(--primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Proctor Sensitivity</span>
                </div>

                <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-surface)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  {[
                    { id: 'RELAXED', label: '🌿 Relaxed (Dim / Home)', desc: 'Higher tolerance for warm/dim lighting & background furniture' },
                    { id: 'STANDARD', label: '🛡️ Standard', desc: 'Balanced detection for normal desk environments' },
                    { id: 'STRICT', label: '⚖️ Strict', desc: 'Rigorous exam-grade tolerances' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleSensitivityChange(mode.id)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: proctorSensitivity === mode.id ? 800 : 500,
                        background: proctorSensitivity === mode.id ? 'var(--primary)' : 'transparent',
                        color: proctorSensitivity === mode.id ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title={mode.desc}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>
                  {proctorSensitivity === 'RELAXED'
                    ? '✓ Relaxed mode active: ideal for home setups, warm lighting, or headphones.'
                    : proctorSensitivity === 'STRICT'
                      ? '✓ Strict mode active: high sensitivity proctoring.'
                      : '✓ Standard mode active: balanced face geometry tracking.'}
                </span>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCalibrateLighting}
                  disabled={calibratingLighting || !hasLiveCamera}
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', gap: '0.35rem' }}
                >
                  <Sparkles size={12} color="var(--primary)" />
                  <span>{calibratingLighting ? 'Calibrating...' : 'Auto-Calibrate Lighting'}</span>
                </button>
              </div>
            </div>

            {/* Camera Options & Switcher Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.65rem',
              fontSize: '0.76rem',
              color: 'var(--text-tertiary)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={13} color="var(--primary)" />
                <span>{deviceStatus.videoLabel || 'Default Camera'}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {videoDevices.length > 1 && (
                  <select
                    value={selectedVideoDeviceId}
                    onChange={(e) => switchCamera(e.target.value)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.74rem',
                      padding: '0.15rem 0.4rem'
                    }}
                  >
                    {videoDevices.map((dev, idx) => (
                      <option key={dev.deviceId || idx} value={dev.deviceId}>
                        {dev.label || `Camera ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Live Microphone Decibel Meter */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mic size={15} color={isQuiet ? 'var(--accent-emerald)' : 'var(--accent-amber)'} />
                  Microphone Ambient Noise
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isQuiet ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                  {setupDecibels} dB {isQuiet ? '(Quiet & Compliant)' : '(High Noise Warning)'}
                </span>
              </div>

              {/* Decibel Progress Bar */}
              <div style={{ height: 8, background: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (setupDecibels / 85) * 100)}%`,
                  background: isQuiet ? 'var(--accent-emerald)' : setupDecibels < 70 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                  transition: 'width 0.15s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Right Column: Proctoring Protocol & Verification Checklist */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                Proctoring Integrity Protocol
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: hasLiveCamera ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                  border: `1px solid ${hasLiveCamera ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`
                }}>
                  <div style={{ color: hasLiveCamera ? 'var(--accent-emerald)' : 'var(--accent-rose)', marginTop: 2 }}>
                    {hasLiveCamera ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block' }}>
                      Mandatory Camera Connected
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Webcam video must remain active throughout the entire session. Camera permission is strictly mandatory.
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSinglePerson ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                  border: `1px solid ${isSinglePerson ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`
                }}>
                  <div style={{ color: isSinglePerson ? 'var(--accent-emerald)' : 'var(--accent-rose)', marginTop: 2 }}>
                    {isSinglePerson ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block' }}>
                      Single Candidate Requirement
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      If multiple individuals or physical contact with the camera occurs, the test will automatically close.
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isQuiet ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                  border: `1px solid ${isQuiet ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`
                }}>
                  <div style={{ color: isQuiet ? 'var(--accent-emerald)' : 'var(--accent-amber)', marginTop: 2 }}>
                    {isQuiet ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block' }}>
                      Quiet Acoustic Environment
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      If sustained loud background noise or secondary voices are detected, the test will automatically close.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {!hasLiveCamera ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={requestMediaAccess}
                    style={{
                      width: '100%',
                      padding: '0.95rem',
                      fontWeight: 800,
                      fontSize: '1rem',
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
                      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
                    }}
                  >
                    <Camera size={19} />
                    <span>Grant Camera & Microphone Access</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-md"
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      gap: '0.5rem',
                      opacity: 0.65,
                      cursor: 'not-allowed'
                    }}
                  >
                    <Lock size={16} />
                    <span>Camera Permission Mandatory to Begin Interview</span>
                  </button>
                </>
              ) : (isSinglePerson || overrideChecked) ? (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    if (overrideChecked && proctorSensitivity === 'STANDARD') {
                      handleSensitivityChange('RELAXED');
                    }
                    setHardwareVerified(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    fontWeight: 800,
                    fontSize: '1rem',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <ShieldCheck size={19} />
                  <span>Confirm & Begin Proctored Rehearsal</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg"
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.95rem',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      gap: '0.5rem',
                      opacity: 0.85,
                      cursor: 'not-allowed',
                      color: 'var(--accent-rose)',
                      borderColor: 'rgba(244, 63, 94, 0.4)'
                    }}
                  >
                    <AlertCircle size={19} />
                    <span>
                      {setupFaceObstructed
                        ? 'Camera Lens Blocked - Clear Obstruction to Proceed'
                        : setupPersons > 1
                          ? 'Multiple Persons Detected - Ensure You Are Alone'
                          : 'Align Face in Camera Frame to Proceed'}
                    </span>
                  </button>

                  {/* Grace bypass acknowledgement for challenging ambient lighting */}
                  <div style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem'
                  }}>
                    <input
                      type="checkbox"
                      id="proctorBypassCheckbox"
                      checked={overrideChecked}
                      onChange={(e) => setOverrideChecked(e.target.checked)}
                      style={{ marginTop: 3, cursor: 'pointer' }}
                    />
                    <label htmlFor="proctorBypassCheckbox" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.45 }}>
                      <strong>Acknowledge Lighting / Framing:</strong> I confirm I am alone in a private room and my webcam is active. Switch to <em>Relaxed Sensitivity</em> and proceed.
                    </label>
                  </div>
                </>
              )}

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                {!hasLiveCamera
                  ? 'Physical camera permission is strictly required for candidate identity verification.'
                  : (isSinglePerson || overrideChecked)
                    ? 'System verification complete. Click Confirm to launch your proctored session.'
                    : 'Please face the camera directly with good lighting, or adjust sensitivity mode above.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // ==========================================
  // VIEW 3: ACTIVE PROCTORED INTERVIEW ROOM
  // ==========================================
  return (
    <div>
      {/* Top Session Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.5rem',
        background: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-category">{session.category}</span>
          <span className={`badge badge-${(session.difficulty || 'intermediate').toLowerCase()}`}>
            {session.difficulty}
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Target: <strong style={{ color: 'var(--text-primary)' }}>{activeRoleProfile?.title || session.targetRole}</strong>
          </span>
          {/* Programming Language Badge */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(56, 189, 248, 0.14)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            fontSize: '0.78rem',
            fontWeight: 700
          }} title={`All interview questions are calibrated for ${activeLanguageProfile.name || programmingLanguage}`}>
            <Code2 size={13} />
            <span>{activeLanguageProfile.icon ? `${activeLanguageProfile.icon} ` : ''}{activeLanguageProfile.name || programmingLanguage}</span>
          </span>
          {activeRoleProfile && (
            <button
              type="button"
              onClick={() => setShowRoleGuidelines(!showRoleGuidelines)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Toggle Strict Role Calibration Rubric"
            >
              <Sparkles size={12} />
              <span>{activeRoleProfile.badge || 'Role Calibrated'}</span>
              {showRoleGuidelines ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--accent-emerald)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <ShieldCheck size={13} />
            PROCTORED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Question Counter */}
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>

          {/* Countdown Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            background: timeLeft <= 30 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            border: `1px solid ${timeLeft <= 30 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`,
            borderRadius: 'var(--radius-full)',
            color: timeLeft <= 30 ? '#fb7185' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.92rem'
          }}>
            <Clock size={16} />
            <span>{timeFormatted}</span>
          </div>

          {/* Pause / Resume */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume Rehearsal' : 'Pause Rehearsal'}
            style={{ gap: '0.4rem' }}
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onExit}
            style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.4)' }}
          >
            End Rehearsal
          </button>
        </div>
      </div>

      {/* Strict Role Calibration & Pillars Directive Banner */}
      {showRoleGuidelines && activeRoleProfile && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid var(--border-subtle)',
          borderLeft: '4px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                {activeRoleProfile.title || session.targetRole} • {activeLanguageProfile.name || programmingLanguage} Calibration Rubric
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontSize: '0.73rem',
                fontWeight: 700,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '0.18rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Code2 size={12} /> {activeLanguageProfile.name || programmingLanguage} Stack
              </span>
              <span style={{
                fontSize: '0.73rem',
                fontWeight: 700,
                color: 'var(--accent-amber)',
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '0.18rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Strict Directive
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{activeRoleProfile.strict_instruction || activeRoleProfile.strictInstruction}"
            {activeLanguageProfile.strictInstruction && (
              <span style={{ display: 'block', marginTop: '0.25rem', color: '#93c5fd' }}>
                Programming Language Focus: {activeLanguageProfile.strictInstruction}
              </span>
            )}
          </div>
          {((activeRoleProfile.core_pillars || activeRoleProfile.corePillars)?.length > 0 || activeLanguageProfile.corePillars?.length > 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.2rem' }}>
              {(activeRoleProfile.core_pillars || activeRoleProfile.corePillars || []).map((pillar, idx) => (
                <span
                  key={`role-${idx}`}
                  style={{
                    fontSize: '0.73rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>✓</span> {pillar}
                </span>
              ))}
              {(activeLanguageProfile.corePillars || []).slice(0, 3).map((pillar, idx) => (
                <span
                  key={`lang-${idx}`}
                  style={{
                    fontSize: '0.73rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#bae6fd',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Code2 size={11} color="#38bdf8" /> {pillar}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Proctoring Warning Toast Banner */}
      {proctorWarning && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.9rem 1.25rem',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1.5px solid var(--accent-rose)',
          borderRadius: 'var(--radius-md)',
          color: '#fb7185',
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
          animation: 'pulse 1.5s infinite'
        }}>
          <AlertTriangle size={20} />
          <span>{proctorWarning}</span>
        </div>
      )}

      {/* Top Error Alert Banner if any */}
      {sessionError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          borderRadius: 'var(--radius-md)',
          color: '#fb7185',
          fontSize: '0.88rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{sessionError}</span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => setSessionError(null)}
            style={{ color: '#fb7185' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split Room Layout */}
      <div className="interview-room">
        {/* Left Column: AI Question & Post-Answer Feedback */}
        <div className="question-panel">
          <div className="question-box">
            <div className="question-header">
              <span className="eyebrow" style={{ color: 'var(--accent-cyan)' }}>
                {currentQuestion?.isFollowUp ? 'AI PROBING FOLLOW-UP QUESTION' : `QUESTION ${currentIndex + 1}`}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={speakQuestion}
                title="AI reads question aloud"
                style={{ gap: '0.35rem' }}
              >
                <Volume2 size={15} color="var(--primary)" />
                <span>Listen Question</span>
              </button>
            </div>

            <h2 className="question-text">
              {currentQuestion?.questionText}
            </h2>

            {currentQuestion?.expectedKeywords?.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Target Keywords:
                </span>
                <div className="tags-cloud" style={{ marginTop: '0.35rem' }}>
                  {currentQuestion.expectedKeywords.map((kw, i) => (
                    <span key={i} className="tag-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* If Feedback is generated, display the 10-Factor Scorecard */}
          {currentFeedback ? (
            <div className="card-elevated" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
              {/* Header with Overall Score & Verdict */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{
                    width: 54,
                    height: 54,
                    borderRadius: 'var(--radius-full)',
                    background: currentFeedback.overallScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : currentFeedback.overallScore >= 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                    border: `2px solid ${currentFeedback.overallScore >= 80 ? 'var(--accent-emerald)' : currentFeedback.overallScore >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    color: currentFeedback.overallScore >= 80 ? 'var(--accent-emerald)' : currentFeedback.overallScore >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                  }}>
                    {currentFeedback.overallScore}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                      {currentFeedback.overallScore >= 85 ? 'Strong Hire / Ready' : currentFeedback.overallScore >= 65 ? 'Good Foundation / Minor Refinements' : currentFeedback.overallScore >= 35 ? 'Further Practice Recommended' : 'Evasive / Incomplete Answer'}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Rigorous AI Multi-Factor Evaluation & Monitored Speech Telemetry
                    </span>
                  </div>
                </div>

                {/* Next / Finish Button */}
                <button className="btn btn-primary" onClick={handleNext} style={{ fontWeight: 700 }}>
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Full Report'}</span>
                  <ArrowRight size={17} />
                </button>
              </div>

              {/* Monitored Speech Telemetry Audit */}
              {currentFeedback.telemetryAudit && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    <Sparkles size={15} color="var(--primary)" />
                    <span>Monitored Delivery Telemetry:</span>
                  </div>
                  <div>
                    Pace: <strong style={{ color: 'var(--text-primary)' }}>{currentFeedback.telemetryAudit.paceAssessment}</strong>
                  </div>
                  <div>
                    Clarity: <strong style={{ color: 'var(--text-primary)' }}>{currentFeedback.telemetryAudit.fillerAssessment}</strong>
                  </div>
                </div>
              )}

              {/* 6-Dimension Sub-Score Bars */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                padding: '0.85rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                {[
                  { label: 'Accuracy', val: currentFeedback.accuracyScore },
                  { label: 'Relevance', val: currentFeedback.relevanceScore },
                  { label: 'Clarity', val: currentFeedback.clarityScore },
                  { label: 'Confidence', val: currentFeedback.confidenceScore },
                  { label: 'Technical', val: currentFeedback.technicalScore },
                  { label: 'Completeness', val: currentFeedback.completenessScore }
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{metric.label}</span>
                      <span style={{ fontWeight: 800, color: (metric.val ?? 75) >= 80 ? 'var(--accent-emerald)' : (metric.val ?? 75) >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                        {metric.val ?? '--'}%
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-surface-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, metric.val ?? 75)}%`,
                        background: (metric.val ?? 75) >= 80 ? 'var(--accent-emerald)' : (metric.val ?? 75) >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                        borderRadius: 3
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Keyword & Concept Coverage */}
              {((currentFeedback.coveredKeywords && currentFeedback.coveredKeywords.length > 0) ||
                (currentFeedback.missingKeywords && currentFeedback.missingKeywords.length > 0)) && (
                <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    Domain Concept Coverage:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {currentFeedback.coveredKeywords?.map((kw, i) => (
                      <span key={`cov-${i}`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: 'var(--accent-emerald)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <CheckCircle2 size={12} /> {kw}
                      </span>
                    ))}
                    {currentFeedback.missingKeywords?.map((kw, i) => (
                      <span key={`mis-${i}`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: 'var(--accent-amber)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        <AlertCircle size={12} /> Missing: {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={14} /> Key Strengths
                  </span>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {currentFeedback.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={14} /> Refinement Areas
                  </span>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {currentFeedback.weaknesses?.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Polished Rewrite */}
              {currentFeedback.improvedAnswer && (
                <div style={{ marginBottom: '1rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Candidate Response Rewrite (Elevate Impact):
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                    "{currentFeedback.improvedAnswer}"
                  </p>
                </div>
              )}

              {/* Ideal Top 1% Model Answer */}
              {currentFeedback.idealModelAnswer && (
                <div style={{ marginBottom: '1.25rem', background: 'rgba(6, 182, 212, 0.06)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Ideal Model Answer (Top 1% Bar):
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {currentFeedback.idealModelAnswer}
                  </p>
                </div>
              )}

              {/* Dynamic Follow-up Action */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingTop: '0.25rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={askingFollowUp}
                  onClick={handleFollowUp}
                  style={{ gap: '0.35rem' }}
                >
                  <Sparkles size={14} color="var(--primary)" />
                  <span>{askingFollowUp ? 'Formulating Follow-up…' : 'Trigger Proactive AI Follow-Up Question'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Answer Input Box */
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Your Response
                </span>
                <div className="btn-group" style={{ background: 'var(--bg-surface-elevated)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    className={`btn btn-xs ${inputMode === 'VOICE' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setInputMode('VOICE')}
                    style={{ padding: '0.35rem 0.75rem', borderRadius: 'calc(var(--radius-md) - 2px)' }}
                  >
                    <Mic size={14} />
                    <span>Voice Mic</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-xs ${inputMode === 'TEXT' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setInputMode('TEXT')}
                    style={{ padding: '0.35rem 0.75rem', borderRadius: 'calc(var(--radius-md) - 2px)' }}
                  >
                    <Keyboard size={14} />
                    <span>Type Text</span>
                  </button>
                </div>
              </div>

              {/* Textarea or Speech capture */}
              <textarea
                className="form-textarea"
                rows={6}
                placeholder={inputMode === 'VOICE' ? 'Click "Start Voice Recording" or speak directly into your microphone…' : 'Type your detailed answer here…'}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
              />

              {/* Delivery telemetry info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span>Words: <strong style={{ color: 'var(--text-primary)' }}>{wordCount}</strong> • Cadence: <strong style={{ color: 'var(--text-primary)' }}>{estimatedWpm} WPM</strong></span>
                  {estimatedWpm > 165 && <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>(A bit fast)</span>}
                  {estimatedWpm < 100 && estimatedWpm > 0 && <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>(Take pause)</span>}
                  {fillerMatches.length > 0 && (
                    <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>
                      Filler words: {fillerMatches.length} ({fillerMatches.slice(0, 3).join(', ')})
                    </span>
                  )}
                  {isRecording && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      <span className="pulse-dot" style={{ background: '#ef4444', boxShadow: '0 0 8px #ef4444', width: 6, height: 6 }} />
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fca5a5' }}>Recording Live Audio</span>
                      <div className="speech-wave-bars" style={{ height: 14 }}>
                        <div className="speech-wave-bar" style={{ background: '#ef4444', width: 2 }} />
                        <div className="speech-wave-bar" style={{ background: '#ef4444', width: 2 }} />
                        <div className="speech-wave-bar" style={{ background: '#ef4444', width: 2 }} />
                        <div className="speech-wave-bar" style={{ background: '#ef4444', width: 2 }} />
                        <div className="speech-wave-bar" style={{ background: '#ef4444', width: 2 }} />
                      </div>
                    </div>
                  )}
                </div>

                {inputMode === 'VOICE' && (
                  <button
                    type="button"
                    className={`btn btn-sm ${isRecording ? 'btn-danger' : 'btn-primary'}`}
                    onClick={toggleRecording}
                    style={{ gap: '0.45rem', padding: '0.5rem 1.15rem', fontWeight: 700, boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.4)' : undefined }}
                  >
                    {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                    <span>{isRecording ? 'Stop Recording' : 'Start Voice Recording'}</span>
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  disabled={evaluating || !answerText.trim()}
                  className="btn btn-primary btn-lg"
                  onClick={handleAnswerSubmit}
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, gap: '0.5rem' }}
                >
                  {evaluating ? (
                    <span>Analyzing Answer with 10-Factor AI Rubric…</span>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Submit Answer & Get Instant Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Media Preview & Real-Time Proctoring HUD */}
        <div className="media-feed-container">
          {/* Webcam Box with Live Proctoring Overlay */}
          <div className="camera-preview-box" style={{
            position: 'relative',
            border: liveTelemetry.isMultiplePersons
              ? '2px solid var(--accent-rose)'
              : !liveTelemetry.isCandidatePresent || liveTelemetry.isCameraObstructed
                ? '2px solid var(--accent-amber)'
                : '1.5px solid var(--border-subtle)'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={(e) => e.currentTarget.play().catch(() => {})}
              className="camera-video"
            />

            {/* Real-time Dynamic Face Tracking Overlay during Interview */}
            {streamRef.current && liveTelemetry.faces && liveTelemetry.faces.length > 0 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {liveTelemetry.faces.map((face, fIdx) => (
                  <div
                    key={fIdx}
                    style={{
                      position: 'absolute',
                      left: `${face.x * 100}%`,
                      top: `${face.y * 100}%`,
                      width: `${face.width * 100}%`,
                      height: `${face.height * 100}%`,
                      border: `2px solid ${face.isSecondary ? 'rgba(244, 63, 94, 0.9)' : 'rgba(16, 185, 129, 0.85)'}`,
                      borderRadius: '10px',
                      boxShadow: `0 0 14px ${face.isSecondary ? 'rgba(244, 63, 94, 0.45)' : 'rgba(16, 185, 129, 0.35)'}`,
                      transition: 'all 0.12s ease-out'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: -22,
                      left: 0,
                      background: face.isSecondary ? 'rgba(244, 63, 94, 0.95)' : 'rgba(16, 185, 129, 0.95)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      {face.isSecondary ? '⚠️ Extra Person' : `Candidate • ${face.confidence || 95}%`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Virtual Candidate Placeholder if Camera stream is not active */}
            {!streamRef.current && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.95), #090d16)',
                color: 'var(--text-secondary)',
                gap: '0.65rem',
                zIndex: 1,
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1.5px solid rgba(244, 63, 94, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Camera size={26} color="var(--accent-rose)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                    Camera Disconnected
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', maxWidth: 220, marginTop: '0.2rem' }}>
                    Camera feed offline. Active webcam connection is mandatory for proctor compliance.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={requestMediaAccess}
                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.8rem', marginTop: '0.25rem', gap: '0.35rem' }}
                  >
                    <RefreshCw size={12} />
                    <span>Reconnect Camera</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Proctoring HUD Badges */}
            <div style={{
              position: 'absolute',
              top: 10,
              left: 10,
              right: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.74rem',
                color: streamRef.current ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                fontWeight: 700
              }}>
                <div className="pulse-dot" style={{ background: streamRef.current ? 'var(--accent-emerald)' : 'var(--accent-rose)' }} />
                <span>{streamRef.current ? 'AI PROCTOR ACTIVE' : 'CAMERA OFFLINE'}</span>
              </div>

              {/* Person Presence Status Chip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: !streamRef.current
                  ? 'rgba(244, 63, 94, 0.9)'
                  : liveTelemetry.isMultiplePersons
                    ? 'rgba(244, 63, 94, 0.9)'
                    : !liveTelemetry.isCandidatePresent || liveTelemetry.isCameraObstructed
                      ? 'rgba(245, 158, 11, 0.9)'
                      : 'rgba(16, 185, 129, 0.85)',
                color: '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 700,
                backdropFilter: 'blur(8px)'
              }}>
                <Users size={13} />
                <span>
                  {!streamRef.current
                    ? 'Camera Offline'
                    : liveTelemetry.isMultiplePersons
                      ? `ALERT: ${liveTelemetry.detectedPersons} Persons`
                      : liveTelemetry.isCameraObstructed
                        ? 'Camera Obstructed'
                        : !liveTelemetry.isCandidatePresent
                          ? 'Face Not Detected'
                          : '1 Verified Candidate'}
                </span>
              </div>
            </div>

            {/* Bottom Proctoring Audio Decibel Gauge */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mic size={14} color={liveTelemetry.isCriticalNoise ? 'var(--accent-rose)' : liveTelemetry.isLoud ? 'var(--accent-amber)' : 'var(--accent-emerald)'} />
                <span>Audio Noise:</span>
                <strong style={{
                  color: liveTelemetry.isCriticalNoise
                    ? 'var(--accent-rose)'
                    : liveTelemetry.isLoud
                      ? 'var(--accent-amber)'
                      : 'var(--accent-emerald)'
                }}>
                  {liveTelemetry.decibels} dB
                </strong>
              </div>

              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: liveTelemetry.isCriticalNoise
                  ? 'var(--accent-rose)'
                  : liveTelemetry.isLoud
                    ? 'var(--accent-amber)'
                    : 'var(--accent-emerald)'
              }}>
                {liveTelemetry.isCriticalNoise ? 'LOUD NOISE' : liveTelemetry.isLoud ? 'ELEVATED' : 'QUIET ROOM'}
              </span>
            </div>
          </div>

          {/* Audio Visualizer Canvas */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Microphone Audio Frequency
              </span>
              <span style={{ fontSize: '0.75rem', color: isRecording ? 'var(--accent-rose)' : 'var(--text-tertiary)' }}>
                {isRecording ? 'Listening live' : 'Standby'}
              </span>
            </div>
            <canvas ref={canvasRef} className="audio-visualizer-canvas" width={320} height={48} />
          </div>

          {/* Live Delivery Coaching Tips Card */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              Proctored Rehearsal Protocol
            </h3>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
              <li><strong>Private Room:</strong> Ensure no other person enters the camera frame or test terminates automatically.</li>
              <li><strong>Quiet Space:</strong> Keep room quiet. Sustained background conversation triggers auto-termination.</li>
              <li><strong>Camera View:</strong> Keep your face centered in frame; do not cover or block the camera lens.</li>
              <li><strong>STAR Method:</strong> Focus on Situation & Task in 30s, spend 60% on Action, and close with the Result.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
