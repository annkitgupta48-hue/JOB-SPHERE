// app.js - Job Spare (HTML/CSS/JS only)
// Fixed bugs and made handlers tolerant to different input id naming.

// --- Helper Utilities ---
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);
const uid = () => 'u'+Date.now()+Math.floor(Math.random()*999);

// Small helper to safely read value from multiple possible selectors
function valOf(...selectors){
  for(const sel of selectors){
    const el = qs(sel);
    if(el) return (el.value || '').trim();
  }
  return '';
}

// Initial bootstrap: create default admin and sample categories/jobs if not present
function bootstrap(){
  if(!localStorage.getItem('job_spare_users')){
    const admin = {id: uid(), name:'admin', email:'admin@jobspare.com', password:'admin123', role:'admin'};
    localStorage.setItem('job_spare_users', JSON.stringify([admin]));
  }
  if(!localStorage.getItem('job_spare_categories')){
    const cats = ['Government','Private','Off-Campus','Internship','Part-Time'];
    localStorage.setItem('job_spare_categories', JSON.stringify(cats));
  }
  if(!localStorage.getItem('job_spare_jobs')){
    const sampleJobs = [
      {id:'j1',title:'Graduate Trainee (Govt)',company:'State Board',category:'Government',location:'Delhi',description:'Entry level role',status:'approved',postedBy:null,applyLink:'#'},
      {id:'j2',title:'Software Intern',company:'TechSoft',category:'Internship',location:'Remote',description:'3 month internship',status:'approved',postedBy:null,applyLink:'#'},
      {id:'j3',title:'Off-Campus Drive - Engineer',company:'BuildIt',category:'Off-Campus',location:'Mumbai',description:'Hiring for 2025 batch',status:'approved',postedBy:null,applyLink:'#'}
    ];
    localStorage.setItem('job_spare_jobs', JSON.stringify(sampleJobs));
  }
}

// --- Authentication (LocalStorage) ---
function getUsers(){ return JSON.parse(localStorage.getItem('job_spare_users')||'[]'); }
function saveUsers(u){ localStorage.setItem('job_spare_users', JSON.stringify(u)); }
function getCurrentUser(){ return JSON.parse(sessionStorage.getItem('job_spare_current')||'null'); }
function setCurrentUser(u){ sessionStorage.setItem('job_spare_current', JSON.stringify(u)); }
function logout(){ sessionStorage.removeItem('job_spare_current'); location.href = '/index.html'; }

// Signup logic (robust to different input ids)
function signupHandler(e){
  e.preventDefault();
  // support both id="name" and id="signupName", id="email" and id="signupEmail", etc.
  const name = valOf('#name','#signupName','#signup_name');
  const email = valOf('#email','#signupEmail','#signup_email');
  const password = valOf('#password','#signupPassword','#signup_password');
  if(!name||!email||!password){ alert('Please fill all fields'); return; }
  const users = getUsers();
  if(users.find(x=>x.email===email)){ alert('Email already registered'); return; }
  const user = {id:uid(), name, email, password, role:'user'};
  users.push(user); saveUsers(users); setCurrentUser(user); alert('Signup success'); location.href='/pages/user-dashboard.html';
}

// Login logic (robust to different input ids)
function loginHandler(e){
  e.preventDefault();
  const email = valOf('#email','#loginEmail','#login_email');
  const password = valOf('#password','#loginPassword','#login_password');
  if(!email||!password){ alert('Please fill all fields'); return; }
  const users = getUsers();
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user){ alert('Invalid credentials'); return; }
  setCurrentUser(user);
  if(user.role==='admin') location.href='/pages/admin-dashboard.html';
  else location.href='/pages/user-dashboard.html';
}

// --- Categories ---
function getCategories(){ return JSON.parse(localStorage.getItem('job_spare_categories')||'[]'); }
function saveCategories(c){ localStorage.setItem('job_spare_categories', JSON.stringify(c)); }

// --- Jobs ---
function getJobs(){ return JSON.parse(localStorage.getItem('job_spare_jobs')||'[]'); }
function saveJobs(j){ localStorage.setItem('job_spare_jobs', JSON.stringify(j)); }

