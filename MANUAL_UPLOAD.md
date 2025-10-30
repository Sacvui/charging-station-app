# Hướng dẫn Upload thủ công lên GitHub

## Cách 1: Upload qua GitHub Web Interface

1. **Vào repository:** https://github.com/Sacvui/charging-station-app
2. **Click "uploading an existing file"**
3. **Kéo thả tất cả files/folders vào**
4. **Commit message:** "Initial commit: Charging Station App"
5. **Click "Commit changes"**

## Cách 2: Restart Terminal và dùng GitHub CLI

1. **Đóng terminal hiện tại**
2. **Mở terminal mới**
3. **Chạy:**
```bash
gh auth login
# Chọn GitHub.com
# Chọn HTTPS
# Paste token: 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

git push -u origin main
```

## Cách 3: Tạo ZIP file

1. **Tạo file ZIP của toàn bộ project**
2. **Vào GitHub repository**
3. **Upload ZIP và extract**

## Sau khi code đã lên GitHub:

### Deploy lên Vercel:
1. **Vào vercel.com**
2. **New Project > Import from GitHub**
3. **Chọn repository `charging-station-app`**
4. **Cấu hình:**
   - Framework: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/build`
5. **Environment Variables:**
   ```
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your-secret-key
   ```
6. **Deploy!**

Bạn muốn thử cách nào?