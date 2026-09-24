import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import db from '../db/index.js';
import { requireAuth } from '../services/authService.js';
import { parseResumeWithAI, matchResumeToJobDescription } from '../services/geminiService.js';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  storage: multer.memoryStorage()
});

const router = Router();

/**
 * Helper: Retrieve all resumes for a user as an array
 */
export async function getUserResumes(userId) {
  return await db.resumes.getByUserId(userId);
}

/**
 * Helper: Retrieve active or specified resume for a user
 */
export async function getActiveResume(userId, specificResumeId = null) {
  return await db.resumes.getActive(userId, specificResumeId);
}

// 1. Get all resumes for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userResumes = await getUserResumes(req.user.id);
    res.json(userResumes);
  } catch (err) {
    console.error('[Resume Get Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve resumes.' });
  }
});

// 2. Retrieve user's active / latest parsed resume (backwards compatible)
router.get('/latest', requireAuth, async (req, res) => {
  try {
    const active = await getActiveResume(req.user.id);
    if (!active) {
      return res.status(200).json(null);
    }
    res.json(active);
  } catch (err) {
    console.error('[Resume Latest Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve latest resume.' });
  }
});

// 3. Retrieve specific resume by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    if (req.params.id === 'latest') {
      const active = await getActiveResume(req.user.id);
      return res.status(200).json(active || null);
    }
    const userResumes = await getUserResumes(req.user.id);
    const found = userResumes.find(r => r.id === req.params.id) || await db.resumes.getById(req.params.id);
    if (!found) {
      return res.status(404).json({ message: 'Resume not found.' });
    }
    res.json(found);
  } catch (err) {
    console.error('[Resume ID Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve resume.' });
  }
});

// 4. Upload / Parse New Resume (Text or Multipart Document)
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    let rawText = '';
    let fileName = 'Pasted Resume.txt';

    if (req.file) {
      fileName = req.file.originalname;
      rawText = req.file.buffer.toString('utf-8');
      rawText = rawText.replace(/[^\x20-\x7E\t\n\r]/g, ' ');
    } else if (req.body.resumeText) {
      rawText = req.body.resumeText;
      fileName = req.body.fileName || 'Pasted Resume.txt';
    }

    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({ message: 'Please provide valid resume content (at least 20 characters).' });
    }

    const userProfile = await db.userProfiles.get(req.user.id);
    const targetRole = req.body.targetRole || userProfile?.targetRole || 'Software Engineer';
    const title = req.body.title || (fileName ? fileName.replace(/\.[^/.]+$/, "") : 'Resume');

    // AI Semantic Parsing & Skill Extraction
    const parsedData = await parseResumeWithAI(rawText, targetRole);

    const resumeRecord = {
      id: `res-${crypto.randomUUID()}`,
      userId: req.user.id,
      title,
      targetRole,
      filename: fileName,
      fileName,
      fileSize: req.file?.size || rawText.length,
      mimeType: req.file?.mimetype || 'text/plain',
      rawText,
      parsedData,
      extractedSkills: parsedData.extractedSkills || [],
      missingSkills: parsedData.missingRecommendedSkills || [],
      overallScore: parsedData.resumeQualityScore || 75,
      isActive: true,
      uploadedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.resumes.create(resumeRecord);

    // Sync extracted skills into user profile
    if (userProfile && parsedData.extractedSkills?.length) {
      const currentSkills = userProfile.skills || [];
      const mergedSkills = [...new Set([...currentSkills, ...parsedData.extractedSkills])];
      await db.userProfiles.upsert(req.user.id, {
        ...userProfile,
        skills: mergedSkills,
        targetRole: parsedData.headline || userProfile.targetRole,
        experienceYears: parsedData.yearsOfExperience || userProfile.experienceYears,
        updatedAt: new Date().toISOString()
      });
    }

    res.status(201).json(resumeRecord);
  } catch (err) {
    console.error('[Resume Upload Error]:', err);
    res.status(500).json({ message: 'Failed to process resume.' });
  }
});

// 5. Set active/primary resume
router.put('/:id/set-active', requireAuth, async (req, res) => {
  try {
    const userResumes = await getUserResumes(req.user.id);
    const target = userResumes.find(r => r.id === req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    const updated = await db.resumes.setActive(req.user.id, req.params.id);

    // Sync profile skills from newly active resume
    const userProfile = await db.userProfiles.get(req.user.id);
    if (userProfile && target.extractedSkills?.length) {
      const currentSkills = userProfile.skills || [];
      const mergedSkills = [...new Set([...currentSkills, ...target.extractedSkills])];
      await db.userProfiles.upsert(req.user.id, {
        ...userProfile,
        skills: mergedSkills,
        targetRole: target.parsedData?.headline || target.targetRole || userProfile.targetRole,
        experienceYears: target.parsedData?.yearsOfExperience || userProfile.experienceYears,
        updatedAt: new Date().toISOString()
      });
    }

    res.json({
      message: 'Active resume updated',
      activeResume: { ...target, isActive: true },
      resumes: updated
    });
  } catch (err) {
    console.error('[Resume Set Active Error]:', err);
    res.status(500).json({ message: 'Failed to update active resume.' });
  }
});

// 6. Delete a resume
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const success = await db.resumes.delete(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    const remaining = await getUserResumes(req.user.id);
    res.json({
      message: 'Resume deleted successfully',
      remainingResumes: remaining,
      activeResume: remaining.find(r => r.isActive) || null
    });
  } catch (err) {
    console.error('[Resume Delete Error]:', err);
    res.status(500).json({ message: 'Failed to delete resume.' });
  }
});

// 7. Match resume against Job Description
router.post('/analyze-jd', requireAuth, async (req, res) => {
  try {
    const { jobDescriptionText, resumeText, resumeId } = req.body;
    if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
      return res.status(400).json({ message: 'Please provide a valid Job Description (at least 20 characters).' });
    }

    let textToCompare = resumeText || '';
    if (!textToCompare && resumeId) {
      const userResumes = await getUserResumes(req.user.id);
      const specific = userResumes.find(r => r.id === resumeId);
      if (specific) textToCompare = specific.rawText;
    }
    if (!textToCompare) {
      const active = await getActiveResume(req.user.id);
      textToCompare = active?.rawText || '';
    }

    if (!textToCompare || textToCompare.trim().length < 20) {
      return res.status(400).json({ message: 'No resume found. Please upload or paste a resume first.' });
    }

    const analysis = await matchResumeToJobDescription(textToCompare, jobDescriptionText);
    res.json(analysis);
  } catch (err) {
    console.error('[JD Match Error]:', err);
    res.status(500).json({ message: 'Failed to evaluate Job Description match.' });
  }
});

export default router;
