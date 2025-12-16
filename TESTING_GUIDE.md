# Testing Guide - Admin Dashboard & MongoDB Integration

## ✅ What Was Implemented

### Option A: Client-Side Test Functions (admin-dashboard.html)
```javascript
testAdminLogin()          // Force admin login for testing
testPostSampleJobs()      // Post 3 sample jobs instantly
testClearAllData()        // Clear all localStorage data
testExportData()          // Export all data to console
```

### Option B: MongoDB Fetch Integration (db.js)
```javascript
getJobsFromMongoDB()      // Fetch jobs from MongoDB via API
saveJobsToMongoDB()       // Save jobs to MongoDB via API
getUsersFromMongoDB()     // Fetch users from MongoDB via API
saveUsersToMongoDB()      // Save users to MongoDB via API
getCategoriesFromMongoDB()// Fetch categories from MongoDB via API
saveCategoriesToMongoDB() // Save categories to MongoDB via API
```

All functions include:
- ✅ Automatic fallback to localStorage on error
- ✅ Error logging with helpful messages
- ✅ Fetch timeout configuration
- ✅ Proper error handling and status checking

---

## 🧪 Quick Test Workflow

### Step 1: Open Admin Dashboard in Browser

```
1. Open: http://localhost:5500/pages/admin-dashboard.html
2. You'll see: "⛔ Admin access only!" error
3. Press F12 to open Developer Console
4. You're ready to test!
```

### Step 2: Auto-Login as Admin (Option A)

**In Browser Console (F12), type:**
```javascript
testAdminLogin()
```

**Expected Result:**
```
✅ Test admin login successful
(Page reloads and shows admin dashboard)
```

### Step 3: Post Sample Jobs (Option A)

**In Console, type:**
```javascript
testPostSampleJobs()
```

**Expected Result:**
```
✅ Posted 3 sample jobs
(Stats update, jobs appear in "Manage Jobs" tab)
```

### Step 4: View Posted Jobs

**Click tabs in admin dashboard:**
1. **📋 Manage Jobs** → See 3 sample jobs in table
2. **📊 Stats** → See "Total Jobs: 3"
3. **🏠 Home** → See jobs on homepage

### Step 5: Export Data (Option A)

**In Console, type:**
```javascript
testExportData()
```

**Expected Result:**
```
✅ Data exported to console (F12 → Console)
(Console shows all jobs, users, categories as JSON)
```

---

## 🗄️ Testing MongoDB Integration (Option B)

### Prerequisites
1. Node.js backend running with Express + Mongoose
2. MongoDB Atlas cluster set up
3. Backend API endpoints available at `http://localhost:3000/api`

### Configuration

**In `db.js`, change:**
```javascript
const DB_CONFIG = {
    USE_MONGODB: true,  // ← Change from false to true
    MONGODB_API_URL: 'http://localhost:3000/api',
    ...
};
```

### Test Flow

**1. Start Backend Server:**
```bash
cd jobsphere-backend
npm run dev
# Expected: "Server running on http://localhost:3000"
```

**2. Verify MongoDB Connection:**
```bash
# Check backend logs for: "✅ MongoDB connected"
```

**3. In Browser Console, Test Each Function:**

```javascript
// Get jobs from MongoDB
getJobs().then(jobs => console.log('Jobs:', jobs))

// Save jobs to MongoDB
const newJob = { title: 'Test', company: 'Test Co', ... };
saveJobs([newJob]).then(() => console.log('✅ Saved'))

// Get users from MongoDB
getUsers().then(users => console.log('Users:', users))

// Get categories
getCategories().then(cats => console.log('Categories:', cats))
```

### Expected Console Output (MongoDB Mode)

```
✅ Jobs saved to MongoDB: { success: true, count: 1 }
⬅️ Falling back to localStorage
(Shows fallback was triggered if MongoDB is down)
```

---

## 📊 Test Scenarios

### Scenario 1: Development Mode (Current - localStorage)
```
✓ Use testAdminLogin() to login
✓ Use testPostSampleJobs() to add jobs
✓ Data persists in browser
✓ Perfect for UI testing
✓ No backend needed
```

### Scenario 2: Production Mode (MongoDB)
```
✓ Set USE_MONGODB: true
✓ Run Node.js backend
✓ Connect to MongoDB Atlas
✓ All data syncs with database
✓ Data persists permanently
✓ Multi-user access works
```

### Scenario 3: Error Handling
```
✓ Stop backend server
✓ Try to post a job
✓ System falls back to localStorage
✓ User gets notification
✓ No crashes or errors
```

---

## 🐛 Debugging Tips

### Check localStorage in Browser
```
F12 → Application → Local Storage → 
Select your domain → View all data
```

