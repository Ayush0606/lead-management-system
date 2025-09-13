import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, findUserById } from '../models/user.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already exists' });
  const user = await createUser({ email, password });
  const token = generateToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.status(201).json({ user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: { id: user.id, email: user.email } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
