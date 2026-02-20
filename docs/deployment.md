# TodoFlow Deployment Guide

**Version:** 1.9.0  
**Last Updated:** 20 Feb 2026

This guide covers deploying TodoFlow to production using recommended services.

---

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│     Backend      │────▶│    Database     │
│   (Vercel)      │     │  (Railway/Render)│     │    (Neon)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
       │                        │                        │
       │                        │                        │
  Next.js 16.1.6           FastAPI +              PostgreSQL 15
  Static + SSR             UVicorn                Serverless
  CDN                      REST API               Neon
```

---

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Railway or Render account (free tier available)
- Neon account (free tier: 0.5 GB storage)

---

## Step 1: Database Setup (Neon)

### Create Neon Project

1. Go to https://neon.tech and sign up
2. Click **New Project**
3. Enter project name: `todoflow-db`
4. Choose region closest to your users
5. Click **Create Project**

### Get Connection String

1. In project dashboard, copy the **Connection String**
2. It looks like:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/todoflow?sslmode=require
   ```
3. Save this for backend configuration

### Run Migrations

```bash
# Clone your repo locally
git clone <your-repo-url>
cd todo-phase-2/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Set DATABASE_URL temporarily
export DATABASE_URL="<your-neon-connection-string>"

# Run migrations
alembic upgrade head

# Verify tables created
alembic current
```

---

## Step 2: Backend Deployment (Railway)

### Create Railway Project

1. Go to https://railway.app and sign up with GitHub
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository
5. Select the `backend` folder as root

### Configure Environment Variables

In Railway dashboard, add these variables:

```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/todoflow?sslmode=require

# JWT Authentication
BETTER_AUTH_SECRET=generate-a-random-32-character-string-here
FRONTEND_URL=https://your-app.vercel.app
JWT_ALGORITHM=HS256
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# CORS
CORS_ORIGINS=https://your-app.vercel.app

# Application
ENVIRONMENT=production
LOG_LEVEL=info
```

**Generate BETTER_AUTH_SECRET:**
```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or use any random string generator
```

### Deploy

1. Railway automatically deploys after configuration
2. Wait for build to complete (~2-3 minutes)
3. Copy the generated URL (e.g., `https://todoflow-backend.railway.app`)

### Verify Backend

```bash
# Test health endpoint
curl https://your-backend.railway.app/health

# Expected: {"status": "healthy"}
```

---

## Step 3: Frontend Deployment (Vercel)

### Create Vercel Project

1. Go to https://vercel.com and sign up with GitHub
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Configure Environment Variables

In Vercel dashboard, add these variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Authentication
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app.vercel.app
BETTER_AUTH_SECRET=<same-secret-as-backend>

# Application
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** `BETTER_AUTH_SECRET` must be identical to backend!

### Deploy

1. Click **Deploy**
2. Wait for build (~3-5 minutes)
3. Your app is live at `https://your-app.vercel.app`

---

## Step 4: Update CORS Settings

Update backend environment variables to include your Vercel URL:

```env
CORS_ORIGINS=https://your-app.vercel.app,https://todoflow.vercel.app
FRONTEND_URL=https://your-app.vercel.app
```

Railway automatically redeploys when you change environment variables.

---

## Step 5: Custom Domain (Optional)

### Vercel Custom Domain

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your domain: `todoflow.app`
3. Configure DNS records as instructed
4. SSL is automatically provisioned

### Railway Custom Domain

1. In Railway dashboard, go to **Settings > Domains**
2. Add your domain: `api.todoflow.app`
3. Configure DNS records
4. Update `FRONTEND_URL` and `CORS_ORIGINS` with new domain

---

## Post-Deployment Checklist

### Backend

- [ ] Health endpoint returns `{"status": "healthy"}`
- [ ] Database migrations ran successfully
- [ ] CORS configured correctly
- [ ] JWT authentication working
- [ ] API docs accessible at `/docs`

### Frontend

- [ ] Homepage loads without errors
- [ ] Signup/signin flow works
- [ ] Protected routes redirect to signin
- [ ] API calls include JWT token
- [ ] No console errors

### Database

- [ ] All tables created (7 tables)
- [ ] Indexes present
- [ ] Connection pooling working
- [ ] SSL mode set to `require`

---

