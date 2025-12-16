/**
 * Database Abstraction Layer
 * Supports both localStorage (current) and MongoDB (future/production)
 * 
 * Usage: Import functions and use them as-is; storage backend is transparent
 * const { getJobs, saveJobs, getUsers, saveUsers } = require('./db.js');
 */

// Configuration
const DB_CONFIG = {
    USE_MONGODB: false, // Set to true when MongoDB backend is ready
    MONGODB_API_URL: process.env.MONGODB_API_URL || 'http://localhost:3000/api', // Backend API endpoint
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING, // Connection string from env
};

// Load client-side settings from sessionStorage if available (set by settings modal)
if (typeof sessionStorage !== 'undefined') {
  try {
    const savedSettings = JSON.parse(sessionStorage.getItem('job_spare_db_settings') || '{}');
    if (savedSettings.USE_MONGODB !== undefined) DB_CONFIG.USE_MONGODB = savedSettings.USE_MONGODB;
    if (savedSettings.API_URL) DB_CONFIG.MONGODB_API_URL = savedSettings.API_URL;
  } catch (e) {
    console.warn('Could not load settings from sessionStorage:', e);
  }
}

// ===== JOBS STORAGE =====

/**
 * Get all jobs from storage
 * @returns {Array} Array of job objects
 */
function getJobs() {
    if (DB_CONFIG.USE_MONGODB) {
        return getJobsFromMongoDB();
    }
    return getJobsFromLocalStorage();
}

/**
 * Save jobs to storage
 * @param {Array} jobs - Array of job objects to save
 * @returns {void}
 */
function saveJobs(jobs) {
    if (DB_CONFIG.USE_MONGODB) {
        return saveJobsToMongoDB(jobs);
    }
    return saveJobsToLocalStorage(jobs);
}

// ===== USERS STORAGE =====

/**
 * Get all users from storage
 * @returns {Array} Array of user objects
 */
function getUsers() {
    if (DB_CONFIG.USE_MONGODB) {
        return getUsersFromMongoDB();
    }
    return getUsersFromLocalStorage();
}

/**
 * Save users to storage
 * @param {Array} users - Array of user objects to save
 * @returns {void}
 */
function saveUsers(users) {
    if (DB_CONFIG.USE_MONGODB) {
        return saveUsersToMongoDB(users);
    }
    return saveUsersToLocalStorage(users);
}

// ===== CATEGORIES STORAGE =====

/**
 * Get all categories from storage
 * @returns {Array} Array of category strings
 */
function getCategories() {
    if (DB_CONFIG.USE_MONGODB) {
        return getCategoriesFromMongoDB();
    }
    return getCategoriesFromLocalStorage();
}

/**
 * Save categories to storage
 * @param {Array} categories - Array of category strings
 * @returns {void}
 */
function saveCategories(categories) {
    if (DB_CONFIG.USE_MONGODB) {
        return saveCategoriesToMongoDB(categories);
    }
    return saveCategoriesToLocalStorage(categories);
}

// ===== LOCALSTORAGE IMPLEMENTATION =====

function getJobsFromLocalStorage() {
    try {
        const data = localStorage.getItem('jobs');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading jobs from localStorage:', e);
        return [];
    }
}

