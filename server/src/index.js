import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import resumeRouter from './routes/resume.js';
import interviewRouter from './routes/interview.js';
import codingRouter from './routes/coding.js';
import questionBankRouter from './routes/questionBank.js';
import analyticsRouter from './routes/analytics.js';
import gamificationRouter from './routes/gamification.js';
import adminRouter from './routes/admin.js';
import scheduleRouter from './routes/schedule.js';
import { initDb } from './db/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_, res) => res.json({
  ok: true,
  name: 'AI-Based Smart Interview Preparation System API',
  version: '1.0.0',
  timestamp: new Date().toISOString()
}));

// Route Mounts
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/coding', codingRouter);
app.use('/api/question-bank', questionBankRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/schedule', scheduleRouter);

// Serve Static Frontend Assets from client/dist if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// For SPA routing, redirect all non-API GET requests to index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // If dist/index.html is not found, show helpful redirect
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>PrepAI Running</title></head>
        <body style="font-family: sans-serif; background: #090d16; color: #f8fafc; padding: 3rem; text-align: center;">
          <h1 style="color: #6366f1;">PrepAI Backend Server Active</h1>
          <p>The API is active on port 3001. Please access the web client at:</p>
          <p><a href="http://localhost:5173" style="color: #34d399; font-size: 1.25rem; font-weight: bold;">http://localhost:5173</a></p>
        </body>
        </html>
      `);
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Unhandled Error]:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    const dbStatus = await initDb();
    console.log(`[Database] Active Storage Engine: ${dbStatus.activeMode}`);
  } catch (err) {
    console.error('[Database] Initialization error:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 PrepAI Server listening on http://localhost:${PORT}`);
  });
}

startServer();
