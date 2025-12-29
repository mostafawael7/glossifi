# Deployment Quick Reference Card

Use this as a quick checklist when deploying. For detailed instructions, see `DEPLOYMENT_GUIDE.md`.

## 🚀 Quick Deployment Steps

### 1. Supabase Setup
- [ ] Create Supabase project
- [ ] Get connection string: `postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres`
- [ ] Replace `[YOUR-PASSWORD]` with actual password

### 2. Local Setup
```bash
npm install
```

Create `.env`:
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:push
npm run create-admin
```

### 4. Git Push
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 5. Vercel Deployment
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import repository
3. Add environment variables:
   - `DATABASE_URL` (all environments)
   - `NEXTAUTH_SECRET` (all environments)
   - `NEXTAUTH_URL` (production only - update after first deploy)
4. Deploy

### 6. Update NEXTAUTH_URL
- Get your Vercel URL from deployment
- Update `NEXTAUTH_URL` in Vercel settings
- Redeploy

### 7. Verify
- [ ] Homepage loads
- [ ] Admin login works
- [ ] Can create products
- [ ] Products appear on site

## 🔑 Environment Variables

| Variable | Value | Where |
|----------|-------|-------|
| `DATABASE_URL` | Supabase connection string | Supabase Settings → Database |
| `NEXTAUTH_SECRET` | Random 32+ chars | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL | After first deployment |

## ⚠️ Common Issues

**Build fails?**
- Check `prisma generate` is in build command ✅ (already included)

**Database connection fails?**
- Verify `DATABASE_URL` is correct
- Check only ONE `@` in connection string
- Ensure Supabase project is active

**Login doesn't work?**
- `NEXTAUTH_URL` must match exact Vercel URL
- Must include `https://`
- No trailing slash

**Tables missing?**
- Run `npm run db:push` locally (with production DATABASE_URL)

## 📞 Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

