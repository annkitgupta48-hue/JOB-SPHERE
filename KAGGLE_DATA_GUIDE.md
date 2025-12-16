# 📊 Kaggle Job Data Integration Guide

## 🎯 Overview
This guide helps you import real job vacancy data from Kaggle into JobSphere. The platform supports CSV and JSON imports.

---

## 🔗 Step 1: Find Kaggle Datasets

### Popular Job Vacancy Datasets on Kaggle:

#### **1. Job Postings 2024**
- **URL**: https://www.kaggle.com/datasets/andrewmvd/job-postings
- **Format**: CSV
- **Records**: 50,000+ jobs
- **Columns**: Job Title, Company, Location, Salary, Experience Level

#### **2. LinkedIn Job Postings**
- **URL**: https://www.kaggle.com/datasets/arshkon/linkedin-job-postings
- **Format**: CSV
- **Records**: 33,000+ jobs
- **Columns**: Job Title, Company, Salary, Experience Level, Job Type

#### **3. Data Science Job Market**
- **URL**: https://www.kaggle.com/datasets/ruchi798/data-science-jobs
- **Format**: CSV
- **Records**: 3,000+ data science jobs
- **Columns**: Job Title, Company, Location, Salary, Level

#### **4. Software Engineer Jobs**
- **URL**: https://www.kaggle.com/datasets/jmshaw/kaggle-survey-2020
- **Format**: CSV
- **Records**: Tech job market data
- **Columns**: Job Role, Experience, Salary

#### **5. Indeed Job Postings**
- **URL**: https://www.kaggle.com/datasets/imranmalikg/indeed-job-postings
- **Format**: CSV
- **Records**: 20,000+ job postings
- **Columns**: Job Title, Company, Location, Salary Estimate

---

## 📥 Step 2: Download from Kaggle

