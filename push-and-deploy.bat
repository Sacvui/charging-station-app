@echo off
echo 🚀 Git Push + Auto Deploy to Netlify
echo.

if "%~1"=="" (
    set /p commit_msg="💬 Enter commit message: "
) else (
    set commit_msg=%~1
)

echo 📝 Commit message: %commit_msg%
echo.

echo 📦 Step 1: Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ❌ Git add failed
    pause
    exit /b 1
)

echo 💾 Step 2: Committing changes...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ❌ Git commit failed (maybe no changes?)
    echo ℹ️ Continuing with push...
)

echo 📤 Step 3: Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Git push failed
    pause
    exit /b 1
)

echo ✅ Code pushed to GitHub successfully!
echo 🔄 Netlify will auto-deploy in 1-2 minutes
echo 🌐 Check your site: https://bespoke-cuchufli-ae9505.netlify.app
echo.
echo 📊 You can monitor deployment at: https://app.netlify.com
pause