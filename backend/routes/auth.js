const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  officerId: { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  name:      { type: String, required: true },
  role:      { type: String, default: 'official' },
  ministry:  { type: String, default: 'Finance Ministry' },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { officerId, password, name, ministry } = req.body;
    if (!officerId || !password || !name)
      return res.status(400).json({ error: 'officerId, password, name required' });
    const existing = await User.findOne({ officerId });
    if (existing) return res.status(400).json({ error: 'Officer ID already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ officerId, password: hashed, name, ministry });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { officerId, password } = req.body;
    if (!officerId || !password)
      return res.status(400).json({ error: 'officerId and password required' });
    const user = await User.findOne({ officerId });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, officerId: user.officerId, role: user.role },
      process.env.JWT_SECRET || 'budget_secret_key',
      { expiresIn: '24h' }
    );
    res.json({ token, user: { officerId: user.officerId, name: user.name, role: user.role, ministry: user.ministry } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'budget_secret_key');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;