# Complete Deployment Guide: Supabase + Vercel

This guide will walk you through deploying your Glossifi e-commerce platform from scratch, covering both Supabase database setup and Vercel deployment, until your website is fully working.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Set Up Supabase Database](#step-1-set-up-supabase-database)
3. [Step 2: Prepare Your Local Environment](#step-2-prepare-your-local-environment)
4. [Step 3: Create Database Tables](#step-3-create-database-tables)
5. [Step 4: Create Admin User](#step-4-create-admin-user)
6. [Step 5: Push Code to Git](#step-5-push-code-to-git)
7. [Step 6: Deploy to Vercel](#step-6-deploy-to-vercel)
8. [Step 7: Configure Vercel Environment Variables](#step-7-configure-vercel-environment-variables)
9. [Step 8: Update NEXTAUTH_URL](#step-8-update-nextauth_url)
10. [Step 9: Verify Everything Works](#step-9-verify-everything-works)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:
- ✅ Node.js 18+ installed
- ✅ A GitHub account (or GitLab/Bitbucket)
- ✅ A Supabase account ([sign up free](https://supabase.com))
- ✅ A Vercel account ([sign up free](https://vercel.com))

---

## Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `glossifi` (or any name you prefer)
   - **Database Password**: Create a strong password (⚠️ **SAVE THIS PASSWORD** - you'll need it!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

### 1.2 Get Your Database Connection String

1. In your Supabase dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **Database** in the settings menu
3. Scroll down to the **Connection string** section
4. Under **Connection pooling**, find the **URI** connection string
5. Click the **Copy** button next to the connection string
6. It will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
7. **Important**: Replace `[YOUR-PASSWORD]` with the actual database password you created
   - The connection string will have `[YOUR-PASSWORD]` as a placeholder
   - Replace it with your actual password
   - **Example**: If your password is `MySecurePass123`, the connection string should be:
     ```
     postgresql://postgres:MySecurePass123@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```

### 1.3 Save Your Connection String

Copy your complete connection string (with password replaced) - you'll need it in the next steps.

**Example format:**
```
postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## Step 2: Prepare Your Local Environment

### 2.1 Install Dependencies

In your project directory, run:

```bash
cd /Users/hendawi/Desktop/Glossifi
npm install
```

### 2.2 Create Local .env File

1. Create a `.env` file in the root of your project:

```bash
touch .env
```

2. Open the `.env` file and add the following:

```env
# Database Connection (from Supabase)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# NextAuth Configuration
# Generate a random secret: openssl rand -base64 32
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. **Replace the values**:
   - `DATABASE_URL`: Paste your Supabase connection string (from Step 1.3)
   - `NEXTAUTH_SECRET`: Generate a random secret by running:
     ```bash
     openssl rand -base64 32
     ```
     Copy the output and paste it as the value
   - `NEXTAUTH_URL`: Keep as `http://localhost:3000` for now

**Example .env file:**
```env
DATABASE_URL="postgresql://postgres:MySecurePass123@db.abcdefghijklmnop.supabase.co:5432/postgres"
NEXTAUTH_SECRET="Z2QPXuZHG1vtl46D+Ts+OmpYOKeC96F0"
NEXTAUTH_URL="http://localhost:3000"
```

### 2.3 Verify .env File

Make sure your `.env` file:
- ✅ Is in the project root directory
- ✅ Has no extra spaces or quotes around values (unless the value itself contains spaces)
- ✅ Has the correct connection string format (only ONE `@` symbol)
- ✅ Is listed in `.gitignore` (so it won't be committed to Git)

---

## Step 3: Create Database Tables

Now we'll create the database tables (Product, Order, AdminUser) in your Supabase database.

### 3.1 Generate Prisma Client

```bash
npm run db:generate
```

You should see:
```
✔ Generated Prisma Client
```

### 3.2 Push Schema to Database

This creates all the tables in your Supabase database:

```bash
npm run db:push
```

You should see:
```
✔ The database is now in sync with your schema.
```

### 3.3 Verify Tables Were Created

1. Go back to your Supabase dashboard
2. Click **Table Editor** in the left sidebar
3. You should now see three tables:
   - ✅ `Product`
   - ✅ `Order`
   - ✅ `AdminUser`

If you see these tables, you're good to go! 🎉

---

## Step 4: Create Admin User

You need an admin account to access the admin dashboard.

### 4.1 Run the Create Admin Script

```bash
npm run create-admin
```

### 4.2 Enter Admin Details

The script will prompt you for:
- **Email**: Your admin email (e.g., `admin@glossifi.com`)
- **Password**: Your admin password (will be hashed automatically)
- **Name**: Your name (e.g., `Admin User`)

**Example:**
```
Email: admin@glossifi.com
Password: Admin123!
Name: Admin User
```

### 4.3 Verify Admin User

1. Go to Supabase dashboard → **Table Editor**
2. Click on the `AdminUser` table
3. You should see your admin user with the email you entered

---

## Step 5: Push Code to Git

Before deploying to Vercel, your code needs to be in a Git repository.

### 5.1 Initialize Git (if not already done)

```bash
git init
```

### 5.2 Create .gitignore (if not exists)

Make sure your `.gitignore` includes:
```
.env
node_modules
.next
.vercel
```

### 5.3 Commit Your Code

```bash
git add .
git commit -m "Initial commit - ready for deployment"
```

### 5.4 Push to GitHub/GitLab/Bitbucket

**Option A: Create New Repository on GitHub**

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `glossifi` (or any name)
3. Don't initialize with README
4. Copy the repository URL

**Option B: Use Existing Repository**

If you already have a repository, use its URL.

**Then push:**

```bash
git remote add origin YOUR_REPOSITORY_URL
git branch -M main
git push -u origin main
```

Replace `YOUR_REPOSITORY_URL` with your actual repository URL.

---

## Step 6: Deploy to Vercel

### 6.1 Go to Vercel Dashboard

1. Visit [vercel.com](https://vercel.com)
2. Sign in (or create an account)
3. Click **"Add New..."** → **"Project"**

### 6.2 Import Your Repository

1. Connect your Git provider (GitHub, GitLab, or Bitbucket) if not already connected
2. Find and select your `glossifi` repository
3. Click **"Import"**

### 6.3 Configure Project Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: `Next.js` ✅
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` ✅ (already includes `prisma generate`)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

**Don't click Deploy yet!** We need to add environment variables first.

---

## Step 7: Configure Vercel Environment Variables

### 7.1 Add Environment Variables

Before deploying, click **"Environment Variables"** in the project configuration.

Add these three variables:

#### Variable 1: DATABASE_URL

- **Key**: `DATABASE_URL`
- **Value**: Your Supabase connection string (same as in your local `.env`)
  ```
  postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
  ```
- **Environment**: Select all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

Click **"Save"**

#### Variable 2: NEXTAUTH_SECRET

- **Key**: `NEXTAUTH_SECRET`
- **Value**: The same secret from your local `.env` file
  - (The one you generated with `openssl rand -base64 32`)
- **Environment**: Select all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

Click **"Save"**

#### Variable 3: NEXTAUTH_URL

- **Key**: `NEXTAUTH_URL`
- **Value**: For now, use a placeholder: `https://your-app-name.vercel.app`
  - **We'll update this after the first deployment with the actual URL**
- **Environment**: Select **Production only** for now

Click **"Save"**

### 7.2 Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. You'll see build logs in real-time
4. Once complete, you'll get a deployment URL like: `https://glossifi-abc123.vercel.app`

**⚠️ Important**: Copy this URL - you'll need it in the next step!

---

## Step 8: Update NEXTAUTH_URL

After the first deployment, you need to update `NEXTAUTH_URL` with your actual Vercel URL.

### 8.1 Get Your Vercel URL

From the deployment page, copy your URL:
- It will be something like: `https://glossifi-abc123.vercel.app`
- Or if you have a custom domain: `https://yourdomain.com`

### 8.2 Update Environment Variable

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Find `NEXTAUTH_URL` and click **Edit**
4. Update the value to your actual Vercel URL:
   ```
   https://glossifi-abc123.vercel.app
   ```
   (Use your actual URL, not this example)
5. Make sure it's set for **Production** environment
6. Click **"Save"**

### 8.3 Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Wait for the redeployment to complete

---

## Step 9: Verify Everything Works

Now let's test that everything is working correctly.

### 9.1 Test Homepage

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. ✅ The homepage should load without errors
3. ✅ You should see the Glossifi branding/logo

### 9.2 Test Products Page

1. Navigate to `/products` or click the Products link
2. ✅ Products page should load
3. ✅ If you seeded products, you should see them
4. ✅ If no products, the page should still load (just empty)

### 9.3 Test Admin Login

1. Navigate to `/admin/login`
2. ✅ Login page should load
3. Enter your admin credentials (from Step 4):
   - Email: (the email you used)
   - Password: (the password you used)
4. Click **Login**
5. ✅ You should be redirected to `/admin/dashboard`
6. ✅ Dashboard should load with statistics

### 9.4 Test Product Management

1. In the admin dashboard, go to **Products**
2. ✅ Products page should load
3. Click **"Add Product"** or **"Create Product"**
4. Fill in product details:
   - Name: `Test Product`
   - Description: `This is a test product`
   - Price: `19.99`
   - Image URL: `https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop`
   - Stock: `10`
   - Category: `Test`
5. Click **Save** or **Create**
6. ✅ Product should be created
7. ✅ Product should appear in the products list

### 9.5 Test Public Product Display

1. Go back to the public site (homepage)
2. Navigate to `/products`
3. ✅ Your newly created product should appear
4. Click on the product
5. ✅ Product detail page should load
6. ✅ Product information should display correctly

### 9.6 Test Orders (Optional)

1. Add a product to cart (on the public site)
2. Go to checkout
3. Fill in order details
4. Submit order
5. Go to admin dashboard → **Orders**
6. ✅ Order should appear in the orders list

### 9.7 Verify Database Connection

1. Go to Supabase dashboard → **Table Editor**
2. Check the `Product` table
3. ✅ Your test product should be there
4. Check the `Order` table (if you created an order)
5. ✅ Order should be there

---

## 🎉 Success Checklist

If all the above tests pass, your deployment is complete! ✅

- [ ] Homepage loads
- [ ] Products page works
- [ ] Admin login works
- [ ] Can create products
- [ ] Products appear on public site
- [ ] Database connection works
- [ ] No console errors

---

## Troubleshooting

### Build Fails: "Prisma Client hasn't been generated"

**Problem**: Prisma client not generated during build

**Solution**:
1. Check that `@prisma/client` is in `dependencies` (not `devDependencies`) in `package.json`
2. Verify your build command in Vercel includes `prisma generate`
3. Your `package.json` should have: `"build": "prisma generate && next build"`

### Database Connection Error

**Problem**: `Can't reach database server` or connection timeout

**Solutions**:
1. **Verify DATABASE_URL**:
   - Check the connection string in Vercel environment variables
   - Make sure password is correct
   - Ensure there's only ONE `@` symbol (not `@@`)

2. **Check Supabase Project**:
   - Make sure your Supabase project is not paused
   - Go to Supabase dashboard and verify project is active

3. **Check IP Restrictions**:
   - Supabase allows all IPs by default
   - If you have restrictions, make sure Vercel IPs are allowed

4. **Test Connection Locally**:
   - Try running `npm run db:push` locally with the same connection string
   - If it works locally but not on Vercel, it's likely an environment variable issue

### NextAuth Not Working / Login Fails

**Problem**: Can't login or redirects don't work

**Solutions**:
1. **Check NEXTAUTH_URL**:
   - Must match your actual Vercel URL exactly
   - Must include `https://`
   - No trailing slash
   - Example: `https://glossifi-abc123.vercel.app`

2. **Check NEXTAUTH_SECRET**:
   - Must be set in Vercel environment variables
   - Should be the same value you used locally
   - Must be at least 32 characters

3. **Clear Browser Cookies**:
   - Clear cookies for your Vercel domain
   - Try in incognito/private mode

### Tables Don't Exist Error

**Problem**: API returns errors about missing tables

**Solution**:
1. Go back to **Step 3** and run:
   ```bash
   npm run db:push
   ```
   Make sure your local `.env` has the production `DATABASE_URL` (temporarily)

2. Or verify in Supabase:
   - Go to Supabase dashboard → Table Editor
   - Check if tables exist
   - If not, run `npm run db:push` again

### Images Not Loading

**Problem**: Product images show as broken

**Solutions**:
1. **Check Image URLs**:
   - Verify image URLs in database are accessible
   - Test the URL in a browser

2. **Check next.config.mjs**:
   - Your config already allows all remote images
   - Should work with any HTTPS image URL

3. **Use Valid Image URLs**:
   - Use URLs from Unsplash, Cloudinary, or other CDN
   - Example: `https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop`

### Admin User Not Found

**Problem**: Can't login even with correct credentials

**Solution**:
1. Verify admin user exists:
   - Go to Supabase → Table Editor → `AdminUser` table
   - Check if your user is there

2. Create admin user again:
   ```bash
   npm run create-admin
   ```
   Make sure your local `.env` points to production database (temporarily)

### Environment Variables Not Working

**Problem**: App works locally but not on Vercel

**Solution**:
1. **Verify in Vercel Dashboard**:
   - Go to Settings → Environment Variables
   - Make sure all three variables are set
   - Check they're enabled for the right environments

2. **Redeploy After Adding Variables**:
   - After adding/updating environment variables, you must redeploy
   - Go to Deployments → Redeploy

3. **Check Variable Names**:
   - Must be exactly: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
   - Case-sensitive, no typos

### Build Takes Too Long / Times Out

**Problem**: Vercel build times out

**Solution**:
1. **Check Build Logs**:
   - Look at the build logs in Vercel
   - See where it's stuck

2. **Optimize Dependencies**:
   - Make sure `prisma` is in `devDependencies` (it is)
   - `@prisma/client` should be in `dependencies` (it is)

3. **Check Node Version**:
   - Vercel uses Node 18+ by default (should be fine)
   - You can specify in `package.json` if needed:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

## Next Steps After Deployment

Once everything is working:

1. **Set Up Custom Domain** (Optional):
   - In Vercel → Settings → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` to your custom domain
   - Redeploy

2. **Seed Sample Products** (Optional):
   ```bash
   npm run seed:products
   ```
   (Make sure local `.env` points to production database temporarily)

3. **Set Up Monitoring**:
   - Consider adding error tracking (Sentry)
   - Enable Vercel Analytics

4. **Backup Database**:
   - Set up automatic backups in Supabase
   - Or export database regularly

5. **Add Payment Integration**:
   - Integrate Stripe or PayPal for checkout
   - Update checkout flow

---

## 🎊 Congratulations!

Your Glossifi e-commerce platform is now live on Vercel with Supabase! 

If you encounter any issues not covered here, check the build logs in Vercel and the error messages for specific guidance.

