# 🚀 Render Backend Deployment Guide

## 🎯 Current Status
- ❌ Backend returning 502 Bad Gateway
- ⚠️  Likely missing PostgreSQL database and environment variables
- 📝 Service needs proper configuration

## 🔧 Required Setup Steps

### 1. PostgreSQL Database Setup
```bash
# In Render Dashboard:
1. Go to https://dashboard.render.com/
2. Click "New +" → "PostgreSQL"
3. Database Name: jobifies-v5-db
4. User: jobifies_user
5. Region: Same as your web service
6. Plan: Free (sufficient for testing)
```

### 2. Web Service Configuration
```yaml
# Service Settings:
Name: jobifies-v5-backend
Environment: Node
Region: Same as database
Branch: main
Root Directory: backend
Build Command: npm ci && npm run build
Start Command: npm start
```

### 3. Essential Environment Variables
```bash
# Copy these EXACT variables to Render Environment Variables section:
NODE_ENV=production
PORT=10000
DATABASE_URL=[Auto-filled by PostgreSQL service]
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
SESSION_SECRET=your-super-secret-session-key-min-32-chars
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://jobifies-portal.netlify.app
ENABLE_API_DOCS=true
LOG_LEVEL=info
```

### 4. Database Connection
```bash
# After PostgreSQL service is created:
1. Copy the "Internal Database URL" 
2. Add it as DATABASE_URL environment variable
3. Format: postgresql://username:password@hostname:port/database
```

## 🔍 Troubleshooting Steps

### Check Build Logs
1. Go to Render service dashboard
2. Click "Logs" tab
3. Look for build/startup errors

### Common Issues:
- **Missing DATABASE_URL**: Service won't start
- **Port conflicts**: Use PORT=10000 (Render requirement)
- **Missing dependencies**: Check package.json
- **TypeScript errors**: Run `npm run build` locally first

### Database Migration
```bash
# After service is running, trigger migration:
# This should happen automatically via our migration scripts
```

## 📋 Verification Checklist
- [ ] PostgreSQL database created and connected
- [ ] All environment variables configured
- [ ] Service successfully deployed (no 502 errors)
- [ ] Health endpoint responding: `/api/health`
- [ ] Database migration completed
- [ ] API documentation accessible: `/api-docs`

## 🔗 Expected URLs
- Backend: https://jobifies-v5-backend.onrender.com
- Health Check: https://jobifies-v5-backend.onrender.com/api/health
- API Docs: https://jobifies-v5-backend.onrender.com/api-docs

## 🆘 Support
If issues persist:
1. Check Render service logs
2. Verify all environment variables
3. Ensure PostgreSQL service is running
4. Test database connection manually