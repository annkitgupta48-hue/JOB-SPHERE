# 🚀 JobSphere Data Import - Quick Start

## For Users Who Just Want to Load Jobs

### Option 1: **Load Pre-made Sample Data** (30 seconds ⚡)
1. Go to Admin Dashboard → **"📤 Import Data"** button
2. Click **"📁 Load Sample Data (28 Jobs)"**
3. Done! Jobs appear instantly
4. View them at `/pages/jobs.html`

### Option 2: **Load from sample-jobs.js** (1 minute 🎯)
1. Admin Dashboard → **"📤 Import Data"** button
2. Click **"📚 Load from sample-jobs.js"**
3. Loads 100+ realistic jobs
4. Browse at `/pages/jobs.html`

### Option 3: **Upload Your Own CSV** (5 minutes 📥)
1. **Prepare CSV file** with columns:
   ```
   title,company,category,location,type,salary,experience,description,skills,applyLink
   ```
2. Go to Admin Dashboard → **"📤 Import Data"**
3. **Drag & drop your CSV** or click "Choose File"
4. **Preview shows first 10 jobs**
5. Click "✅ Import" (if no button visible, it auto-imports)
6. Check statistics → all jobs loaded!

---

## Getting Jobs from Kaggle

### Method A: Manual Download (Recommended First Time)
1. Visit: https://www.kaggle.com/datasets/andrewmvd/job-postings
2. Click **"Download"** (top-right) → Save `job_postings.csv`
3. Open in Excel/Google Sheets
4. Map columns to: `title`, `company`, `category`, `location`, `type`, `salary`, `experience`
5. Save as CSV
6. Upload via Admin Data Import page
7. ✅ Jobs appear in system!

### Method B: Quick Template
```csv
title,company,category,location,type,salary,experience,description,skills,applyLink
Senior Software Engineer,Google,IT & Software,Mountain View CA,Full-time,$150000-$250000,5+ years,Build large-scale systems,Python Java Go,https://careers.google.com
Full Stack Developer,Meta,IT & Software,Menlo Park CA,Full-time,$130000-$200000,3+ years,Build products for billions,JavaScript React,https://careers.meta.com
```
Save this as `jobs.csv`, upload it!

---

## Troubleshooting

### "No valid jobs found"
- Check CSV has headers: `title,company,category,location`
- Ensure no empty rows between data
- Verify file is `.csv` not `.xlsx`

### Jobs uploaded but don't show
- Go to `/pages/jobs.html` and **refresh page** (F5)
- Check filters - jobs might be hidden by category filter
- Open browser DevTools → Console → type: `getJobs().length` (should show count)

### Want to start fresh?
- Admin → Data Import → **"🗑️ Clear All Jobs"**
- Re-import clean dataset

---

## Full Documentation

For detailed Kaggle integration guide, see: **[KAGGLE_DATA_GUIDE.md](KAGGLE_DATA_GUIDE.md)**

---

**Done! 🎉 Your job portal now has real data!**
