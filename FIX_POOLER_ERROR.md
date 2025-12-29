# Fix: "prepared statement already exists" Error

## The Problem

You're getting this error because:
- **Transaction Pooler** doesn't support prepared statements
- Prisma uses prepared statements for database operations
- You need to use **Session Pooler** instead

## Solution: Use Session Pooler Connection String

### Step 1: Get Session Pooler Connection String

1. Go to Supabase Dashboard → Your Project → **Settings** → **Database**
2. Click the **"Connect"** button (top right)
3. In the connection modal:
   - **Method**: Select **"Session"** (NOT Transaction)
   - **Type**: Select **"URI"**
4. Copy the connection string
5. It should look like:
   ```
   postgresql://postgres.tvbrolmksstlulanibtd:[YOUR-PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
   ```

### Step 2: URL Encode Your Password

Your password is `Glossifi@123`, so encode the `@`:
- `@` becomes `%40`
- Password becomes: `Glossifi%40123`

### Step 3: Update Your Local .env File

Update your `.env` file with the Session Pooler connection string:

```env
DATABASE_URL="postgresql://postgres.tvbrolmksstlulanibtd:Glossifi%40123@aws-1-eu-north-1.pooler.supabase.com:6543/postgres"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important:** Use **Session** mode, not Transaction mode.

### Step 4: Test Locally

```bash
npm run db:push
```

This should work now! ✅

### Step 5: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL` → **Edit**
3. Update with the Session Pooler connection string:
   ```
   postgresql://postgres.tvbrolmksstlulanibtd:Glossifi%40123@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
   ```
4. Make sure it's enabled for Production, Preview, and Development
5. Click **Save**

### Step 6: Redeploy on Vercel

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on your latest deployment
3. Click **"Redeploy"**

## Why Session Pooler?

- ✅ **Session Pooler** supports prepared statements (what Prisma needs)
- ❌ **Transaction Pooler** doesn't support prepared statements
- ✅ Both use port 6543, but Session mode works with Prisma

## Summary

**Change:** Transaction Pooler → **Session Pooler**

**Connection String Format:**
```
postgresql://postgres.tvbrolmksstlulanibtd:Glossifi%40123@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
```

After updating both your local `.env` and Vercel environment variables, everything should work! 🎉

