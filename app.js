/**
 * JobSphere - Advanced Application Logic
 * Modern, feature-rich job portal with enhanced UX
 * Features: Analytics, Animations, Advanced Filtering, Notifications, and more
 */

// ===== CORE UTILITIES & HELPERS =====
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);
const uid = () => 'u' + Date.now() + Math.floor(Math.random() * 999);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced value extraction with multiple fallbacks
function valOf(...selectors) {
  for (const sel of selectors) {
    const el = qs(sel);
    if (el) return (el.value || '').trim();
  }
  return '';
}

// Sanitization functions
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

function escapeAttr(s) {
  return s ? s.replace(/"/g, '&quot;') : '#';
}

function escapeJsLiteral(s) {
  return String(s).replace(/'/g, "\\'");
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info', duration = 3000) {
  const id = uid();
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };
  
  const notif = document.createElement('div');
  notif.id = id;
  notif.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 16px 20px;
    background: ${classes[type] === 'bg-green-500' ? '#4caf50' : 
                  classes[type] === 'bg-red-500' ? '#f44336' :
                  classes[type] === 'bg-blue-500' ? '#2196f3' : '#ff9800'};
    color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease; z-index: 10000;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, duration);
}

// ===== STORAGE MANAGEMENT =====
function getUsers() { 
  try { 
    if (typeof DBModule !== 'undefined' && DBModule.getUsers) return DBModule.getUsers(); 
  } catch (e) { /* fallback */ }
  return JSON.parse(localStorage.getItem('job_spare_users') || '[]'); 
}
function saveUsers(u) { 
  try { 
    if (typeof DBModule !== 'undefined' && DBModule.saveUsers) DBModule.saveUsers(u); 
  } catch (e) { /* fallback */ }
  localStorage.setItem('job_spare_users', JSON.stringify(u)); 
}
function getCurrentUser() { return JSON.parse(sessionStorage.getItem('job_spare_current') || 'null'); }
function setCurrentUser(u) { sessionStorage.setItem('job_spare_current', JSON.stringify(u)); }
function logout() { 
  sessionStorage.removeItem('job_spare_current');
  showNotification('Logged out successfully', 'success');
  setTimeout(() => location.href = '/index.html', 500);
}

function getCategories() { 
  try { 
    if (typeof DBModule !== 'undefined' && DBModule.getCategories) return DBModule.getCategories(); 
  } catch (e) { /* fallback */ }
  return JSON.parse(localStorage.getItem('job_spare_categories') || '["Government", "Private", "Off-Campus", "Internship"]'); 
}
function saveCategories(c) { 
  try { 
    if (typeof DBModule !== 'undefined' && DBModule.saveCategories) DBModule.saveCategories(c); 
  } catch (e) { /* fallback */ }
  localStorage.setItem('job_spare_categories', JSON.stringify(c)); 
}
function getJobs() { 
  try { 
    if (typeof DBModule !== 'undefined' && DBModule.getJobs) return DBModule.getJobs(); 
  } catch (e) { /* fallback */ }
  return JSON.parse(localStorage.getItem('job_spare_jobs') || '[]'); 
}
function saveJobs(j) { 
  try { 
    if (typeof DBModule !== 'undefined' && DBModule.saveJobs) DBModule.saveJobs(j); 
  } catch (e) { /* fallback */ }
  try {
    const users = getUsers();
    const normalized = (Array.isArray(j) ? j : []).map(job => {
      try {
        if (job && job.postedBy) {
          const u = users.find(x => x.id === job.postedBy);
          if (u && u.role === 'admin') job.status = 'approved';
          else if (!job.status) job.status = 'pending';
        } else {
          if (!job.status) job.status = 'pending';
        }
      } catch (e) {}
      return job;
    });
    localStorage.setItem('job_spare_jobs', JSON.stringify(normalized));
  } catch (e) {
    localStorage.setItem('job_spare_jobs', JSON.stringify(j));
  }
}

// ===== DRAFTS (localStorage) =====
function getDrafts(){ return JSON.parse(localStorage.getItem('job_spare_drafts') || '[]'); }
function saveDrafts(d){ localStorage.setItem('job_spare_drafts', JSON.stringify(d)); }

// ===== PREVIEW / DRAFT / PUBLISH HELPERS =====
function previewJob(){
  const title = valOf('#job_title');
  const company = valOf('#job_company');
  const location = valOf('#job_location');
  const categoryEl = qs('#job_category');
  const category = categoryEl ? categoryEl.value : '';
  const desc = valOf('#job_desc');
  const link = valOf('#job_link');
  const area = qs('#previewArea');
  if(!area) return;
  if(!title || !company || !category || !desc){ showNotification('Fill required fields to preview', 'warning'); return; }
  area.style.display = 'block';
  area.innerHTML = `
    <h3 style="margin:0;color:#184d28">${escapeHtml(title)}</h3>
    <div style="color:#666;font-size:0.95rem;margin:6px 0">${escapeHtml(company)} • ${escapeHtml(location||'Anywhere')} • <span style="background:#e8f5e9;color:#2e7d32;padding:4px 8px;border-radius:6px">${escapeHtml(category)}</span></div>
    <p style="color:#444;line-height:1.5">${escapeHtml(desc)}</p>
    <div style="margin-top:8px"><a href="${escapeAttr(link||'#')}" target="_blank" style="background:#2e7d32;color:#fff;padding:8px 12px;border-radius:8px;text-decoration:none">Apply</a></div>
  `;
}

