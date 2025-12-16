# JobSphere Deployment & Security Guide

## Overview

This guide covers:
- Setting up the backend with MongoDB
- Secure password hashing (bcrypt) and JWT authentication
- Deploying to production (Heroku, Railway, Vercel)
- Security checklist before going live

---

## Backend Setup (Local)

### Prerequisites
- Node.js 14+ and npm
- MongoDB Atlas account (free tier available)

### Steps

1. **Create MongoDB Atlas Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Create a new cluster
   - Get your connection string: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/jobsphere?retryWrites=true&w=majority`

2. **Install Dependencies**
   ```powershell
   cd backend
   npm install
   ```

3. **Configure Environment**
   ```powershell
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/jobsphere?retryWrites=true&w=majority
   PORT=3000
   JWT_SECRET=your-very-long-secret-key-min-32-chars-change-in-production
   ```

4. **Start Server**
   ```powershell
   npm run dev    # Development with auto-reload
   npm start      # Production
   ```

   Server runs at `http://localhost:3000`

---

## Backend API Endpoints

### Public Endpoints (No Auth)

**Get Jobs**
```
GET /api/jobs
```
Returns: Array of job objects

**Get Users** (non-sensitive fields only)
```
GET /api/users
```
Returns: Array of {id, name, email, role} (passwords excluded)

**Get Categories**
```
GET /api/categories
```
Returns: Array of category names

---

### Authentication Endpoints

**Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "John Doe"
}

Response: {
  "user": { "id", "name", "email", "role": "user" },
  "token": "eyJhbGc..."
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password"
}

Response: {
  "user": { "id", "name", "email", "role": "user" },
  "token": "eyJhbGc..."
}
```

---

### Protected Endpoints (Require Auth Header)

Include JWT token in Authorization header:
```
Authorization: Bearer eyJhbGc...
```

**Save All Jobs** (bulk update)
```
POST /api/jobs/save-all
Content-Type: application/json

[{ job1 }, { job2 }, ...]

Returns: Array of saved jobs
```

**Save All Users** (bulk update)
```
POST /api/users/save-all
Content-Type: application/json

[{ user1 }, { user2 }, ...]

Returns: Array of saved users (passwords hashed, no plain passwords returned)
```

**Save All Categories** (bulk update)
```
POST /api/categories/save-all
Content-Type: application/json

["category1", "category2", ...]

Returns: Array of saved categories
```

---

## Security Features

### 1. Password Hashing
- Passwords are hashed using **bcrypt** (10 rounds) before storage
- Plain passwords are never stored or returned to clients
- Each password is unique due to salt

### 2. JWT Tokens
- Tokens expire after 7 days
- Tokens contain: user id, email, and role
- Tokens are verified on protected endpoints
- JWT_SECRET must be changed in production

### 3. CORS
- Cross-Origin Resource Sharing enabled for localhost and production domains
- Prevent unauthorized cross-origin requests

### 4. Input Validation
- Email uniqueness enforced at database level
- Password and email required for registration/login
- Payload size limited to 1MB

---

## Deployment to Production

### Option 1: Heroku

1. **Install Heroku CLI**
   ```powershell
   choco install heroku-cli
   ```

2. **Create App**
   ```powershell
   cd backend
   heroku login
   heroku create jobsphere-api
   ```

3. **Set Environment Variables**
   ```powershell
   heroku config:set MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/jobsphere"
   heroku config:set JWT_SECRET="your-production-secret-key-32-chars-min"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```powershell
   git push heroku main
   ```

5. **View Logs**
   ```powershell
   heroku logs --tail
   ```

### Option 2: Railway.app

1. **Sign Up** at https://railway.app

2. **Connect GitHub**
   - Push your code to GitHub
   - Railway auto-deploys on push

3. **Add MongoDB Plugin**
   - In Railway dashboard: Add Plugin > MongoDB
   - Automatically sets MONGODB_URI

4. **Set Environment Variables**
   - In Railway dashboard: Variables
   - Add: `JWT_SECRET`, `NODE_ENV=production`

5. **Deploy**
   - Just push to GitHub, Railway handles the rest

### Option 3: Vercel (Frontend) + Railway (Backend)

1. **Deploy Frontend to Vercel**
   - Connect GitHub repo to Vercel
   - Auto-deploys on push

2. **Deploy Backend to Railway** (as above)

3. **Update Client Settings**
   - In browser settings modal (⚙️ icon)
   - Enable MongoDB
   - Set API URL to: `https://your-railway-app.up.railway.app/api`

---

## Pre-Production Checklist

- [ ] Change JWT_SECRET to a strong random string (32+ chars)
- [ ] Set MONGODB_URI to production MongoDB cluster
- [ ] Enable HTTPS/SSL on all endpoints
- [ ] Add rate limiting to auth endpoints
- [ ] Add request logging/monitoring
- [ ] Configure CORS for your production domain only
- [ ] Add email verification for registrations
- [ ] Implement password reset flow
- [ ] Add 2FA/MFA for admin accounts
- [ ] Monitor and rotate logs regularly
- [ ] Set up automated database backups
- [ ] Test all endpoints in production environment

---

## Hardening Steps for Production

### 1. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
});
app.post('/api/auth/login', loginLimiter, (req, res) => { /* ... */ });
```

### 2. HTTPS Only
```javascript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

### 3. Security Headers
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. Input Sanitization
```javascript
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Prevent NoSQL injection
```

### 5. Email Verification
```javascript
// Add emailVerified flag to User schema
// Send verification email on registration
// Only allow login after verification
```

---

## Troubleshooting

**MongoDB Connection Error**
- Check MONGODB_URI format
- Verify IP whitelist in MongoDB Atlas
- Test connection string manually

**JWT Token Expired**
- Check token expiration time in server.js (7d)
- Refresh token on login page
- Clear sessionStorage and re-login

**CORS Error**
- Verify frontend domain in CORS config
- Check if API URL is correct in settings modal

**Password Validation Fails**
- Ensure password is bcrypt hashed before storing
- Use `bcrypt.compare()` for verification, not `===`

---

## Next Steps

1. Set up GitHub Actions for automated testing
2. Add Datadog or Sentry for error tracking
3. Implement GraphQL for better API queries
4. Add WebSocket for real-time job notifications
5. Implement admin dashboard backend endpoints

---

## Support

For issues or questions:
1. Check logs: `heroku logs --tail` or Railway dashboard
2. Verify .env configuration
3. Test endpoints with Postman or Thunder Client
4. Check MongoDB Atlas status page