function saveJobsToLocalStorage(jobs) {
    try {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch (e) {
        console.error('Error saving jobs to localStorage:', e);
    }
}

function getUsersFromLocalStorage() {
    try {
        const data = localStorage.getItem('users');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading users from localStorage:', e);
        return [];
    }
}

function saveUsersToLocalStorage(users) {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (e) {
        console.error('Error saving users to localStorage:', e);
    }
}

function getCategoriesFromLocalStorage() {
    try {
        const data = localStorage.getItem('categories');
        return data ? JSON.parse(data) : ['IT & Software', 'Marketing & Sales', 'Education & Training'];
    } catch (e) {
        console.error('Error reading categories from localStorage:', e);
        return ['IT & Software', 'Marketing & Sales', 'Education & Training'];
    }
}

function saveCategoriesToLocalStorage(categories) {
    try {
        localStorage.setItem('categories', JSON.stringify(categories));
    } catch (e) {
        console.error('Error saving categories to localStorage:', e);
    }
}

// ===== MONGODB IMPLEMENTATION (Stubs - to be implemented with Node.js backend) =====

/**
 * MongoDB Implementation Stubs
 * These functions will be called if USE_MONGODB is true
 * Requires a Node.js backend with Express + MongoDB integration
 * 
 * EXAMPLE NODE.JS BACKEND SETUP:
 * 
 * // server.js or api.js
 * const express = require('express');
 * const mongoose = require('mongoose');
 * const app = express();
 * 
 * // MongoDB Connection
 * mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
 *   useNewUrlParser: true,
 *   useUnifiedTopology: true,
 * });
 * 
 * // Schemas
 * const jobSchema = new mongoose.Schema({
 *   id: String,
 *   title: String,
 *   company: String,
 *   category: String,
 *   location: String,
 *   type: String,
 *   applyLink: String,
 *   description: String,
 *   status: String,
 *   postedBy: String,
 *   createdAt: Date,
 *   views: Number,
 *   applications: Number
 * });
 * 
 * const Job = mongoose.model('Job', jobSchema);
 * 
 * // GET all jobs
 * app.get('/api/jobs', async (req, res) => {
 *   try {
 *     const jobs = await Job.find().sort({ createdAt: -1 });
 *     res.json(jobs);
 *   } catch (e) {
 *     res.status(500).json({ error: e.message });
 *   }
 * });
 * 
 * // POST new job
 * app.post('/api/jobs', async (req, res) => {
 *   try {
 *     const job = new Job(req.body);
 *     await job.save();
 *     res.json(job);
 *   } catch (e) {
 *     res.status(500).json({ error: e.message });
 *   }
 * });
 * 
 * // SAVE all jobs (bulk update)
 * app.post('/api/jobs/save-all', async (req, res) => {
 *   try {
 *     await Job.deleteMany({});
 *     const jobs = await Job.insertMany(req.body);
 *     res.json(jobs);
 *   } catch (e) {
 *     res.status(500).json({ error: e.message });
 *   }
 * });
 */

// ===== ASYNC MONGODB IMPLEMENTATION (with fetch) =====

async function getJobsFromMongoDB() {
    try {
        const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/jobs', { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: DB_CONFIG.API_TIMEOUT || 30000
        });
        if (!response.ok) throw new Error('API error: ' + response.status);
        const jobs = await response.json();
        return Array.isArray(jobs) ? jobs : [];
    } catch (e) {
        console.error('❌ MongoDB fetch error:', e.message);
        console.log('⬅️ Falling back to localStorage');
        return getJobsFromLocalStorage();
    }
}

async function saveJobsToMongoDB(jobs) {
    try {
        const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/jobs/save-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobs),
            timeout: DB_CONFIG.API_TIMEOUT || 30000
        });
        if (!response.ok) throw new Error('API error: ' + response.status);
        const result = await response.json();
        console.log('✅ Jobs saved to MongoDB:', result);
        return result;
    } catch (e) {
        console.error('❌ MongoDB save error:', e.message);
        console.log('⬅️ Falling back to localStorage');
        return saveJobsToLocalStorage(jobs);
    }
}

async function getUsersFromMongoDB() {
    try {
        const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/users', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: DB_CONFIG.API_TIMEOUT || 30000
        });
        if (!response.ok) throw new Error('API error: ' + response.status);
        const users = await response.json();
        return Array.isArray(users) ? users : [];
    } catch (e) {
        console.error('❌ MongoDB fetch error:', e.message);
        console.log('⬅️ Falling back to localStorage');
        return getUsersFromLocalStorage();
    }
}

async function saveUsersToMongoDB(users) {
    try {
        const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/users/save-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(users),
            timeout: DB_CONFIG.API_TIMEOUT || 30000
        });
        if (!response.ok) throw new Error('API error: ' + response.status);
        const result = await response.json();
        console.log('✅ Users saved to MongoDB:', result);
        return result;
    } catch (e) {
        console.error('❌ MongoDB save error:', e.message);
        console.log('⬅️ Falling back to localStorage');
        return saveUsersToLocalStorage(users);
    }
}

async function getCategoriesFromMongoDB() {
    try {
        const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/categories', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: DB_CONFIG.API_TIMEOUT || 30000
        });
        if (!response.ok) throw new Error('API error: ' + response.status);
        const cats = await response.json();
        return Array.isArray(cats) ? cats : [];
    } catch (e) {
        console.error('❌ MongoDB fetch error:', e.message);
        console.log('⬅️ Falling back to localStorage');
        return getCategoriesFromLocalStorage();
    }
}

async function saveCategoriesToMongoDB(categories) {
    try {
        const response = await fetch(DB_CONFIG.MONGODB_API_URL + '/categories/save-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categories),
            timeout: DB_CONFIG.API_TIMEOUT || 30000
        });
        if (!response.ok) throw new Error('API error: ' + response.status);
        const result = await response.json();
        console.log('✅ Categories saved to MongoDB:', result);
        return result;
    } catch (e) {
        console.error('❌ MongoDB save error:', e.message);
        console.log('⬅️ Falling back to localStorage');
        return saveCategoriesToLocalStorage(categories);
    }
}

// ===== EXPORTS =====
// For use in Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getJobs, saveJobs,
        getUsers, saveUsers,
        getCategories, saveCategories,
        DB_CONFIG
    };
}

// For direct use in browser (app.js)
const DBModule = {
    getJobs, saveJobs,
    getUsers, saveUsers,
    getCategories, saveCategories,
    DB_CONFIG
};
