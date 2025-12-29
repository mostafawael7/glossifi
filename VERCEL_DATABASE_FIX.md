# Fix Vercel Database Connection Error

## Error: Can't reach database server at port 6543

This means Vercel can't connect to your Supabase database. Here's how to fix it:

## Step 1: Verify Supabase Project is Active

1. Go to https://supabase.com/dashboard
2. Check if your project shows "Paused"
3. If paused, click "Restore" and wait 1-2 minutes

## Step 2: Get the Correct Connection String

### Option A: Use Transaction Pooler (Recommended for Vercel)

1. Go to Supabase Dashboard → Your Project → **Settings** → **Database**
2. Scroll to **Connection string** section
3. Change **Method** dropdown to **"Transaction"** (or "Transaction Pooler")
4. Make sure **Type** is set to **"URI"**
5. Click **Copy** button
6. The connection string will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.tvbrolmksstlulanibtd.supabase.co:6543/postgres?pgbouncer=true
   ```
7. **Replace `[YOUR-PASSWORD]`** with your actual database password

### Option B: Use Connection Pooling (Alternative)

1. In Supabase → Settings → Database
2. Under **Connection string**, select **"Connection pooling"** tab
3. Select **"Session mode"**
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password

## Step 3: URL Encode Password (If Needed)

If your password contains special characters, you MUST URL encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `/` | `%2F` |
| `:` | `%3A` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |

**Example:**
- Password: `My@Pass#123`
- Encoded: `My%40Pass%23123`
- Connection string: `postgresql://postgres:My%40Pass%23123@db.xxx.supabase.co:6543/postgres?pgbouncer=true`

## Step 4: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL` and click **Edit** (or create it if it doesn't exist)
3. Paste your connection string with:
   - ✅ Password replaced (not `[YOUR-PASSWORD]`)
   - ✅ Password URL encoded if it has special characters
   - ✅ Port 6543 (Transaction Pooler)
   - ✅ `?pgbouncer=true` at the end
4. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **Save**

## Step 5: Verify Connection String Format

Your DATABASE_URL should look exactly like this (with your actual password):

```
postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.tvbrolmksstlulanibtd.supabase.co:6543/postgres?pgbouncer=true
```

**Common mistakes:**
- ❌ `postgresql://postgres:[YOUR-PASSWORD]@...` (placeholder not replaced)
- ❌ `postgresql://postgres:password@@...` (double @)
- ❌ Missing `?pgbouncer=true` at the end
- ❌ Using port 5432 instead of 6543
- ❌ Special characters in password not URL encoded

## Step 6: Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Step 7: Test

1. Visit: https://glossifi.vercel.app/products
2. Check if products load (or at least no 500 error)
3. Check Vercel **Logs** tab for any new errors

## Alternative: Try Direct Connection (Port 5432)

If Transaction Pooler (6543) still doesn't work, try the direct connection:

1. In Supabase → Settings → Database
2. Select **"Direct connection"** method
3. Copy the connection string (port 5432)
4. Update Vercel `DATABASE_URL` with this connection string
5. Redeploy

**Note:** Direct connection might not work if your Supabase project doesn't support IPv4 (as shown in the earlier warning).

## Still Not Working?

### Check Vercel Logs:
1. Vercel Dashboard → **Logs** tab
2. Look for the exact error message
3. Common errors:
   - "Can't reach database server" → Connection string is wrong or Supabase is paused
   - "Authentication failed" → Password is wrong
   - "Connection timeout" → Network issue or wrong port

### Verify Password:
1. Go to Supabase → Settings → Database
2. Check **Database password** section
3. If you're not sure, reset the password:
   - Click "Reset database password"
   - Update your connection string with the new password
   - Update Vercel environment variable
   - Redeploy

### Test Connection String Locally:
```bash
# Set the connection string
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.tvbrolmksstlulanibtd.supabase.co:6543/postgres?pgbouncer=true"

# Test it
npm run db:push
```

If this works locally, the same connection string should work in Vercel.

## Quick Checklist

Before redeploying, verify:
- [ ] Supabase project is active (not paused)
- [ ] DATABASE_URL has actual password (not `[YOUR-PASSWORD]`)
- [ ] Password special characters are URL encoded
- [ ] Connection string uses port 6543
- [ ] Connection string ends with `?pgbouncer=true`
- [ ] DATABASE_URL is set for Production, Preview, and Development in Vercel

