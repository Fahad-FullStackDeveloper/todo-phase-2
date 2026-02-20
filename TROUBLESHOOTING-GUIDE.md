# Troubleshooting Guide - "Unable to Connect to Server"

**Date:** 20 Feb 2026
**Version:** v1.7.6
**Status:** ✅ **RESOLVED**

---

## 🎯 Issue Description

**Error Message:** "Unable to connect to the server. Please check your connection."

**Actual Problem:** User is **NOT authenticated** (not signed in), but error message was misleading.

---

## ✅ Root Cause Analysis

### Backend Status: ✅ WORKING
```bash
# Backend is running on port 8000
netstat -ano | findstr :8000
# Output: TCP 0.0.0.0:8000 LISTENING ✅

# Health endpoint working
curl http://localhost:8000/health
# Response: {"status":"healthy","version":"2.0.0","database":"connected"} ✅

# CORS configured correctly
curl -X OPTIONS http://localhost:8000/api/tasks -H "Origin: http://localhost:3000"
# Response: access-control-allow-origin: http://localhost:3000 ✅
```

### Frontend Status: ✅ WORKING
```bash
# Frontend is running on port 3000
netstat -ano | findstr :3000
# Output: TCP 0.0.0.0:3000 LISTENING ✅
```

### Actual Issue: ❌ **USER NOT SIGNED IN**

When user tries to access protected routes (`/api/tasks`, `/api/projects`) without a JWT token:
1. Frontend sends request WITHOUT `Authorization: Bearer <token>` header
2. Backend returns `401 Unauthorized` with `{"detail": "Not authenticated"}`
3. Frontend shows misleading error: "Unable to connect to the server"

---

## 🔧 Solution Applied

### 1. Improved Error Message

**File:** `frontend/src/lib/api.ts`

**Before:**
```typescript
if (error.message === 'Unauthorized') {
  // 401 errors are handled by redirect
  return;
}
```

**After:**
```typescript
if (error.message === 'Unauthorized') {
  // 401 errors - user is not authenticated
  if (showToast) {
    toast.error('Authentication Required', {
      description: 'Please sign in to access this resource.',
    });
  }
  return;
}
```

Now users will see: **"Authentication Required - Please sign in to access this resource"** instead of the misleading connection error.

---

## 📋 Step-by-Step Fix

### Step 1: Sign Up or Sign In

**Option A: Create New Account**
1. Navigate to: `http://localhost:3000/signup`
2. Fill in the form:
   - **Name:** Your Name
   - **Email:** your@email.com
   - **Password:** Must be 8+ chars with uppercase, lowercase, and number
   - **Confirm Password:** Same as password
3. Click "Create Account"
4. You'll be redirected to dashboard

**Option B: Use Test Account**
```bash
# Create test user via API (for testing)
curl http://localhost:8000/api/auth/signup \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","name":"Test User"}'
```

### Step 2: Verify Authentication

After signing in:
1. Check browser console (F12)
2. Look for JWT token in:
   - **Cookies:** `jwt_token`
   - **LocalStorage:** `jwt_token`
3. Navigate to `/projects` or `/tasks`
4. Data should load successfully

### Step 3: Create Project

1. Navigate to: `http://localhost:3000/projects`
2. Click "New Project" button
3. Fill in:
   - **Name:** My First Project (required)
   - **Description:** Optional
   - **Color:** Select from color picker
4. Click "Save"
5. ✅ Project should appear in the list

### Step 4: Create Task

1. Navigate to: `http://localhost:3000/tasks`
2. Click "New Task" button
3. Fill in:
   - **Title:** My First Task (required)
   - **Priority:** Select from Low/Medium/High/Urgent
   - **Due Date:** Optional
   - **Project:** Select from dropdown (if projects exist)
   - **Labels:** Optional (create labels first if needed)
4. Click "Save"
5. ✅ Task should appear in the list

---

## 🧪 Testing Checklist

