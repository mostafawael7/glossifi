# Troubleshooting Database Connection Error

## Error: Can't reach database server

If you're seeing this error:
```
Error: P1001: Can't reach database server at `db.xxxxx.supabase.co:5432`
```

Follow these steps to fix it:

## Step 1: Check Supabase Project Status

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Check if your project is **active** (not paused)
3. If it's paused, click "Restore" to activate it
4. Wait 1-2 minutes for the project to fully start

## Step 2: Verify Connection String Format

Your connection string should look like this:
```
postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Common issues:**

### Issue A: Double `@` Symbol
❌ **Wrong**: `postgresql://postgres:pass@@db.xxx.supabase.co:5432/postgres`
✅ **Correct**: `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres`

### Issue B: Password Not Replaced
❌ **Wrong**: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`
✅ **Correct**: `postgresql://postgres:YourActualPassword123@db.xxx.supabase.co:5432/postgres`

### Issue C: Special Characters in Password
If your password contains special characters like `@`, `#`, `%`, `&`, etc., you need to **URL encode** them:

- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- `&` becomes `%26`
- `/` becomes `%2F`
- `:` becomes `%3A`

**Example:**
- Password: `My@Pass#123`
- Encoded: `My%40Pass%23123`
- Connection string: `postgresql://postgres:My%40Pass%23123@db.xxx.supabase.co:5432/postgres`

## Step 3: Get Fresh Connection String

1. Go to Supabase Dashboard → Your Project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection string** section
4. Under **Connection pooling**, click **URI**
5. Click **Copy** button
6. The string will have `[YOUR-PASSWORD]` placeholder
7. **Replace** `[YOUR-PASSWORD]` with your actual database password

**To find your database password:**
- Go to Settings → Database
- Look for **Database password** section
- If you forgot it, you can reset it (but this will require updating all connection strings)

## Step 4: Test Connection String

Update your `.env` file with the corrected connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.tvbrolmksstlulanibtd.supabase.co:5432/postgres"
```

**Important:**
- Remove any quotes if they're causing issues (or keep them if your password has spaces)
- Make sure there's only ONE `@` symbol
- If password has special characters, URL encode them

## Step 5: Try Again

```bash
npm run db:push
```

## Step 6: Alternative - Use Connection Pooling Port

Sometimes the direct connection (port 5432) doesn't work. Try using the **pooled connection** (port 6543):

1. In Supabase Dashboard → Settings → Database
2. Under **Connection string**, find **Session mode** (not Connection pooling)
3. Copy that connection string
4. It will use port `6543` instead of `5432`
5. Update your `.env` file with this connection string

**Example:**
```
postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:6543/postgres?pgbouncer=true
```

## Step 7: Verify Network Access

1. Check if you're behind a firewall or VPN that might block database connections
2. Try from a different network (mobile hotspot, etc.)
3. Check if your ISP blocks port 5432

## Step 8: Check Supabase Project Region

1. Make sure your Supabase project is in an active region
2. If the project was recently created, wait a few minutes for it to fully provision

## Quick Fix Checklist

- [ ] Supabase project is active (not paused)
- [ ] Connection string has only ONE `@` symbol
- [ ] Password is replaced (not `[YOUR-PASSWORD]`)
- [ ] Special characters in password are URL encoded
- [ ] Connection string format is correct
- [ ] Tried both port 5432 and 6543 (pooled)

## Still Not Working?

1. **Reset Database Password:**
   - Supabase Dashboard → Settings → Database
   - Click "Reset database password"
   - Update your `.env` file with the new password

2. **Try Direct Connection (Non-Pooled):**
   - Use "Session mode" connection string instead of "Connection pooling"
   - This uses port 5432 directly

3. **Check Supabase Status:**
   - Visit https://status.supabase.com
   - Check if there are any outages

4. **Contact Support:**
   - Supabase has great support in their Discord
   - Or check their documentation: https://supabase.com/docs

