# MongoDB Integration Guide - JobSphere

## Overview
JobSphere has been architected with a **database abstraction layer** (`db.js`) that allows seamless switching between localStorage (current) and MongoDB (production). This guide walks you through setting up MongoDB integration.

---

## Current Architecture

### Storage Layers
1. **Frontend (app.js)** - Uses getJobs(), saveJobs(), getUsers(), saveUsers(), getCategories(), saveCategories()
2. **Abstraction (db.js)** - Routes calls to localStorage OR MongoDB based on USE_MONGODB flag
3. **Backend (optional)** - Node.js/Express API that handles MongoDB CRUD operations
4. **Database** - MongoDB Atlas cloud cluster (recommended) or local MongoDB

### Current Flow (localStorage)
```
app.js → db.js → localStorage
```

### Production Flow (MongoDB)
```
app.js → db.js → backend API → MongoDB Atlas
```

---

## MongoDB Setup Instructions

### Step 1: MongoDB Atlas Account & Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization and project
4. Create a new cluster:
   - Click "Create a Cluster"
   - Select "FREE" tier (M0 - great for development)
   - Choose your region (select closest to your users)
   - Name it "jobsphere-cluster"
   - Click "Create"

### Step 2: Database & Network Access

1. Once cluster is created, click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" as driver
4. Copy your connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@jobsphere-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Note your username and password (save securely)

6. Go to "Network Access" tab in left menu
7. Click "Add IP Address"
8. Select "Allow access from anywhere" (0.0.0.0/0) for development
9. Click "Confirm"

### Step 3: Node.js Backend Setup

Create a new directory for your backend:

```bash
mkdir jobsphere-backend
cd jobsphere-backend
npm init -y
npm install express mongoose cors dotenv
npm install -D nodemon
```

Create `.env` file:
```
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@jobsphere-cluster.xxxxx.mongodb.net/jobsphere?retryWrites=true&w=majority
PORT=3000
```

Create `server.js`:

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5500' })); // Adjust for your frontend URL

// MongoDB Connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ===== SCHEMAS =====

const jobSchema = new mongoose.Schema({
  id: String,
  title: String,
  company: String,
  category: String,
  location: String,
  type: String,
  applyLink: String,
  description: String,
  status: { type: String, default: 'approved' },
  postedBy: String,
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: String
});

const Job = mongoose.model('Job', jobSchema);
const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);

// ===== JOBS ENDPOINTS =====

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json(job);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/jobs/save-all', async (req, res) => {
  try {
    // Bulk save: clear and re-insert (use with caution in production)
    await Job.deleteMany({});
    const jobs = await Job.insertMany(req.body);
    res.json({ success: true, count: jobs.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    await Job.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== USERS ENDPOINTS =====

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, id: user.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/users/save-all', async (req, res) => {
  try {
    await User.deleteMany({});
    const users = await User.insertMany(req.body);
    res.json({ success: true, count: users.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== CATEGORIES ENDPOINTS =====

app.get('/api/categories', async (req, res) => {
  try {
    const cats = await Category.find({});
    res.json(cats.map(c => c.name));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const cat = new Category({ name });
    await cat.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/categories/save-all', async (req, res) => {
  try {
    await Category.deleteMany({});
    const categories = req.body.map(name => ({ name }));
    const cats = await Category.insertMany(categories);
    res.json({ success: true, count: cats.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== START SERVER =====

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Check MongoDB Atlas for data at https://cloud.mongodb.com`);
});
```

Update `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Run the backend:
```bash
npm run dev
```

---

## Step 4: Enabling MongoDB in Frontend

### Option 1: Production (with backend)

1. **Update `db.js`** - Change the configuration:
   ```javascript
   const DB_CONFIG = {
       USE_MONGODB: true,
       MONGODB_API_URL: 'http://localhost:3000/api', // Change for production
   };
   ```

2. **Update `db.js` MongoDB functions** to make actual API calls:
   ```javascript
   async function getJobsFromMongoDB() {
       try {
           const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/jobs');
           return response.json();
       } catch (e) {
           console.error('MongoDB fetch error:', e);
           return getJobsFromLocalStorage(); // Fallback
       }
   }
   
   async function saveJobsToMongoDB(jobs) {
       try {
           const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/jobs/save-all', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(jobs)
           });
           return response.json();
       } catch (e) {
           console.error('MongoDB save error:', e);
           saveJobsToLocalStorage(jobs); // Fallback
       }
   }
   ```

### Option 2: Development (localStorage only - current)

- Keep `USE_MONGODB: false` in `db.js`
- All data stays in browser localStorage
- Perfect for testing UI without backend

---

## MongoDB Collections Schema Reference

### jobs
```javascript
{
  _id: ObjectId,
  id: String,              // Unique identifier (generated on frontend)
  title: String,
  company: String,
  category: String,
  location: String,
  type: String,            // "Full-time", "Part-time", "Contract", "Internship"
  applyLink: String,       // URL to apply
  description: String,
  status: String,          // "approved", "pending", "rejected"
  postedBy: String,        // User ID who posted
  createdAt: Date,
  views: Number,
  applications: Number
}
```

### users
```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  email: String,           // Unique
  password: String,        // Hash in production!
  role: String,            // "user", "admin"
  createdAt: Date
}
```

### categories
```javascript
{
  _id: ObjectId,
  name: String             // Category name
}
```

---

## Production Deployment

### Vercel (Frontend)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Heroku (Backend)
1. Create Heroku app: `heroku create jobsphere-api`
2. Set environment variable: `heroku config:set MONGODB_CONNECTION_STRING="..."`
3. Deploy: `git push heroku main`
4. Update frontend API URL in `db.js` to Heroku URL

### Security Checklist
- [ ] Hash passwords (use bcryptjs in backend)
- [ ] Validate all input (frontend + backend)
- [ ] Use HTTPS only
- [ ] Restrict MongoDB IP whitelist to backend server
- [ ] Never expose MongoDB connection string in frontend code
- [ ] Implement API authentication (JWT tokens)
- [ ] Add CORS restrictions to backend
- [ ] Rate limit API endpoints

---

## Troubleshooting

**"Network access not allowed"**
- Go to MongoDB Atlas → Security → Network Access
- Ensure your backend server IP is whitelisted

**"Connection refused"**
- Check backend is running (`npm run dev`)
- Verify correct connection string in `.env`
- Check MongoDB Atlas cluster is running (may take a few minutes)

**"CORS error"**
- Backend must have `cors` middleware
- Check frontend API URL matches backend URL

**"Data not persisting"**
- Verify `USE_MONGODB: true` in `db.js`
- Check MongoDB Atlas dashboard for actual data

---

## Quick Start Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created cluster and noted connection string
- [ ] Set up Node.js backend with Express + Mongoose
- [ ] Created `.env` file with connection string
- [ ] Updated `db.js` with `USE_MONGODB: true`
- [ ] Implemented MongoDB functions with fetch calls
- [ ] Tested API endpoints with Postman
- [ ] Frontend successfully fetches/saves data from MongoDB
- [ ] Data visible in MongoDB Atlas dashboard

---

## Support

For issues:
1. Check browser console for errors (`F12` → Console)
2. Check backend logs for API errors
3. Check MongoDB Atlas dashboard for connection issues
4. Review MongoDB connection string format

MongoDB docs: https://docs.mongodb.com/
Mongoose docs: https://mongoosejs.com/
