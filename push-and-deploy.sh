#!/bin/bash

echo "🚀 Git Push + Auto Deploy to Netlify"
echo

if [ -z "$1" ]; then
    read -p "💬 Enter commit message: " commit_msg
else
    commit_msg="$1"
fi

echo "📝 Commit message: $commit_msg"
echo

echo "📦 Step 1: Adding all changes..."
git add .
if [ $? -ne 0 ]; then
    echo "❌ Git add failed"
    exit 1
fi

echo "💾 Step 2: Committing changes..."
git commit -m "$commit_msg"
if [ $? -ne 0 ]; then
    echo "❌ Git commit failed (maybe no changes?)"
    echo "ℹ️ Continuing with push..."
fi

echo "📤 Step 3: Pushing to GitHub..."
git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Git push failed"
    exit 1
fi

echo "✅ Code pushed to GitHub successfully!"
echo "🔄 Netlify will auto-deploy in 1-2 minutes"
echo "🌐 Check your site: https://bespoke-cuchufli-ae9505.netlify.app"
echo
echo "📊 You can monitor deployment at: https://app.netlify.com"