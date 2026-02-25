import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import multer from 'multer';
import { GoogleGenAI } from "@google/genai";
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Database
const db = new Database('akademi.db');
db.pragma('journal_mode = WAL');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    university TEXT,
    faculty TEXT,
    department TEXT,
    level TEXT,
    subscription_tier TEXT DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS learning_profiles (
    user_id TEXT PRIMARY KEY,
    subject_strengths TEXT,
    subject_weaknesses TEXT,
    preferred_explanation_style TEXT,
    session_count INTEGER DEFAULT 0,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS courses (
    code TEXT PRIMARY KEY,
    title TEXT,
    university TEXT
  );

  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    course_code TEXT,
    title TEXT,
    type TEXT,
    status TEXT DEFAULT 'pending',
    uploaded_by TEXT,
    university TEXT,
    department TEXT,
    level TEXT,
    upload_count INTEGER DEFAULT 1,
    verified_at DATETIME,
    contributor_ids TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    course_code TEXT,
    reply_mode TEXT,
    ended_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    role TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES sessions(id)
  );
`);

// Seed some data
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  db.prepare(`
    INSERT INTO users (id, name, email, university, faculty, department, level, subscription_tier)
    VALUES ('user_1', 'Tunde', 'tunde@unilag.edu.ng', 'University of Lagos', 'Science', 'Computer Science', '200L', 'free')
  `).run();

  db.prepare(`
    INSERT INTO learning_profiles (user_id, subject_strengths, subject_weaknesses, preferred_explanation_style)
    VALUES ('user_1', '["Programming", "Logic"]', '["Calculus"]', 'step-by-step')
  `).run();

  const courses = [
    ['CSC 201', 'Computer Programming I', 'University of Lagos'],
    ['MTH 101', 'General Mathematics I', 'University of Lagos'],
    ['GST 101', 'Use of English', 'University of Lagos'],
    ['PHY 101', 'General Physics I', 'University of Lagos'],
    ['CHM 101', 'General Chemistry I', 'University of Lagos']
  ];

  const insertCourse = db.prepare('INSERT OR IGNORE INTO courses (code, title, university) VALUES (?, ?, ?)');
  courses.forEach(c => insertCourse.run(c));
}

async function updateLearningProfile(sessionId: string) {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;
  if (!session) return;

  const messages = db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC').all(sessionId) as {role: string, content: string}[];
  const profile = db.prepare('SELECT * FROM learning_profiles WHERE user_id = ?').get(session.user_id) as any;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    let updates: any = { subject_strengths: [], subject_weaknesses: [], preferred_explanation_style: "" };

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new (GoogleGenAI as any)({ apiKey });
      const chat = ai.chats.create({
        model: "gemini-2.5-flash-lite-latest",
      });

      const prompt = `Analyze the following academic chat session and the student's current learning profile.
      Identify if any new subject strengths, weaknesses, or preferred explanation styles have emerged.
      Return a JSON object with: { "subject_strengths": [], "subject_weaknesses": [], "preferred_explanation_style": "" }.
      Only include NEW or UPDATED information.

      Current Profile:
      Strengths: ${profile.subject_strengths}
      Weaknesses: ${profile.subject_weaknesses}
      Style: ${profile.preferred_explanation_style}

      Chat Session:
      ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
      `;

      const result = await chat.sendMessage({ message: prompt });
      const text = result.text.replace(/```json|```/g, '').trim();
      updates = JSON.parse(text);
    } else {
      // Mock for testing when no API key
      console.log('Mocking learning profile update');
      updates = { subject_weaknesses: ["Python Loops"], preferred_explanation_style: "step-by-step" };
    }

    // Merge strengths and weaknesses
    const currentStrengths = JSON.parse(profile.subject_strengths || '[]');
    const currentWeaknesses = JSON.parse(profile.subject_weaknesses || '[]');

    const newStrengths = Array.from(new Set([...currentStrengths, ...(updates.subject_strengths || [])]));
    const newWeaknesses = Array.from(new Set([...currentWeaknesses, ...(updates.subject_weaknesses || [])]));

    db.prepare(`
      UPDATE learning_profiles
      SET subject_strengths = ?,
          subject_weaknesses = ?,
          preferred_explanation_style = COALESCE(?, preferred_explanation_style),
          session_count = session_count + 1,
          last_active = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(JSON.stringify(newStrengths), JSON.stringify(newWeaknesses), updates.preferred_explanation_style || null, session.user_id);

  } catch (error) {
    console.error('Failed to update learning profile:', error);
  }
}