## Environment Variables Reference

### Backend (.env)

```env
# Required
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key-min-32-characters

# Optional (with defaults)
FRONTEND_URL=http://localhost:3000
JWT_ALGORITHM=HS256
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=production
LOG_LEVEL=info
```

### Frontend (.env.local)

```env
# Required
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
BETTER_AUTH_SECRET=your-secret-key-min-32-characters

# Optional
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## Monitoring & Logs

### Railway Logs

1. Go to Railway project
2. Click **Deployments** tab
3. View real-time logs
4. Download logs if needed

### Vercel Logs

```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs your-app.vercel.app

# Follow logs in real-time
vercel logs --follow your-app.vercel.app
```

### Neon Logs

1. Go to Neon dashboard
2. Select your project
3. View **Connection Pooler** logs
4. Monitor query performance

---

## Backup & Recovery

### Database Backup (Neon)

Neon automatically creates daily backups. To restore:

1. Go to Neon dashboard
2. Select project
3. Click **Backups**
4. Choose backup point
5. Click **Restore**

### Manual Backup

```bash
# Export database
pg_dump "$DATABASE_URL" > backup.sql

# Import database
psql "$DATABASE_URL" < backup.sql
```

---

## Scaling Considerations

### Frontend (Vercel)

- **Free Tier:** 100GB bandwidth/month
- **Pro Tier:** Unlimited bandwidth
- Auto-scales with CDN
- No configuration needed

### Backend (Railway)

- **Free Tier:** $5 credit/month
- **Pro Tier:** Pay as you go
- Auto-scales vertically
- Configure in Railway settings

### Database (Neon)

- **Free Tier:** 0.5 GB storage
- **Pro Tier:** Starting at $0.18/GB
- Auto-scales storage
- Connection pooling included

---

## Troubleshooting

### Backend won't start

1. Check Railway logs for errors
2. Verify DATABASE_URL is correct
3. Ensure all migrations ran
4. Check environment variables

### Frontend shows 500 errors

1. Check Vercel logs
2. Verify NEXT_PUBLIC_API_URL is correct
3. Check CORS configuration in backend
4. Ensure backend is accessible

### Database connection errors

1. Verify Neon connection string
2. Check SSL mode is `require`
3. Ensure IP is not blocked
4. Check connection pool settings

### Authentication issues

1. Verify BETTER_AUTH_SECRET matches in both frontend and backend
2. Check token expiration settings
3. Clear browser cache and cookies
4. Try signing in again

---

## Cost Estimation

### Free Tier (Development/Personal)

- **Vercel:** Free (100GB bandwidth)
- **Railway:** $5/month (with free tier credit)
- **Neon:** Free (0.5 GB storage)
- **Total:** ~$5/month

### Pro Tier (Small Team)

- **Vercel Pro:** $20/month
- **Railway:** ~$20/month
- **Neon Pro:** ~$10/month (for more storage)
- **Total:** ~$50/month

### Enterprise (Large Scale)

- **Vercel Enterprise:** Custom pricing
- **Railway Pro:** ~$100+/month
- **Neon Enterprise:** Custom pricing
- **Total:** Custom

---

## Security Best Practices

1. **Use environment variables** - Never commit secrets
2. **Enable HTTPS** - Automatic on Vercel/Railway
3. **Rotate secrets regularly** - Change BETTER_AUTH_SECRET periodically
4. **Use strong passwords** - Enforce password requirements
5. **Enable rate limiting** - Already configured in backend
6. **Monitor logs** - Set up alerts for errors
7. **Regular backups** - Neon does this automatically
8. **Keep dependencies updated** - Run `npm audit` and `pip audit` regularly

---

## CI/CD Pipeline

### Automatic Deployments

Both Vercel and Railway automatically deploy on push to main branch:

```
git push origin main
  ↓
GitHub webhook triggers
  ↓
Vercel deploys frontend
Railway deploys backend
  ↓
Production updated
```

### Manual Deployment

```bash
# Deploy frontend manually
cd frontend
vercel --prod

# Deploy backend manually (Railway CLI)
railway up --prod
```

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Neon Docs:** https://neon.tech/docs
- **Next.js Docs:** https://nextjs.org/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com

---

*Deployment Guide v1.9.0 | Last Updated: 20 Feb 2026*
