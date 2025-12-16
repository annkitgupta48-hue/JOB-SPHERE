# Admin Dashboard & Authentication Setup Guide

## 🔐 Complete Authentication System

### User Roles
```
👤 User (Regular)
  - Browse jobs
  - Apply to jobs
  - View profile
  - Email/Password or Google Sign-In

🔐 Admin
  - Post new jobs (auto-approved)
  - Manage all jobs
  - Approve user submissions
  - Create/delete categories
  - Edit apply links
  - View analytics
  - Special credentials required
```

---

## 👤 User Login Process

### 1. Email/Password Login
**Access**: `/pages/login.html` → User Login tab

```
Email: user@example.com
Password: anypassword
```

**Steps**:
1. Go to login page
2. Enter email and password
3. Click "Login"
4. Redirected to user dashboard

### 2. Google Sign-In (Setup Required)
**Features**: 
- One-click login/signup
- No password needed
- Auto-creates account on first login

**Setup**:
1. Get Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com)
2. In `login.html` line ~157:
   ```javascript
   const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```
3. Replace with actual Client ID
4. Google Sign-In button will appear

**Usage**:
- Click Google button
- Select your Google account
- Auto-login or create account

---

## 🔐 Admin Login (NEW!)

### Default Admin Credentials
```
Email:    admin@jobspare.com
Password: admin123
```

### Admin Login Steps

**1. Navigate to Login Page**
```
Go to: http://localhost:5500/pages/login.html
```

**2. Click "🔐 Admin Login" Tab**
```
You'll see two tabs:
- 👤 User Login (default)
- 🔐 Admin Login (click this)
```

**3. Enter Admin Credentials**
```
Admin Email: admin@jobspare.com
Admin Password: admin123
```

**4. Click "🔓 Admin Login"**
```
✅ Admin authenticated
→ Redirected to admin dashboard
```

### Admin Dashboard Access
```
URL: /pages/admin-dashboard.html

Tabs Available:
1. ➕ Post Job
2. 📋 Manage Jobs
3. ⏳ Pending Approval
4. 🏷️ Categories
5. 🔗 Apply Links

Stats Grid:
- Total Jobs
- Pending Approval
- Registered Users
- Categories
```

---

## 📝 How to Post Jobs (Admin)

### Step 1: Login as Admin
```
Go to: /pages/login.html
→ Click "🔐 Admin Login" tab
→ Enter admin@jobspare.com / admin123
→ Click "🔓 Admin Login"
```

### Step 2: Access Job Posting Form
```
URL: /pages/admin-dashboard.html
→ Click "➕ Post Job" tab (active by default)
```

### Step 3: Fill Job Details

**Required Fields** (marked with *):
```
Job Title *
  Example: Senior Full-Stack Developer

Company *
  Example: Tech Innovators Inc.

Category *
  Dropdown: Select from existing categories
  Examples: IT & Software, Marketing & Sales, Education & Training

Location *
  Example: Bengaluru, Remote, Mumbai

Job Type
  Options: Full-time, Part-time, Contract, Internship

Apply Link *
  Example: https://careers.example.com/apply/job-123

Job Description *
  Detailed description of the job
  (Can include requirements, responsibilities, benefits, etc.)
```

### Step 4: Submit Job

**Click "✅ Post Job (Auto-Approved)"**

**Result**:
- ✅ Green notification: "Job posted: [Job Title]"
- Job appears immediately
- Stats counter increments
- Job visible on homepage featured section
- Job appears in "Manage Jobs" tab
- Available for all users to apply

---

## 🎯 Admin Features Breakdown

### 1. ➕ Post Job Tab

**Form Fields**:
- Title, Company, Category, Location, Type
- Apply Link, Description
- Button: "✅ Post Job (Auto-Approved)"
- Button: "🔄 Clear" (reset form)

**Auto-Approval**:
- Admin-posted jobs are approved immediately
- No pending review needed
- Appear on homepage instantly
- Users can apply right away

### 2. 📋 Manage Jobs Tab

**Displays**: All jobs in table format

**Table Columns**:
- Job Title
- Company
- Category
- Location
- Status (Approved/Pending badge)
- Actions (Delete button)

**Actions**:
- 🗑️ Delete any job (confirmation required)
- Stats update automatically

### 3. ⏳ Pending Approval Tab

**For User-Submitted Jobs**:
- Shows jobs submitted by regular users
- Admin can approve or reject

**Actions**:
- ✅ Approve → Moves to approved jobs
- ❌ Reject → Deletes permanently

### 4. 🏷️ Categories Tab

**Manage Categories**:
- Add new category (input field + Add button)
- Delete existing categories (delete button)
- Changes sync with job posting dropdown
- Examples: "Remote Jobs", "Startup Roles", etc.

### 5. 🔗 Apply Links Tab

**Edit Application URLs**:
- Shows all jobs with editable link fields
- Edit inline: click field and change URL
- 💾 Save All button: saves all changes at once
- Green notification on successful save

### Stats Grid (All Tabs)

**Real-time Counters**:
```
📊 Total Jobs        → Count of all jobs
⏳ Pending Approval  → Jobs awaiting review
👥 Registered Users  → All user accounts
🏷️ Categories       → Total categories

Auto-updates after each action
```

---

## 🔑 Creating Additional Admin Accounts

### Method 1: Signup + Manual Role Change (Dev Mode)

**1. Create user account**:
- Go to signup page
- Create account with name, email, password

**2. Make admin** (Browser Console):
```javascript
const users = getUsers();
const user = users.find(u => u.email === 'newemail@example.com');
user.role = 'admin';  // Change to admin
saveUsers(users);
```

