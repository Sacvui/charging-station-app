# ⚡ Quick Deploy to Vercel

## 🚀 One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sacvui/charging-station-app)

## 📋 Quick Steps

### 1. Prepare Database
- Sign up at [Supabase](https://supabase.com) (recommended)
- Create new project
- Copy connection string from Settings > Database

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel
```

### 3. Set Environment Variables
In Vercel Dashboard > Settings > Environment Variables:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-random-secret-key
NODE_ENV=production
```

### 4. Setup Database
```bash
npx prisma db push
```

### 5. Create Admin User
- Register via app
- Update user role in database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email';
```

## ✅ Done!
Your app is live at: `https://your-app.vercel.app`

---

**Need help?** Check [DEPLOY.md](./DEPLOY.md) for detailed instructions.