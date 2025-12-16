# 📋 Admin Data Import Reference Card

## 🎯 Quick Access

| Action | Where | Steps |
|--------|-------|-------|
| **Load Sample Jobs** | Admin Dashboard | Click "📤 Import Data" → "📁 Load Sample Data" |
| **Load 100+ Jobs** | Admin Dashboard | Click "📤 Import Data" → "📚 Load from sample-jobs.js" |
| **Upload CSV** | Admin Dashboard | Click "📤 Import Data" → Drag-drop CSV |
| **Clear All** | Admin Dashboard | Click "📤 Import Data" → "🗑️ Clear All Jobs" |
| **Download Template** | Admin Dashboard | Click "📤 Import Data" → "⬇️ Download CSV Template" |

---

## 📥 CSV Format (Copy & Use)

```csv
title,company,category,location,type,salary,experience,description,skills,applyLink
Senior Developer,Company,IT & Software,City,Full-time,$100k-$150k,3+ years,Job desc,Python Java,https://apply.com
Marketing Manager,Company,Marketing & Sales,City,Full-time,$60k-$90k,2+ years,Job desc,Marketing SEO,https://apply.com
Financial Analyst,Company,Finance & Accounting,City,Full-time,$70k-$110k,1+ years,Job desc,Excel SQL,https://apply.com
```

---

## 🏷️ Valid Categories

```
- IT & Software
- Marketing & Sales
- Finance & Accounting
- Government & Public Sector
- Internships
- Fresher Roles
- Private Sector
- Remote Jobs
```

---

## ✅ Before Upload Checklist

- [ ] CSV has headers (title, company, category, location)
- [ ] Company names spelled correctly
- [ ] Categories from valid list above
- [ ] Locations formatted as "City, State" or "Remote"
- [ ] No empty rows between data
- [ ] File is .csv not .xlsx
- [ ] URLs start with http:// or https://

---

## 📊 After Import

1. **Check Statistics**
   - Total jobs count
   - Companies count
   - Categories represented
   - Locations count

2. **Preview Data**
   - First 10 jobs display correctly
   - No weird characters
   - Descriptions look good

3. **Visit /pages/jobs.html**
   - Browse by category
   - Search functionality
   - All jobs visible

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "No valid jobs found" | Check CSV headers: `title,company,category,location` |
| Jobs don't show | Refresh page (F5) or check category filters |
| Special characters wrong | Save CSV as UTF-8 encoding |
| Want fresh start | Click "🗑️ Clear All Jobs" then re-import |
| Column mapping help | Click "📖 How to Import Data" link |

---

## 🔗 Important Links

- **Data Import**: `/pages/data-import.html`
- **Browse Jobs**: `/pages/jobs.html`
- **Sample Data**: `/data/jobs-kaggle-sample.csv`
- **Full Guide**: `KAGGLE_DATA_GUIDE.md`
- **Quick Start**: `DATA_IMPORT_QUICK_START.md`

---

## 📱 Example Workflow

```
1. Find Kaggle dataset
   ↓
2. Download CSV
   ↓
3. Open in Excel/Sheets
   ↓
4. Map columns to: title, company, category, location
   ↓
5. Save as CSV
   ↓
6. Login as admin
   ↓
7. Go to Admin Dashboard
   ↓
8. Click "📤 Import Data"
   ↓
9. Upload CSV (drag-drop)
   ↓
10. Check preview & stats
   ↓
11. View jobs at /pages/jobs.html
```

---

## 💡 Pro Tips

- **One-Click Load**: Start with sample data to see how it works
- **Merge Multiple**: Upload different CSVs - they auto-merge
- **No Duplicates**: Same job (title+company+location) = skipped
- **Auto Format**: Salary, dates auto-formatted on display
- **Instant Search**: Jobs searchable immediately after import
- **Mobile Ready**: All responsive - works on phone/tablet

---

## 🎯 Kaggle Datasets

Top 5 job vacancy datasets (copy-paste URLs):

1. **Job Postings 2024**
   https://www.kaggle.com/datasets/andrewmvd/job-postings

2. **LinkedIn Job Postings**
   https://www.kaggle.com/datasets/arshkon/linkedin-job-postings

3. **Data Science Jobs**
   https://www.kaggle.com/datasets/ruchi798/data-science-jobs

4. **Software Engineer Jobs**
   https://www.kaggle.com/datasets/jmshaw/kaggle-survey-2020

5. **Indeed Job Postings**
   https://www.kaggle.com/datasets/imranmalikg/indeed-job-postings

---

## ⚙️ Advanced

**Export all jobs as JSON:**
```javascript
// In browser console:
const jobs = getJobs();
const json = JSON.stringify(jobs, null, 2);
console.log(json); // Ctrl+C to copy
```

**Check import success:**
```javascript
const jobs = getJobs();
const approved = jobs.filter(j => j.status === 'approved');
console.log(`Total: ${jobs.length}, Approved: ${approved.length}`);
```

**Remove duplicates:**
```javascript
const jobs = getJobs();
const unique = Array.from(new Map(jobs.map(j => [
  (j.title + j.company + j.location).toLowerCase(), j
])).values());
saveJobs(unique);
```

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: ✅ Ready for Production