// Add job (user submission) - tolerant to input id differences
function submitJob(e){
  e.preventDefault();
  const title = valOf('#job_title','#jobTitle','#job_title_input');
  const description = valOf('#job_desc','#job_desc_textarea','#jobDescription');
  const company = valOf('#job_company','#jobCompany');
  const categoryEl = qs('#job_category') || qs('#jobCategory');
  const category = categoryEl ? categoryEl.value : '';
  const location = valOf('#job_location','#jobLocation');
  const applyLink = valOf('#job_link','#jobLink') || '#';
  if(!title||!description||!company||!category){ alert('Fill required fields'); return; }
  const jobs = getJobs();
  const current = getCurrentUser();
  const job = { id:'j'+Date.now(), title, description, company, category, location, applyLink, status: current && current.role==='admin' ? 'approved' : 'pending', postedBy: current? current.id:null };
  jobs.unshift(job);
  saveJobs(jobs);
  alert('Job submitted. Status: '+job.status);
  location.href='/pages/jobs.html';
}

// Render jobs to a container with optional filter/search
function renderJobs(containerSelector, filterCategory=null, searchTerm=''){
  const container = qs(containerSelector);
  if(!container) return;
  const jobs = getJobs().filter(j => j.status==='approved');
  const filtered = jobs.filter(j=>{
    const matchCat = filterCategory ? j.category===filterCategory : true;
    const st = searchTerm ? searchTerm.toLowerCase() : '';
    const matchSearch = st ? (j.title.toLowerCase().includes(st)||j.company.toLowerCase().includes(st)||j.description.toLowerCase().includes(st)) : true;
    return matchCat && matchSearch;
  });
  container.innerHTML = filtered.map(j=>`
    <div class="card">
      <h3 class="job-title">${escapeHtml(j.title)}</h3>
      <div class="meta">${escapeHtml(j.company)} • ${escapeHtml(j.location || 'Anywhere')} • <span class="badge">${escapeHtml(j.category)}</span></div>
      <p class="small">${escapeHtml(j.description.slice(0,120))}${j.description.length>120 ? '...':''}</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <a href="/pages/job-details.html?id=${encodeURIComponent(j.id)}" class="small">View</a>
        <a href="${escapeAttr(j.applyLink)}" target="_blank" class="btn" style="padding:6px 10px">Apply</a>
      </div>
    </div>
  `).join('');
  if(filtered.length===0) container.innerHTML = '<p class="small">No jobs found</p>';
}

