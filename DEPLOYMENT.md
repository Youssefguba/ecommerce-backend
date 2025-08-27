# 🚀 Railway Deployment Guide

## Repository URL
https://github.com/Youssefguba/ecommerce-backend

## Step-by-Step Deployment

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up/Login with GitHub account
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose "Youssefguba/ecommerce-backend"

### 2. Add PostgreSQL Database
- In your Railway project dashboard
- Click "+ New Service" 
- Select "Database" → "PostgreSQL"
- Railway will automatically create and start the database

### 3. Configure Environment Variables
Click on your **APP SERVICE** (not the database), go to "Variables" tab, and add:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-railway-2024
JWT_EXPIRE=24h
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 4. Connect Database
- Click on your **PostgreSQL SERVICE**
- Go to "Connect" tab  
- Copy the "Postgres Connection URL"
- Go back to your **APP SERVICE** → "Variables"
- Add: `DATABASE_URL` = [paste the copied URL]

### 5. Deploy & Test
- Railway will automatically deploy
- Check "Deployments" tab for build logs
- Your app will be live at: `https://your-app-name.up.railway.app`

## Test Your Live API

```bash
# Health check
curl https://your-app-name.up.railway.app/health

# Get products
curl https://your-app-name.up.railway.app/api/products

# Login test
curl -X POST https://your-app-name.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Test Credentials
- Admin: admin@example.com / admin123
- User: test@example.com / test123

## Troubleshooting

If deployment fails:
1. Check "Deployments" tab for error logs
2. Ensure DATABASE_URL is correctly set
3. Verify all environment variables are added
4. Check that PostgreSQL service is running

Your API endpoints will be:
- Authentication: `/api/auth/*`
- Products: `/api/products/*` 
- Cart: `/api/cart/*`
- Users: `/api/users/*`
