const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// High-Level Security Middleware
app.use(helmet()); // Sets robust HTTP headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter); // Apply to all our MongoDB access routes

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
const budgetRoutes = require('./routes/budget');
app.use('/api/budget', budgetRoutes);
const secureRoute = require('./routes/secureroute');
app.use('/api/secure', secureRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ============================================================
// 🔐 DATA INTEGRITY — DIGITAL SIGNATURE VERIFY ROUTES
// ============================================================
const DATA_DIR = path.join(__dirname, 'data');
const KEYS_DIR = path.join(__dirname, 'keys');
const SIG_DIR = path.join(__dirname, 'signatures');

// GET /api/verify/budget_data.csv  ← ek file verify karo
app.get('/api/verify/:filename', (req, res) => {
  const { filename } = req.params;

  if (!filename.endsWith('.csv')) {
    return res.status(400).json({
      success: false,
      message: 'Sirf .csv files verify hoti hain.',
    });
  }

  const dataPath = path.join(DATA_DIR, filename);
  const sigPath = path.join(SIG_DIR, filename + '.sig');
  const pubKeyPath = path.join(KEYS_DIR, 'public.pem');

  if (!fs.existsSync(dataPath))
    return res.status(404).json({ success: false, message: `data/${filename} nahi mila.` });
  if (!fs.existsSync(sigPath))
    return res.status(404).json({ success: false, message: `signatures/${filename}.sig nahi mili. Pehle: node signData.js` });
  if (!fs.existsSync(pubKeyPath))
    return res.status(500).json({ success: false, message: 'keys/public.pem nahi mili.' });

  try {
    const fileContent = fs.readFileSync(dataPath);
    const publicKey = fs.readFileSync(pubKeyPath, 'utf8');
    const sigData = JSON.parse(fs.readFileSync(sigPath, 'utf8'));

    const verify = crypto.createVerify('SHA256');
    verify.update(fileContent);
    verify.end();

    const isValid = verify.verify(publicKey, sigData.signature, 'base64');

    if (isValid) {
      return res.json({
        success: true,
        message: `✅ "${filename}" verified — data tamper nahi hua.`,
        file: filename,
        signedAt: sigData.signedAt,
        algorithm: sigData.algorithm,
      });
    } else {
      return res.json({
        success: false,
        message: `⚠️ "${filename}" TAMPERED hai! Signature match nahi kiya.`,
        file: filename,
        signedAt: sigData.signedAt,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error: ' + err.message });
  }
});

// GET /api/verify-all  ← saari CSV files ek saath verify karo
app.get('/api/verify-all', (req, res) => {
  const pubKeyPath = path.join(KEYS_DIR, 'public.pem');

  if (!fs.existsSync(pubKeyPath)) {
    return res.status(500).json({ success: false, message: 'keys/public.pem nahi mili.' });
  }

  const publicKey = fs.readFileSync(pubKeyPath, 'utf8');
  const csvFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.csv'));

  if (csvFiles.length === 0) {
    return res.json({ success: true, message: 'Koi CSV nahi mili.', results: [] });
  }

  const results = csvFiles.map((file) => {
    const dataPath = path.join(DATA_DIR, file);
    const sigPath = path.join(SIG_DIR, file + '.sig');

    if (!fs.existsSync(sigPath)) {
      return { file, status: 'NO_SIGNATURE', message: 'Signature file nahi mili' };
    }

    try {
      const fileContent = fs.readFileSync(dataPath);
      const sigData = JSON.parse(fs.readFileSync(sigPath, 'utf8'));

      const verify = crypto.createVerify('SHA256');
      verify.update(fileContent);
      verify.end();

      const isValid = verify.verify(publicKey, sigData.signature, 'base64');

      return {
        file,
        status: isValid ? 'VALID' : 'TAMPERED',
        signedAt: sigData.signedAt,
        message: isValid ? 'Integrity OK ✅' : 'Data tampered ⚠️',
      };
    } catch (err) {
      return { file, status: 'ERROR', message: err.message };
    }
  });

  const validCount = results.filter((r) => r.status === 'VALID').length;

  return res.json({
    success: validCount === csvFiles.length,
    summary: `${validCount}/${csvFiles.length} files valid`,
    results,
  });
});
// ============================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});