function saveDraft(e){
  e && e.preventDefault && e.preventDefault();
  const title = valOf('#job_title');
  const company = valOf('#job_company');
  const location = valOf('#job_location');
  const categoryEl = qs('#job_category');
  const category = categoryEl ? categoryEl.value : '';
  const desc = valOf('#job_desc');
  const link = valOf('#job_link');
  if(!title || !company){ showNotification('Please provide at least job title and company to save draft', 'warning'); return; }
  const drafts = getDrafts();
  const d = { id: 'd'+Date.now(), title, company, location, category, description: desc, applyLink: link, savedBy: getCurrentUser()? getCurrentUser().id : null, savedAt: new Date().toISOString() };
  drafts.unshift(d);
  saveDrafts(drafts);
  showNotification('Draft saved locally', 'success');
}

function publishJob(e){
  e && e.preventDefault && e.preventDefault();
  const title = valOf('#job_title');
  const company = valOf('#job_company');
  const location = valOf('#job_location');
  const categoryEl = qs('#job_category');
  const category = categoryEl ? categoryEl.value : '';
  const desc = valOf('#job_desc');
  const link = valOf('#job_link') || '#';
  if(!title || !company || !category || !desc){ showNotification('Please complete all required fields before publishing', 'warning'); return; }
  const jobs = getJobs();
  const current = getCurrentUser();
  const job = {
    id: 'j'+Date.now(), title, description: desc, company, category, location, applyLink: link,
    status: (current && current.role === 'admin') ? 'approved' : 'pending',
    postedBy: current ? current.id : null, createdAt: new Date().toISOString(), views:0, applications:0
  };
  jobs.unshift(job);
  saveJobs(jobs);
  // remove any matching draft by id if editing, or by title+company otherwise
  let drafts = getDrafts();
  const editingId = sessionStorage.getItem('job_spare_edit_draft') || window.currentEditingDraftId || null;
  if (editingId) {
    drafts = drafts.filter(d => d.id !== editingId);
    sessionStorage.removeItem('job_spare_edit_draft');
    window.currentEditingDraftId = null;
  } else {
    drafts = drafts.filter(d => !(d.title===title && d.company===company));
  }
  saveDrafts(drafts);
  showNotification('Job published — status: ' + job.status, 'success');
  setTimeout(()=> location.href = '/pages/jobs.html', 900);
}

