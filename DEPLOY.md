# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị PostgreSQL Database
Bạn có thể sử dụng:
- **Supabase** (miễn phí): https://supabase.com
- **Railway** (miễn phí): https://railway.app
- **Neon** (miễn phí): https://neon.tech
- **PlanetScale** (MySQL): https://planetscale.com

## Bước 2: Cài đặt Vercel CLI
```bash
npm i -g vercel
```

## Bước 3: Deploy
```bash
# Đăng nhập Vercel
vercel login

# Deploy dự án
vercel

# Hoặc deploy production
vercel --prod
```

## Bước 4: Cấu hình Environment Variables
Trong Vercel Dashboard, thêm các biến môi trường:

- `DATABASE_URL`: Connection string PostgreSQL của bạn
- `JWT_SECRET`: Một chuỗi bí mật để mã hóa JWT (ví dụ: `your-super-secret-jwt-key-here`)

## Bước 5: Chạy Database Migration
Sau khi deploy, chạy lệnh để tạo tables:
```bash
npx prisma db push
```

## Bước 6: Tạo Admin User
Sau khi deploy:
1. Đăng ký tài khoản bình thường qua app
2. Vào database, tìm table `users`
3. Sửa field `role` từ `"USER"` thành `"ADMIN"`

## Bước 7: Cấu hình Domain (tùy chọn)
- Vercel sẽ tự động tạo domain `.vercel.app`
- Bạn có thể thêm custom domain trong settings

## Lưu ý quan trọng:

### 1. File Upload
Vercel có giới hạn về file upload. Nếu cần upload nhiều ảnh, nên sử dụng:
- **Cloudinary** (miễn phí 25GB): https://cloudinary.com
- **AWS S3**
- **Supabase Storage**

### 2. Serverless Functions
- Vercel chạy trên serverless functions
- Mỗi request có timeout 10s (hobby plan)
- Database connections sẽ được tạo mới mỗi request

### 3. Static Files
- Folder `uploads/` sẽ không persist trên Vercel
- Cần chuyển sang cloud storage

## Cấu hình Cloudinary (khuyến nghị)
```bash
npm install cloudinary multer-storage-cloudinary
```

Thêm vào `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Alternative: Railway
Nếu muốn deploy fullstack app truyền thống:
```bash
# Cài đặt Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

Railway hỗ trợ:
- File uploads persistent
- Database built-in
- Easier configuration