### Method 2: Direct localStorage Edit (Development)

**1. Press F12 → Application → Local Storage**

**2. Find key**: `job_spare_users`

**3. Edit JSON**:
```json
[
  {
    "id": "u12345",
    "name": "New Admin",
    "email": "admin2@jobspare.com",
    "password": "admin456",
    "role": "admin",
    "createdAt": "2024-01-01T..."
  }
]
```

**4. Refresh and login with new credentials**

### Method 3: Production (Backend API)

When MongoDB is enabled:
```javascript
// Create admin user via API
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Admin',
    email: 'admin3@jobspare.com',
    password: 'securepass123',  // Hash in backend!
    role: 'admin'
  })
});
```

---

## 🔒 Security Notes

### Current Implementation (Development)
```
⚠️ Passwords stored in plain text (localStorage)
✓ For development/testing only
⚠️ Not suitable for production
```

### Production Requirements
```
✅ Hash passwords with bcryptjs
✅ Use HTTPS only
✅ Validate all inputs
✅ Implement JWT tokens
✅ Rate limit login attempts
✅ Add 2FA for admin accounts
✅ Audit logs for admin actions
✅ Never expose passwords in code
```

### Before Deploying
1. Set up backend with password hashing (bcryptjs)
2. Replace plain-text passwords with hashed values
3. Implement proper session management (JWT)
4. Enable HTTPS on server
5. Add role-based access control (RBAC)

---

## 🧪 Testing Admin Features

### Quick Test Workflow

**Step 1: Auto-Login as Admin** (Console)
```javascript
testAdminLogin()
// Logs in as admin, reloads page
```

**Step 2: Post Sample Jobs** (Console)
```javascript
testPostSampleJobs()
// Posts 3 sample jobs instantly
```

**Step 3: Verify in Admin Dashboard**
```
- Go to /pages/admin-dashboard.html
- Check "📋 Manage Jobs" tab
- See jobs in table
- Stats counters show updates
```

**Step 4: Verify on Homepage**
```
- Go to /index.html
- See jobs in featured section
- See job count in stats
```

---

## 🐛 Troubleshooting

### "Admin access only!" Error
```
Solution:
1. Go to /pages/login.html
2. Click "🔐 Admin Login" tab
3. Enter: admin@jobspare.com / admin123
4. Click "🔓 Admin Login"
```

### Admin Login Not Working
```
Check:
1. Email is exactly: admin@jobspare.com
2. Password is exactly: admin123
3. Clear browser cache (Ctrl+Shift+Del)
4. Check browser console (F12) for errors
```

### Admin Dashboard Appears Blank
```
Solution:
1. Refresh page (Ctrl+R)
2. Check admin login (see above)
3. Check browser console for errors
4. Try incognito mode
```

### Google Sign-In Not Showing
```
Check:
1. CLIENT_ID is set in login.html (line ~157)
2. Google Account APIs are enabled
3. Domain is whitelisted in Google Cloud Console
4. Refresh browser cache
```

### Posted Job Not Appearing
```
Check:
1. All required fields filled
2. Valid URL in "Apply Link"
3. Category exists in dropdown
4. Check "📋 Manage Jobs" tab
5. Check stats increment
```

---

## 📊 User Flow Diagram

```
┌─────────────────────────────────────────┐
│          Landing Page (index.html)       │
└────────┬──────────────────────────┬──────┘
         │                          │
         ↓                          ↓
    [Sign Up]              [Log In]
         │                   │      │
         ↓                   ↓      ↓
    signup.html         User Login  Admin Login
         │              (login.html) (login.html)
         ├─ Email/Pass       │          │
         └─ Google           ↓          ↓
              │         user-dashboard  admin-dashboard
              │              │              │
              └──────────────┘              │
                     ↓                      │
              Browse Jobs                  ├─ Post Job
              Apply to Jobs                ├─ Manage Jobs
              View Profile                 ├─ Approve Jobs
              Save Jobs                    ├─ Edit Categories
                                           ├─ Edit Links
                                           └─ View Stats
```

---

## 🚀 Next Steps

### For Testing
1. Use default admin credentials
2. Test job posting
3. Verify jobs appear on homepage
4. Test category management

### For Development
1. Add more admin accounts as needed
2. Customize categories
3. Enable MongoDB for persistence
4. Deploy to production

### For Production
1. Hash all passwords
2. Implement JWT authentication
3. Set up backend with MongoDB
4. Enable HTTPS
5. Add audit logging
6. Set up monitoring

---

## 📞 Quick Reference

### Admin Login
```
Email: admin@jobspare.com
Password: admin123
URL: /pages/login.html → 🔐 Admin Login tab
```

### Admin Dashboard
```
URL: /pages/admin-dashboard.html
Accessible after admin login
5 main tabs: Post, Manage, Pending, Categories, Links
```

### Default Categories
```
IT & Software
Marketing & Sales
Education & Training
```

### API Endpoints (When MongoDB Enabled)
```
POST   /api/jobs              # Create job
GET    /api/jobs              # Get all jobs
POST   /api/jobs/save-all     # Bulk save
DELETE /api/jobs/:id          # Delete job
```

---

## ✅ Implementation Checklist

- [x] User login with email/password
- [x] Google Sign-In integration (setup required)
- [x] Admin login with separate form
- [x] Admin role verification
- [x] Admin dashboard with 5 tabs
- [x] Job posting form (auto-approved)
- [x] Job management table
- [x] Category management
- [x] Apply link editor
- [x] Real-time stats grid
- [x] Error handling
- [x] Toast notifications
- [x] Responsive design

---

**Status**: ✅ Complete & Ready to Use

Start with: `/pages/login.html` → Try admin login!

