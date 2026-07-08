import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { runResearchAgent } from './lib/agent/graph.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

let usersCollection = null;

async function connectToMongo() {
  if (usersCollection) return usersCollection;

  if (!MONGO_URI) {
    return null;
  }

  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('researchdesk');
    usersCollection = db.collection('users');
    console.log('✅ MongoDB connected');
    return usersCollection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    return null;
  }
}

app.use(cors());
app.use(express.json());

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const collection = await connectToMongo();

    if (!collection) {
      return res.status(503).json({ error: 'MongoDB is not configured.' });
    }

    const existing = await collection.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const user = {
      id: randomUUID(),
      name: name?.trim() || 'User',
      email: email.trim().toLowerCase(),
      password: password.trim(),
      createdAt: new Date().toISOString(),
    };

    await collection.insertOne(user);

    return res.status(201).json({
      message: 'User created successfully.',
      user: { id: user.id, name: user.name, email: user.email },
      token: randomUUID(),
    });
  } catch (err) {
    console.error('Signup failed:', err);
    return res.status(500).json({ error: 'Signup failed.', detail: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const collection = await connectToMongo();

    if (!collection) {
      return res.status(503).json({ error: 'MongoDB is not configured.' });
    }

    const user = await collection.findOne({ email: email.trim().toLowerCase(), password: password.trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful.',
      user: { id: user.id, name: user.name, email: user.email },
      token: randomUUID(),
    });
  } catch (err) {
    console.error('Login failed:', err);
    return res.status(500).json({ error: 'Login failed.', detail: err.message });
  }
});

app.post('/api/research', async (req, res) => {
  const { companyName } = req.body || {};

  if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
    return res.status(400).json({ error: "companyName is required." });
  }

  try {
    const result = await runResearchAgent(companyName.trim());
    return res.status(200).json({
      companyName: result.companyName,
      decision: result.decision,
      analysis: result.analysis,
      steps: result.steps,
      structuredFinancials: result.structuredFinancials,
      sources: {
        news: result.newsResults?.map((r) => ({ title: r.title, url: r.url })) || [],
        financials: result.financialResults?.map((r) => ({ title: r.title, url: r.url })) || [],
      },
    });
  } catch (err) {
    console.error("Agent run failed:", err);
    return res.status(500).json({ error: "Agent run failed.", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