### Backend Verification
- [ ] Backend running on port 8000
- [ ] Health endpoint accessible: `http://localhost:8000/health`
- [ ] API docs accessible: `http://localhost:8000/docs`
- [ ] CORS configured for `http://localhost:3000`

### Frontend Verification
- [ ] Frontend running on port 3000
- [ ] Landing page accessible: `http://localhost:3000`
- [ ] Signin page accessible: `http://localhost:3000/signup`
- [ ] `.env` has correct `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Authentication Flow
- [ ] Can create new account
- [ ] JWT token stored in cookies/localStorage
- [ ] Redirected to dashboard after signin
- [ ] Protected routes accessible with valid token

### Projects & Tasks
- [ ] Can create new project
- [ ] Projects list displays correctly
- [ ] Can create new task
- [ ] Tasks list displays correctly
- [ ] Priority correctly mapped (string → integer)
- [ ] Labels correctly assigned (label_ids)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Unable to connect to the server"

**Cause:** Not signed in

**Solution:**
1. Navigate to `/signin`
2. Sign in with your credentials
3. Try accessing projects/tasks again

---

### Issue 2: "Invalid email or password"

**Cause:** Wrong credentials or user doesn't exist

**Solution:**
1. Create new account at `/signup`
2. Use correct email/password
3. Password must meet requirements (8+ chars, uppercase, lowercase, number)

---

### Issue 3: Projects not showing after creation

**Cause:** Missing `position` field (fixed in v1.7.6)

**Solution:**
1. Ensure you're using v1.7.6 or later
2. API client now sends `position: 0` by default
3. Refresh page after creating project

---

### Issue 4: Tasks not showing after creation

**Cause:** Priority format mismatch (fixed in v1.7.5)

**Solution:**
1. Ensure you're using v1.7.5 or later
2. API client converts priority: `"urgent"` → `1`, `"high"` → `2`, etc.
3. API client sends `label_ids` instead of `labels`
4. Refresh page after creating task

---

### Issue 5: Backend not starting

**Symptoms:**
- `netstat -ano | findstr :8000` shows nothing
- Port already in use error

**Solution:**
```bash
# Kill existing process
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# Start backend
cd backend
python -m uvicorn main:app --reload
```

---

### Issue 6: Frontend not starting

**Symptoms:**
- `netstat -ano | findstr :3000` shows nothing
- Port already in use error

**Solution:**
```bash
# Kill existing process
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Start frontend
cd frontend
npm run dev
```

---

## 📊 Quick Diagnostic Commands

```bash
# 1. Check if backend is running
netstat -ano | findstr :8000
# Expected: TCP 0.0.0.0:8000 LISTENING

# 2. Check if frontend is running
netstat -ano | findstr :3000
# Expected: TCP 0.0.0.0:3000 LISTENING

# 3. Test backend health
curl http://localhost:8000/health
# Expected: {"status":"healthy",...}

# 4. Test API without auth (should return 401)
curl http://localhost:8000/api/tasks
# Expected: {"detail":"Not authenticated"}

# 5. Check frontend .env
cd frontend
type .env | findstr API_URL
# Expected: NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📝 Test User Credentials

For testing purposes, you can create a test user:

```bash
curl http://localhost:8000/api/auth/signup \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "test@test.com",
    "name": "Test User"
  },
  "token": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci..."
  }
}
```

**Use these credentials to sign in:**
- **Email:** test@test.com
- **Password:** Test1234

---

## ✅ Success Criteria

After following this guide, you should be able to:

- [ ] Sign in successfully
- [ ] Access `/projects` page without errors
- [ ] Create new projects
- [ ] See projects in the list
- [ ] Access `/tasks` page without errors
- [ ] Create new tasks
- [ ] See tasks in the list
- [ ] Update task priority (correctly converted)
- [ ] Assign labels to tasks (correctly mapped)

---

**Report Generated:** 20 Feb 2026
**Version:** v1.7.6
**Status:** Issue resolved with better error messaging
