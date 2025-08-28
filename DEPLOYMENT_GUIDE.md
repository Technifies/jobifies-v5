# 🚀 Jobifies Deployment Guide

## Quick Deployment Links

### Backend Deployment (Render)
1. **[Deploy Backend to Render](https://dashboard.render.com/create?type=web)**
   - Repository: `https://github.com/Technifies/jobifies-v5`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### Database Setup (Render)
2. **[Create PostgreSQL Database](https://dashboard.render.com/create?type=pserv)**
   - Name: `jobifies-postgres`
   - Database: `jobifies`
   - Plan: Free

### Frontend Deployment (Netlify)
3. **[Deploy Frontend to Netlify](https://app.netlify.com/start)**
   - Repository: `https://github.com/Technifies/jobifies-v5`
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `.next`

## Environment Variables

### Render Backend Environment Variables
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=[auto-filled from database connection]
JWT_SECRET=jobifies-super-secret-jwt-key-2024-production-ready
SESSION_SECRET=jobifies-session-secret-key-for-secure-cookies-2024
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://jobifies-portal.netlify.app
```

### Netlify Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_ENV=production
NODE_VERSION=18
NEXT_TELEMETRY_DISABLED=1
```

## Deployment Status Checklist

- [ ] Backend deployed to Render
- [ ] PostgreSQL database created
- [ ] Backend environment variables configured
- [ ] Frontend deployed to Netlify
- [ ] Frontend environment variables configured
- [ ] CORS updated with actual Netlify URL
- [ ] Health check working: `/api/health`
- [ ] Frontend loading successfully

## Quick Test URLs

After deployment, test these endpoints:
- Health Check: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-frontend.netlify.app`

## Troubleshooting

### Common Issues:
1. **CORS Error**: Update `CORS_ORIGIN` with actual Netlify URL
2. **Database Connection**: Ensure `DATABASE_URL` is correctly set
3. **Build Failures**: Check Node.js version (should be 18+)
4. **API Not Found**: Verify `NEXT_PUBLIC_API_URL` points to Render backend

## Next Steps After Deployment
1. Run database migrations
2. Seed with test data
3. Test all functionality
4. Set up custom domains (optional)