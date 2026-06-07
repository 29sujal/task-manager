# Task Manager App — MERN Stack

I built this project as part of my MERN stack internship assignment. It's a full-stack task management app where users can register, log in, and manage their daily tasks. I used React with Vite on the frontend and Node/Express with MongoDB on the backend.

---

## What this app does

- Users can create an account and log in securely
- After login, they land on a dashboard where they can add, edit, delete and view their tasks
- Each task has a title, description, priority (low/medium/high) and a status (pending/completed)
- You can mark tasks as done by clicking the checkbox on each card
- There's a search bar to find tasks quickly and filters for status and priority
- Tasks are paginated — 6 per page so the dashboard doesn't get too cluttered
- Stats at the top show how many tasks are total, pending and completed

---

## Tech I used

**Frontend**
- React 18 with Vite (much faster than CRA)
- Tailwind CSS for styling
- React Router v6 for page navigation
- Axios for API calls
- React Hot Toast for notifications

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs to hash passwords

---

## Folder structure

```
task-manager/
├── backend/
│   ├── controllers/      # business logic for auth and tasks
│   ├── middleware/        # JWT verification middleware
│   ├── models/            # Mongoose schemas for User and Task
│   ├── routes/            # API route definitions
│   ├── .env.example       # sample env file
│   └── server.js          # entry point
│
└── frontend/
    ├── src/
    │   ├── components/    # TaskCard and TaskModal
    │   ├── context/       # AuthContext for global user state
    │   ├── pages/         # Login, Register, Dashboard
    │   ├── utils/         # Axios instance with interceptor
    │   └── App.jsx        # routes setup
    ├── vite.config.js
    └── index.html
```

---

## How to run it locally

You'll need Node.js (v18 or above) and MongoDB installed, or a MongoDB Atlas account.

**1. Clone the repo**
```bash
git clone https://github.com/29sujal/task-manager.git
cd task-manager
```

**2. Set up the backend**
```bash
cd backend
npm install
cp .env.example .env
```

Open the `.env` file and fill in your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=makethissomethinglong
JWT_EXPIRE=7d
```

Start the backend:
```bash
npm run dev
```

**3. Set up the frontend**
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`. The Vite proxy handles forwarding API requests so you don't run into CORS issues.

---

## API endpoints

| Method | Route | What it does | Protected |
|--------|-------|-------------|-----------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get logged in user | Yes |
| GET | `/api/tasks` | Get all tasks (search, filter, paginate) | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Edit a task | Yes |
| PATCH | `/api/tasks/:id/toggle` | Toggle pending/completed | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

---

## Database schemas

**User**
```
name     — string, required
email    — string, required, unique
password — string, hashed with bcrypt before saving
```

**Task**
```
title       — string, required
description — string, optional
status      — pending | completed
priority    — low | medium | high
userId      — reference to the User who created it
```

---

## Few things I want to mention

- Passwords are never stored as plain text — bcrypt hashes them before saving
- JWT token is attached automatically to every request using an Axios interceptor
- Search is debounced (400ms delay) so it doesn't spam the API on every keystroke
- Each user can only see and manage their own tasks — the backend always filters by userId
- Edit/delete buttons on task cards only appear on hover to keep the UI clean

---

## Deployment

- Backend → Render or Railway (free tier works fine)
- Frontend → Vercel or Netlify
- Database → MongoDB Atlas (free 512MB cluster)

---

## Author

**Sujal** — Engineering Student, MERN Stack Developer  
Feel free to reach out if you have any questions about the code.
