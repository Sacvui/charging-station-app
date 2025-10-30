# 🚀 Hướng dẫn Deploy Charging Station App lên Vercel

## 📋 Tổng quan
Dự án này sử dụng:
- **Frontend:** React (client folder)
- **Backend:** Node.js + Express (serverless functions)
- **Database:** PostgreSQL với Prisma ORM
- **Deployment:** Vercel

## 🎯 Bước 1: Chuẩn bị Database
Chọn một trong các dịch vụ PostgreSQL miễn phí:

### Option 1: Supabase (Khuyến nghị)
1. Đăng ký tại: https://supabase.com
2. Tạo project mới
3. Vào **Settings > Database**
4. Copy **Connection string** (URI format)

### Option 2: Neon
1. Đăng ký tại: https://neon.tech
2. Tạo database mới
3. Copy connection string

### Option 3: Railway
1. Đăng ký tại: https://railway.app
2. Tạo PostgreSQL service
3. Copy DATABASE_URL

## 🛠️ Bước 2: Chuẩn bị Deploy

### 2.1. Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### 2.2. Đăng nhập Vercel
```bash
vercel login
```

### 2.3. Kiểm tra cấu hình
Đảm bảo có các file:
- ✅ `vercel.json` (đã có)
- ✅ `package.json` với script `vercel-build` (đã có)
- ✅ `api/index.js` (đã có)

## 🚀 Bước 3: Deploy lần đầu
```bash
# Trong thư mục root của dự án
vercel

# Trả lời các câu hỏi:
# ? Set up and deploy "~/charging-station-app"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? charging-station-app
# ? In which directory is your code located? ./
```

## ⚙️ Bước 4: Cấu hình Environment Variables

### 4.1. Vào Vercel Dashboard
1. Truy cập: https://vercel.com/dashboard
2. Click vào project vừa tạo
3. Vào tab **Settings > Environment Variables**

### 4.2. Thêm các biến môi trường:
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret (tạo chuỗi random)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Node Environment
NODE_ENV=production
```

### 4.3. Tạo JWT Secret mạnh
```bash
# Sử dụng một trong các cách sau:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Hoặc online: https://generate-secret.vercel.app/64
```

## 🗄️ Bước 5: Setup Database Schema

### 5.1. Chạy Migration
```bash
# Trong thư mục local
npx prisma db push
```

### 5.2. Generate Prisma Client
```bash
npx prisma generate
```

## 👤 Bước 6: Tạo Admin User

### Option 1: Qua App (Khuyến nghị)
1. Truy cập app đã deploy
2. Đăng ký tài khoản bình thường
3. Vào database console (Supabase/Neon)
4. Chạy SQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Option 2: Qua Prisma Studio
```bash
npx prisma studio
# Mở browser, edit user role thành 'ADMIN'
```

## 🔄 Bước 7: Deploy Production

### 7.1. Deploy Production Build
```bash
vercel --prod
```

### 7.2. Kiểm tra Deploy
- Vercel sẽ cung cấp URL: `https://your-app.vercel.app`
- Kiểm tra các chức năng chính:
  - ✅ Đăng ký/Đăng nhập
  - ✅ Xem trạm sạc
  - ✅ Bản đồ
  - ✅ Đánh giá

## 🌐 Bước 8: Custom Domain (Tùy chọn)
1. Vào **Settings > Domains**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

## ⚠️ Lưu ý quan trọng

### 🖼️ File Upload Limitations
Vercel serverless không lưu trữ files. Cần sử dụng:

#### Option 1: Cloudinary (Khuyến nghị)
```bash
npm install cloudinary multer-storage-cloudinary
```

Environment Variables:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

#### Option 2: Supabase Storage
```bash
npm install @supabase/storage-js
```

### ⚡ Serverless Limitations
- **Timeout:** 10s per request (Hobby plan)
- **Memory:** 1024MB max
- **Cold starts:** First request might be slow
- **Database connections:** Tạo mới mỗi request

### 🔧 Troubleshooting

#### Build Errors
```bash
# Clear cache và rebuild
vercel --force

# Check logs
vercel logs [deployment-url]
```

#### Database Connection Issues
```bash
# Test connection locally
npx prisma db pull

# Reset database
npx prisma db push --force-reset
```

#### Environment Variables
- Phải restart deployment sau khi thay đổi env vars
- Check spelling và format của DATABASE_URL

## 🚀 Alternative: Railway (Easier)
Nếu gặp khó khăn với Vercel:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

**Railway advantages:**
- ✅ Built-in PostgreSQL
- ✅ Persistent file storage
- ✅ Easier configuration
- ✅ No serverless limitations

## 📞 Support
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **GitHub Issues:** https://github.com/Sacvui/charging-station-app/issues

---

## 🎉 Checklist Deploy thành công:
- [ ] Database connection working
- [ ] Environment variables set
- [ ] Prisma schema deployed
- [ ] Admin user created
- [ ] App accessible via URL
- [ ] All features working
- [ ] Custom domain (optional)