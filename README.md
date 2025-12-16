# JobSphere - Modern Job Portal Platform

## 🎯 Overview

**JobSphere** is a modern, feature-rich job portal platform built with vanilla JavaScript, HTML5, and CSS3. It features a beautiful nature-inspired UI, advanced admin dashboard, persistent storage, and MongoDB integration capabilities for enterprise deployment.

### Key Features
✅ **Modern UI** - Nature-inspired gradients, smooth animations, responsive design  
✅ **Admin Dashboard** - Multi-tab interface for job posting, category management  
✅ **Google Sign-In** - Seamless OAuth 2.0 authentication  
✅ **Job Management** - Post, edit, delete, and categorize jobs  
✅ **📊 Data Import (NEW!)** - Import jobs from CSV/JSON or Kaggle datasets  
✅ **📁 Sample Data** - 128+ pre-loaded realistic job listings  
✅ **Persistent Storage** - localStorage (current) + MongoDB (production-ready)  
✅ **Search & Filter** - Find jobs by category, keywords, location  
✅ **Toast Notifications** - Beautiful, non-intrusive user feedback  
✅ **Admin Authorization** - Role-based access control  
✅ **Responsive Design** - Mobile, tablet, and desktop optimized  

---

## 📁 Project Structure

```
JobSphere/
├── index.html                 # 🏠 Homepage (hero, stats, featured jobs, categories)
├── app.js                     # 🧠 Core application logic (500+ lines)
├── style.css                  # 🎨 Global styles & animations
├── db.js                      # 💾 Database abstraction layer (localStorage/MongoDB)
├── MONGODB_SETUP.md           # 📚 MongoDB integration guide
├── README.md                  # 📖 This file
│
└── pages/
    ├── signup.html            # 👤 User registration (Google Sign-In)
    ├── login.html             # 🔑 User authentication (Google Sign-In)
    ├── categories.html        # 🏷️ Browse jobs by category
    ├── admin-dashboard.html   # 🎯 Admin control panel (NEW!)
    ├── jobs.html              # 📋 Job listing page
    ├── job-details.html       # 📄 Individual job details
    ├── user-dashboard.html    # 👨‍💼 User profile & applications
    ├── government.html        # 🏛️ Government jobs
    ├── private.html           # 🏢 Private sector jobs
    ├── offcampus.html         # 🌍 Off-campus jobs
    ├── internships.html       # 🎓 Internship listings
    ├── contact.html           # 📧 Contact page
    ├── faq.html               # ❓ FAQ page
    └── ankit.css              # 🎨 Page-specific styles
```

---

## 🚀 Quick Start

### 1. **Local Setup (Development)**

```bash
# No installation needed! Just open in browser
# If using Live Server extension in VS Code:
# Right-click index.html → Open with Live Server
# Then navigate to http://localhost:5500
```

### 2. **First Time Setup**

1. Open `index.html` in browser
2. Admin account auto-created:
   - Email: `admin@jobspare.com`
   - Password: `admin123`
3. Three sample categories created automatically
4. Data stored in browser's localStorage

### 3. **Access Admin Dashboard**

1. Navigate to `/pages/admin-dashboard.html`
2. Log in with admin credentials
3. **NEW!** Click "📤 Import Data" button to:
   - Load sample data (28 jobs)
   - Load from sample-jobs.js (100+ jobs)
   - Upload your own CSV file
   - Import jobs from Kaggle

### 4. **Quick Import (30 seconds)**

```
1. Admin Login → admin@jobspare.com / admin123
2. Go to: /pages/admin-dashboard.html
3. Click: "📤 Import Data" button
4. Click: "📁 Load Sample Data (28 Jobs)"
5. Done! Browse at /pages/jobs.html
```

---

## 📊 Data Import (NEW!)

### Import Real Jobs from Kaggle

**Admin Dashboard → "📤 Import Data"** provides:
- ✅ CSV file upload (drag-drop)
- ✅ JSON import support
- ✅ Sample data loaders (28 or 100+ jobs)
- ✅ Data preview (first 10 rows)
- ✅ Statistics dashboard
- ✅ Import logs
- ✅ One-click templates