// small sanitizers for safer injection (good practice for demo)
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
function escapeAttr(s){ return s ? s.replace(/"/g,'&quot;') : '#'; }

// Render categories as filter buttons
function renderCategories(containerSelector){
  const c = getCategories();
  const cont = qs(containerSelector);
  if(!cont) return;
  // create All button first (correctly formatted)
  cont.innerHTML = '<button class="badge" onclick="applyCategory(\'\')">All</button> ' + c.map(cat=>`<button class="badge" data-cat="${escapeHtml(cat)}" onclick="applyCategory('${escapeJsLiteral(cat)}')">${escapeHtml(cat)}</button>`).join(' ');
}

// helper to escape single quotes inside JS literal used in onclick
function escapeJsLiteral(s){
  return String(s).replace(/'/g,"\\'");
}

function applyCategory(cat){
  const search = qs('#search') ? qs('#search').value.trim().toLowerCase() : '';
  renderJobs('#jobsContainer', cat, search);
}

// Job details rendering
function renderJobDetails(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const job = getJobs().find(j=>j.id===id);
  const cont = qs('#jobDetails');
  if(!cont) return;
  if(!job){ cont.innerHTML='<p>Job not found</p>'; return; }
  cont.innerHTML = `<div class="card"><h2>${escapeHtml(job.title)}</h2><div class="meta">${escapeHtml(job.company)} • ${escapeHtml(job.location || 'Anywhere')} • <span class="badge">${escapeHtml(job.category)}</span></div><p>${escapeHtml(job.description)}</p><a href="${escapeAttr(job.applyLink)}" target="_blank" class="btn">Apply Now</a></div>`;
}

// Admin area: list pending jobs
function renderAdminPending(){
  const pending = getJobs().filter(j=>j.status==='pending');
  const cont = qs('#pendingList');
  if(!cont) return;
  cont.innerHTML = pending.map(j=>`
    <div class="card">
      <h3>${escapeHtml(j.title)} <span class="small">(${escapeHtml(j.category)})</span></h3>
      <p class="small">${escapeHtml(j.company)} • ${escapeHtml(j.location || '')}</p>
      <p>${escapeHtml(j.description.slice(0,150))}...</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn" onclick="adminApprove('${j.id}')">Approve</button>
        <button onclick="adminReject('${j.id}')">Reject</button>
      </div>
    </div>
  `).join('');
  if(pending.length===0) cont.innerHTML = '<p class="small">No pending jobs</p>';
}

function adminApprove(id){
  const jobs = getJobs();
  const j = jobs.find(x=>x.id===id);
  if(!j) return alert('Not found');
  j.status='approved'; saveJobs(jobs); alert('Approved'); renderAdminPending();
}
function adminReject(id){
  let jobs = getJobs();
  jobs = jobs.filter(x=>x.id!==id);
  saveJobs(jobs); alert('Rejected & removed'); renderAdminPending();
}

// Manage categories in admin
function adminRenderCategories(){
  const cont = qs('#categoriesAdmin');
  if(!cont) return;
  const cats = getCategories();
  cont.innerHTML = cats.map((c,i)=>`<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><span>${escapeHtml(c)}</span><button onclick="adminDeleteCategory(${i})">Delete</button></div>`).join('');
}
function adminAddCategory(e){
  e && e.preventDefault();
  const val = valOf('#newCategory','#new_category');
  if(!val) return alert('Enter category');
  const cats = getCategories();
  cats.push(val);
  saveCategories(cats);
  // clear input if it exists
  const inp = qs('#newCategory') || qs('#new_category');
  if(inp) inp.value = '';
  adminRenderCategories();
  renderCategories('#categoryFilters');
}
function adminDeleteCategory(i){
  const cats = getCategories();
  cats.splice(i,1); saveCategories(cats); adminRenderCategories(); renderCategories('#categoryFilters');
}

// Render user's own jobs in dashboard
function renderUserJobs(){
  const current = getCurrentUser();
  const cont = qs('#userJobs');
  if(!cont) return;
  if(!current){ cont.innerHTML='<p>Please login</p>'; return; }
  const jobs = getJobs().filter(j=>j.postedBy===current.id);
  cont.innerHTML = jobs.map(j=>`<div class="card"><h4>${escapeHtml(j.title)}</h4><div class="small">${escapeHtml(j.category)} • ${escapeHtml(j.status)}</div><p>${escapeHtml(j.description.slice(0,80))}...</p></div>`).join('');
  if(jobs.length===0) cont.innerHTML='<p class="small">You have not posted any jobs</p>';
}

// --- Category Tables Renderer (dynamic tables with clickable apply links) ---
function renderCategoryTables(containerSelector){
  const container = qs(containerSelector);
  if(!container) return;

  // Seed data for the three showcased categories (placeholders for apply links)
  const seed = {
    'IT & Software': [
      {title:'Frontend Developer',company:'AlphaTech',location:'Remote',type:'Full-time',url:'https://example.com/apply/frontend-alpha'},
      {title:'Backend Engineer',company:'Beta Labs',location:'Bengaluru',type:'Full-time',url:'https://example.com/apply/backend-beta'},
      {title:'DevOps Specialist',company:'CloudWave',location:'Hyderabad',type:'Contract',url:'https://example.com/apply/devops-cloudwave'}
    ],
    'Marketing & Sales': [
      {title:'Digital Marketing Exec.',company:'MarketPro',location:'Remote',type:'Full-time',url:'https://example.com/apply/digital-marketpro'},
      {title:'SEO Specialist',company:'Searchly',location:'Bengaluru',type:'Contract',url:'https://example.com/apply/seo-searchly'},
      {title:'Content Strategist',company:'WriteRight',location:'Remote',type:'Part-time',url:'https://example.com/apply/content-writer'}
    ],
    'Education & Training': [
      {title:'Teacher (Math)',company:'Bright Academy',location:'Delhi',type:'Full-time',url:'https://example.com/apply/teacher-bright'},
      {title:'Instructional Designer',company:'LearnWell',location:'Remote',type:'Contract',url:'https://example.com/apply/inst-design'},
      {title:'Online Tutor',company:'TutorOn',location:'Remote',type:'Part-time',url:'https://example.com/apply/online-tutor'}
    ]
  };

  // Merge with jobs stored in localStorage if present (include approved jobs)
  const storedJobs = getJobs().filter(j=>j.status==='approved');
  // Transform stored jobs into same shape and group by category
  const grouped = {};
  for(const j of storedJobs){
    const cat = j.category || 'Other';
    if(!grouped[cat]) grouped[cat]=[];
    grouped[cat].push({title:j.title, company:j.company, location:j.location||'', type:j.type||j.status||'', url: j.applyLink||'#'});
  }

  // final categories to render: union of seed keys and stored job categories
  const cats = new Set([...Object.keys(seed), ...Object.keys(grouped)]);

  // Helper to build one table HTML
  function buildTableHTML(title, rows){
    const header = `<div class="table-section"><h3>${escapeHtml(title)}</h3><div class="table-responsive"><table class="category-table"><thead><tr><th>Job Title</th><th>Company</th><th>Location</th><th>Type</th></tr></thead><tbody>`;
    const body = rows.map(r=>{
      const safeUrl = escapeAttr(r.url || '#');
      return `<tr><td><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a></td><td>${escapeHtml(r.company||'')}</td><td>${escapeHtml(r.location||'')}</td><td>${escapeHtml(r.type||'')}</td></tr>`;
    }).join('');
    const footer = `</tbody></table></div></div>`;
    return header + body + footer;
  }

  // Build HTML for all categories
  const html = [];
  for(const cat of cats){
    const s = seed[cat] || [];
    const g = grouped[cat] || [];
    const rows = [...s, ...g];
    if(rows.length===0) continue;
    html.push(buildTableHTML(cat, rows));
  }

  container.innerHTML = html.join('');
}

// --- Admin: render and edit job apply links ---
function renderLinkAdmin(){
  const panel = qs('#linkAdmin');
  const list = qs('#linkAdminList');
  const current = getCurrentUser();
  if(!panel || !list) return;
  if(!current || current.role!=='admin') { panel.style.display='none'; return; }
  panel.style.display = 'block';

  const jobs = getJobs();
  if(jobs.length===0){ list.innerHTML = '<p class="small">No jobs available.</p>'; return; }

  const rows = jobs.map(j=>{
    const id = j.id;
    const safeUrl = escapeAttr(j.applyLink||'');
    return `
      <div class="admin-row" style="display:flex;gap:8px;align-items:center;padding:8px;border-bottom:1px solid rgba(0,0,0,0.04)">
        <div style="flex:2"><strong>${escapeHtml(j.title)}</strong><div class="small">${escapeHtml(j.company||'')}</div></div>
        <div style="flex:3"><input id="link-input-${id}" type="text" value="${safeUrl}" style="width:100%" placeholder="https://..." /></div>
        <div style="flex:0 0 100px;display:flex;gap:6px">
          <a id="open-${id}" href="${safeUrl||'#'}" target="_blank" rel="noopener noreferrer">Open</a>
          <button onclick="saveJobLink('${id}')">Save</button>
        </div>
      </div>`;
  }).join('');

  list.innerHTML = rows;
}

function saveJobLink(id){
  const input = qs(`#link-input-${id}`);
  if(!input) return alert('Input not found');
  const url = input.value.trim() || '#';
  const jobs = getJobs();
  const job = jobs.find(j=>j.id===id);
  if(!job) return alert('Job not found');
  job.applyLink = url;
  saveJobs(jobs);
  const openA = qs(`#open-${id}`);
  if(openA) openA.href = url;
  alert('Saved link for: ' + job.title);
}

function saveAllLinks(){
  const jobs = getJobs();
  let changed = 0;
  for(const j of jobs){
    const input = qs(`#link-input-${j.id}`);
    if(input){
      const val = input.value.trim() || '';
      if(j.applyLink !== val){ j.applyLink = val; changed++; }
    }
  }
  saveJobs(jobs);
  alert('Saved '+changed+' link(s)');
}

// On document ready, run appropriate binds based on presence of elements
document.addEventListener('DOMContentLoaded', function(){
  bootstrap();
  
  // Bind signup/login if forms exist
  if(qs('#signupForm')) qs('#signupForm').addEventListener('submit', signupHandler);
  if(qs('#loginForm')) qs('#loginForm').addEventListener('submit', loginHandler);
  if(qs('#postJobForm')) qs('#postJobForm').addEventListener('submit', submitJob);
  
  // Render categories on pages
  if(qs('#categoryFilters')) renderCategories('#categoryFilters');
  if(qs('#jobsContainer')) renderJobs('#jobsContainer');
  if(qs('#categoryTables')) renderCategoryTables('#categoryTables');
  if(qs('#linkAdmin')) renderLinkAdmin();
  
  // Homepage features
  if(qs('#totalJobs')) renderStats();
  if(qs('#featuredJobs')) renderFeaturedJobs();
  if(qs('#categoryTables') && qs('.category-tables-section')) renderHomepageCategoryTables();
  
  if(qs('#search')) {
    qs('#search').addEventListener('input', (e)=> renderJobs('#jobsContainer', null, e.target.value.trim().toLowerCase()));
  }
  if(qs('#jobDetails')) renderJobDetails();
  if(qs('#pendingList')) renderAdminPending();
  if(qs('#categoriesAdmin')) adminRenderCategories();
  if(qs('#userJobs')) renderUserJobs();

  // Google Sign-In: render button if container exists and library loaded
  if(qs('#googleSignInBtn') && window.google && google.accounts && google.accounts.id){
    const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleGoogleCredential
    });
    google.accounts.id.renderButton(document.getElementById('googleSignInBtn'), { theme: 'outline', size: 'large', width: 240 });
  }
});

// --- Homepage Stats Rendering ---
function renderStats(){
  const jobs = getJobs().filter(j => j.status === 'approved').length;
  const users = getUsers().length;
  const categories = getCategories().length;
  
  const totalJobsEl = qs('#totalJobs');
  const totalUsersEl = qs('#totalUsers');
  const totalCategoriesEl = qs('#totalCategories');
  
  if(totalJobsEl) totalJobsEl.textContent = jobs;
  if(totalUsersEl) totalUsersEl.textContent = users;
  if(totalCategoriesEl) totalCategoriesEl.textContent = categories;
}

// --- Featured Jobs Rendering (top 6 approved jobs) ---
function renderFeaturedJobs(){
  const container = qs('#featuredJobs');
  if(!container) return;
  
  const jobs = getJobs()
    .filter(j => j.status === 'approved')
    .slice(0, 6);
  
  if(jobs.length === 0){
    container.innerHTML = '<p class="small" style="grid-column: 1/-1; text-align: center;">No jobs available yet.</p>';
    return;
  }
  
  container.innerHTML = jobs.map(j => `
    <div class="job-card">
      <div class="badge">${escapeHtml(j.category || 'General')}</div>
      <h4>${escapeHtml(j.title)}</h4>
      <p><strong>${escapeHtml(j.company)}</strong></p>
      <p style="color: #999; font-size: 0.9rem;">📍 ${escapeHtml(j.location || 'Remote')}</p>
      <p>${escapeHtml(j.description.slice(0, 80))}...</p>
      <div class="actions">
        <a href="/pages/job-details.html?id=${encodeURIComponent(j.id)}" class="view">View Details</a>
        <a href="${escapeAttr(j.applyLink || '#')}" target="_blank" class="apply">Apply Now</a>
      </div>
    </div>
  `).join('');
}

// --- Homepage Category Tables (showcase categories with sample jobs) ---
function renderHomepageCategoryTables(){
  const container = qs('#categoryTables');
  if(!container) return;
  
  const categories = getCategories();
  const jobs = getJobs().filter(j => j.status === 'approved');
  
  if(categories.length === 0){
    container.innerHTML = '<p class="small" style="grid-column: 1/-1;">No categories available.</p>';
    return;
  }
  
  const tables = categories.slice(0, 3).map(cat => {
    const catJobs = jobs.filter(j => j.category === cat).slice(0, 5);
    if(catJobs.length === 0) return '';
    
    const rows = catJobs.map(j => `
      <tr>
        <td><a href="/pages/job-details.html?id=${encodeURIComponent(j.id)}" target="_blank">${escapeHtml(j.title)}</a></td>
        <td>${escapeHtml(j.company || 'N/A')}</td>
        <td>${escapeHtml(j.location || 'Remote')}</td>
      </tr>
    `).join('');
    
    return `
      <div class="table-card">
        <h3>${escapeHtml(cat)}</h3>
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }).filter(t => t).join('');
  
  container.innerHTML = tables || '<p class="small">No jobs in categories yet.</p>';
}

// --- Google Sign-In handlers ---
function parseJwt (token) {
  try{
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g,'+').replace(/_/g,'/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  }catch(e){return null}
}

function handleGoogleCredential(response){
  // response.credential contains the ID token (JWT)
  if(!response || !response.credential) return alert('Google sign-in failed');
  const payload = parseJwt(response.credential);
  if(!payload) return alert('Could not parse Google token');
  const email = payload.email;
  const name = payload.name || payload.given_name || '';
  if(!email) return alert('Google account email not available');

  // Create or find user in localStorage and sign them in
  const users = getUsers();
  let user = users.find(u=>u.email===email);
  if(!user){
    user = { id: uid(), name: name || email.split('@')[0], email, password: '', role: 'user', provider: 'google' };
    users.push(user); saveUsers(users);
  }
  setCurrentUser(user);
  alert('Signed in as ' + (user.name || user.email));
  // redirect to dashboard
  location.href = '/pages/user-dashboard.html';
}

