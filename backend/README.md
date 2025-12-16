# JobSphere Backend (Minimal)

This folder contains a minimal Express + MongoDB (Mongoose) API to support the JobSphere frontend.

Features:
- Serves static files from the project root so the frontend pages are available at `http://localhost:3000`.
- API endpoints:
  - `GET /api/jobs` - returns all jobs
  - `POST /api/jobs/save-all` - bulk-replace jobs
  - `GET /api/users` - returns all users
  - `POST /api/users/save-all` - bulk-replace users
  - `GET /api/categories` - returns all categories
  - `POST /api/categories/save-all` - bulk-replace categories

Quick start (Windows PowerShell):

```powershell
cd backend
cp .env.example .env
# edit .env and set MONGODB_URI and PORT
npm install
npm run dev    # requires nodemon, for production use `npm start`
```

Notes:
- The server serves static files from the parent folder so your existing HTML/CSS/JS will be available.
- This scaffold is intentionally minimal. For production you should add security hardening, validation, auth, rate limiting, and proper logging.