### Check MongoDB in Console
```
db.jobs.find().pretty()          // All jobs
db.users.find().pretty()         // All users
db.categories.find().pretty()    // All categories
```

### Check Backend Logs
```
npm run dev
# Watch for:
# ✅ MongoDB connected
# POST /api/jobs → 200 OK
# GET /api/jobs → 200 OK
```

### Test API Endpoints Directly
```bash
# In terminal or Postman:
curl http://localhost:3000/api/jobs
curl -X POST http://localhost:3000/api/jobs/save-all \
  -H "Content-Type: application/json" \
  -d '[{"id":"j1","title":"Test Job",...}]'
```

---

## ✨ Advanced Testing

### Test 1: Auto-Populate & Export
```javascript
testPostSampleJobs()
testExportData()
// Copy the exported JSON for backup
```

### Test 2: Data Persistence
```javascript
// Post a job
testPostSampleJobs()

// Refresh page (Ctrl+R)
// Jobs should still be there!

// Check in F12 → Application → Local Storage
```

### Test 3: Multiple Users
```javascript
// Create 2nd user in signup page
// Log in with different user
// Each user has own session
```

### Test 4: MongoDB Sync
```javascript
// With USE_MONGODB: true
testPostSampleJobs()

// Check MongoDB Atlas:
// Cluster → Collections → jobs
// Should see 3 new job documents
```

### Test 5: Fallback Mechanism
```javascript
// Set USE_MONGODB: true
// Stop backend server
testPostSampleJobs()

// Console shows: "⬅️ Falling back to localStorage"
// Jobs still posted via localStorage!
```

---

## 📋 Console Functions Reference

```javascript
// Test Functions (Option A)
testAdminLogin()          // Auto-login as admin
testPostSampleJobs()      // Post 3 sample jobs
testClearAllData()        // Clear all data (⚠️ irreversible)
testExportData()          // Export to console

// Core Functions (available globally)
getJobs()                 // Get all jobs
saveJobs(jobs)           // Save jobs
getUsers()               // Get all users
saveUsers(users)         // Save users
getCategories()          // Get all categories
saveCategories(cats)     // Save categories
getCurrentUser()         // Get logged-in user
setCurrentUser(user)     // Set logged-in user
logout()                 // Logout
showNotification(msg)    // Show notification

// Admin Functions (Option A)
adminPostJob(e)          // Post job from form
renderAllJobs()          // Render jobs table
updateStats()            // Update stats counters
adminAddCategory()       // Add category
renderLinkAdmin()        // Show link editor
```

---

## ✅ Validation Checklist

### Before Deploying:
- [ ] testAdminLogin() works
- [ ] testPostSampleJobs() creates jobs
- [ ] Jobs appear on homepage
- [ ] Manage Jobs tab shows jobs
- [ ] Stats counter updates
- [ ] localStorage data persists on refresh
- [ ] (Optional) MongoDB saves data
- [ ] (Optional) Fallback to localStorage works

### Before Production:
- [ ] All test functions removed or hidden
- [ ] USE_MONGODB set to true (if using DB)
- [ ] Backend running and tested
- [ ] MongoDB Atlas cluster active
- [ ] API endpoints tested with Postman
- [ ] Error handling verified
- [ ] CORS configured correctly
- [ ] Environment variables set

---

## 🚀 Next Steps

### To Use MongoDB:
1. Follow [MONGODB_SETUP.md](../MONGODB_SETUP.md)
2. Deploy Node.js backend
3. Set `USE_MONGODB: true` in `db.js`
4. Test each endpoint

### To Stay on localStorage:
1. Keep `USE_MONGODB: false`
2. Use test functions for development
3. Deploy frontend to Vercel/Netlify
4. Perfect for MVP/prototyping

---

## 📞 Troubleshooting

### "testAdminLogin is not defined"
```
Solution: 
1. Refresh page
2. Press F12 to open console
3. Try again
```

### "MongoDB functions not working"
```
Check:
1. Is backend running? (npm run dev)
2. Is MongoDB Atlas cluster active?
3. Is connection string correct?
4. Check browser console for errors
```

### "Data not syncing to MongoDB"
```
Check:
1. USE_MONGODB is set to true
2. API endpoints are correct
3. Network tab shows requests (F12)
4. Backend logs show requests
```

### "Getting fallback to localStorage"
```
Means:
- MongoDB is down or unreachable
- This is expected behavior!
- Data automatically saved to localStorage
- No data loss
```

---

## 📚 Reference

- **Test Functions**: Added in `pages/admin-dashboard.html` (lines 372-493)
- **MongoDB Implementation**: Updated in `db.js` (lines 221-346)
- **Backend Setup**: See `MONGODB_SETUP.md`
- **Configuration**: See `.env.template`

---

**Ready to test! 🚀**

Start with: `testAdminLogin()` in browser console
