# ⚡ ChargeFinder - Ứng dụng Tìm Trạm Sạc Xe Điện

Ứng dụng web toàn diện giúp kết nối cộng đồng xe điện Việt Nam, tìm kiếm trạm sạc gần nhất, kết nối với người dùng khác và chia sẻ thông tin hữu ích.

## 🚀 Tính năng nổi bật

### 🔍 Tìm kiếm & Định vị
- **Tìm trạm gần nhất** với GPS định vị chính xác
- **Bản đồ tương tác** với OpenStreetMap
- **Filter theo loại xe** (ô tô/xe máy) 
- **Chỉ đường tức thì** với Google Maps integration
- **Tìm kiếm theo khu vực** (tỉnh/huyện)

### 👥 Mạng xã hội EV
- **Xem người dùng gần đây** trong bán kính 15km
- **Chat real-time** với cộng đồng EV
- **Chia sẻ kinh nghiệm** sạc xe
- **Profile người dùng** với rating và thống kê
- **Status real-time** (đang sạc, tìm trạm, online)

### 🏗️ Quản lý trạm sạc
- **Tạo trạm mới** với form thông minh
- **Upload hình ảnh** (tổng thể + trụ sạc) với auto-compression
- **Chọn loại sạc + giá** từ database có sẵn
- **Đánh giá đa tiêu chí** (dịch vụ, thoải mái, giá cả, vị trí, vệ sinh)
- **Xác minh trạm** bởi admin

### 🎁 Hệ thống thưởng
- **Điểm thưởng** cho mọi hoạt động
- **Mời bạn bè** qua nhiều kênh (+50 điểm/lời mời)
- **Leaderboard** và ranking
- **Badges** và achievements

### 📱 Trải nghiệm người dùng
- **Responsive design** tối ưu mobile
- **iOS-style UI** với animations mượt mà
- **Dark/Light theme** tự động
- **PWA ready** - cài đặt như app native
- **Offline support** cho dữ liệu cơ bản

## 🛠️ Cài đặt & Chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn
- PostgreSQL database (hoặc sử dụng Supabase)

### 1. Clone repository
```bash
git clone https://github.com/Sacvui/charging-station-app.git
cd charging-station-app
```

### 2. Cài đặt dependencies
```bash
# Backend
npm install

# Frontend  
cd client
npm install
cd ..
```

### 3. Cấu hình môi trường
```bash
# Tạo file .env từ template
cp .env.example .env

# Cấu hình các biến môi trường:
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 4. Setup database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. Chạy ứng dụng
```bash
# Development mode
npm run dev          # Backend (port 5000)
npm run client       # Frontend (port 3000)

# Hoặc chạy đồng thời
npm run dev & npm run client
```

### 6. Truy cập ứng dụng
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập

### Stations
- GET `/api/stations/nearby` - Lấy trạm gần nhất
- POST `/api/stations` - Tạo trạm mới
- GET `/api/stations/:id` - Chi tiết trạm
- POST `/api/stations/:id/review` - Đánh giá trạm

### Users
- GET `/api/users/profile` - Thông tin profile
- GET `/api/users/my-stations` - Trạm của tôi
- POST `/api/users/stations/:id/promotions` - Tạo khuyến mãi

## Công nghệ sử dụng

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, React Router, Leaflet Maps
- **Upload**: Multer cho xử lý hình ảnh
- **Authentication**: JWT tokens
- **Maps**: OpenStreetMap với Leaflet

## Hệ thống điểm thưởng

- Tạo trạm mới: +100 điểm
- Trạm được xác minh: +200 điểm
- Đánh giá trạm: +10 điểm"# 1st" 
"# charging-station-app" 
