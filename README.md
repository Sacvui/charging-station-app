# Ứng dụng Kết nối Trạm Sạc Pin Xe Máy

Ứng dụng web giúp kết nối người dùng với các trạm sạc pin xe máy, cho phép tìm kiếm trạm gần nhất, đánh giá và tạo trạm mới.

## Tính năng chính

### Người dùng (User)
- Tìm trạm sạc gần nhất trên bản đồ
- Xem thông tin chi tiết: đánh giá, loại sạc, bảng giá
- Tạo trạm sạc mới với hình ảnh xác minh
- Nhận điểm thưởng khi đóng góp thông tin
- Đánh giá và bình luận về trạm sạc

### Chủ trạm (Station Owner)
- Tạo và quản lý trạm sạc của mình
- Tạo các chương trình khuyến mãi
- Cập nhật thông tin trạm

### Quản trị viên (Admin)
- Quản lý tất cả người dùng và trạm sạc
- Xác minh trạm sạc mới
- Toàn quyền quản lý hệ thống

## Cài đặt

### Backend
```bash
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

## Cấu hình

1. Tạo file `.env` từ `.env.example`
2. Cấu hình MongoDB URI
3. Thiết lập JWT secret key

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
