# Database Setup Guide

## Step 1: Install PostgreSQL

### macOS (using Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

### macOS (using Postgres.app)
Download and install from: https://postgresapp.com/

### Windows
Download and install from: https://www.postgresql.org/download/windows/

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create a Database

### Option A: Using psql (Command Line)

1. Open Terminal/Command Prompt
2. Connect to PostgreSQL:
```bash
psql postgres
```

3. Create a database:
```sql
CREATE DATABASE glossifi;
```

4. (Optional) Create a dedicated user:
```sql
CREATE USER glossifi_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE glossifi TO glossifi_user;
```

5. Exit psql:
```sql
\q
```

### Option B: Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Name it `glossifi`
4. Click "Save"

## Step 3: Create .env File

1. In your project root (`/Users/hendawi/Desktop/Glossifi`), create a file named `.env`
2. Copy the contents from `.env.example` or use this template:

```env
# Database Connection
# Format: postgresql://username:password@host:port/database_name
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/glossifi"

# NextAuth Secret (generate a random string)
# You can generate one using: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Connection String Format

The `DATABASE_URL` follows this format:
```
postgresql://[username]:[password]@[host]:[port]/[database_name]
```

**Common examples:**

- Default PostgreSQL installation (macOS Homebrew):
  ```
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/glossifi"
  ```

- With custom user:
  ```
  DATABASE_URL="postgresql://glossifi_user:your_password@localhost:5432/glossifi"
  ```

- Remote database:
  ```
  DATABASE_URL="postgresql://user:password@your-server.com:5432/glossifi"
  ```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 4: Test the Connection

After creating your `.env` file, test the connection:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

If successful, you should see:
```
✔ Generated Prisma Client
✔ The database is now in sync with your schema.
```

## Troubleshooting

### "Connection refused" error
- Make sure PostgreSQL is running:
  - macOS: `brew services list` (check if postgresql is started)
  - Linux: `sudo systemctl status postgresql`
  - Windows: Check Services panel

### "Authentication failed" error
- Check your username and password in the DATABASE_URL
- For default PostgreSQL, try `postgres` as both username and password
- Or create a new user as shown in Step 2

### "Database does not exist" error
- Make sure you created the database (Step 2)
- Check the database name in your DATABASE_URL matches the created database

### "Permission denied" error
- Make sure your user has privileges on the database
- Run: `GRANT ALL PRIVILEGES ON DATABASE glossifi TO your_username;`

## Alternative: Using a Cloud Database

If you prefer a cloud-hosted database:

### Supabase (Free tier available)
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Use it in your `.env` file

### Railway
1. Sign up at https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string from the database settings
4. Use it in your `.env` file

### Neon
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Use it in your `.env` file

