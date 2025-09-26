# Deployment Guide

This guide covers deploying the Sweet Shop Management System to production using Render for the backend and Vercel for the frontend.

## Prerequisites

- GitHub repository with the code
- Render account (free tier available)
- Vercel account (free tier available)
- PostgreSQL database (provided by Render)

## Backend Deployment (Render)

### 1. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository and branch

### 2. Configure Build Settings

- **Name**: `sweet-shop-api`
- **Environment**: `Node`
- **Build Command**: `pnpm install && pnpm --filter shared build && pnpm build`
- **Start Command**: `pnpm start`
- **Root Directory**: `apps/api`

### 3. Environment Variables

Add the following environment variables in Render dashboard:

```
NODE_ENV=production
DATABASE_URL=<will be provided by Render PostgreSQL>
JWT_ACCESS_SECRET=<generate a secure random string>
JWT_REFRESH_SECRET=<generate a secure random string>
PORT=10000
```

### 4. Create PostgreSQL Database

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name: `sweet-shop-db`
3. Plan: Free
4. Copy the connection string to `DATABASE_URL` environment variable

### 5. Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the service URL (e.g., `https://sweet-shop-api.onrender.com`)

## Frontend Deployment (Vercel)

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository

### 2. Configure Build Settings

- **Framework Preset**: Vite
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm install && pnpm --filter shared build && pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 3. Environment Variables

Add the following environment variable:

```
VITE_API_URL=https://your-render-api-url.onrender.com
```

### 4. Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Note the frontend URL (e.g., `https://sweet-shop-web.vercel.app`)

## Database Setup

After deployment, you need to run database migrations:

### Option 1: Using Render Shell

1. Go to your Render service dashboard
2. Click "Shell" tab
3. Run the following commands:

```bash
cd apps/api
pnpm prisma migrate deploy
pnpm prisma seed
```

### Option 2: Using Local Connection

1. Get the database connection string from Render
2. Update your local `.env` file
3. Run migrations locally:

```bash
cd apps/api
pnpm prisma migrate deploy
pnpm prisma seed
```

## Post-Deployment Configuration

### 1. Update CORS Settings

Update the backend CORS configuration to allow your frontend domain:

```javascript
// In apps/api/src/main.js
app.enableCors({
  origin: ['https://your-frontend-domain.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### 2. Update Frontend API URL

Update the frontend environment variable to point to your deployed API:

```
VITE_API_URL=https://your-render-api-url.onrender.com
```

### 3. Redeploy

After making these changes, redeploy both services.

## Monitoring and Maintenance

### Health Checks

- **Backend**: `https://your-api-url.onrender.com/api/docs`
- **Frontend**: `https://your-frontend-url.vercel.app`

### Logs

- **Render**: Check logs in the Render dashboard
- **Vercel**: Check logs in the Vercel dashboard

### Database Management

- Use Render's PostgreSQL dashboard for database management
- Monitor database usage and performance
- Set up automated backups if needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are properly installed
   - Verify build commands are correct
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is correctly set
   - Check that migrations have been run
   - Ensure database is accessible from Render

3. **CORS Issues**
   - Verify frontend URL is in CORS origin list
   - Check that credentials are properly configured

4. **Environment Variables**
   - Ensure all required environment variables are set
   - Check that JWT secrets are properly generated
   - Verify API URL is correct in frontend

### Performance Optimization

1. **Enable Caching**
   - Configure Redis for session storage
   - Implement API response caching

2. **Database Optimization**
   - Add database indexes for frequently queried fields
   - Monitor query performance

3. **CDN Configuration**
   - Use Vercel's CDN for static assets
   - Optimize images and assets

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use Render's secure environment variable storage
   - Rotate JWT secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Enable SSL connections
   - Restrict database access to application servers only

3. **API Security**
   - Implement rate limiting
   - Add request validation
   - Monitor for suspicious activity

## Cost Optimization

### Render Free Tier Limits
- 750 hours per month
- Sleeps after 15 minutes of inactivity
- 512MB RAM

### Vercel Free Tier Limits
- 100GB bandwidth per month
- Unlimited static deployments
- 100 serverless function executions per day

### Recommendations
- Monitor usage to stay within free tier limits
- Consider upgrading to paid plans for production use
- Implement proper caching to reduce API calls