// expose to window for post-job.html bindings
window.previewJob = previewJob;
window.saveDraft = saveDraft;
window.publishJob = publishJob;
// Draft management utilities (list/edit/delete/publish from drafts page)
function renderDraftsList(containerSelector){
  const container = qs(containerSelector);
  if(!container) return;
  const drafts = getDrafts();
  if(drafts.length===0){ container.innerHTML = '<p class="small">No drafts saved.</p>'; return; }
  const html = drafts.map(d=>{
    return `
      <div class="card" style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
        <div style="flex:1">
          <h4 style="margin:0">${escapeHtml(d.title)}</h4>
          <div class="small" style="color:#666">${escapeHtml(d.company)} • ${escapeHtml(d.location||'')}</div>
          <p style="margin-top:8px;color:#444">${escapeHtml((d.description||'').slice(0,200))}${(d.description||'').length>200?'...':''}</p>
          <div style="margin-top:8px;display:flex;gap:8px">
            <button class="btn secondary" onclick="editDraft('${d.id}')">Edit</button>
            <button class="btn" onclick="publishDraft('${d.id}')">Publish</button>
            <button onclick="deleteDraft('${d.id}')" class="btn secondary" style="background:#fff;color:#d32">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  container.innerHTML = html;
}

function editDraft(id){
  const drafts = getDrafts();
  const d = drafts.find(x=>x.id===id);
  if(!d) return showNotification('Draft not found', 'error');
  sessionStorage.setItem('job_spare_edit_draft', id);
  // redirect to post-job where loadDraftToForm will populate
  location.href = '/pages/post-job.html';
}

function publishDraft(id){
  const drafts = getDrafts();
  const d = drafts.find(x=>x.id===id);
  if(!d) return showNotification('Draft not found', 'error');
  const current = getCurrentUser();
  const jobs = getJobs();
  const job = {
    id: 'j'+Date.now(), title: d.title, description: d.description, company: d.company, category: d.category || '', location: d.location || '', applyLink: d.applyLink || '#',
    status: (current && current.role === 'admin') ? 'approved' : 'pending', postedBy: current? current.id: null, createdAt: new Date().toISOString(), views:0, applications:0
  };
  jobs.unshift(job);
  saveJobs(jobs);
  // remove draft
  const remaining = drafts.filter(x=>x.id!==id);
  saveDrafts(remaining);
  showNotification('Draft published: ' + job.title, 'success');
  // if on drafts page, re-render list
  const list = qs('#draftsList'); if(list) renderDraftsList('#draftsList');
}

function deleteDraft(id){
  if(!confirm('Delete this draft?')) return;
  const drafts = getDrafts();
  const remaining = drafts.filter(x=>x.id!==id);
  saveDrafts(remaining);
  showNotification('Draft deleted', 'success');
  const list = qs('#draftsList'); if(list) renderDraftsList('#draftsList');
}

function loadDraftToForm(){
  const editId = sessionStorage.getItem('job_spare_edit_draft');
  if(!editId) return;
  const drafts = getDrafts();
  const d = drafts.find(x=>x.id===editId);
  if(!d) return;
  // populate fields if present
  const setVal = (sel, val)=>{ const el = qs(sel); if(el) el.value = val || ''; };
  setVal('#job_title', d.title);
  setVal('#job_company', d.company);
  setVal('#job_location', d.location || '');
  setVal('#job_category', d.category || '');
  setVal('#job_desc', d.description || '');
  setVal('#job_link', d.applyLink || '');
  window.currentEditingDraftId = editId;
  // leave the session key — publishJob will remove it after publishing
  showNotification('Loaded draft for editing', 'info');
}

// expose draft functions
window.renderDraftsList = renderDraftsList;
window.editDraft = editDraft;
window.publishDraft = publishDraft;
window.deleteDraft = deleteDraft;
window.loadDraftToForm = loadDraftToForm;

// ===== BOOTSTRAP =====
function bootstrap() {
  if (!localStorage.getItem('job_spare_users')) {
    const admin = {
      id: uid(), name: 'admin', email: 'admin@jobspare.com',
      password: 'admin123', role: 'admin', createdAt: new Date().toISOString()
    };
    localStorage.setItem('job_spare_users', JSON.stringify([admin]));
  }
  if (!localStorage.getItem('job_spare_categories')) {
    const cats = ['Government', 'Private', 'Off-Campus', 'Internship', 'Part-Time', 'Remote', 'Startup'];
    localStorage.setItem('job_spare_categories', JSON.stringify(cats));
  }
  if (!localStorage.getItem('job_spare_jobs')) {
    // If a bundled sample dataset exists, use it to seed jobs so submitted sample datasets
    // (e.g., /data/sample-jobs.js) are automatically available on first load.
    if (typeof sampleJobsDataset !== 'undefined' && Array.isArray(sampleJobsDataset) && sampleJobsDataset.length > 0) {
      const seeded = sampleJobsDataset.map((j, idx) => ({
        id: j.id || ('j' + (Date.now() + idx)),
        title: j.title || 'Untitled',
        description: j.description || j.desc || '',
        company: j.company || 'Company',
        category: j.category || 'General',
        location: j.location || 'Remote',
        type: j.type || j.employment_type || 'Full-time',
        salary: j.salary || '',
        experience: j.experience || '',
        skills: j.skills || '',
        applyLink: j.applyLink || j.apply_link || '#',
        status: 'approved',
        postedBy: null,
        createdAt: new Date().toISOString(),
        views: 0,
        applications: 0
      }));
      localStorage.setItem('job_spare_jobs', JSON.stringify(seeded));
    } else {
      const sampleJobs = [
        {
          id: 'j1', title: 'Graduate Trainee (Govt)', company: 'State Board',
          category: 'Government', location: 'Delhi', description: 'Entry level role for fresh graduates',
          status: 'approved', postedBy: null, applyLink: '#', createdAt: new Date().toISOString()
        },
        {
          id: 'j2', title: 'Software Intern', company: 'TechSoft',
          category: 'Internship', location: 'Remote', description: '3 month internship with stipend',
          status: 'approved', postedBy: null, applyLink: '#', createdAt: new Date().toISOString()
        },
        {
          id: 'j3', title: 'Off-Campus Drive - Engineer', company: 'BuildIt',
          category: 'Off-Campus', location: 'Mumbai', description: 'Hiring for 2025 batch',
          status: 'approved', postedBy: null, applyLink: '#', createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('job_spare_jobs', JSON.stringify(sampleJobs));
    }
  }
}

// ===== AUTHENTICATION =====
function signupHandler(e) {
  e.preventDefault();
  const name = valOf('#name', '#signupName', '#signup_name');
  const email = valOf('#email', '#signupEmail', '#signup_email');
  const password = valOf('#password', '#signupPassword', '#signup_password');
  
  if (!name || !email || !password) {
    showNotification('Please fill all fields', 'warning');
    return;
  }
  
  const users = getUsers();
  if (users.find(x => x.email === email)) {
    showNotification('Email already registered', 'error');
    return;
  }
  
  const user = {
    id: uid(), name, email, password, role: 'user',
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user);
  showNotification('Signup successful! Redirecting...', 'success');
  setTimeout(() => location.href = '/pages/user-dashboard.html', 1000);
}

function loginHandler(e) {
  e.preventDefault();
  const email = valOf('#email', '#loginEmail', '#login_email');
  const password = valOf('#password', '#loginPassword', '#login_password');
  
  if (!email || !password) {
    showNotification('Please fill all fields', 'warning');
    return;
  }
  
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showNotification('Invalid credentials', 'error');
    return;
  }
  
  setCurrentUser(user);
  showNotification(`Welcome back, ${user.name}!`, 'success');
  setTimeout(() => {
    location.href = user.role === 'admin' ? '/pages/admin-dashboard.html' : '/pages/user-dashboard.html';
  }, 800);
}

// ===== JOBS MANAGEMENT =====
function submitJob(e) {
  e.preventDefault();
  const title = valOf('#job_title', '#jobTitle', '#job_title_input');
  const description = valOf('#job_desc', '#job_desc_textarea', '#jobDescription');
  const company = valOf('#job_company', '#jobCompany');
  const categoryEl = qs('#job_category') || qs('#jobCategory');
  const category = categoryEl ? categoryEl.value : '';
  const location = valOf('#job_location', '#jobLocation');
  const applyLink = valOf('#job_link', '#jobLink') || '#';
  
  if (!title || !description || !company || !category) {
    showNotification('Fill all required fields', 'warning');
    return;
  }
  
  const jobs = getJobs();
  const current = getCurrentUser();
  const job = {
    id: 'j' + Date.now(),
    title, description, company, category, location, applyLink,
    status: current && current.role === 'admin' ? 'approved' : 'pending',
    postedBy: current ? current.id : null,
    createdAt: new Date().toISOString(),
    views: 0, applications: 0
  };
  
  jobs.unshift(job);
  saveJobs(jobs);
  showNotification(`Job submitted. Status: ${job.status}`, 'success');
  setTimeout(() => location.href = '/pages/jobs.html', 1000);
}

function renderJobs(containerSelector, filterCategory = null, searchTerm = '') {
  const container = qs(containerSelector);
  if (!container) return;
  
  const jobs = getJobs().filter(j => j.status === 'approved');
  const filtered = jobs.filter(j => {
    const matchCat = filterCategory ? j.category === filterCategory : true;
    const st = searchTerm ? searchTerm.toLowerCase() : '';
    const matchSearch = st ? (
      j.title.toLowerCase().includes(st) ||
      j.company.toLowerCase().includes(st) ||
      j.description.toLowerCase().includes(st)
    ) : true;
    return matchCat && matchSearch;
  });
  
  container.innerHTML = filtered.map(j => `
    <div class="card" style="transition: all 0.3s ease; border-left: 4px solid #2e7d32;">
      <h3 class="job-title" style="margin: 0 0 6px; color: #143;">${escapeHtml(j.title)}</h3>
      <div class="meta" style="color: #666; font-size: 0.95rem; margin-bottom: 8px;">
        ${escapeHtml(j.company)} • ${escapeHtml(j.location || 'Anywhere')} • 
        <span class="badge" style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px;">
          ${escapeHtml(j.category)}
        </span>
      </div>
      <p class="small" style="color: #555; margin: 8px 0;">${escapeHtml(j.description.slice(0, 120))}${j.description.length > 120 ? '...' : ''}</p>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <a href="/pages/job-details.html?id=${encodeURIComponent(j.id)}" style="color: #2e7d32; text-decoration: none; font-weight: 600;">View Details</a>
        <a href="${escapeAttr(j.applyLink)}" target="_blank" class="btn" style="padding: 6px 12px; background: #2e7d32; color: white; text-decoration: none; border-radius: 6px;">Apply Now</a>
      </div>
    </div>
  `).join('');
  
  if (filtered.length === 0) {
    container.innerHTML = '<p class="small" style="text-align: center; color: #999; padding: 20px;">No jobs found matching your criteria.</p>';
  }
}

function renderJobDetails() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const job = getJobs().find(j => j.id === id);
  const cont = qs('#jobDetails');
  if (!cont) return;
  
  if (!job) {
    cont.innerHTML = '<p style="color: #f44336;">Job not found</p>';
    return;
  }
  
  cont.innerHTML = `
    <div class="card" style="padding: 24px;">
      <h2 style="margin-top: 0; color: #143;">${escapeHtml(job.title)}</h2>
      <div class="meta" style="color: #666; margin-bottom: 16px;">
        <strong>${escapeHtml(job.company)}</strong> • ${escapeHtml(job.location || 'Anywhere')} • 
        <span class="badge" style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 4px;">
          ${escapeHtml(job.category)}
        </span>
      </div>
      <p style="color: #555; line-height: 1.6; margin: 16px 0;">${escapeHtml(job.description)}</p>
      <div style="display: flex; gap: 12px; margin-top: 20px;">
        <a href="${escapeAttr(job.applyLink)}" target="_blank" class="btn" style="background: linear-gradient(90deg, #2e7d32, #66bb6a); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Apply Now</a>
        <button onclick="history.back()" style="background: #f0f0f0; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">Back</button>
      </div>
    </div>
  `;
}

// ===== CATEGORIES =====
function renderCategories(containerSelector) {
  const c = getCategories();
  const cont = qs(containerSelector);
  if (!cont) return;
  
  cont.innerHTML = '<button class="badge" onclick="applyCategory(\'\')">All</button> ' +
    c.map(cat => `
      <button class="badge" data-cat="${escapeHtml(cat)}" onclick="applyCategory('${escapeJsLiteral(cat)}')" 
        style="transition: all 0.2s ease; cursor: pointer; padding: 8px 16px; border-radius: 8px; border: 1px solid #2e7d32; background: white; color: #2e7d32; margin: 4px;">
        ${escapeHtml(cat)}
      </button>
    `).join(' ');
}

function applyCategory(cat) {
  const search = qs('#search') ? qs('#search').value.trim().toLowerCase() : '';
  renderJobs('#jobsContainer', cat, search);
}

// ===== ADMIN FUNCTIONS =====
function renderAdminPending() {
  const pending = getJobs().filter(j => j.status === 'pending');
  const cont = qs('#pendingList');
  if (!cont) return;
  
  cont.innerHTML = pending.map(j => `
    <div class="card" style="border-left: 4px solid #ff9800;">
      <h3 style="margin-top: 0; color: #ff9800;">${escapeHtml(j.title)} <span class="small">(${escapeHtml(j.category)})</span></h3>
      <p class="small">${escapeHtml(j.company)} • ${escapeHtml(j.location || '')}</p>
      <p>${escapeHtml(j.description.slice(0, 150))}...</p>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button class="btn" onclick="adminApprove('${j.id}')" style="background: #4caf50; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Approve</button>
        <button onclick="adminReject('${j.id}')" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Reject</button>
      </div>
    </div>
  `).join('');
  
  if (pending.length === 0) {
    cont.innerHTML = '<p class="small" style="text-align: center; color: #999;">No pending jobs</p>';
  }
}

function adminApprove(id) {
  const jobs = getJobs();
  const j = jobs.find(x => x.id === id);
  if (!j) return showNotification('Job not found', 'error');
  j.status = 'approved';
  saveJobs(jobs);
  showNotification(`Approved: ${j.title}`, 'success');
  renderAdminPending();
}

function adminReject(id) {
  let jobs = getJobs();
  const j = jobs.find(x => x.id === id);
  const title = j ? j.title : 'Job';
  jobs = jobs.filter(x => x.id !== id);
  saveJobs(jobs);
  showNotification(`Rejected: ${title}`, 'success');
  renderAdminPending();
}

function adminRenderCategories() {
  const cont = qs('#categoriesAdmin');
  if (!cont) return;
  const cats = getCategories();
  cont.innerHTML = cats.map((c, i) => `
    <div style="display: flex; gap: 8px; align-items: center; padding: 8px; background: #f5f5f5; border-radius: 6px; margin-bottom: 8px;">
      <span style="flex: 1;">${escapeHtml(c)}</span>
      <button onclick="adminDeleteCategory(${i})" style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Delete</button>
    </div>
  `).join('');
}

function adminAddCategory(e) {
  e && e.preventDefault();
  const val = valOf('#newCategory', '#new_category');
  if (!val) return showNotification('Enter category name', 'warning');
  const cats = getCategories();
  if (cats.includes(val)) return showNotification('Category already exists', 'warning');
  cats.push(val);
  saveCategories(cats);
  const inp = qs('#newCategory') || qs('#new_category');
  if (inp) inp.value = '';
  showNotification(`Added category: ${val}`, 'success');
  adminRenderCategories();
  renderCategories('#categoryFilters');
}

function adminDeleteCategory(i) {
  const cats = getCategories();
  cats.splice(i, 1);
  saveCategories(cats);
  adminRenderCategories();
  renderCategories('#categoryFilters');
}

function renderUserJobs() {
  const current = getCurrentUser();
  const cont = qs('#userJobs');
  if (!cont) return;
  if (!current) {
    cont.innerHTML = '<p>Please login</p>';
    return;
  }
  const jobs = getJobs().filter(j => j.postedBy === current.id);
  cont.innerHTML = jobs.map(j => `
    <div class="card" style="border-left: 4px solid #2196f3;">
      <h4 style="margin-top: 0; color: #143;">${escapeHtml(j.title)}</h4>
      <div class="small" style="color: #999;">${escapeHtml(j.category)} • ${escapeHtml(j.status)}</div>
      <p style="color: #555;">${escapeHtml(j.description.slice(0, 80))}...</p>
    </div>
  `).join('');
  
  if (jobs.length === 0) {
    cont.innerHTML = '<p class="small" style="color: #999; text-align: center;">You have not posted any jobs</p>';
  }
}

// ===== CATEGORY TABLES (Dynamic Rendering) =====
function renderCategoryTables(containerSelector) {
  const container = qs(containerSelector);
  if (!container) return;

  const seed = {
    'IT & Software': [
      { title: 'Frontend Developer', company: 'AlphaTech', location: 'Remote', type: 'Full-time', url: 'https://example.com/apply/frontend' },
      { title: 'Backend Engineer', company: 'Beta Labs', location: 'Bengaluru', type: 'Full-time', url: 'https://example.com/apply/backend' },
      { title: 'DevOps Specialist', company: 'CloudWave', location: 'Hyderabad', type: 'Contract', url: 'https://example.com/apply/devops' }
    ],
    'Marketing & Sales': [
      { title: 'Digital Marketing Exec.', company: 'MarketPro', location: 'Remote', type: 'Full-time', url: 'https://example.com/apply/marketing' },
      { title: 'SEO Specialist', company: 'Searchly', location: 'Bengaluru', type: 'Contract', url: 'https://example.com/apply/seo' },
      { title: 'Sales Executive', company: 'DealFlow', location: 'Mumbai', type: 'Full-time', url: 'https://example.com/apply/sales' }
    ],
    'Education & Training': [
      { title: 'Teacher (Math)', company: 'Bright Academy', location: 'Delhi', type: 'Full-time', url: 'https://example.com/apply/teacher' },
      { title: 'Instructional Designer', company: 'LearnWell', location: 'Remote', type: 'Contract', url: 'https://example.com/apply/design' },
      { title: 'Online Tutor', company: 'TutorOn', location: 'Remote', type: 'Part-time', url: 'https://example.com/apply/tutor' }
    ]
  };

  const storedJobs = getJobs().filter(j => j.status === 'approved');
  const grouped = {};
  for (const j of storedJobs) {
    const cat = j.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ title: j.title, company: j.company, location: j.location || '', type: j.type || '', url: j.applyLink || '#' });
  }

  const cats = new Set([...Object.keys(seed), ...Object.keys(grouped)]);

  function buildTableHTML(title, rows) {
    const header = `<div class="table-section"><h3 style="color: #2e7d32; margin-bottom: 12px;">${escapeHtml(title)}</h3><div class="table-responsive"><table class="category-table"><thead><tr><th>Job Title</th><th>Company</th><th>Location</th><th>Type</th></tr></thead><tbody>`;
    const body = rows.map(r => {
      const safeUrl = escapeAttr(r.url || '#');
      return `<tr><td><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color: #2e7d32; font-weight: 600; text-decoration: none;">${escapeHtml(r.title)}</a></td><td>${escapeHtml(r.company || '')}</td><td>${escapeHtml(r.location || '')}</td><td>${escapeHtml(r.type || '')}</td></tr>`;
    }).join('');
    const footer = `</tbody></table></div></div>`;
    return header + body + footer;
  }

  const html = [];
  for (const cat of cats) {
    const s = seed[cat] || [];
    const g = grouped[cat] || [];
    const rows = [...s, ...g];
    if (rows.length === 0) continue;
    html.push(buildTableHTML(cat, rows));
  }

  container.innerHTML = html.join('');
}

