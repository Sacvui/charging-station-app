@echo off
echo 🚀 Manual build for Netlify deployment
echo.

cd client
echo 📦 Cleaning old build...
if exist build rmdir /s /q build

echo 🔨 Building React app...
set CI=false
set GENERATE_SOURCEMAP=false
call npm run build

echo 📁 Checking build output...
if exist build (
    echo ✅ Build folder created
    dir build
    echo.
    echo 📊 Build summary:
    for /f %%i in ('dir /s /b build\* ^| find /c /v ""') do echo Files created: %%i
) else (
    echo ❌ Build folder not found
)

echo.
echo 🌐 Next steps:
echo 1. Go to netlify.com/drop
echo 2. Drag the 'build' folder to deploy
echo 3. Or zip the build folder and upload

pause