require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING || '';
const JWT_SECRET = process.env.JWT_SECRET || 'jobsphere-dev-secret-change-in-production';

// Serve frontend static files from project root (one level up)
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB if URI provided
mongoose.set('strictQuery', false);
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('⚠️  No MONGODB_URI configured. API will run but DB operations will fail. Set MONGODB_URI in .env');
}

// Define simple schemas
const jobSchema = new mongoose.Schema({
  id: String, title: String, company: String, category: String, location: String,
  type: String, applyLink: String, description: String, status: String,
  postedBy: String, createdAt: Date, views: Number, applications: Number
}, { strict: false });

const userSchema = new mongoose.Schema({
  id: String, name: String, email: { type: String, unique: true, sparse: true }, 
  password: String, role: String, createdAt: Date
}, { strict: false });

const categorySchema = new mongoose.Schema({ name: String }, { strict: false });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// ===== JWT MIDDLEWARE =====
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(); // Optional auth
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (e) {
    console.warn('Invalid token:', e.message);
  }
  next();
}

app.use(verifyToken);

// ===== AUTH ENDPOINTS =====
// Register/Create User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!MONGODB_URI) return res.status(500).json({ error: 'No MongoDB configured' });

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: 'u' + Date.now() + Math.floor(Math.random() * 999),
      email, password: hashedPassword, name: name || email.split('@')[0],
      role: 'user', createdAt: new Date()
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!MONGODB_URI) return res.status(500).json({ error: 'No MongoDB configured' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Compare password with hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// ===== JOBS API =====
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = MONGODB_URI ? await Job.find().sort({ createdAt: -1 }) : [];
    return res.json(jobs);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/jobs/save-all', async (req, res) => {
  try {
    const jobs = Array.isArray(req.body) ? req.body : [];
    if (!MONGODB_URI) return res.status(500).json({ error: 'No MongoDB configured' });
    await Job.deleteMany({});
    const inserted = await Job.insertMany(jobs);
    return res.json(inserted);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// ===== USERS API =====
app.get('/api/users', async (req, res) => {
  try {
    const users = MONGODB_URI ? await User.find().sort({ createdAt: -1 }) : [];
    // Don't return password hashes to client
    return res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

app.post('/api/users/save-all', async (req, res) => {
  try {
    const users = Array.isArray(req.body) ? req.body : [];
    if (!MONGODB_URI) return res.status(500).json({ error: 'No MongoDB configured' });
    await User.deleteMany({});
    // Hash passwords before saving
    const hashPromises = users.map(async u => ({
      ...u,
      password: u.password ? await bcrypt.hash(u.password, 10) : u.password
    }));
    const usersWithHashedPasswords = await Promise.all(hashPromises);
    const inserted = await User.insertMany(usersWithHashedPasswords);
    return res.json(inserted.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// ===== CATEGORIES API =====
app.get('/api/categories', async (req, res) => {
  try {
    if (!MONGODB_URI) return res.json([]);
    const cats = await Category.find();
    return res.json(cats.map(c => c.name || c));
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

app.post('/api/categories/save-all', async (req, res) => {
  try {
    const categories = Array.isArray(req.body) ? req.body : [];
    if (!MONGODB_URI) return res.status(500).json({ error: 'No MongoDB configured' });
    await Category.deleteMany({});
    const docs = categories.map(name => ({ name }));
    const inserted = await Category.insertMany(docs);
    return res.json(inserted.map(d => d.name));
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Fallback to serve index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

