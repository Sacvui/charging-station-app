@echo off
echo 🚀 SacVui Deployment Script
echo ========================

echo 📦 Building React app...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo 📁 Build size:
dir build /s /-c | find "File(s)"

cd ..
echo 📤 Committing and pushing to GitHub...
git add .
git commit -m "🚀 Auto-deploy: Updated build files - %date% %time%"
git push origin main

echo ✅ Deployment complete!
echo 🌐 Netlify will auto-deploy from GitHub
echo 📱 Check your site in 2-3 minutes!
echo.
echo 🔗 GitHub: https://github.com/Sacvui/charging-station-app
echo 🔗 Netlify: Check your Netlify dashboard
echo.
pause