### Popular Kaggle Datasets
1. [Job Postings 2024](https://www.kaggle.com/datasets/andrewmvd/job-postings) - 50,000+ jobs
2. [LinkedIn Job Postings](https://www.kaggle.com/datasets/arshkon/linkedin-job-postings) - 33,000+ jobs
3. [Data Science Jobs](https://www.kaggle.com/datasets/ruchi798/data-science-jobs) - 3,000+ jobs

See [KAGGLE_DATA_GUIDE.md](KAGGLE_DATA_GUIDE.md) for complete integration guide.

---

## 🔐 Authentication

### Current Implementation
- Email/Password authentication with localStorage
- Google OAuth 2.0 Sign-In (client-side)
- Session-based (sessionStorage)
- Admin role-based access control

### Google Sign-In Setup

1. Create Google Cloud project: [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Google+ API"
3. Create OAuth 2.0 credentials (Web application)
4. Copy your Client ID
5. Replace `YOUR_GOOGLE_CLIENT_ID` in `app.js`:

```javascript
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

---

## 💾 Data Storage

### Current (localStorage)
```javascript
// All data stored in browser
- job_spare_jobs        → Job listings
- job_spare_users       → User accounts
- job_spare_categories  → Job categories
- job_spare_session     → Current session
```

### Production (MongoDB)
See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for complete instructions.

---

## 📊 Admin Dashboard Features

### Tabs & Functionality

#### 1️⃣ **Post Job** (➕)
- Form to add new jobs
- Auto-approved (appears immediately)
- Fields: Title, Company, Category, Location, Type, Apply Link, Description
- Auto-incremented stats

#### 2️⃣ **Manage Jobs** (📋)
- Table view of all jobs
- Delete jobs
- View status badges (Approved/Pending)

#### 3️⃣ **Pending Approval** (⏳)
- User-submitted jobs awaiting approval
- Approve or reject with one click
- Auto-syncs with Manage Jobs tab

#### 4️⃣ **Categories** (🏷️)
- Add new job categories
- Delete existing categories
- Syncs with job posting form

#### 5️⃣ **Apply Links** (🔗)
- Edit job application URLs
- Bulk save functionality
- Inline editing

#### 📊 **Stats Grid**
- Total Jobs count
- Pending Approval count
- Registered Users count
- Categories count
- Auto-updates after each action

---

## 🎨 UI/UX Features

### Color Scheme (Nature-Inspired)
```css
Primary Green:    #2e7d32    /* Forest green */
Light Green:      #66bb6a    /* Light leaf */
Background:       #e8f5e9    /* Mint */
White:            #ffffff    /* Card backgrounds */
Accent:           #ff9800    /* Orange for pending */
Error:            #f44336    /* Red for delete */
```

### Animations
- **Slide In/Out** - Toast notifications
- **Fade In** - Tab content transitions
- **Hover Effects** - Cards, buttons, links
- **Gradient Backgrounds** - Modern visual appeal
- **Floating Leaves** - Decorative SVG elements

### Responsive Design
- **Desktop** - Full-width layouts, multi-column grids
- **Tablet** - Adjusted spacing, 2-column grids
- **Mobile** - Single column, touch-friendly buttons

---

## 🔧 API Reference

### Core Functions (app.js)

#### Storage Management
```javascript
getJobs()                 // Get all jobs
saveJobs(jobs)           // Save jobs array
getUsers()               // Get all users
saveUsers(users)         // Save users array
getCategories()          // Get categories
saveCategories(cats)     // Save categories
```

#### User Management
```javascript
getCurrentUser()         // Get logged-in user
setCurrentUser(user)     // Set current session
logout()                 // Clear session
```

#### Notifications
```javascript
showNotification(msg, type, duration)
// type: 'success', 'error', 'warning', 'info'
// duration: milliseconds (default 3000)
```

#### Admin Functions
```javascript
adminPostJob(e)          // Post new job (form handler)
adminApproveJob(id)      // Approve pending job
adminRejectJob(id)       // Reject pending job
adminAddCategory()       // Add new category
adminDeleteCategory(cat) // Delete category
renderLinkAdmin()        // Show link editor
saveAllLinks()           // Save all link changes
updateStats()            // Refresh stat counters
```

#### Rendering Functions
```javascript
renderJobs(container, category, search)      // Render job listings
renderCategoryTables(container)              // Render 3 category tables
renderFeaturedJobs()                         // Homepage featured section
renderStats()                                // Homepage stats grid
renderAdminPending()                         // Admin pending jobs tab
adminRenderCategories()                      // Admin categories tab
```

---

## 🗄️ Database Schema (MongoDB)

### Jobs Collection
```javascript
{
  _id: ObjectId,
  id: String,              // Unique identifier
  title: String,           // Job title
  company: String,         // Company name
  category: String,        // Job category
  location: String,        // Job location
  type: String,            // Full-time/Part-time/Contract/Internship
  applyLink: String,       // URL to apply
  description: String,     // Job description
  status: String,          // approved/pending/rejected
  postedBy: String,        // User ID who posted
  createdAt: Date,         // Timestamp
  views: Number,           // View count
  applications: Number     // Application count
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  id: String,              // Unique identifier
  name: String,            // User name
  email: String,           // Email (unique)
  password: String,        // Hashed password
  role: String,            // user/admin
  createdAt: Date          // Timestamp
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String             // Category name
}
```

---

## 🛠️ Development

### File Editing
- Edit HTML/CSS files directly in VS Code
- Changes live-reload with Live Server
- No build process needed

### Adding New Features
1. Add HTML structure in relevant `.html` file
2. Add styling in `style.css` or page-specific CSS
3. Add logic functions in `app.js`
4. Initialize on DOMContentLoaded if needed
5. Test in browser (F12 → Console for errors)

### Debugging
```javascript
// Check browser console
F12 → Console tab

// Check localStorage
localStorage.getItem('job_spare_jobs')

// Check current user
JSON.parse(sessionStorage.getItem('job_spare_current'))

// Manual notifications
showNotification('Test message', 'success')
```

---

## 📈 Production Deployment

### Frontend (Vercel/Netlify)
```bash
# Push to GitHub, connect repository
# Auto-deploys on every push
# Zero configuration needed
```

### Backend (Heroku/Railway)
```bash
# Deploy Node.js server
# Set MongoDB connection string in environment variables
# See MONGODB_SETUP.md for detailed instructions
```

### Security Checklist
- [ ] Hash passwords using bcryptjs
- [ ] Validate all inputs (frontend + backend)
- [ ] Use HTTPS only
- [ ] Restrict MongoDB IP whitelist
- [ ] Implement API authentication (JWT)
- [ ] Add CORS restrictions
- [ ] Rate limit API endpoints
- [ ] Never expose secrets in code

---

## 🚨 Troubleshooting

### **Issue: Data not persisting**
- Check: Browser's localStorage might be disabled
- Solution: Enable localStorage or switch to MongoDB

### **Issue: Google Sign-In not working**
- Check: CLIENT_ID is correct and whitelisted
- Solution: Replace `YOUR_GOOGLE_CLIENT_ID` with actual ID

### **Issue: Admin dashboard blank**
- Check: Make sure you're logged in as admin
- Solution: Log in with admin@jobspare.com / admin123

### **Issue: Category dropdown empty**
- Check: Categories might not be initialized
- Solution: Refresh page or check browser console for errors

### **Issue: Styles not loading**
- Check: style.css path is correct (must be in root directory)
- Solution: Verify file exists and path in HTML is `../style.css`

---

## 📝 File Manifest

| File | Lines | Purpose |
|------|-------|---------|
| `app.js` | 750+ | Core application logic, all features |
| `index.html` | 250+ | Homepage with hero, stats, featured jobs |
| `admin-dashboard.html` | 400+ | Admin control panel with multi-tab UI |
| `categories.html` | 200+ | Category browsing & admin link editor |
| `db.js` | 300+ | Database abstraction (localStorage/MongoDB) |
| `style.css` | 500+ | Global styles, animations, responsive design |
| `MONGODB_SETUP.md` | 500+ | Complete MongoDB integration guide |

---

## 🤝 Contributing

### To add a new feature:
1. Fork the repository
2. Create a feature branch
3. Make changes following existing code style
4. Test thoroughly in browser
5. Submit pull request

### Code Style Guidelines
- Use `const` for constants, `let` for variables
- Use arrow functions `() => {}`
- Use template literals for strings
- Add comments for complex logic
- Keep functions focused and DRY (Don't Repeat Yourself)

---

## 📚 Learning Resources

- **HTML/CSS/JS**: [MDN Web Docs](https://developer.mozilla.org/)
- **Google Sign-In**: [Google Identity Services](https://developers.google.com/identity)
- **MongoDB**: [MongoDB University](https://university.mongodb.com/)
- **Node.js/Express**: [Express.js Guide](https://expressjs.com/)
- **Mongoose**: [Mongoose Documentation](https://mongoosejs.com/)

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review console errors: Press F12 → Console
3. Check MONGODB_SETUP.md for database issues
4. Review app.js comments for function documentation

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Credits

Built with ❤️ for job seekers and employers worldwide.

**Version**: 2.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready

---

## 🚀 Next Steps

1. **Customize** - Add your branding, colors, and content
2. **Deploy** - Push to Vercel/Netlify (frontend) and Heroku (backend)
3. **Enable MongoDB** - Follow MONGODB_SETUP.md for database integration
4. **Launch** - Share with users and start receiving job applications!

---

Happy job hunting! 🎯
