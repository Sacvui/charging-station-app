@echo off
echo 🔍 SacVui Deployment Status Checker
echo ===================================

echo 📊 Current Build Status:
echo ========================
cd client
if exist "build\index.html" (
    echo ✅ Build folder exists
    echo 📁 Build contents:
    dir build /b
    echo.
    echo 📦 Build size:
    dir build\static\js\*.js | find "File(s)"
    dir build\static\css\*.css | find "File(s)"
) else (
    echo ❌ Build folder not found
    echo 🔧 Running build...
    call npm run build
)

cd ..
echo.
echo 🌐 Git Status:
echo ==============
git log --oneline -5
echo.
echo 🚀 Latest commit:
git show --stat HEAD

echo.
echo 📱 Deployment Links:
echo ===================
echo 🔗 GitHub: https://github.com/Sacvui/charging-station-app
echo 🔗 Netlify: Check your dashboard for auto-deployment
echo.
echo 💡 To deploy manually: run deploy.bat
echo 💡 To check build: npm run build (in client folder)
echo.
pause