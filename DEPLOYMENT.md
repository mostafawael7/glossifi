# Deployment Guide

This guide covers deploying the Glossifi e-commerce platform to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deploying to Vercel](#deploying-to-vercel)
- [Deploying to Other Platforms](#deploying-to-other-platforms)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- A production PostgreSQL database (e.g., Vercel Postgres, Supabase, AWS RDS, Railway)
- A domain name (optional, but recommended)
- Environment variables configured
- Admin user created in the database

## Environment Variables

### Required Variables

Set these environment variables in your deployment platform:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
# Or use CLOUDINARY_URL format:
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Resend Configuration (for email notifications)
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"  # Or your verified domain email
ADMIN_EMAIL="your-admin-email@example.com"  # Where to receive notifications

# Node Environment
NODE_ENV="production"
```

### Generating NEXTAUTH_SECRET

Generate a secure random secret:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Environment-Specific URLs

- **Development**: `NEXTAUTH_URL=http://localhost:3000`
- **Production**: `NEXTAUTH_URL=https://your-domain.com`
- **Preview/Staging**: `NEXTAUTH_URL=https://preview.your-domain.com`

## Database Setup

### 1. Create Production Database

Choose a PostgreSQL provider:

- **Vercel Postgres**: Integrated with Vercel deployments
- **Supabase**: Free tier available, easy setup
- **Railway**: Simple PostgreSQL hosting
- **AWS RDS**: Enterprise-grade solution
- **DigitalOcean**: Managed PostgreSQL

### 2. Run Migrations

**Option A: Using Prisma Migrate (Recommended)**

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

**Option B: Using Prisma DB Push (Development/Quick Setup)**

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Push schema (creates tables if they don't exist)
npm run db:push
```

⚠️ **Warning**: `db:push` is not recommended for production. Use migrations for better version control.

### 3. Create Admin User

After database is set up, create an admin user:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Create admin user
npm run create-admin admin@yourdomain.com "SecurePassword123" "Admin Name"
```

### 4. Seed Products (Optional)

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Seed sample products
npm run seed:products
```

## Deploying to Vercel

Vercel is the recommended platform for Next.js applications.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Link Your Project

```bash
vercel login
vercel link
```

### Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all required variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NODE_ENV=production`

### Step 4: Configure Build Settings

Vercel automatically detects Next.js projects. Ensure your `package.json` has:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Step 5: Deploy

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### Step 6: Set Up Database (Vercel Postgres)

If using Vercel Postgres:

1. In Vercel Dashboard, go to Storage
2. Create a new Postgres database
3. The `DATABASE_URL` will be automatically added to environment variables
4. Run migrations using Vercel CLI or Prisma Studio

### Vercel-Specific Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## Deploying to Other Platforms

### Railway

1. Connect your GitHub repository
2. Add PostgreSQL service
3. Set environment variables in Railway dashboard
4. Railway will auto-detect Next.js and deploy
5. Run migrations: `railway run npm run db:migrate`

### Netlify

1. Connect your repository
2. Set build command: `prisma generate && next build`
3. Set publish directory: `.next`
4. Add environment variables
5. Configure serverless functions for API routes

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Update `next.config.mjs`:

```javascript
const nextConfig = {
  output: 'standalone',
  // ... rest of config
};
```

Build and run:

```bash
docker build -t glossifi .
docker run -p 3000:3000 --env-file .env.production glossifi
```

## Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Admin user created and can log in
- [ ] Environment variables configured correctly
- [ ] `NEXTAUTH_URL` matches your domain
- [ ] Database connection is working
- [ ] API routes are accessible
- [ ] Admin dashboard is accessible
- [ ] Product images are loading correctly
- [ ] Checkout process works end-to-end
- [ ] SSL certificate is active (HTTPS)
- [ ] Error logging/monitoring is set up
- [ ] Database backups are configured

## Production Optimizations

### 1. Enable Image Optimization

Ensure `next.config.mjs` has proper image domains:

```javascript
images: {
  domains: ['your-image-cdn.com'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

### 2. Database Connection Pooling

For high-traffic applications, use connection pooling:

```javascript
// lib/db.ts
export const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

Consider using PgBouncer or Prisma Data Proxy for connection pooling.

### 3. Enable Caching

- Use Next.js ISR (Incremental Static Regeneration) for product pages
- Implement Redis for session storage (if needed)
- Use CDN for static assets

### 4. Monitoring and Logging

Set up:

- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Vercel Analytics, Google Analytics
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Database Monitoring**: Your database provider's tools

### 5. Security Headers

Add security headers in `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## Troubleshooting

### Database Connection Issues

**Error**: "Can't reach database server"

- Check `DATABASE_URL` is correct
- Verify database is accessible from your deployment platform
- Check firewall rules and IP whitelisting
- Ensure SSL mode is set correctly (`?sslmode=require`)

### Authentication Not Working

**Error**: "Invalid credentials" or session issues

- Verify `NEXTAUTH_SECRET` is set and matches across all instances
- Check `NEXTAUTH_URL` matches your actual domain
- Clear browser cookies and try again
- Check server logs for authentication errors

### Build Failures

**Error**: "Prisma Client not generated"

- Ensure `prisma generate` runs before `next build`
- Check `package.json` build script includes Prisma generation
- Verify Prisma schema is valid

### Environment Variables Not Loading

- Restart your deployment after adding environment variables
- Verify variable names match exactly (case-sensitive)
- Check for typos in variable values
- Some platforms require redeployment to pick up new variables

### API Routes Returning 500 Errors

- Check database connection
- Review server logs for detailed error messages
- Verify Prisma client is generated correctly
- Check that all required environment variables are set

## Rollback Procedure

If deployment fails:

1. **Vercel**: Use the deployment history to rollback to previous version
2. **Database**: Restore from backup if migrations caused issues
3. **Environment Variables**: Revert to previous values if needed

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Support

For deployment issues, refer to:

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vercel Documentation](https://vercel.com/docs)

