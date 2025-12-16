# How to Find Your PostgreSQL Username and Password

## Quick Answer

Since you're on macOS and PostgreSQL is installed via Homebrew, try these in order:

### Option 1: No Password (Most Common)
Try connecting without a password first:
```bash
psql postgres
```

If that works, your connection string should be:
```env
DATABASE_URL="postgresql://hendawi@localhost:5432/glossifi"
```
(No password needed)

### Option 2: Your macOS Username
Your username is likely: **hendawi** (your macOS username)

Try:
```bash
psql -U hendawi -d postgres
```

### Option 3: Default "postgres" User
Try the default PostgreSQL superuser:
```bash
psql -U postgres -d postgres
```

## Step-by-Step Guide

### Step 1: Try to Connect

Open Terminal and try these commands one by one:

**Command 1: Connect with your macOS username (no password)**
```bash
psql postgres
```

**Command 2: If that fails, try with explicit username**
```bash
psql -U hendawi -d postgres
```

**Command 3: Try the default postgres user**
```bash
psql -U postgres -d postgres
```

### Step 2: Check What Works

- If **Command 1** works → Your username is `hendawi` and no password is needed
- If **Command 2** works → Your username is `hendawi` and no password is needed
- If **Command 3** works → Your username is `postgres` and no password is needed
- If all fail → You may need to set a password (see below)

### Step 3: Check PostgreSQL Users

Once connected, you can see all users:
```sql
\du
```

This will show you all PostgreSQL users and their roles.

### Step 4: If You Need to Set a Password

If you can't connect, you might need to set a password:

1. **If using Homebrew PostgreSQL:**
   ```bash
   # Connect as your macOS user (usually works without password)
   psql postgres
   
   # Then in psql, create/alter a user:
   CREATE USER hendawi WITH PASSWORD 'your_password_here';
   ALTER USER hendawi WITH SUPERUSER;
   ```

2. **Or reset the postgres user password:**
   ```bash
   psql postgres
   ALTER USER postgres WITH PASSWORD 'your_password_here';
   ```

## For Your .env File

Based on what works, use one of these:

**If no password needed:**
```env
DATABASE_URL="postgresql://hendawi@localhost:5432/glossifi"
```

**If username is postgres with no password:**
```env
DATABASE_URL="postgresql://postgres@localhost:5432/glossifi"
```

**If you set a password:**
```env
DATABASE_URL="postgresql://hendawi:your_password@localhost:5432/glossifi"
```

## Common Scenarios

### Scenario 1: Homebrew Installation (Most Common)
- **Username:** Your macOS username (`hendawi`)
- **Password:** Usually none required
- **Connection:** `psql postgres` should work directly

### Scenario 2: Postgres.app
- **Username:** Your macOS username
- **Password:** Usually none required
- **Port:** Might be different (check Postgres.app settings)

### Scenario 3: Manual Installation
- **Username:** `postgres` or your macOS username
- **Password:** May have been set during installation

## Quick Test

Run this to test your connection:
```bash
# Try connecting (replace with what works for you)
psql -U hendawi -d postgres -c "SELECT version();"
```

If this works, you're all set! Use the same username (and password if needed) in your `.env` file.

## Still Can't Connect?

1. **Check if PostgreSQL is running:**
   ```bash
   brew services list
   ```
   Look for `postgresql` and make sure it says "started"

2. **Start PostgreSQL if needed:**
   ```bash
   brew services start postgresql@14
   # or
   brew services start postgresql
   ```

3. **Check the port:**
   ```bash
   lsof -i :5432
   ```
   This shows if PostgreSQL is listening on port 5432

