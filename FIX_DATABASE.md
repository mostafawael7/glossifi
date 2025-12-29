# Fix Database Connection - Quick Steps

## The Problem
Your `/api/products` endpoint is returning a 500 error because:
- Database tables don't exist, OR
- DATABASE_URL in Vercel is incorrect

## Solution Steps

### Step 1: Fix Local .env File

Make sure your local `.env` file has the **Session Pooler** connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.tvbrolmksstlulanibtd.supabase.co:6543/postgres?pgbouncer=true"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important:**
- Use port `6543` (Session Pooler) not `5432` (Direct connection)
- Replace `YOUR_PASSWORD` with your actual Supabase database password
- Make sure there's only ONE `@` symbol

### Step 2: Create Database Tables Locally

Run these commands:

```bash
# Generate Prisma client
npm run db:generate

# Create tables in Supabase
npm run db:push
```

You should see:
```
✔ Generated Prisma Client
✔ The database is now in sync with your schema.
```

### Step 3: Verify Tables in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. You should see:
   - ✅ `Product`
   - ✅ `Order`
   - ✅ `AdminUser`

### Step 4: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

2. Find `DATABASE_URL` and click **Edit**
   - Make sure it uses the **Session Pooler** connection (port 6543)
   - Format: `postgresql://postgres:PASSWORD@db.tvbrolmksstlulanibtd.supabase.co:6543/postgres?pgbouncer=true`
   - Replace `PASSWORD` with your actual password
   - Make sure it's set for **Production, Preview, and Development**

3. Click **Save**

### Step 5: Redeploy on Vercel

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 6: Test

1. Visit: https://glossifi.vercel.app/products
2. Products should load (even if empty, no error)
3. If you want sample products, run: `npm run seed:products` (locally, with production DATABASE_URL)

## Still Getting 500 Error?

### Check Vercel Logs:
1. Vercel Dashboard → **Logs** tab
2. Look for error messages
3. Common errors:
   - "Can't reach database server" → DATABASE_URL is wrong
   - "Table does not exist" → Run `npm run db:push` again
   - "Authentication failed" → Password is wrong

### Verify DATABASE_URL Format:
- ✅ Correct: `postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true`
- ❌ Wrong: `postgresql://postgres:password@@db.xxx...` (double @)
- ❌ Wrong: `postgresql://postgres:[YOUR-PASSWORD]@...` (placeholder not replaced)

## Quick Test Command

To test your connection string locally:

```bash
# Temporarily use production DATABASE_URL
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.tvbrolmksstlulanibtd.supabase.co:6543/postgres?pgbouncer=true"

# Test connection
npm run db:push
```

If this works locally, the same connection string should work in Vercel.