function triggerVerification(materialId: string) {
  console.log(`Triggering verification for material ${materialId}`);
  // Step 4 & 5: AI Reconciliation (Mocked)
  db.prepare("UPDATE materials SET status = 'verified', verified_at = CURRENT_TIMESTAMP WHERE id = ?").run(materialId);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Configure Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage });

  // API Routes
  
  // Get User Profile
  app.get('/api/user', (req, res) => {
    const user = db.prepare('SELECT * FROM users LIMIT 1').get();
    res.json(user);
  });

  app.get('/api/learning-profile', (req, res) => {
    const profile = db.prepare("SELECT * FROM learning_profiles WHERE user_id = 'user_1'").get();
    res.json(profile);
  });

  // Get Courses
  app.get('/api/courses', (req, res) => {
    const courses = db.prepare('SELECT * FROM courses').all();
    res.json(courses);
  });

  // Get Materials
  app.get('/api/materials', (req, res) => {
    const materials = db.prepare('SELECT * FROM materials ORDER BY created_at DESC').all();
    res.json(materials);
  });

  // Upload Material
  app.post('/api/materials', upload.single('file'), (req, res) => {
    const { courseCode, title, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Step 2 & 3: Similarity and Threshold
    const existing = db.prepare("SELECT * FROM materials WHERE course_code = ? AND title = ? AND status != 'verified'").get(courseCode, title) as any;

    if (existing) {
      const newCount = existing.upload_count + 1;
      const contributorIds = JSON.parse(existing.contributor_ids || '[]');
      if (!contributorIds.includes('user_1')) {
        contributorIds.push('user_1');
      }

      db.prepare('UPDATE materials SET upload_count = ?, contributor_ids = ? WHERE id = ?').run(newCount, JSON.stringify(contributorIds), existing.id);

      if (newCount >= 10) {
        triggerVerification(existing.id);
      }
      res.json({ id: existing.id, message: 'Contribution recorded', upload_count: newCount });
    } else {
      const id = crypto.randomUUID();
      db.prepare(`
        INSERT INTO materials (id, course_code, title, type, status, uploaded_by, university, department, level, contributor_ids)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, courseCode, title, type, 'pending', 'user_1', 'University of Lagos', 'Computer Science', '200L', JSON.stringify(['user_1']));
      res.json({ id, message: 'Material uploaded' });
    }
  });

  // Create Session
  app.post('/api/sessions', (req, res) => {
    const { userId, type, courseCode, replyMode } = req.body;
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO sessions (id, user_id, type, course_code, reply_mode) VALUES (?, ?, ?, ?, ?)').run(id, userId, type, courseCode, replyMode);
    res.json({ id });
  });

  // Get User Sessions
  app.get('/api/sessions', (req, res) => {
    const sessions = db.prepare(`
      SELECT s.*, 
      (SELECT content FROM messages WHERE session_id = s.id ORDER BY created_at ASC LIMIT 1) as first_message
      FROM sessions s 
      WHERE user_id = 'user_1' 
      ORDER BY created_at DESC
    `).all();
    res.json(sessions);
  });

  // Get Session Messages
  app.get('/api/sessions/:id/messages', (req, res) => {
    const messages = db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC').all(req.params.id);
    res.json(messages);
  });

  // Send Message
  app.post('/api/sessions/:id/messages', async (req, res) => {
    const { content, role } = req.body;
    const sessionId = req.params.id;
    const messageId = crypto.randomUUID();

    db.prepare('INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)').run(messageId, sessionId, role, content);

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id) as any;
    const course = db.prepare('SELECT * FROM courses WHERE code = ?').get(session.course_code) as any;
    const profile = db.prepare('SELECT * FROM learning_profiles WHERE user_id = ?').get(session.user_id) as any;
    const history = db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC').all(sessionId) as {role: string, content: string}[];

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      let responseText = "";

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new (GoogleGenAI as any)({ apiKey });

        let systemInstruction = `You are Akademi, an AI academic companion for Nigerian university students.
        Student: ${user.name}, ${user.level} ${user.department} student at ${user.university}.
        Course: ${course ? `${course.code} - ${course.title}` : 'General'}.

        Learning Profile:
        Strengths: ${profile.subject_strengths}
        Weaknesses: ${profile.subject_weaknesses}
        Preferred Style: ${profile.preferred_explanation_style}

        Tone: Encouraging, relatable, clear, and academically rigorous but accessible. Use Nigerian context where appropriate (e.g., relatable analogies).
        `;

        if (session.type === 'assignment') {
          switch (session.reply_mode) {
            case 'direct': systemInstruction += `\nMODE: DIRECT REPLY.`; break;
            case 'study': systemInstruction += `\nMODE: STUDY REPLY.`; break;
            case 'question': systemInstruction += `\nMODE: QUESTION REPLY.`; break;
            case 'wrongly': systemInstruction += `\nMODE: WRONGLY REPLY.`; break;
          }
        } else if (session.type === 'tutor') {
          systemInstruction += `\nMODE: LIVE TUTOR.`;
        }

        const chat = ai.chats.create({
          model: "gemini-2.5-flash-lite-latest",
          config: { systemInstruction },
          history: history.slice(0, -1).map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          })),
        });

        const result = await chat.sendMessage({ message: content });
        responseText = result.text;
      } else {
        responseText = "I'm currently in offline mode (mock). How can I help you today?";
      }

      const aiMessageId = crypto.randomUUID();
      db.prepare('INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)').run(aiMessageId, sessionId, 'assistant', responseText);

      res.json({ id: aiMessageId, role: 'assistant', content: responseText });

      // Update profile in background
      updateLearningProfile(sessionId);

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'AI service unavailable' });
    }
  });

  // Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:3000`);
  });
}

startServer();
