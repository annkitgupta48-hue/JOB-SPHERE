# JobSphere Copilot Instructions

## 🎯 Project Overview
JobSphere is a modern job portal built with vanilla **JavaScript/HTML5/CSS3** (frontend) + optional **Node.js/MongoDB** (backend). It's production-ready with localStorage persistence, Google OAuth 2.0 authentication, and a comprehensive admin dashboard. No build tools required for frontend.

---

## 🏗️ Architecture Essentials

### Storage Layer (db.js - Database Abstraction)
- **Design Pattern**: Abstraction layer that switches between localStorage (current) and MongoDB (future)
- **Key Functions**: `getJobs()`, `saveJobs()`, `getUsers()`, `getCategories()` - all use same interface
- **Configuration Flag**: `DB_CONFIG.USE_MONGODB` controls backend (false=localStorage, true=MongoDB API)
- **localStorage Keys**: `job_spare_jobs`, `job_spare_users`, `job_spare_categories`, `job_spare_session`
- **When modifying**: Always update BOTH localStorage and MongoDB stub implementations in db.js for consistency

### App Logic (app.js - 1011 lines)
- **Three storage domains**: Users, Jobs, Categories (all managed via db.js)
- **Core functions by domain**:
  - **Auth**: `loginHandler()`, `adminLogin()`, `signupHandler()`, `handleGoogleCredential()`
  - **Jobs**: `publishJob()`, `getJobs()`, `renderAllJobs()`, `saveDraft()`
  - **Admin**: `adminPostJob()`, `adminAddCategory()`, `renderLinkAdmin()`, `updateStats()`
- **State management**: Current user stored in sessionStorage (`job_spare_current`), not persisted on logout
- **Notification system**: `showNotification(msg, type, duration)` uses fixed positioning with animation

### Frontend Structure
- **Single-page app**: Links navigate between pages/ folder (not SPA routing - full page loads)
- **HTML Pages**: Each is standalone (login.html, admin-dashboard.html, jobs.html, etc.)
- **CSS Strategy**: Global styles in style.css + page-specific in ankit.css
- **No build required**: Drop HTML/CSS/JS files in browser - works immediately

---

## 🔐 Authentication Flows

### Three Auth Methods (All in login.html)
1. **Email/Password** (User): Lookup in localStorage users array, verify password
2. **Admin Login**: Same email/password check BUT validates `role === 'admin'`
3. **Google OAuth 2.0**: Parses JWT credential, extracts email/name, auto-creates user account

**Default Credentials**:
- Admin: `admin@jobspare.com` / `admin123` (auto-created on first app load)
- Users: Created via signup.html

**Key Detail**: Session via sessionStorage, NOT persisted - logout clears it immediately.

---

## 📋 Data Model

### Users Schema
```javascript
{
  id: "u{timestamp}",
  email: string,
  password: string (plaintext in localStorage - not production safe),
  name: string,
  role: "user" | "admin",
  createdAt: ISO string
}
```

### Jobs Schema
```javascript
{
  id: "j{timestamp}",
  title: string,
  company: string,
  category: string (must match category in categories list),
  location: string,
  description: string,
  applyLink: string,
  status: "pending" | "approved",
  postedBy: userId,
  createdAt: ISO string,
  views: number,
  applications: number
}
```

### Categories
- Simple array of category name strings stored in localStorage
- Three defaults auto-created: "IT & Software", "Marketing", "Finance"

---

## 🎯 Critical Patterns & Conventions

### 1. HTML Form Handling
- Use `valOf('#selector1', '#selector2')` utility - tries multiple selectors, returns trimmed value
- Don't use `.value` directly - use valOf() for consistency
- All form handlers end with `showNotification()` for user feedback

### 2. localStorage Key Naming
- **Prefix**: `job_spare_*` - search for this pattern to find all storage keys
- **Established keys**: `job_spare_users`, `job_spare_jobs`, `job_spare_categories`, `job_spare_session`, `job_spare_drafts`
- When adding new data type, follow this prefix convention

### 3. Admin-Only Logic
- **Check before rendering**: `getCurrentUser()?.role === 'admin'` throughout UI
- **Admin Dashboard path**: `/pages/admin-dashboard.html` (only accessible if logged in as admin)
- Protected functions that need role check: `adminPostJob()`, `adminAddCategory()`, `adminApproveJob()`

### 4. DOM Manipulation
- Use helper utilities: `qs()` (querySelector), `qsa()` (querySelectorAll)
- HTML escaping critical: `escapeHtml()` for content, `escapeAttr()` for attributes
- Notification positioning: Fixed top-right, uses z-index 10000, auto-removes after 3s

### 5. Job Approval Workflow
- **Admin posts**: status = "approved" (immediate publication)
- **User posts**: status = "pending" (awaits admin review in `/pages/admin-dashboard.html`)
- **Admin approval function**: `adminApproveJob(jobId)` changes status to "approved"