// ===== ADMIN LINK EDITOR =====
function renderLinkAdmin() {
  const panel = qs('#linkAdmin');
  const list = qs('#linkAdminList');
  const current = getCurrentUser();
  if (!panel || !list) return;
  if (!current || current.role !== 'admin') {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = 'block';

  const jobs = getJobs();
  if (jobs.length === 0) {
    list.innerHTML = '<p class="small">No jobs available.</p>';
    return;
  }

  const rows = jobs.map(j => {
    const id = j.id;
    const safeUrl = escapeAttr(j.applyLink || '');
    return `
      <div style="display: flex; gap: 8px; align-items: center; padding: 8px; border-bottom: 1px solid rgba(0,0,0,0.04);">
        <div style="flex: 2;"><strong>${escapeHtml(j.title)}</strong><div class="small">${escapeHtml(j.company || '')}</div></div>
        <div style="flex: 3;"><input id="link-input-${id}" type="text" value="${safeUrl}" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ddd;" placeholder="https://..." /></div>
        <div style="flex: 0 0 100px; display: flex; gap: 6px;">
          <a id="open-${id}" href="${safeUrl || '#'}" target="_blank" rel="noopener noreferrer" style="color: #2e7d32; text-decoration: none; font-weight: 600;">Open</a>
          <button onclick="saveJobLink('${id}')" style="background: #2e7d32; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">Save</button>
        </div>
      </div>`;
  }).join('');

  list.innerHTML = rows;
}

function saveJobLink(id) {
  const input = qs(`#link-input-${id}`);
  if (!input) return showNotification('Input not found', 'error');
  const url = input.value.trim() || '#';
  const jobs = getJobs();
  const job = jobs.find(j => j.id === id);
  if (!job) return showNotification('Job not found', 'error');
  job.applyLink = url;
  saveJobs(jobs);
  const openA = qs(`#open-${id}`);
  if (openA) openA.href = url;
  showNotification(`Saved link for: ${job.title}`, 'success');
}

function saveAllLinks() {
  const jobs = getJobs();
  let changed = 0;
  for (const j of jobs) {
    const input = qs(`#link-input-${j.id}`);
    if (input) {
      const val = input.value.trim() || '';
      if (j.applyLink !== val) {
        j.applyLink = val;
        changed++;
      }
    }
  }
  saveJobs(jobs);
  showNotification(`Saved ${changed} link(s)`, 'success');
}

// ===== HOMEPAGE FEATURES =====
function renderStats() {
  const jobs = getJobs().filter(j => j.status === 'approved').length;
  const users = getUsers().length;
  const categories = getCategories().length;

  const totalJobsEl = qs('#totalJobs');
  const totalUsersEl = qs('#totalUsers');
  const totalCategoriesEl = qs('#totalCategories');

  if (totalJobsEl) totalJobsEl.textContent = jobs;
  if (totalUsersEl) totalUsersEl.textContent = users;
  if (totalCategoriesEl) totalCategoriesEl.textContent = categories;
}

function renderFeaturedJobs() {
  const container = qs('#featuredJobs');
  if (!container) return;

  const jobs = getJobs()
    .filter(j => j.status === 'approved')
    ;

  if (jobs.length === 0) {
    container.innerHTML = '<p class="small" style="grid-column: 1/-1; text-align: center;">No jobs available yet.</p>';
    return;
  }

  container.innerHTML = jobs.map(j => `
    <div class="job-card" style="transition: all 0.3s ease;">
      <div class="badge" style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-bottom: 8px;">${escapeHtml(j.category || 'General')}</div>
      <h4 style="margin: 8px 0 4px; color: #143;">${escapeHtml(j.title)}</h4>
      <p style="margin: 4px 0; font-weight: 600;"><strong>${escapeHtml(j.company)}</strong></p>
      <p style="color: #999; font-size: 0.9rem; margin: 4px 0;">📍 ${escapeHtml(j.location || 'Remote')}</p>
      <p style="color: #555; margin: 8px 0;">${escapeHtml(j.description.slice(0, 80))}...</p>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <a href="/pages/job-details.html?id=${encodeURIComponent(j.id)}" style="flex: 1; background: #f0f0f0; color: #333; padding: 8px; border-radius: 6px; text-align: center; text-decoration: none; transition: all 0.2s;">View Details</a>
        <a href="${escapeAttr(j.applyLink || '#')}" target="_blank" style="flex: 1; background: #2e7d32; color: white; padding: 8px; border-radius: 6px; text-align: center; text-decoration: none; transition: all 0.2s;">Apply Now</a>
      </div>
    </div>
  `).join('');
}

function renderHomepageCategoryTables() {
  const container = qs('#categoryTables');
  if (!container) return;

  const categories = getCategories();
  const jobs = getJobs().filter(j => j.status === 'approved');
  if (categories.length === 0) {
    container.innerHTML = '<p class="small" style="grid-column: 1/-1;">No categories available.</p>';
    return;
  }
  // Render all categories and all approved jobs per category (no artificial slicing)
  const tables = categories.map(cat => {
    const catJobs = jobs.filter(j => j.category === cat);
    if (catJobs.length === 0) return '';

    const rows = catJobs.map(j => `
      <tr style="transition: all 0.2s; border-bottom: 1px solid rgba(0,0,0,0.04);">
        <td style="padding: 8px;"><a href="/pages/job-details.html?id=${encodeURIComponent(j.id)}" target="_blank" style="color: #2e7d32; font-weight: 600; text-decoration: none;">${escapeHtml(j.title)}</a></td>
        <td style="padding: 8px;">${escapeHtml(j.company || 'N/A')}</td>
        <td style="padding: 8px;">${escapeHtml(j.location || 'Remote')}</td>
      </tr>
    `).join('');

    return `
      <div class="table-card" style="background: white; border-radius: 10px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: all 0.3s;">
        <h3 style="color: #2e7d32; margin-top: 0; font-size: 1.1rem;">${escapeHtml(cat)}</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="background: linear-gradient(90deg, #e8f5e9, #f1f8e9); border-bottom: 2px solid #2e7d32;">
              <th style="text-align: left; padding: 8px; font-weight: 600;">Job Title</th>
              <th style="text-align: left; padding: 8px; font-weight: 600;">Company</th>
              <th style="text-align: left; padding: 8px; font-weight: 600;">Location</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }).filter(t => t).join('');

  container.innerHTML = tables || '<p class="small">No jobs in categories yet.</p>';
}

// ===== GOOGLE SIGN-IN =====
function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

function handleGoogleCredential(response) {
  if (!response || !response.credential) return showNotification('Google sign-in failed', 'error');
  const payload = parseJwt(response.credential);
  if (!payload) return showNotification('Could not parse Google token', 'error');
  const email = payload.email;
  const name = payload.name || payload.given_name || '';
  if (!email) return showNotification('Google account email not available', 'warning');

  const users = getUsers();
  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      id: uid(), name: name || email.split('@')[0], email, password: '',
      role: 'user', provider: 'google', createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
  }
  setCurrentUser(user);
  showNotification(`Welcome, ${user.name}!`, 'success');
  setTimeout(() => location.href = '/pages/user-dashboard.html', 800);
}

// ===== ADD ANIMATION STYLES =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
  .card { transition: all 0.3s ease; } .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
  bootstrap();

  // Bind forms
  if (qs('#signupForm')) qs('#signupForm').addEventListener('submit', signupHandler);
  if (qs('#loginForm')) {
    qs('#loginForm').addEventListener('submit', loginHandler);
  }
  if (qs('#adminLoginForm')) {
    // Admin login handled by page-specific script
    console.log('✅ Admin login form detected');
  }
  if (qs('#postJobForm')) qs('#postJobForm').addEventListener('submit', submitJob);

  // Render core features
  if (qs('#categoryFilters')) renderCategories('#categoryFilters');
  if (qs('#jobsContainer')) renderJobs('#jobsContainer');
  if (qs('#categoryTables')) renderCategoryTables('#categoryTables');
  if (qs('#linkAdmin')) renderLinkAdmin();

  // Homepage features
  if (qs('#totalJobs')) renderStats();
  if (qs('#featuredJobs')) renderFeaturedJobs();
  if (qs('#categoryTables') && qs('.category-tables-section')) renderHomepageCategoryTables();

  // Search functionality
  if (qs('#search')) {
    qs('#search').addEventListener('input', (e) => renderJobs('#jobsContainer', null, e.target.value.trim().toLowerCase()));
  }

  // Detail pages
  if (qs('#jobDetails')) renderJobDetails();
  if (qs('#pendingList')) renderAdminPending();
  if (qs('#categoriesAdmin')) adminRenderCategories();
  if (qs('#userJobs')) renderUserJobs();

  // Google Sign-In
  if (qs('#googleSignInBtn') && window.google && google.accounts && google.accounts.id) {
    const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleGoogleCredential
    });
    google.accounts.id.renderButton(document.getElementById('googleSignInBtn'), { theme: 'outline', size: 'large', width: 240 });
  }
});

// ===== ADMIN DASHBOARD HELPERS =====

// Render admin pending jobs
function renderAdminPending() {
  const jobs = getJobs().filter(j => j.status === 'pending');
  const container = qs('#pendingJobsList');
  if (!container) return;
  
  if (jobs.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No pending jobs</p>';
    return;
  }
  
  container.innerHTML = jobs.map(j => `
    <div style="background: white; padding: 16px; margin-bottom: 12px; border-left: 4px solid #ff9800; border-radius: 8px;">
      <h3 style="margin-bottom: 8px; color: #333;">${escapeHtml(j.title)}</h3>
      <p style="margin: 4px 0; color: #666;"><strong>${escapeHtml(j.company)}</strong> • ${escapeHtml(j.location)}</p>
      <p style="margin: 4px 0; color: #666; font-size: 0.9rem;">${escapeHtml(j.description.substring(0, 100))}...</p>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <button onclick="adminApproveJob('${j.id}')" style="background: #4caf50; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">✅ Approve</button>
        <button onclick="adminRejectJob('${j.id}')" style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">❌ Reject</button>
      </div>
    </div>
  `).join('');
}

function adminApproveJob(id) {
  let jobs = getJobs();
  const job = jobs.find(j => j.id === id);
  if (job) {
    job.status = 'approved';
    saveJobs(jobs);
    showNotification(`✅ Job approved: ${job.title}`, 'success');
    renderAdminPending();
    updateStats();
  }
}

function adminRejectJob(id) {
  let jobs = getJobs();
  jobs = jobs.filter(j => j.id !== id);
  saveJobs(jobs);
  showNotification('❌ Job rejected and removed', 'success');
  renderAdminPending();
  updateStats();
}

// Admin category management
function adminRenderCategories() {
  const container = qs('#categoriesList');
  if (!container) return;
  
  const cats = getCategories();
  container.innerHTML = cats.map(c => `
    <div style="background: white; padding: 12px; margin-bottom: 8px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <span style="font-weight: 600; color: #333;">${escapeHtml(c)}</span>
      <button onclick="adminDeleteCategory('${escapeJsLiteral(c)}')" style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">🗑️ Delete</button>
    </div>
  `).join('');
}

function adminAddCategory() {
  const input = qs('#newCategoryInput');
  if (!input) return;
  const catName = input.value.trim();
  if (!catName) return showNotification('Enter category name', 'warning');
  
  let cats = getCategories();
  if (cats.includes(catName)) return showNotification('Category already exists', 'warning');
  
  cats.push(catName);
  saveCategories(cats);
  showNotification(`✅ Category added: ${catName}`, 'success');
  input.value = '';
  adminRenderCategories();
  populateCategoryDropdown();
}

function adminDeleteCategory(catName) {
  if (!confirm(`Delete category "${catName}"?`)) return;
  let cats = getCategories();
  cats = cats.filter(c => c !== catName);
  saveCategories(cats);
  showNotification(`🗑️ Category deleted: ${catName}`, 'success');
  adminRenderCategories();
  populateCategoryDropdown();
}

// Admin link management
function renderLinkAdmin() {
  const container = qs('#linkAdminList');
  if (!container) return;
  
  const jobs = getJobs();
  if (jobs.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No jobs to manage</p>';
    return;
  }
  
  container.innerHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px;">' + 
    jobs.map(j => `
      <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <h4 style="margin-bottom: 8px; color: #333; word-break: break-word;">${escapeHtml(j.title)}</h4>
        <label style="display: block; margin-bottom: 4px; font-weight: 600; font-size: 0.85rem; color: #666;">Apply Link:</label>
        <input type="url" id="link_${j.id}" value="${escapeAttr(j.applyLink)}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 0.85rem; word-break: break-all;">
      </div>
    `).join('') + '</div>';
}

function saveAllLinks() {
  let jobs = getJobs();
  jobs.forEach(j => {
    const input = qs(`#link_${j.id}`);
    if (input) j.applyLink = input.value.trim();
  });
  saveJobs(jobs);
  showNotification('✅ All links saved', 'success');
}

function updateStats() {
  const jobs = getJobs();
  const pending = jobs.filter(j => j.status === 'pending').length;
  
  if (qs('#statJobs')) qs('#statJobs').textContent = jobs.length;
  if (qs('#statPending')) qs('#statPending').textContent = pending;
  if (qs('#statUsers')) qs('#statUsers').textContent = getUsers().length;
  if (qs('#statCategories')) qs('#statCategories').textContent = getCategories().length;
}

function populateCategoryDropdown() {
  const select = qs('#admin_job_category');
  if (!select) return;
  const cats = getCategories();
  select.innerHTML = '<option value="">Select Category</option>' + 
    cats.map(c => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join('');
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { bootstrap, getJobs, saveJobs, getUsers, saveUsers };
}
