@echo off
echo 🚀 Starting automatic deployment to Netlify...
echo.

echo 📦 Step 1: Installing dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🔨 Step 2: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo 📤 Step 3: Deploying to Netlify...
cd ..
call netlify deploy --prod --dir=client/build
if %errorlevel% neq 0 (
    echo ❌ Deploy failed
    pause
    exit /b 1
)

echo ✅ Deployment successful!
echo 🌐 Your app is now live on Netlify
pause