---

## 🚀 Development Workflow

### Local Testing
```bash
# No build required - just open in browser
# Option 1: File Explorer → Right-click index.html → Open with Browser
# Option 2: VS Code → Right-click index.html → "Open with Live Server"
# App loads at file:// or http://localhost:5500
```

### Feature Development Pattern
1. **Modify data model** → Update both getters/setters in db.js
2. **Add new function** → Place in app.js with clear namespace (admin_, render, etc.)
3. **Update UI** → Add HTML to corresponding pages/
4. **Show feedback** → Call `showNotification()` on success/error
5. **Test auth roles** → Ensure admin checks if feature is admin-only

### MongoDB Migration Ready
- **When ready to deploy**: Set `DB_CONFIG.USE_MONGODB = true` in db.js
- **Backend exists**: [backend/server.js](backend/server.js) has Express + Mongoose setup with `/api/jobs`, `/api/users`, `/api/categories` endpoints
- **Environment config**: .env.template documents all required variables (MongoDB connection string, JWT secret, etc.)

---

## 🔗 Integration Points & External Dependencies

### Google OAuth 2.0
- **Where used**: [login.html](pages/login.html), [signup.html](pages/signup.html)
- **Setup required**: Set `CLIENT_ID` constant with your Google Cloud OAuth credentials
- **Flow**: User clicks button → Google popup → JWT returned → Parsed in `handleGoogleCredential()`

### Backend API (When MongoDB enabled)
- **Endpoints**: `/api/jobs`, `/api/users`, `/api/categories` (CRUD operations)
- **Connection**: db.js makes fetch() calls to `MONGODB_API_URL` when `USE_MONGODB = true`
- **Full backend code**: [backend/server.js](backend/server.js) ready to deploy to Heroku/Vercel

---

## ⚠️ Known Limitations & Production Notes

1. **No password hashing** in localStorage version - plaintext passwords stored locally
2. **No rate limiting** on job posting/user signup in current version
3. **No email verification** - signup creates account immediately
4. **Admin account hardcoded** - first load auto-creates admin@jobspare.com / admin123
5. **Drafts are draft-only** - not integrated with published jobs workflow yet

### Before Production Deployment
- Switch to MongoDB backend (set `USE_MONGODB = true`)
- Implement bcrypt password hashing on backend
- Add JWT token validation on API routes
- Configure CORS properly for production domain
- Set strong JWT_SECRET in .env

---

## 📂 File Map - Key Files to Know

| File | Purpose | LOC | Key Functions |
|------|---------|-----|---|
| [app.js](app.js) | Core business logic | 1011 | All major functions (auth, jobs, admin) |
| [db.js](db.js) | Storage abstraction | 358 | getJobs(), saveJobs(), getUsers(), saveUsers() |
| [index.html](index.html) | Homepage + hero section | - | Featured jobs, category browse |
| [pages/admin-dashboard.html](pages/admin-dashboard.html) | Admin control panel | 400+ | Job posting, approval, category mgmt |
| [pages/login.html](pages/login.html) | Auth entry point | - | User + Admin + Google login |
| [backend/server.js](backend/server.js) | Express + MongoDB API | 192 | REST endpoints for production |

---

## 🎓 When You See These Patterns - Know This

- **`job_spare_*` keys** → localStorage - find all data persistence here
- **`escapeHtml()`** → XSS prevention - use before inserting user content to DOM
- **`getCurrentUser()`** → Always returns null or {id, email, role, name} - check role for permissions
- **`showNotification()`** → User feedback - EVERY form action should have one
- **`?. operator`** → Used throughout for safe null checks (getCurrentUser()?.role)
- **Status flow: pending → approved** → Admin must approve user-posted jobs before visible

---

## 🤔 Common Modifications

### Add New Job Category
1. User clicks button in admin dashboard → calls `adminAddCategory()`
2. Function gets input value, adds to categories array, saves to localStorage
3. Category appears in dropdown on job posting form

### Change Job Status Display
- Jobs table renders based on `status` field (pending/approved)
- Modify [admin-dashboard.html](pages/admin-dashboard.html) rendering logic

### Add New User Role
- Create role string in user object (beyond just "admin"/"user")
- Update role checks: `getCurrentUser()?.role === 'newRole'`
- Add role-based UI visibility in templates

---

---

## 🗄️ MongoDB Migration Path (Step-by-Step)

### Phase 1: Current State
- All data persists in **localStorage** (browser-based, single user, single device)
- `db.js` has abstraction layer ready; MongoDB functions are stubs
- `backend/server.js` has full Express + Mongoose setup ready to deploy

