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
    department TEXT,
    level TEXT
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    course_code TEXT,
    reply_mode TEXT,
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
    INSERT INTO users (id, name, email, university, department, level)
    VALUES ('user_1', 'Tunde', 'tunde@unilag.edu.ng', 'University of Lagos', 'Computer Science', '200L')
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

    const id = crypto.randomUUID();
    db.prepare('INSERT INTO materials (id, course_code, title, type, status, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)').run(id, courseCode, title, type, 'pending', 'user_1');

    res.json({ id, message: 'File uploaded successfully' });
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
    // In a real app, filter by logged-in user. Here we assume user_1
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

  // Send Message (Chat with Gemini)
  app.post('/api/sessions/:id/messages', async (req, res) => {
    const { content, role } = req.body; // role: 'user'
    const sessionId = req.params.id;
    const messageId = crypto.randomUUID();

    // Save user message
    db.prepare('INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)').run(messageId, sessionId, role, content);

    // Get session context
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id) as any;
    const course = db.prepare('SELECT * FROM courses WHERE code = ?').get(session.course_code) as any;
    
    // Get history
    const history = db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC').all(sessionId) as {role: string, content: string}[];

    // AI Logic
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let systemInstruction = `You are Akademi, an AI academic companion for Nigerian university students.
      Student: ${user.name}, ${user.level} ${user.department} student at ${user.university}.
      Course: ${course ? `${course.code} - ${course.title}` : 'General'}.
      
      Tone: Encouraging, relatable, clear, and academically rigorous but accessible. Use Nigerian context where appropriate (e.g., relatable analogies).
      `;

      if (session.type === 'assignment') {
        switch (session.reply_mode) {
          case 'direct':
            systemInstruction += `\nMODE: DIRECT REPLY. Provide a direct, structured answer to the question. Be concise and accurate.`;
            break;
          case 'study':
            systemInstruction += `\nMODE: STUDY REPLY. Do NOT give the answer outright. Teach the topic behind the question. Break down concepts step by step. Use analogies. Build comprehension.`;
            break;
          case 'question':
            systemInstruction += `\nMODE: QUESTION REPLY. Reframe the student's question and turn it back to them as a prompt. Ask them to attempt an answer first. Use a Socratic approach.`;
            break;
          case 'wrongly':
            systemInstruction += `\nMODE: WRONGLY REPLY. Deliberately demonstrate an INCORRECT approach to the question using wrong terminology or flawed reasoning. Then ask the student to identify what went wrong.`;
            break;
        }
      } else if (session.type === 'tutor') {
        systemInstruction += `\nMODE: LIVE TUTOR. Act as a patient, knowledgeable tutor. Ask questions to assess understanding before explaining. Adjust depth based on responses.`;
      }

      const chat = ai.chats.create({
        model: "gemini-2.5-flash-lite-latest",
        config: {
          systemInstruction: systemInstruction,
        },
        history: history.slice(0, -1).map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessage({ message: content });
      const responseText = result.text;

      // Save AI response
      const aiMessageId = crypto.randomUUID();
      db.prepare('INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)').run(aiMessageId, sessionId, 'assistant', responseText);

      res.json({ id: aiMessageId, role: 'assistant', content: responseText });

    } catch (error) {
      console.error('Gemini Error:', error);
      res.status(500).json({ error: 'AI service unavailable' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
     // Serve static files in production (if we were building for prod)
     app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
