# NexVoice — Turning Student Voices into Action

NexVoice has been reorganized into three completely separate, independently runnable applications:

```text
NexVoice/
│
├── user/       # Public Student & Institution Representative Website (React + Vite, Port 5173)
├── admin/      # Admin Moderation Portal (React + Vite, Port 5174)
├── backend/    # REST API & Business Logic Server (Node.js + Express + TS, Port 5000)
│
├── supabase_v2_migration.sql # Database Migration & RLS Script
├── README.md
└── .gitignore
```

---

## 🏗️ Architecture

```text
                 NEXVOICE
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
      USER        ADMIN      BACKEND
    (React)      (React)   (Node/Express)
     5173         5174        5000
        │           │           │
        └───────────┴─────┬─────┘
                          ↓
                     SUPABASE
           (PostgreSQL + Auth + Storage)
```

---

## 🚀 Independent Running Instructions

### 1. Backend Application (REST API & Auth Verification)
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. User Application (Public Website)
```bash
cd user
npm install
npm run dev
# Website runs on http://localhost:5173
```

### 3. Admin Application (Moderation Dashboard)
```bash
cd admin
npm install
npm run dev
# Portal runs on http://localhost:5174
```

---

## 🔒 Security & Workflow

1. **Submission**: Issues created via `user/` enter `status = 'PENDING_VERIFICATION'` and are not visible publicly.
2. **Public Filtering**: `user/` displays only `status = 'APPROVED'` records.
3. **Moderation**: `admin/` authenticates administrators (**Ahsan Iqbal** & **Shawal**) securely and allows reviewing, approving, rejecting, and soft-removing (`status = 'REMOVED'`) issues.
4. **Audit Trail**: Every action logs timestamp and admin ID to `issue_moderation_history`.
5. **Database Security**: Supabase RLS enforces that verification documents and audit trails are restricted to authorized admins. Service role keys exist **only** in `backend/` environment variables.

---

## ⚙️ Environment Variables

### `user/.env.example`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### `admin/.env.example`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### `backend/.env.example`
```env
PORT=5000
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CLIENT_ORIGIN_USER=http://localhost:5173
CLIENT_ORIGIN_ADMIN=http://localhost:5174
```