### Method A: Using Kaggle Website
1. Go to dataset link (e.g., https://www.kaggle.com/datasets/andrewmvd/job-postings)
2. Click **"Download"** button (top-right)
3. Save the `.csv` file to your computer
4. If file is `.zip`, extract it to get `.csv`

### Method B: Using Kaggle CLI
```bash
# Install kaggle CLI
pip install kaggle

# Configure API credentials
# 1. Go to https://www.kaggle.com/settings/account
# 2. Click "Create New API Token" 
# 3. Save kaggle.json to ~/.kaggle/
# 4. Run:
kaggle datasets download -d andrewmvd/job-postings
unzip job-postings.zip
```

---

## 🔄 Step 3: Prepare CSV for Import

### CSV Format Requirements

JobSphere expects a CSV with these column names:
```csv
title,company,category,location,type,salary,experience,description,skills,applyLink
```

### Example CSV:
```csv
title,company,category,location,type,salary,experience,description,skills,applyLink
Senior Software Engineer,Google,IT & Software,Mountain View CA,Full-time,$150000-$250000,5+ years,Build large-scale systems,Python Java Go Kubernetes Docker,https://careers.google.com
Full Stack Developer,Meta,IT & Software,Menlo Park CA,Full-time,$130000-$200000,3+ years,Build products for billions,JavaScript React Node.js,https://careers.meta.com
```

### Column Mapping Guide

If your Kaggle CSV has different column names, here's how to map them:

| Kaggle Column | → | JobSphere Column | Notes |
|---|---|---|---|
| `job_title` or `title` | → | `title` | **Required** - Job position name |
| `company_name` or `company` | → | `company` | **Required** - Company name |
| `job_category` or `industry` | → | `category` | Use: IT & Software, Finance, Marketing, etc. |
| `job_location` or `location` | → | `location` | City, State or "Remote" |
| `employment_type` or `type` | → | `type` | Full-time, Part-time, Contract, Internship |
| `salary_min`-`salary_max` | → | `salary` | Format: "$100k-$150k" |
| `level` or `experience_level` | → | `experience` | e.g., "Entry level", "3+ years", "5+ years" |
| `job_description` or `description` | → | `description` | Job details and responsibilities |
| `required_skills` or `skills` | → | `skills` | Comma-separated: "Python,Java,AWS" |
| `apply_url` or `job_link` | → | `applyLink` | Direct apply URL |

### Quick Mapping Instructions

1. **Open downloaded CSV in Excel/Google Sheets**
2. **Identify columns matching above table**
3. **Create new columns with JobSphere names** (or rename existing)
4. **Delete unnecessary columns**
5. **Export as CSV**

#### Example Excel Transformation:
```
Original Columns: job_title, company_name, industry, location, employment_type
Rename To:        title,     company,       category, location, type
```

---

## 📤 Step 4: Upload to JobSphere

### Using Admin Data Import Page

1. **Login as Admin**
   - Go to `/pages/login.html`
   - Email: `admin@jobspare.com`
   - Password: `admin123`

2. **Open Admin Dashboard**
   - Click "🎯 Admin Dashboard" link

3. **Click "📤 Import Data" button**
   - Navigate to `/pages/data-import.html`

4. **Upload Your CSV File**
   - Drag & drop CSV file, OR
   - Click "Choose File" button
   - Select your prepared CSV

5. **Preview Data**
   - Scroll to "👁️ Data Preview" section
   - Verify first 10 jobs look correct
   - Check "📈 Statistics" for counts

6. **View Imported Jobs**
   - Go to `/pages/jobs.html`
   - Browse all imported jobs by category
   - Filter by location, type, search

---

## ✅ Step 5: Verify Import

After import, verify data quality:

### Checklist:
- [ ] All required fields populated (title, company, category, location)
- [ ] Job count matches in statistics
- [ ] No duplicate jobs (company + title + location)
- [ ] All links are valid URLs starting with `http://` or `https://`
- [ ] Categories match system categories (IT & Software, Marketing, Finance, etc.)
- [ ] Locations are properly formatted
- [ ] Salaries are in readable format

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "No valid jobs found" | CSV format invalid or empty | Check headers match expected names |
| Missing data in preview | Columns not mapped correctly | Rename columns to: title, company, category, location |
| Links don't work | Invalid URL format | Ensure URL starts with `http://` or `https://` |
| Special characters show wrong | CSV encoding issue | Save CSV as UTF-8 encoding |

---

## 🔄 Step 6: Advanced - Batch Processing

### Option A: Merge Multiple Datasets
```javascript
// In browser console or in data-import.html
const dataset1 = JSON.parse(localStorage.getItem('kaggle_data_1'));
const dataset2 = JSON.parse(localStorage.getItem('kaggle_data_2'));
const combined = [...dataset1, ...dataset2];
// Remove duplicates
const unique = Array.from(new Map(combined.map(j => [j.title + j.company + j.location, j])).values());
saveJobs(unique);
```

### Option B: Periodic Updates
1. Set reminder to check Kaggle for new datasets
2. Download latest data monthly
3. Import fresh jobs to keep listings current
4. Old jobs auto-archive after 30 days (configurable)

### Option C: Automate with Scripts
```python
# kaggle_import.py - Python script to automate imports
import kaggle
import pandas as pd

# Download dataset
kaggle.api.dataset_download_files('andrewmvd/job-postings', path='/data', unzip=True)

# Process CSV
df = pd.read_csv('/data/job_postings.csv')
df.rename(columns={
    'job_title': 'title',
    'company_name': 'company',
    'job_category': 'category'
}, inplace=True)

# Export to JobSphere format
df.to_csv('/data/jobsphere_import.csv', index=False)
print(f"✅ Prepared {len(df)} jobs for import")
```

---

## 📝 Sample Job Data

### Pre-loaded Sample (28 Jobs)
JobSphere comes with 28 pre-loaded sample jobs in `/data/jobs-kaggle-sample.csv`:
- Google, Meta, Netflix, Amazon, Microsoft, OpenAI
- Various roles: Software Engineer, DevOps, Data Scientist, ML Engineer, etc.
- Locations: US + India + Remote
- Ready to import via admin panel

### Load Sample Data:
1. Go to Admin → Data Import
2. Click "📁 Load Sample Data (28 Jobs)"
3. Jobs instantly appear in system

---

## 🛠️ Troubleshooting

### Import Fails with "No valid jobs found"
**Solution**: Check CSV headers match expected format:
```
✅ Correct: title,company,category,location,type,salary
❌ Wrong: Job Title,Company Name,Industry,City,Employment Type,Salary Range
```

### Jobs Import but Don't Show Up
**Solution**: Ensure jobs have status="approved"
```javascript
// In console:
const jobs = getJobs();
const approved = jobs.filter(j => j.status === 'approved').length;
console.log(`Approved jobs: ${approved}`);
```

### CSV Shows Special Characters Wrong
**Solution**: Save file as UTF-8 encoding
```
Excel → Save As → Format: "CSV UTF-8"
Google Sheets → File → Download → CSV (auto UTF-8)
```

### Duplicate Jobs After Import
**Solution**: Clear all jobs first, then import
```javascript
// Clear: Admin → Data Import → "🗑️ Clear All Jobs"
// Then import fresh dataset
```

---

## 📚 Supported Job Categories

When mapping data, use these category values:

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

If your dataset has different categories, map them:
- "Software Engineer" → "IT & Software"
- "Marketing Manager" → "Marketing & Sales"
- "Accountant" → "Finance & Accounting"
- "UPSC Officer" → "Government & Public Sector"
- "Intern" → "Internships"
- "Entry Level" → "Fresher Roles"
- "Remote" → "Remote Jobs"

---

## 🚀 Next Steps

1. ✅ Download dataset from Kaggle
2. ✅ Prepare CSV with correct column names
3. ✅ Login as admin
4. ✅ Go to Data Import page
5. ✅ Upload CSV file
6. ✅ Verify jobs appear in system
7. ✅ Share with users!

---

## 📞 Support

**Questions about data import?**
- Check "📖 How to Import Data" modal in data-import.html
- Review sample CSV format in `/data/jobs-kaggle-sample.csv`
- Check browser console for detailed error messages

**Want to automate this?**
- Set up GitHub Actions to download Kaggle data weekly
- Use Python script to transform & upload
- Deploy to backend for real-time sync

---

## 📄 CSV Template

Download this template to start:
```csv
title,company,category,location,type,salary,experience,description,skills,applyLink
Senior Developer,Company Name,IT & Software,City or Remote,Full-time,$100000-$150000,3+ years,Build scalable systems,Python Java Go,https://apply.example.com
Marketing Manager,Company Name,Marketing & Sales,City,Full-time,$60000-$90000,2+ years,Lead marketing campaigns,Marketing SEO Analytics,https://apply.example.com
Financial Analyst,Company Name,Finance & Accounting,City,Full-time,$70000-$110000,1+ years,Analyze financial data,Excel SQL Power BI,https://apply.example.com
```

Save as `import_template.csv` and modify for your data!

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: ✅ Ready for Production