### Phase 2: Enable MongoDB
1. **Deploy backend**: Push `backend/server.js` to Heroku/Vercel
2. **Set environment variables**: 
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   JWT_SECRET=your-strong-secret-key
   ```
3. **Update frontend**: In `db.js`, change `DB_CONFIG.USE_MONGODB = false` → `true`
4. **Set API endpoint**: Update `DB_CONFIG.MONGODB_API_URL` to your deployed backend URL

### Phase 3: Data Migration
```javascript
// Migrate localStorage data to MongoDB on first backend connection:
// 1. Backend runs, connects to MongoDB
// 2. Frontend detects USE_MONGODB=true
// 3. db.js makes fetch() POST to /api/jobs/save-all with localStorage array
// 4. Backend uses Mongoose to insert all documents
// 5. Future reads use /api/jobs GET endpoints
```

### Backend API Response Format
- **Success**: `{ data: [...], message: "success" }` (HTTP 200)
- **Error**: `{ error: "message text" }` (HTTP 4xx/5xx)
- **Auth endpoints** (`/api/auth/login`, `/api/auth/register`): Return `{ user: {...}, token: "jwt-token" }`

### Key Backend Features Already Implemented
- Password hashing with bcrypt (10 salt rounds)
- JWT token generation (`expiresIn: '7d'`)
- CORS enabled for cross-domain requests
- Static file serving (frontend from parent directory)
- MongoDB connection with fallback warnings
- Email uniqueness constraints on User model

---

## 🛡️ Error Handling Patterns

### Pattern 1: Graceful Degradation (Silent Failures)
```javascript
// In app.js: MongoDB save is non-blocking
try {
  if (window.DBModule && DBModule.DB_CONFIG && DBModule.DB_CONFIG.USE_MONGODB) {
    const res = DBModule.saveJobs(j);
    if (res && typeof res.then === 'function') 
      res.then(()=> console.log('Saved jobs to MongoDB')).catch(err=>console.warn('Mongo save failed', err));
  }
} catch (e) { console.warn('DBModule saveJobs call failed', e); }
// ⚠️ UI not affected if MongoDB fails - localStorage still works
```

### Pattern 2: Form Validation with Warnings
```javascript
// Early return if validation fails
if (!title || !company || !category || !desc) { 
  showNotification('Please complete all required fields before publishing', 'warning'); 
  return; 
}
// Only proceeds if ALL required fields present
```

### Pattern 3: Data Lookup Errors
```javascript
// When fetching single record, check before operating
const job = jobs.find(j => j.id === jobId);
if (!job) return showNotification('Job not found', 'error');
// Continue only if record exists
```

### Pattern 4: Backend Error Responses (server.js)
```javascript
// API responds with status code + JSON error
try {
  const { email, password } = req.body;
  if (!email || !password) 
    return res.status(400).json({ error: 'Email and password required' });
  if (!MONGODB_URI) 
    return res.status(500).json({ error: 'No MongoDB configured' });
  // ... process
} catch (e) {
  console.error(e);
  return res.status(500).json({ error: e.message });
}
```

### Pattern 5: No UI Crash on Missing DOM Elements
```javascript
const area = qs('#previewArea');
if (!area) return; // Exit silently if element not on this page
// Safe to proceed knowing element exists
```

---

## 📢 Notification System - Complete Reference

### Basic Usage
```javascript
showNotification(message, type, duration)
// message: string (required)
// type: 'success' | 'error' | 'info' | 'warning' (default: 'info')
// duration: ms before auto-dismiss (default: 3000)
```

### Common Patterns in Code

**Success (Job Posted)**
```javascript
showNotification('Job posted — status: ' + job.status, 'success');
```

**Error (Not Found)**
```javascript
if (!draft) return showNotification('Draft not found', 'error');
```

**Warning (Validation)**
```javascript
showNotification('Please fill all fields', 'warning');
```

**Info (Status Update)**
```javascript
showNotification('Loaded draft for editing', 'info');
```

### UI Behavior
- **Position**: Fixed top-right corner (z-index: 10000)
- **Animation**: Slides in (0.3s) → displays → slides out (0.3s) after duration
- **Colors**: Green (#4caf50), Red (#f44336), Blue (#2196f3), Orange (#ff9800)
- **Auto-cleanup**: DOM element removed after animation completes
- **Non-blocking**: Doesn't prevent user interaction elsewhere on page

### When to Use Each Type

| Type | Use Case | Example |
|------|----------|---------|
| **success** | Action completed | Job posted, Category added, Saved draft |
| **error** | Operation failed | Invalid credentials, Job not found, Email exists |
| **warning** | User needs attention | Fill required fields, Invalid input, Confirm action |
| **info** | FYI status | Draft loaded, User logged in, Page changed |

---

## 📚 Documentation References
- **Full architecture**: [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
- **Deployment guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **MongoDB setup**: [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **Quick start**: [QUICKSTART.md](QUICKSTART.md)
